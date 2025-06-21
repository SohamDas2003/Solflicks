/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/database";
import Author from "@/app/_models/Author";

export async function GET() {
	try {
		await dbConnect();
		const authors = await Author.find({}).sort({ createdAt: -1 });
		return NextResponse.json({
			success: true,
			data: authors,
		});
	} catch (error: any) {
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to fetch authors",
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		await dbConnect();
		const body = await request.json();

		// Create slug from name
		const slug = body.name
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");

		const author = await Author.create({
			...body,
			slug,
		});

		return NextResponse.json(
			{
				success: true,
				data: author,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "Failed to create author" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: Request) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		const author = await Author.findByIdAndDelete(id);

		if (!author) {
			return NextResponse.json({ error: "Author not found" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			message: "Author deleted successfully",
		});
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "Failed to delete author" },
			{ status: 500 }
		);
	}
}
