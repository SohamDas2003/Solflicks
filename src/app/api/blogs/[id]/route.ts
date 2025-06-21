/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/utils/database";
import Blog from "@/app/_models/Blog";
import mongoose from "mongoose";

export async function GET(_request: NextRequest, { params }: any) {
	try {
		await dbConnect();
		const blog = await Blog.findById(params.id)
			.populate("categories")
			.populate("tags")
			.populate("author");

		if (!blog) {
			return NextResponse.json({ error: "Blog not found" }, { status: 404 });
		}

		return NextResponse.json(blog);
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "Failed to fetch blog" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest, { params }: any) {
	try {
		await dbConnect();

		const blogData = await request.json();

		// Convert categories to proper ObjectId format
		const categories = blogData.categories.map((cat: any) =>
			typeof cat === "string"
				? new mongoose.Types.ObjectId(cat)
				: new mongoose.Types.ObjectId(cat.$oid || cat._id)
		);

		// Convert tags to proper ObjectId format
		const tags = blogData.tags.map((tag: any) =>
			typeof tag === "string"
				? new mongoose.Types.ObjectId(tag)
				: new mongoose.Types.ObjectId(tag.$oid || tag._id)
		);

		// Convert author to ObjectId
		const author =
			typeof blogData.author === "string"
				? new mongoose.Types.ObjectId(blogData.author)
				: new mongoose.Types.ObjectId(
						blogData.author.$oid || blogData.author._id
				  );

		// Create updated data object
		const updatedData = {
			...blogData,
			categories,
			tags,
			author,
		};

		const blog = await Blog.findByIdAndUpdate(params.id, updatedData, {
			new: true,
			runValidators: true,
		}).populate(["categories", "tags", "author"]);

		if (!blog) {
			return NextResponse.json({ error: "Blog not found" }, { status: 404 });
		}

		return NextResponse.json(blog);
	} catch (error: any) {
		console.error("Update error:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to update blog" },
			{ status: 500 }
		);
	}
}

export async function DELETE(_request: NextRequest, { params }: any) {
	try {
		await dbConnect();
		const blog = await Blog.findByIdAndDelete(params.id);

		if (!blog) {
			return NextResponse.json({ error: "Blog not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "Blog deleted successfully" });
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "Failed to delete blog" },
			{ status: 500 }
		);
	}
}
