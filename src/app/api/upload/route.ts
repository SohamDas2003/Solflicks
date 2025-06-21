/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
	try {
		const formData = await request.formData();

		// Handle different field names depending on source
		const file =
			(formData.get("file") as Blob) || (formData.get("image") as Blob);
		const isEditor = formData.get("editor") === "true";
		const type = (formData.get("type") as string) || "general";

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Convert file to base64
		const buffer = Buffer.from(await file.arrayBuffer());
		const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;
		// Configure upload options based on content type
		let folder = "general-uploads";
		if (isEditor) {
			folder = "blog-content";
		} else if (type === "film") {
			folder = "film-posters"; // Dedicated folder for film posters
		} else if (type === "series") {
			folder = "series-posters"; // Dedicated folder for series posters
		} else if (type === "blog") {
			folder = "blog-images";
		} else if (type === "banner") {
			folder = "hero-banners"; // Dedicated folder for hero banners
		}

		const uploadOptions: any = { folder };

		// Add specific transformations based on image type
		if (type === "film" || type === "series") {
			uploadOptions.transformation = [
				{ width: 500, height: 750, crop: "fill" }, // Standard movie/series poster ratio
				{ quality: "auto:good" },
			];
		} else if (type === "thumbnail") {
			uploadOptions.transformation = [
				{ width: 400, height: 300, crop: "fill" },
				{ quality: "auto:good" },
			];
		} else if (type === "banner") {
			uploadOptions.transformation = [
				{ width: 1920, height: 1080, crop: "fill" }, // 16:9 aspect ratio for hero banners
				{ quality: "auto:good" },
				{ format: "webp" }, // Convert to webp for better performance
			];
		} else {
			uploadOptions.transformation = [{ quality: "auto:good" }];
		}

		// Upload to cloudinary
		const result = await cloudinary.uploader.upload(base64Image, uploadOptions);

		return NextResponse.json({
			url: result.secure_url,
			publicId: result.public_id,
		});
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: "Failed to upload file" },
			{ status: 500 }
		);
	}
}
