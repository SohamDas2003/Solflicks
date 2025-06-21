import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/utils/database";
import Series from "@/app/_models/Series";
import mongoose from "mongoose";

// GET - Get a single series by ID
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ success: false, message: "Invalid series ID" },
				{ status: 400 }
			);
		}

		await dbConnect();
		const series = await Series.findById(id).lean();

		if (!series) {
			return NextResponse.json(
				{ success: false, message: "Series not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			series,
		});
	} catch (error) {
		console.error("Error fetching series:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch series" },
			{ status: 500 }
		);
	}
}

// PUT - Update a series
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ success: false, message: "Invalid series ID" },
				{ status: 400 }
			);
		}

		await dbConnect();

		// Check if series exists
		const existingSeries = await Series.findById(id);
		if (!existingSeries) {
			return NextResponse.json(
				{ success: false, message: "Series not found" },
				{ status: 404 }
			);
		}

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
			status,
		} = body;

		// Validate required fields
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

		// Check if slug is being changed and if it conflicts with another series
		if (slug !== existingSeries.slug) {
			const slugConflict = await Series.findOne({
				slug,
				_id: { $ne: id },
			}).lean();

			if (slugConflict) {
				return NextResponse.json(
					{ success: false, message: "Series with this slug already exists" },
					{ status: 400 }
				);
			}
		}

		const updateData = {
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
			status,
		};

		const updatedSeries = await Series.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		});

		return NextResponse.json({
			success: true,
			message: "Series updated successfully",
			series: updatedSeries,
		});
	} catch (error) {
		console.error("Error updating series:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to update series" },
			{ status: 500 }
		);
	}
}

// DELETE - Delete a series
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ success: false, message: "Invalid series ID" },
				{ status: 400 }
			);
		}

		await dbConnect();

		const result = await Series.findByIdAndDelete(id);

		if (!result) {
			return NextResponse.json(
				{ success: false, message: "Series not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Series deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting series:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to delete series" },
			{ status: 500 }
		);
	}
}
