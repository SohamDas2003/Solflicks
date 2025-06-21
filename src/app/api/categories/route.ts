/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/database";
import Category from "@/app/_models/Category";
import mongoose from "mongoose";
import { z } from "zod";

// Define type-safe schema for category validation
const CategorySchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	description: z.string().optional(),
	slug: z.string().optional(),
});

// Error handler utility
const handleError = (error: unknown) => {
	console.error("API Error:", error);
	if (error instanceof z.ZodError) {
		return NextResponse.json(
			{ success: false, error: "Validation failed", details: error.errors },
			{ status: 400 }
		);
	}
	if (error instanceof mongoose.Error.ValidationError) {
		return NextResponse.json(
			{ success: false, error: "Validation failed", details: error.message },
			{ status: 400 }
		);
	}
	return NextResponse.json(
		{ success: false, error: "Internal server error" },
		{ status: 500 }
	);
};

export async function GET(request: Request) {
	try {
		await dbConnect();
		const categories = await Category.find({})
			.sort({ createdAt: -1 })
			.select("-__v")
			.lean();

		return NextResponse.json({
			success: true,
			data: categories,
		});
	} catch (error) {
		return handleError(error);
	}
}

export async function POST(request: Request) {
	try {
		await dbConnect();
		const body = await request.json();

		// Validate input
		const validatedData = CategorySchema.parse(body);

		// Create slug from name
		const slug = validatedData.name
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");

		// Check for existing category with same name or slug
		const existing = await Category.findOne({
			$or: [{ name: validatedData.name }, { slug }],
		});

		if (existing) {
			return NextResponse.json(
				{ success: false, error: "Category with this name already exists" },
				{ status: 409 }
			);
		}

		const category = await Category.create({
			...validatedData,
			slug,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return NextResponse.json(
			{
				success: true,
				data: category,
			},
			{ status: 201 }
		);
	} catch (error) {
		return handleError(error);
	}
}

export async function PUT(request: Request) {
	try {
		await dbConnect();
		const { id, ...updateData } = await request.json();

		if (!mongoose.isValidObjectId(id)) {
			return NextResponse.json(
				{ success: false, error: "Invalid category ID" },
				{ status: 400 }
			);
		}

		// Validate input
		const validatedData = CategorySchema.parse(updateData);

		// Update slug if name is changed
		const slug = validatedData.name
			? validatedData.name
					.toLowerCase()
					.trim()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-|-$/g, "")
			: undefined;

		// Check for existing category with same name or slug
		if (validatedData.name) {
			const existing = await Category.findOne({
				_id: { $ne: id },
				$or: [{ name: validatedData.name }, { slug }],
			});

			if (existing) {
				return NextResponse.json(
					{ success: false, error: "Category with this name already exists" },
					{ status: 409 }
				);
			}
		}

		const updated = await Category.findByIdAndUpdate(
			id,
			{
				...validatedData,
				...(slug && { slug }),
				updatedAt: new Date(),
			},
			{ new: true, runValidators: true }
		);

		if (!updated) {
			return NextResponse.json(
				{ success: false, error: "Category not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: updated,
		});
	} catch (error) {
		return handleError(error);
	}
}

export async function DELETE(request: Request) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id || !mongoose.isValidObjectId(id)) {
			return NextResponse.json(
				{ error: "Invalid category ID" },
				{ status: 400 }
			);
		}

		const category = await Category.findByIdAndDelete(id);

		if (!category) {
			return NextResponse.json(
				{ success: false, error: "Category not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				success: true,
				message: "Category deleted successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		return handleError(error);
	}
}
