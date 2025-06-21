/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/database";
import Category from "@/app/_models/Category";

export async function GET(_request: Request, { params }: any) {
	try {
		await dbConnect();
		const category = await Category.findById(params.id);
		if (!category) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(category);
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to fetch category: ${error}` },
			{ status: 500 }
		);
	}
}

export async function PUT(request: Request, { params }: any) {
	try {
		await dbConnect();
		const data = await request.json();

		// Update slug if name is changed
		if (data.name) {
			data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
		}

		const category = await Category.findByIdAndUpdate(
			params.id,
			{ ...data, updatedAt: new Date() },
			{ new: true, runValidators: true }
		);

		if (!category) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(category);
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to update category: ${error}` },
			{ status: 500 }
		);
	}
}

export async function DELETE(_request: Request, { params }: any) {
	try {
		await dbConnect();
		const category = await Category.findByIdAndDelete(params.id);

		if (!category) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ message: "Category deleted successfully" });
	} catch (error) {
		return NextResponse.json(
			{ error: `Failed to delete category: ${error}` },
			{ status: 500 }
		);
	}
}
