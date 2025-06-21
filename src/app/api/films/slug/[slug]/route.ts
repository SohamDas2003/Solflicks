import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/utils/database";
import Film from "@/app/_models/Film";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;

		if (!slug) {
			return NextResponse.json(
				{ success: false, message: "Slug is required" },
				{ status: 400 }
			);
		}

		await dbConnect();
		const film = await Film.findOne({ slug }).lean();

		if (!film) {
			return NextResponse.json(
				{ success: false, message: "Film not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			film,
		});
	} catch (error) {
		console.error("Error fetching film by slug:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch film" },
			{ status: 500 }
		);
	}
}
