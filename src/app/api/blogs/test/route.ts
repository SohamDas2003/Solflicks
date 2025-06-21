import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/database";
import Blog from "@/app/_models/Blog";

export async function GET() {
	try {
		console.log("Testing blog API...");
		await dbConnect();
		console.log("Database connected successfully");

		// Count total blogs
		const totalBlogs = await Blog.countDocuments();
		console.log("Total blogs in database:", totalBlogs);

		// Count published blogs
		const publishedBlogs = await Blog.countDocuments({ published: true });
		console.log("Published blogs in database:", publishedBlogs);

		// Get first few blogs for testing
		const sampleBlogs = await Blog.find({ published: true })
			.populate("categories", "name slug")
			.populate("author", "name")
			.populate("tags", "name")
			.limit(3)
			.lean();

		return NextResponse.json({
			success: true,
			message: "Blog API test successful",
			data: {
				totalBlogs,
				publishedBlogs,
				sampleBlogs: sampleBlogs.map((blog) => ({
					_id: blog._id,
					title: blog.title,
					slug: blog.slug,
					published: blog.published,
					hasCategories: blog.categories?.length || 0,
					hasAuthor: !!blog.author,
					hasThumbnail: !!blog.thumbnailImage?.url,
				})),
			},
		});
	} catch (error: any) {
		console.error("Blog API test error:", error);
		return NextResponse.json(
			{
				success: false,
				message: error.message || "Test failed",
				error: error.toString(),
			},
			{ status: 500 }
		);
	}
}
