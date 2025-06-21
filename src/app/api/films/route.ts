import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/utils/database";
import Film from "@/app/_models/Film";

// GET - Fetch all films with pagination and search
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
		const totalFilms = await Film.countDocuments(query);
		const films = await Film.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean();
		return NextResponse.json({
			success: true,
			films,
			pagination: {
				total: totalFilms,
				page,
				limit,
				pages: Math.ceil(totalFilms / limit),
				hasNextPage: skip + films.length < totalFilms,
				hasPrevPage: page > 1,
			},
		});
	} catch (error) {
		console.error("Error fetching films:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch films" },
			{ status: 500 }
		);
	}
}

// POST - Create new film
export async function POST(request: NextRequest) {
	try {
		await dbConnect();
		const body = await request.json();
		const {
			title,
			year,
			duration,
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
		} = body;

		if (!title || !year || !duration || !genres || !description || !slug) {
			return NextResponse.json(
				{ success: false, message: "Missing required fields" },
				{ status: 400 }
			);
		}
		// Check if slug already exists
		const existingFilm = await Film.findOne({ slug }).lean();
		if (existingFilm) {
			return NextResponse.json(
				{ success: false, message: "Film with this slug already exists" },
				{ status: 400 }
			);
		} // Create new film document
		const film = new Film({
			title,
			year: parseInt(year),
			duration,
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
		});

		await film.save();

		return NextResponse.json(
			{
				success: true,
				message: "Film created successfully",
				film,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating film:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to create film" },
			{ status: 500 }
		);
	}
}
