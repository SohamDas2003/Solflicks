import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/utils/database";
import Series from "@/app/_models/Series";

// GET - Fetch all series with pagination and search
export async function GET(request: NextRequest) {
	try {
		await dbConnect();
		const url = new URL(request.url);

		// Pagination parameters
		const page = parseInt(url.searchParams.get("page") || "1");
		const limit = parseInt(url.searchParams.get("limit") || "10");
		const skip = (page - 1) * limit;

		// Search parameter
		const search = url.searchParams.get("search");

		// Build query
		let query = {};
		if (search) {
			query = { $text: { $search: search } };
		}

		// Get total count for pagination metadata
		const totalSeries = await Series.countDocuments(query);
		const series = await Series.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean();
		return NextResponse.json({
			success: true,
			series,
			pagination: {
				total: totalSeries,
				page,
				limit,
				pages: Math.ceil(totalSeries / limit),
				hasNextPage: skip + series.length < totalSeries,
				hasPrevPage: page > 1,
			},
		});
	} catch (error) {
		console.error("Error fetching series:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch series" },
			{ status: 500 }
		);
	}
}

// POST - Create new series
export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();
		const {
			title,
			year,
			seasons,
			episodes,
			genres,
			description,
			starring,
			director,
			producers,
			productionCompany,
			trailerUrl,
			streamingUrl,
			slug,
			imageUrl,
			imagePublicId,
			status,
		} = body;

		if (
			!title ||
			!year ||
			!seasons ||
			!episodes ||
			!genres ||
			!description ||
			!slug
		) {
			return NextResponse.json(
				{ success: false, message: "Missing required fields" },
				{ status: 400 }
			);
		}
		// Check if slug already exists
		const existingSeries = await Series.findOne({ slug }).lean();
		if (existingSeries) {
			return NextResponse.json(
				{ success: false, message: "Series with this slug already exists" },
				{ status: 400 }
			);
		}

		// Create new series document
		const series = new Series({
			title,
			year: parseInt(year),
			seasons: parseInt(seasons),
			episodes: parseInt(episodes),
			genres: Array.isArray(genres)
				? genres
				: genres.split(",").map((g: string) => g.trim()),
			description,
			starring,
			director,
			producers,
			productionCompany,
			trailerUrl,
			streamingUrl,
			slug,
			imageUrl,
			imagePublicId,
			status,
		});

		await series.save();

		return NextResponse.json(
			{
				success: true,
				message: "Series created successfully",
				series,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating series:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to create series" },
			{ status: 500 }
		);
	}
}
