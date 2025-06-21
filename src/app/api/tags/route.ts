/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/database";
import Tag from "@/app/_models/Tag";
import mongoose from "mongoose";

export async function GET() {
	try {
		await dbConnect();
		const tags = await Tag.find({}).sort({ createdAt: -1 });
		return NextResponse.json({
			success: true,
			data: tags,
		});
	} catch (error: any) {
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to fetch tags",
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

		// Check for existing tag
		const existing = await Tag.findOne({
			$or: [{ name: body.name }, { slug }],
		});

		if (existing) {
			return NextResponse.json(
				{ error: "Tag with this name already exists" },
				{ status: 409 }
			);
		}

		const tag = await Tag.create({
			...body,
			slug,
		});

		return NextResponse.json(
			{
				success: true,
				data: tag,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "Failed to create tag" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: Request) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id || !mongoose.isValidObjectId(id)) {
			return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 });
		}

		const tag = await Tag.findByIdAndDelete(id);

		if (!tag) {
			return NextResponse.json({ error: "Tag not found" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			message: "Tag deleted successfully",
		});
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "Failed to delete tag" },
			{ status: 500 }
		);
	}
}
