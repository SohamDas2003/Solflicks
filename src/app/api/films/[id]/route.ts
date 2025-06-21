import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/utils/database";
import Film from "@/app/_models/Film";
import mongoose from "mongoose";

// GET - Get a single film by ID
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ success: false, message: "Invalid film ID" },
				{ status: 400 }
			);
		}

		await dbConnect();
		const film = await Film.findById(id).lean();

		if (!film) {
			return NextResponse.json(
				{ success: false, message: "Film not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			film,
		});
	} catch (error) {
		console.error("Error fetching film:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch film" },
			{ status: 500 }
		);
	}
}

// PUT - Update a film
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ success: false, message: "Invalid film ID" },
				{ status: 400 }
			);
		}

		await dbConnect();

		// Check if film exists
		const existingFilm = await Film.findById(id);
		if (!existingFilm) {
			return NextResponse.json(
				{ success: false, message: "Film not found" },
				{ status: 404 }
			);
		}

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
		} = body;

		// Validate required fields
		if (!title || !year || !duration || !genres || !description || !slug) {
			return NextResponse.json(
				{ success: false, message: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Check if slug is being changed and if it conflicts with another film
		if (slug !== existingFilm.slug) {
			const slugConflict = await Film.findOne({
				slug,
				_id: { $ne: id },
			}).lean();

			if (slugConflict) {
				return NextResponse.json(
					{ success: false, message: "Film with this slug already exists" },
					{ status: 400 }
				);
			}
		}
		const updateData = {
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
		};

		const updatedFilm = await Film.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		});

		return NextResponse.json({
			success: true,
			message: "Film updated successfully",
			film: updatedFilm,
		});
	} catch (error) {
		console.error("Error updating film:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to update film" },
			{ status: 500 }
		);
	}
}

// DELETE - Delete a film
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ success: false, message: "Invalid film ID" },
				{ status: 400 }
			);
		}

		await dbConnect();

		const result = await Film.findByIdAndDelete(id);

		if (!result) {
			return NextResponse.json(
				{ success: false, message: "Film not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Film deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting film:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to delete film" },
			{ status: 500 }
		);
	}
}
