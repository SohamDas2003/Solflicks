import { NextResponse } from "next/server";
import Banner from "../../_models/Banner";
import mongoose from "mongoose";

// Connect to MongoDB
async function connectDB() {
	// Only skip if connection is fully established
	if (mongoose.connections[0].readyState !== 1) {
		try {
				 await mongoose.connect(process.env.NEXT_PUBLIC_MongoDB_URI as string);
				 await mongoose.connection.asPromise();
		} catch (error) {
			console.error("MongoDB connection error:", error);
			throw new Error("Failed to connect to database");
		}
	}
}

// GET - Fetch banners (all for dashboard, active only for frontend)
export async function GET(request: Request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const dashboard = searchParams.get("dashboard") === "true";

		let query = {};
		if (!dashboard) {
			// For frontend, only show active banners
			query = { isActive: true };
		}
		// For dashboard, show all banners

		const banners = await Banner.find(query)
			.sort({ order: 1, createdAt: -1 })
			.select("-createdBy");

		return NextResponse.json({ banners });
	} catch (error) {
		console.error("Error fetching banners:", error);
		return NextResponse.json(
			{ error: "Failed to fetch banners" },
			{ status: 500 }
		);
	}
}

// POST - Create a new banner
export async function POST(request: Request) {
	try {
		await connectDB();

		const data = await request.json();
		const {
			title,
			subtitle,
			description,
			platform,
			imageUrl,
			watchNowLink,
			learnMoreLink,
			order = 0,
		} = data;
		// Validate required fields
		if (!imageUrl) {
			return NextResponse.json({ error: "Image is required" }, { status: 400 });
		}

		const banner = new Banner({
			title,
			subtitle,
			description,
			platform,
			imageUrl,
			watchNowLink,
			learnMoreLink,
			order,
			isActive: true,
		});

		await banner.save();

		return NextResponse.json(
			{ message: "Banner created successfully", banner },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating banner:", error);
		return NextResponse.json(
			{ error: "Failed to create banner" },
			{ status: 500 }
		);
	}
}

// PUT - Update banner status or order
export async function PUT(request: Request) {
	try {
		await connectDB();

		const data = await request.json();
		const { id, isActive, order } = data;

		if (!id) {
			return NextResponse.json(
				{ error: "Banner ID is required" },
				{ status: 400 }
			);
		}

		const updateData: any = {};
		if (typeof isActive === "boolean") updateData.isActive = isActive;
		if (typeof order === "number") updateData.order = order;

		const banner = await Banner.findByIdAndUpdate(id, updateData, {
			new: true,
		});

		if (!banner) {
			return NextResponse.json({ error: "Banner not found" }, { status: 404 });
		}

		return NextResponse.json({
			message: "Banner updated successfully",
			banner,
		});
	} catch (error) {
		console.error("Error updating banner:", error);
		return NextResponse.json(
			{ error: "Failed to update banner" },
			{ status: 500 }
		);
	}
}
