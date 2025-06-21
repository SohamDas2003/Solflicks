/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/utils/database";
import Blog from "@/app/_models/Blog";

export async function GET(_request: NextRequest, { params }: any) {
	try {
		await dbConnect();
		const { slug } = await params;
		const blog = await Blog.findOne({ slug: slug })
			.populate("categories", "name slug")
			.populate("tags", "name")
			.populate("author", "name");

		if (!blog) {
			return NextResponse.json(
				{
					success: false,
					message: "Blog not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			blog,
		});
	} catch (error: any) {
		return NextResponse.json(
			{
				success: false,
				message: error.message || "Failed to fetch blog",
			},
			{ status: 500 }
		);
	}
}
