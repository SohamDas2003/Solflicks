"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { apiService } from "@/app/utils/apiService";
import { ISeries } from "@/app/_models/Series";

interface EditSeriesPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function EditSeriesPage({ params }: EditSeriesPageProps) {
	const router = useRouter();
	const resolvedParams = React.use(params);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		year: new Date().getFullYear(),
		seasons: 1,
		episodes: 1,
		genres: "",
		description: "",
		starring: "",
		director: "",
		producers: "",
		productionCompany: "Solflicks Filmwork",
		trailerUrl: "",
		streamingUrl: "",
		slug: "",
		imageUrl: "",
		imagePublicId: "",
		status: "ongoing" as "ongoing" | "completed" | "upcoming",
	});

	// Fetch series data on component mount
	useEffect(() => {
		const fetchSeries = async () => {
			try {
				setIsLoading(true);
				const response = await apiService.getSeriesById(resolvedParams.id);

				if (response.success && response.series) {
					const series = response.series;
					setFormData({
						title: series.title || "",
						year: series.year || new Date().getFullYear(),
						seasons: series.seasons || 1,
						episodes: series.episodes || 1,
						genres: Array.isArray(series.genres)
							? series.genres.join(", ")
							: "",
						description: series.description || "",
						starring: series.starring || "",
						director: series.director || "",
						producers: series.producers || "",
						productionCompany: series.productionCompany || "Solflicks Filmwork",
						trailerUrl: series.trailerUrl || "",
						streamingUrl: series.streamingUrl || "",
						slug: series.slug || "",
						imageUrl: series.imageUrl || "",
						imagePublicId: "",
						status: series.status || "ongoing",
					});

					if (series.imageUrl) {
						setImagePreview(series.imageUrl);
					}
				} else {
					setError(response.message || "Failed to fetch series data");
				}
			} catch (err) {
				console.error("Error fetching series:", err);
				setError("An unexpected error occurred");
			} finally {
				setIsLoading(false);
			}
		};

		fetchSeries();
	}, [resolvedParams.id]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;

		// Auto-generate slug when title changes
		if (name === "title") {
			const slug = value
				.toLowerCase()
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, "-");

			setFormData({
				...formData,
				[name]: value,
				slug: slug,
			});
		} else {
			setFormData({
				...formData,
				[name]:
					name === "year" || name === "seasons" || name === "episodes"
						? parseInt(value) || 0
						: value,
			});
		}
	};
	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Display preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);

			// Upload to Cloudinary
			const formDataUpload = new FormData();
			formDataUpload.append("file", file);
			formDataUpload.append("type", "series");

			try {
				const response = await fetch("/api/upload", {
					method: "POST",
					body: formDataUpload,
				});

				const data = await response.json();
				if (data.url && data.publicId) {
					setFormData((prev) => ({
						...prev,
						imageUrl: data.url,
						imagePublicId: data.publicId,
					}));
				} else {
					setError("Failed to upload image");
				}
			} catch (err) {
				console.error("Error uploading image:", err);
				setError("Failed to upload image");
			}
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			// Convert genres string to array
			const seriesData = {
				...formData,
				genres: formData.genres
					.split(",")
					.map((g) => g.trim())
					.filter((g) => g.length > 0),
			};

			const response = await apiService.updateSeries(
				resolvedParams.id,
				seriesData
			);

			if (response.success) {
				router.push("/dashboard/series");
			} else {
				setError(response.message || "Failed to update series");
			}
		} catch (err) {
			console.error("Error updating series:", err);
			setError("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	const genreOptions = [
		"Action",
		"Adventure",
		"Animation",
		"Comedy",
		"Crime",
		"Documentary",
		"Drama",
		"Family",
		"Fantasy",
		"History",
		"Horror",
		"Music",
		"Mystery",
		"Romance",
		"Science Fiction",
		"TV Movie",
		"Thriller",
		"War",
		"Western",
	];

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="mb-6">
				<div className="flex items-center gap-4">
					<Link
						href="/dashboard/series"
						className="text-blue-600 hover:text-blue-800">
						← Back to Series
					</Link>
				</div>
				<h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Series</h1>
				<p className="text-gray-600 mt-2">Update the series information</p>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
					{error}
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Title */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Title *
						</label>
						<input
							type="text"
							name="title"
							value={formData.title}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Enter series title"
						/>
					</div>

					{/* Year */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Year *
						</label>
						<input
							type="number"
							name="year"
							value={formData.year}
							onChange={handleChange}
							required
							min="1900"
							max={new Date().getFullYear() + 10}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{/* Seasons */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Number of Seasons *
						</label>
						<input
							type="number"
							name="seasons"
							value={formData.seasons}
							onChange={handleChange}
							required
							min="1"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{/* Episodes */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Total Episodes *
						</label>
						<input
							type="number"
							name="episodes"
							value={formData.episodes}
							onChange={handleChange}
							required
							min="1"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{/* Status */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Status *
						</label>
						<select
							name="status"
							value={formData.status}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="ongoing">Ongoing</option>
							<option value="completed">Completed</option>
							<option value="upcoming">Upcoming</option>
						</select>
					</div>

					{/* Slug */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Slug *
						</label>
						<input
							type="text"
							name="slug"
							value={formData.slug}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="URL-friendly version of title"
						/>
						<p className="text-xs text-gray-500 mt-1">
							This will be used in the URL. Auto-generated from title.
						</p>
					</div>
				</div>

				{/* Genres */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Genres * (comma-separated)
					</label>
					<input
						type="text"
						name="genres"
						value={formData.genres}
						onChange={handleChange}
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="e.g., Drama, Comedy, Action"
					/>
					<p className="text-xs text-gray-500 mt-1">
						Suggested: {genreOptions.slice(0, 5).join(", ")}...
					</p>
				</div>

				{/* Description */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Description *
					</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						required
						rows={4}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="Brief description of the series"
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Starring */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Starring
						</label>
						<input
							type="text"
							name="starring"
							value={formData.starring}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Main cast members"
						/>
					</div>

					{/* Director */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Director
						</label>
						<input
							type="text"
							name="director"
							value={formData.director}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Series director(s)"
						/>
					</div>

					{/* Producers */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Producers
						</label>
						<input
							type="text"
							name="producers"
							value={formData.producers}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Series producers"
						/>
					</div>

					{/* Production Company */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Production Company
						</label>
						<input
							type="text"
							name="productionCompany"
							value={formData.productionCompany}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Production company name"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Trailer URL */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Trailer URL
						</label>
						<input
							type="url"
							name="trailerUrl"
							value={formData.trailerUrl}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="https://..."
						/>
					</div>

					{/* Streaming URL */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Streaming URL
						</label>
						<input
							type="url"
							name="streamingUrl"
							value={formData.streamingUrl}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="https://..."
						/>
					</div>
				</div>

				{/* Image Upload */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Series Poster
					</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageUpload}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					{imagePreview && (
						<div className="mt-4">
							<Image
								src={imagePreview}
								alt="Preview"
								width={200}
								height={300}
								className="rounded-lg object-cover"
							/>
						</div>
					)}
				</div>

				{/* Submit Buttons */}
				<div className="flex justify-end space-x-4 pt-6 border-t">
					<button
						type="button"
						onClick={() => router.push("/dashboard/series")}
						className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
						{isSubmitting ? "Updating..." : "Update Series"}
					</button>
				</div>
			</form>
		</div>
	);
}
