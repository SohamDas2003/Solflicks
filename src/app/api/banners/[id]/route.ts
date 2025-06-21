import { NextResponse } from "next/server";
import Banner from "../../../_models/Banner";
import mongoose from "mongoose";

// Connect to MongoDB
async function connectDB() {
	if (mongoose.connections[0].readyState) {
		return;
	}

	try {
		await mongoose.connect(process.env.MONGODB_URI as string);
	} catch (error) {
		console.error("MongoDB connection error:", error);
		throw new Error("Failed to connect to database");
	}
}

// GET - Fetch single banner
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();

		const { id } = await params;
		const banner = await Banner.findById(id);

		if (!banner) {
			return NextResponse.json({ error: "Banner not found" }, { status: 404 });
		}

		return NextResponse.json({ banner });
	} catch (error) {
		console.error("Error fetching banner:", error);
		return NextResponse.json(
			{ error: "Failed to fetch banner" },
			{ status: 500 }
		);
	}
}

// PUT - Update banner
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();

		const data = await request.json();
		const { id } = await params;

		const banner = await Banner.findByIdAndUpdate(id, data, {
			new: true,
			runValidators: true,
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

// DELETE - Delete banner
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectDB();

		const { id } = await params;
		const banner = await Banner.findByIdAndDelete(id);

		if (!banner) {
			return NextResponse.json({ error: "Banner not found" }, { status: 404 });
		}

		return NextResponse.json({
			message: "Banner deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting banner:", error);
		return NextResponse.json(
			{ error: "Failed to delete banner" },
			{ status: 500 }
		);
	}
}
