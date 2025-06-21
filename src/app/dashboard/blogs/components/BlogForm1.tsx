/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";

interface BlogFormProps {
	initialData?: any;
	onCancel?: () => void;
}

interface BlogFormData {
	title: string;
	slug: string;
	shortDescription: string;
	content: string;
	thumbnailImage?: {
		url: string;
		alt: string;
		publicId: string;
	};
	bannerImage?: {
		url: string;
		alt: string;
		publicId: string;
	};
	categories: string[];
	tags: string[];
	author: string;
	published: boolean;
	metaTitle: string;
	metaDescription: string;
	metaKeywords: string;
}

interface Category {
	_id: string;
	name: string;
	slug: string;
}

interface Tag {
	_id: string;
	name: string;
	slug: string;
}

interface Author {
	_id: string;
	name: string;
	email: string;
}

const BlogForm1: React.FC<BlogFormProps> = ({ initialData, onCancel }) => {
	const router = useRouter();

	// State for form data
	const [formData, setFormData] = useState<BlogFormData>({
		title: initialData?.title || "",
		slug: initialData?.slug || "",
		shortDescription: initialData?.shortDescription || "",
		content: initialData?.content || "",
		thumbnailImage: initialData?.thumbnailImage || undefined,
		bannerImage: initialData?.bannerImage || undefined,
		categories: initialData?.categories?.map((cat: any) => cat._id) || [],
		tags: initialData?.tags?.map((tag: any) => tag._id) || [],
		author: initialData?.author?._id || "",
		published: initialData?.published || false,
		metaTitle: initialData?.metaTitle || "",
		metaDescription: initialData?.metaDescription || "",
		metaKeywords: initialData?.metaKeywords || "",
	});

	// State for options
	const [categories, setCategories] = useState<Category[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [authors, setAuthors] = useState<Author[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Image upload states
	const [uploadingBanner, setUploadingBanner] = useState(false);
	const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

	// Fetch data on component mount
	useEffect(() => {
		fetchOptions();
	}, []);

	const fetchOptions = async () => {
		try {
			const [categoriesRes, tagsRes, authorsRes] = await Promise.all([
				fetch("/api/categories"),
				fetch("/api/tags"),
				fetch("/api/authors"),
			]);

			if (categoriesRes.ok) {
				const categoriesData = await categoriesRes.json();
				setCategories(
					Array.isArray(categoriesData.data)
						? categoriesData.data
						: Array.isArray(categoriesData)
						? categoriesData
						: []
				);
			}

			if (tagsRes.ok) {
				const tagsData = await tagsRes.json();
				setTags(
					Array.isArray(tagsData.data)
						? tagsData.data
						: Array.isArray(tagsData)
						? tagsData
						: []
				);
			}

			if (authorsRes.ok) {
				const authorsData = await authorsRes.json();
				setAuthors(
					Array.isArray(authorsData.data)
						? authorsData.data
						: Array.isArray(authorsData)
						? authorsData
						: []
				);
			}
		} catch (error) {
			console.error("Error fetching options:", error);
			setError("Failed to load form options. Please try again.");
		}
	};

	// Generate slug from title
	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value, type } = e.target;

		if (type === "checkbox") {
			const checked = (e.target as HTMLInputElement).checked;
			setFormData((prev) => ({ ...prev, [name]: checked }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));

			// Auto-generate slug when title changes
			if (name === "title" && !initialData) {
				setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
			}
		}
	};

	const handleCategoryChange = (categoryId: string) => {
		setFormData((prev) => ({
			...prev,
			categories: prev.categories.includes(categoryId)
				? prev.categories.filter((id) => id !== categoryId)
				: [...prev.categories, categoryId],
		}));
	};

	const handleTagChange = (tagId: string) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.includes(tagId)
				? prev.tags.filter((id) => id !== tagId)
				: [...prev.tags, tagId],
		}));
	};

	// Image upload handlers
	const handleImageUpload = async (
		file: File,
		type: "banner" | "thumbnail"
	) => {
		if (type === "banner") {
			setUploadingBanner(true);
		} else {
			setUploadingThumbnail(true);
		}

		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("type", "blog");

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Failed to upload image");
			}

			const result = await response.json();

			// Update form data with the uploaded image
			setFormData((prev) => ({
				...prev,
				[type === "banner" ? "bannerImage" : "thumbnailImage"]: {
					url: result.url,
					alt: prev.title || "Blog image",
					publicId: result.publicId,
				},
			}));
		} catch (error) {
			console.error("Error uploading image:", error);
			setError(`Failed to upload ${type} image. Please try again.`);
		} finally {
			if (type === "banner") {
				setUploadingBanner(false);
			} else {
				setUploadingThumbnail(false);
			}
		}
	};

	const handleFileInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: "banner" | "thumbnail"
	) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				setError("Please select a valid image file");
				return;
			}

			// Validate file size (5MB limit)
			if (file.size > 5 * 1024 * 1024) {
				setError("Image size should be less than 5MB");
				return;
			}

			handleImageUpload(file, type);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Validate required fields
			if (
				!formData.title ||
				!formData.shortDescription ||
				!formData.content ||
				!formData.author
			) {
				throw new Error("Please fill in all required fields");
			}

			if (formData.categories.length === 0) {
				throw new Error("Please select at least one category");
			}

			// Validate required images
			if (!formData.bannerImage?.url) {
				throw new Error("Banner image is required");
			}

			if (!formData.thumbnailImage?.url) {
				throw new Error("Thumbnail image is required");
			}

			const isEdit = !!initialData?._id;
			const url = isEdit ? `/api/blogs/${initialData._id}` : "/api/blogs";
			const method = isEdit ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to save blog");
			}

			// Redirect to blogs list on success
			router.push("/dashboard/blogs");
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		} else {
			router.back();
		}
	};

	return (
		<div className="max-w-container mx-auto bg-white rounded-lg shadow-md p-6">
			<h1 className="text-2xl font-semibold mb-6 text-gray-800">
				{initialData ? "Edit Blog Post" : "Add New Blog Post"}
			</h1>

			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
					<p className="text-red-600 text-sm">{error}</p>
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Left Column - Basic Info and Content */}
					<div className="space-y-4">
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-700 mb-1">
								Blog Title*
							</label>
							<input
								type="text"
								id="title"
								name="title"
								value={formData.title}
								onChange={handleInputChange}
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
								onChange={handleInputChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
							<p className="text-xs text-gray-500 mt-1">
								Auto-generated from title, but can be edited
							</p>
						</div>

						<div>
							<label
								htmlFor="shortDescription"
								className="block text-sm font-medium text-gray-700 mb-1">
								Short Description*
							</label>
							<textarea
								id="shortDescription"
								name="shortDescription"
								rows={3}
								value={formData.shortDescription}
								onChange={handleInputChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						<div>
							<label
								htmlFor="author"
								className="block text-sm font-medium text-gray-700 mb-1">
								Author*
							</label>
							<select
								id="author"
								name="author"
								value={formData.author}
								onChange={handleInputChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								required>
								<option value="">Select an author</option>
								{Array.isArray(authors) &&
									authors.map((author) => (
										<option
											key={author._id}
											value={author._id}>
											{author.name}
										</option>
									))}
							</select>
						</div>

						<div>
							<label
								htmlFor="content"
								className="block text-sm font-medium text-gray-700 mb-1">
								Content*
							</label>
							<Editor
								tinymceScriptSrc="/tinymce/js/tinymce/tinymce.min.js"
								onInit={(evt, editor) => {
									console.log("Content Editor initialized");
									if (formData.content) {
										console.log("Setting content on init:", formData.content);
										editor.setContent(formData.content);
									}
								}}
								initialValue={formData.content || ""}
								init={{
									height: 400,
									menubar: true,
									plugins: [
										"advlist",
										"autolink",
										"lists",
										"link",
										"charmap",
										"preview",
										"anchor",
										"searchreplace",
										"visualblocks",
										"code",
										"fullscreen",
										"insertdatetime",
										"media",
										"table",
										"help",
										"wordcount",
										"emoticons",
										"quickbars",
										"nonbreaking",
									],
									fontsize_formats:
										"8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
									toolbar: [
										"undo redo | fontsize | bold italic underline strikethrough | forecolor backcolor |",
										"alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |",
										"removeformat | charmap emoticons | fullscreen preview |",
										"table | link anchor | searchreplace code help",
									].join(" "),
									toolbar_mode: "wrap",
									content_style:
										"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
									setup: (editor: any) => {
										editor.on("blur", () => {
											setFormData((prev) => ({
												...prev,
												content: editor.getContent(),
											}));
										});
									},
								}}
							/>
						</div>
					</div>

					{/* Right Column - Images, Categories, Tags, SEO */}
					<div className="space-y-4">
						{/* Banner Image */}
						<div>
							<label
								htmlFor="bannerImage"
								className="block text-sm font-medium text-gray-700 mb-1">
								Banner Image*
							</label>
							<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
								{formData.bannerImage?.url ? (
									<div className="text-center">
										<div className="relative w-40 h-24 mx-auto mb-2">
											<Image
												src={formData.bannerImage.url}
												alt="Banner Preview"
												fill
												className="object-cover rounded-md"
											/>
										</div>
										<button
											type="button"
											onClick={() =>
												setFormData((prev) => ({
													...prev,
													bannerImage: undefined,
												}))
											}
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
												htmlFor="banner-upload"
												className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
												<span>
													{uploadingBanner ? "Uploading..." : "Upload banner"}
												</span>
												<input
													id="banner-upload"
													name="banner-upload"
													type="file"
													accept="image/*"
													className="sr-only"
													onChange={(e) => handleFileInputChange(e, "banner")}
													disabled={uploadingBanner}
												/>
											</label>
											<p className="pl-1">or drag and drop</p>
										</div>
										<p className="text-xs text-gray-500">
											PNG, JPG, WebP up to 5MB
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Thumbnail Image */}
						<div>
							<label
								htmlFor="thumbnailImage"
								className="block text-sm font-medium text-gray-700 mb-1">
								Thumbnail Image*
							</label>
							<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
								{formData.thumbnailImage?.url ? (
									<div className="text-center">
										<div className="relative w-40 h-24 mx-auto mb-2">
											<Image
												src={formData.thumbnailImage.url}
												alt="Thumbnail Preview"
												fill
												className="object-cover rounded-md"
											/>
										</div>
										<button
											type="button"
											onClick={() =>
												setFormData((prev) => ({
													...prev,
													thumbnailImage: undefined,
												}))
											}
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
												htmlFor="thumbnail-upload"
												className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
												<span>
													{uploadingThumbnail
														? "Uploading..."
														: "Upload thumbnail"}
												</span>
												<input
													id="thumbnail-upload"
													name="thumbnail-upload"
													type="file"
													accept="image/*"
													className="sr-only"
													onChange={(e) =>
														handleFileInputChange(e, "thumbnail")
													}
													disabled={uploadingThumbnail}
												/>
											</label>
											<p className="pl-1">or drag and drop</p>
										</div>
										<p className="text-xs text-gray-500">
											PNG, JPG, WebP up to 5MB
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Categories */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Categories*
							</label>
							{/* Selected Categories Bubbles */}
							<div className="mb-2 min-h-[2rem] flex flex-wrap gap-2">
								{formData.categories.map((categoryId) => {
									const category = categories.find(
										(cat) => cat._id === categoryId
									);
									return category ? (
										<span
											key={categoryId}
											className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
											{category.name}
											<button
												type="button"
												onClick={() => handleCategoryChange(categoryId)}
												className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-700 focus:outline-none">
												<svg
													className="w-3 h-3"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</button>
										</span>
									) : null;
								})}
								{formData.categories.length === 0 && (
									<span className="text-sm text-gray-400 italic">
										No categories selected
									</span>
								)}
							</div>
							{/* Categories Dropdown */}
							<div className="relative">
								<select
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
									value=""
									onChange={(e) => {
										if (
											e.target.value &&
											!formData.categories.includes(e.target.value)
										) {
											handleCategoryChange(e.target.value);
										}
									}}>
									<option value="">Add a category...</option>
									{Array.isArray(categories) &&
										categories
											.filter(
												(category) =>
													!formData.categories.includes(category._id)
											)
											.map((category) => (
												<option
													key={category._id}
													value={category._id}>
													{category.name}
												</option>
											))}
								</select>
							</div>
							{(!Array.isArray(categories) || categories.length === 0) && (
								<p className="text-gray-500 text-sm mt-1">
									No categories available
								</p>
							)}
							<p className="text-xs text-gray-500 mt-1">
								Select at least one category
							</p>
						</div>

						{/* Tags */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Tags
							</label>
							{/* Selected Tags Bubbles */}
							<div className="mb-2 min-h-[2rem] flex flex-wrap gap-2">
								{formData.tags.map((tagId) => {
									const tag = tags.find((t) => t._id === tagId);
									return tag ? (
										<span
											key={tagId}
											className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
											{tag.name}
											<button
												type="button"
												onClick={() => handleTagChange(tagId)}
												className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-600 hover:bg-green-200 hover:text-green-700 focus:outline-none">
												<svg
													className="w-3 h-3"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</button>
										</span>
									) : null;
								})}
								{formData.tags.length === 0 && (
									<span className="text-sm text-gray-400 italic">
										No tags selected
									</span>
								)}
							</div>
							{/* Tags Dropdown */}
							<div className="relative">
								<select
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
									value=""
									onChange={(e) => {
										if (
											e.target.value &&
											!formData.tags.includes(e.target.value)
										) {
											handleTagChange(e.target.value);
										}
									}}>
									<option value="">Add a tag...</option>
									{Array.isArray(tags) &&
										tags
											.filter((tag) => !formData.tags.includes(tag._id))
											.map((tag) => (
												<option
													key={tag._id}
													value={tag._id}>
													{tag.name}
												</option>
											))}
								</select>
							</div>
							{(!Array.isArray(tags) || tags.length === 0) && (
								<p className="text-gray-500 text-sm mt-1">No tags available</p>
							)}
						</div>

						{/* Publishing Options */}
						<div>
							<label className="flex items-center">
								<input
									type="checkbox"
									name="published"
									checked={formData.published}
									onChange={handleInputChange}
									className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
								/>
								<span className="text-sm font-medium text-gray-700">
									Publish immediately
								</span>
							</label>
						</div>
					</div>
				</div>

				{/* SEO Settings - Full Width */}
				<div className="space-y-4 border-t pt-6">
					<h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="metaTitle"
								className="block text-sm font-medium text-gray-700 mb-1">
								Meta Title
							</label>
							<input
								type="text"
								id="metaTitle"
								name="metaTitle"
								value={formData.metaTitle}
								onChange={handleInputChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label
								htmlFor="metaKeywords"
								className="block text-sm font-medium text-gray-700 mb-1">
								Meta Keywords
							</label>
							<input
								type="text"
								id="metaKeywords"
								name="metaKeywords"
								value={formData.metaKeywords}
								onChange={handleInputChange}
								placeholder="keyword1, keyword2, keyword3"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="metaDescription"
							className="block text-sm font-medium text-gray-700 mb-1">
							Meta Description
						</label>
						<textarea
							id="metaDescription"
							name="metaDescription"
							rows={3}
							value={formData.metaDescription}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				<div className="flex justify-end space-x-3">
					<button
						type="button"
						onClick={handleCancel}
						className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
						Cancel
					</button>
					<button
						type="submit"
						disabled={loading}
						className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
						{loading
							? initialData
								? "Updating..."
								: "Saving..."
							: initialData
							? "Update Blog Post"
							: "Save Blog Post"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default BlogForm1;
