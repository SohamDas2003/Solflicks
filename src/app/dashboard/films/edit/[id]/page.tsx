"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { apiService } from "@/app/utils/apiService";
import { IFilm } from "@/app/_models/Film";

interface EditFilmPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function EditFilmPage({ params }: EditFilmPageProps) {
	const router = useRouter();
	const resolvedParams = React.use(params);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		year: new Date().getFullYear(),
		duration: "",
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
	});

	// Fetch film data on component mount
	useEffect(() => {
		const fetchFilm = async () => {
			try {
				setIsLoading(true);
				const response = await apiService.getFilm(resolvedParams.id);

				if (response.success && response.film) {
					const film = response.film;
					setFormData({
						title: film.title || "",
						year: film.year || new Date().getFullYear(),
						duration: film.duration || "",
						genres: Array.isArray(film.genres) ? film.genres.join(", ") : "",
						description: film.description || "",
						starring: film.starring || "",
						director: film.director || "",
						producers: film.producers || "",
						productionCompany: film.productionCompany || "Solflicks Filmwork",
						trailerUrl: film.trailerUrl || "",
						streamingUrl: film.streamingUrl || "",
						slug: film.slug || "",
						imageUrl: film.imageUrl || "",
						imagePublicId: "", // This might not be available from the API
					});

					if (film.imageUrl) {
						setImagePreview(film.imageUrl);
					}
				} else {
					setError(response.message || "Film not found");
				}
			} catch (err) {
				console.error("Error fetching film:", err);
				setError("Failed to load film data");
			} finally {
				setIsLoading(false);
			}
		};
		if (resolvedParams.id) {
			fetchFilm();
		}
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
				[name]: value,
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
			formDataUpload.append("type", "film");

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
			// Format genres as array if it's a string
			const genresArray =
				typeof formData.genres === "string"
					? formData.genres.split(",").map((g) => g.trim())
					: formData.genres; // Update film through API
			const response = await apiService.updateFilm(resolvedParams.id, {
				...formData,
				genres: genresArray,
			});

			if (response.success) {
				router.push("/dashboard/films");
			} else {
				setError(response.message || "Failed to update film");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			setError("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="max-w-container mx-auto bg-white rounded-lg shadow-md p-6">
				<div className="flex justify-center items-center py-12">
					<div className="text-lg text-gray-600">Loading film data...</div>
				</div>
			</div>
		);
	}
	return (
		<div className="max-w-container mx-auto bg-white rounded-lg shadow-md p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-semibold text-gray-800">Edit Film</h1>
				{formData.slug && (
					<Link
						href={`/films/${formData.slug}`}
						target="_blank"
						className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
						View Film ↗
					</Link>
				)}
			</div>

			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
					<p className="text-red-600 text-sm">{error}</p>
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Left Column - Basic Info */}
					<div className="space-y-4">
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-700 mb-1">
								Film Title*
							</label>
							<input
								type="text"
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="year"
									className="block text-sm font-medium text-gray-700 mb-1">
									Release Year*
								</label>
								<input
									type="number"
									id="year"
									name="year"
									min="1900"
									max="2099"
									value={formData.year}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="duration"
									className="block text-sm font-medium text-gray-700 mb-1">
									Duration*
								</label>
								<input
									type="text"
									id="duration"
									name="duration"
									placeholder="e.g. 1 Hour 30 Mins"
									value={formData.duration}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="genres"
								className="block text-sm font-medium text-gray-700 mb-1">
								Genres*
							</label>
							<input
								type="text"
								id="genres"
								name="genres"
								placeholder="e.g. Drama, History (comma separated)"
								value={formData.genres}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						<div>
							<label
								htmlFor="slug"
								className="block text-sm font-medium text-gray-700 mb-1">
								Slug (URL-friendly name)*
							</label>
							<input
								type="text"
								id="slug"
								name="slug"
								value={formData.slug}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
							<p className="text-xs text-gray-500 mt-1">
								Auto-generated from title, but can be edited
							</p>
						</div>

						<div>
							<label
								htmlFor="description"
								className="block text-sm font-medium text-gray-700 mb-1">
								Description*
							</label>
							<textarea
								id="description"
								name="description"
								rows={5}
								value={formData.description}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>
					</div>

					{/* Right Column - Additional Info + Image Upload */}
					<div className="space-y-4">
						<div>
							<label
								htmlFor="image"
								className="block text-sm font-medium text-gray-700 mb-1">
								Film Poster/Cover Image*
							</label>
							<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
								{imagePreview ? (
									<div className="text-center">
										<div className="relative w-40 h-52 mx-auto mb-2">
											<Image
												src={imagePreview}
												alt="Preview"
												fill
												className="object-cover rounded-md"
											/>
										</div>
										<button
											type="button"
											onClick={() => setImagePreview(null)}
											className="text-sm text-red-600 hover:text-red-800">
											Remove
										</button>
									</div>
								) : (
									<div className="space-y-1 text-center">
										<svg
											className="mx-auto h-12 w-12 text-gray-400"
											stroke="currentColor"
											fill="none"
											viewBox="0 0 48 48"
											aria-hidden="true">
											<path
												d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<div className="flex text-sm text-gray-600">
											<label
												htmlFor="file-upload"
												className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
												<span>Upload a file</span>
												<input
													id="file-upload"
													name="file-upload"
													type="file"
													accept="image/*"
													className="sr-only"
													onChange={handleImageUpload}
												/>
											</label>
											<p className="pl-1">or drag and drop</p>
										</div>
										<p className="text-xs text-gray-500">
											PNG, JPG, WebP up to 10MB
										</p>
									</div>
								)}
							</div>
						</div>{" "}
						<div>
							<label
								htmlFor="trailerUrl"
								className="block text-sm font-medium text-gray-700 mb-1">
								YouTube Trailer ID
							</label>
							<input
								type="text"
								id="trailerUrl"
								name="trailerUrl"
								placeholder="e.g. dQw4w9WgXcQ"
								value={formData.trailerUrl}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Just the ID, not the full URL
							</p>
						</div>
						<div>
							<label
								htmlFor="streamingUrl"
								className="block text-sm font-medium text-gray-700 mb-1">
								Streaming/Watch Now Link
							</label>
							<input
								type="url"
								id="streamingUrl"
								name="streamingUrl"
								placeholder="https://example.com/watch/film"
								value={formData.streamingUrl}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Full URL where users can watch the film
							</p>
						</div>
						<div>
							<label
								htmlFor="starring"
								className="block text-sm font-medium text-gray-700 mb-1">
								Starring/Cast
							</label>
							<input
								type="text"
								id="starring"
								name="starring"
								placeholder="e.g. Actor 1, Actor 2"
								value={formData.starring}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label
								htmlFor="director"
								className="block text-sm font-medium text-gray-700 mb-1">
								Director
							</label>
							<input
								type="text"
								id="director"
								name="director"
								value={formData.director}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label
								htmlFor="producers"
								className="block text-sm font-medium text-gray-700 mb-1">
								Producers
							</label>
							<input
								type="text"
								id="producers"
								name="producers"
								value={formData.producers}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label
								htmlFor="productionCompany"
								className="block text-sm font-medium text-gray-700 mb-1">
								Production Company
							</label>
							<input
								type="text"
								id="productionCompany"
								name="productionCompany"
								value={formData.productionCompany}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>
				</div>

				{/* Add hidden fields for image data */}
				<input
					type="hidden"
					name="imageUrl"
					value={formData.imageUrl}
				/>
				<input
					type="hidden"
					name="imagePublicId"
					value={formData.imagePublicId}
				/>

				<div className="flex justify-end space-x-3">
					<button
						type="button"
						onClick={() => router.push("/dashboard/films")}
						className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
						{isSubmitting ? "Updating..." : "Update Film"}
					</button>
				</div>
			</form>
		</div>
	);
}
