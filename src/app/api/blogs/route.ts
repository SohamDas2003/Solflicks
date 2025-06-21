/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import dbConnect from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server";
import Blog from "@/app/_models/Blog";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const blogData = await request.json();
		console.log("Received blog data:", blogData); // Debug log

		// Convert categories to ObjectIds
		const categories = blogData.categories.map((cat: any) =>
			typeof cat === "string"
				? new mongoose.Types.ObjectId(cat)
				: new mongoose.Types.ObjectId(cat.$oid || cat._id)
		);

		// Modify tags conversion to explicitly create ObjectIds
		const tags = blogData.tags.map((tag: any) => {
			// Ensure we're creating and passing a real ObjectId instance
			const tagId = typeof tag === "string" ? tag : tag.$oid || tag._id;
			return new mongoose.Types.ObjectId(tagId);
		});

		// Modify author conversion similarly
		const authorId =
			typeof blogData.author === "string"
				? blogData.author
				: blogData.author.$oid || blogData.author._id;

		const author = new mongoose.Types.ObjectId(authorId);

		// Create blog with converted ObjectIds and explicitly include metadata fields
		const blog = await Blog.create({
			...blogData,
			categories,
			tags,
			author,
			// Explicitly include metadata fields
			metaTitle: blogData.metaTitle || "",
			metaDescription: blogData.metaDescription || "",
			metaKeywords: blogData.metaKeywords || "",
		});

		// Populate references before sending response
		await blog.populate(["categories", "tags", "author"]);

		return NextResponse.json(blog, { status: 201 });
	} catch (error: any) {
		console.error("Blog creation error:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to create blog" },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		// Get query parameters
		const searchParams = request.nextUrl.searchParams;
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const published = searchParams.get("published");
		const search = searchParams.get("search");
		const exclude = searchParams.get("exclude"); // Slug to exclude

		// Get all category values (can be multiple)
		const categories = searchParams.getAll("categories");

		// Build query
		const query: any = {};

		// Add published filter
		if (published !== null) {
			query.published = published === "true";
		}

		// Add search functionality
		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ shortDescription: { $regex: search, $options: "i" } },
			];
		}

		// Add categories filter - match if ANY of the categories match
		if (categories && categories.length > 0) {
			const categoryIds = categories.map(
				(cat) => new mongoose.Types.ObjectId(cat)
			);
			query.categories = { $in: categoryIds };
		}

		// Add exclusion by slug
		if (exclude) {
			query.slug = { $ne: exclude };
		}

		// Calculate skip value for pagination
		const skip = (page - 1) * limit;

		// Fetch blogs with pagination and populate references
		const [blogs, total] = await Promise.all([
			Blog.find(query)
				.populate("categories", "name slug")
				.populate("author", "name")
				.populate("tags", "name")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			Blog.countDocuments(query),
		]);

		// Calculate pagination info
		const totalPages = Math.ceil(total / limit);
		const hasMore = page < totalPages;

		return NextResponse.json({
			success: true,
			blogs,
			pagination: {
				currentPage: page,
				totalPages,
				totalItems: total,
				hasMore,
				itemsPerPage: limit,
			},
		});
	} catch (error: any) {
		console.error("Error fetching blogs:", error);
		return NextResponse.json(
			{
				success: false,
				message: error.message || "Failed to fetch blogs",
			},
			{ status: 500 }
		);
	}
}
