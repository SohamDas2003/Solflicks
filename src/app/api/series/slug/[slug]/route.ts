import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/utils/database";
import Series from "@/app/_models/Series";

// GET - Get a series by slug
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;

		await dbConnect();
		const series = await Series.findOne({ slug }).lean();

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
		console.error("Error fetching series by slug:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch series" },
			{ status: 500 }
		);
	}
}
