"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Banner {
	_id: string;
	title: string;
	subtitle?: string;
	description: string;
	platform?: string;
	imageUrl: string;
	watchNowLink?: string;
	learnMoreLink?: string;
	isActive: boolean;
	order: number;
}

function Dashboard() {
	const [banners, setBanners] = useState<Banner[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
	const [loading, setLoading] = useState(false);
	const [imageUploading, setImageUploading] = useState(false);

	const [formData, setFormData] = useState({
		title: "",
		subtitle: "",
		description: "",
		platform: "",
		imageUrl: "",
		watchNowLink: "",
		learnMoreLink: "",
		order: 0,
	});
	// Fetch banners
	const fetchBanners = async () => {
		try {
			const response = await fetch("/api/banners?dashboard=true");
			const data = await response.json();
			setBanners(data.banners || []);
		} catch (error) {
			console.error("Error fetching banners:", error);
		}
	};

	useEffect(() => {
		fetchBanners();
	}, []);

	// Handle image upload
	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setImageUploading(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", "banner");

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				setFormData((prev) => ({ ...prev, imageUrl: data.url }));
			}
		} catch (error) {
			console.error("Error uploading image:", error);
		} finally {
			setImageUploading(false);
		}
	}; // Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submission started");
		console.log("Form data:", formData);
		setLoading(true);

		// Only validate that image is uploaded
		if (!formData.imageUrl) {
			alert("Please upload an image for the banner.");
			console.log("Form submission stopped: No image uploaded");
			setLoading(false);
			return;
		}

		try {
			const url = editingBanner
				? `/api/banners/${editingBanner._id}`
				: "/api/banners";
			const method = editingBanner ? "PUT" : "POST";

			console.log("Making API request:", { url, method, data: formData });

			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			console.log("API response status:", response.status);
			console.log("API response ok:", response.ok);

			if (response.ok) {
				const responseData = await response.json();
				console.log("Banner saved successfully:", responseData);
				await fetchBanners();
				setIsModalOpen(false);
				resetForm();
			} else {
				const errorData = await response.text();
				console.error("API error response:", errorData);
				alert("Failed to save banner. Please try again.");
			}
		} catch (error) {
			console.error("Error saving banner:", error);
			alert("An error occurred while saving the banner. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Reset form
	const resetForm = () => {
		setFormData({
			title: "",
			subtitle: "",
			description: "",
			platform: "",
			imageUrl: "",
			watchNowLink: "",
			learnMoreLink: "",
			order: 0,
		});
		setEditingBanner(null);
	};

	// Open edit modal
	const handleEdit = (banner: Banner) => {
		setEditingBanner(banner);
		setFormData({
			title: banner.title,
			subtitle: banner.subtitle || "",
			description: banner.description,
			platform: banner.platform || "",
			imageUrl: banner.imageUrl,
			watchNowLink: banner.watchNowLink || "",
			learnMoreLink: banner.learnMoreLink || "",
			order: banner.order,
		});
		setIsModalOpen(true);
	};

	// Delete banner
	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this banner?")) return;

		try {
			const response = await fetch(`/api/banners/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				await fetchBanners();
			}
		} catch (error) {
			console.error("Error deleting banner:", error);
		}
	};

	// Toggle banner status
	const toggleStatus = async (id: string, isActive: boolean) => {
		try {
			const response = await fetch("/api/banners", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, isActive: !isActive }),
			});

			if (response.ok) {
				await fetchBanners();
			}
		} catch (error) {
			console.error("Error updating banner status:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-900">
						Banner Management
					</h1>
					<button
						onClick={() => {
							resetForm();
							setIsModalOpen(true);
						}}
						className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
						Add New Banner
					</button>
				</div>

				{/* Banners Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{banners.map((banner) => (
						<div
							key={banner._id}
							className="bg-white rounded-lg shadow-md overflow-hidden">
							<div className="relative h-48">
								<Image
									src={banner.imageUrl}
									alt={banner.title}
									fill
									className="object-cover"
								/>
								<div
									className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
										banner.isActive
											? "bg-green-500 text-white"
											: "bg-red-500 text-white"
									}`}>
									{banner.isActive ? "Active" : "Inactive"}
								</div>
							</div>
							<div className="p-4">
								<h3 className="font-bold text-lg mb-2">{banner.title}</h3>
								<p className="text-gray-600 text-sm mb-2">{banner.platform}</p>
								<p className="text-gray-700 text-sm mb-4 line-clamp-2">
									{banner.description}
								</p>
								<div className="flex justify-between items-center">
									<span className="text-xs text-gray-500">
										Order: {banner.order}
									</span>
									<div className="flex space-x-2">
										<button
											onClick={() => handleEdit(banner)}
											className="text-blue-600 hover:text-blue-800 text-sm">
											Edit
										</button>
										<button
											onClick={() => toggleStatus(banner._id, banner.isActive)}
											className="text-yellow-600 hover:text-yellow-800 text-sm">
											{banner.isActive ? "Deactivate" : "Activate"}
										</button>
										<button
											onClick={() => handleDelete(banner._id)}
											className="text-red-600 hover:text-red-800 text-sm">
											Delete
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Modal */}
				{isModalOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
							<h2 className="text-2xl font-bold mb-4">
								{editingBanner ? "Edit Banner" : "Add New Banner"}
							</h2>
							<form
								onSubmit={handleSubmit}
								className="space-y-4">
								{" "}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Title
									</label>
									<input
										type="text"
										value={formData.title}
										onChange={(e) =>
											setFormData({ ...formData, title: e.target.value })
										}
										className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Subtitle
									</label>
									<input
										type="text"
										value={formData.subtitle}
										onChange={(e) =>
											setFormData({ ...formData, subtitle: e.target.value })
										}
										className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Platform
									</label>
									<input
										type="text"
										value={formData.platform}
										onChange={(e) =>
											setFormData({ ...formData, platform: e.target.value })
										}
										placeholder="e.g., Netflix, Amazon Prime, Solflicks"
										className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>{" "}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Description
									</label>
									<textarea
										rows={2}
										value={formData.description}
										onChange={(e) =>
											setFormData({
												...formData,
												description: e.target.value,
											})
										}
										className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Banner Image *
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={handleImageUpload}
										className="w-full p-2 border rounded-lg"
									/>
									{imageUploading && (
										<p className="text-sm text-blue-600 mt-1">
											Uploading image...
										</p>
									)}
									{formData.imageUrl && (
										<div className="mt-2 relative h-32 w-full">
											<Image
												src={formData.imageUrl}
												alt="Preview"
												fill
												className="object-cover rounded"
											/>
										</div>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Watch Now Link
									</label>
									<input
										type="url"
										value={formData.watchNowLink}
										onChange={(e) =>
											setFormData({
												...formData,
												watchNowLink: e.target.value,
											})
										}
										placeholder="https://..."
										className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Learn More Link
									</label>
									<input
										type="url"
										value={formData.learnMoreLink}
										onChange={(e) =>
											setFormData({
												...formData,
												learnMoreLink: e.target.value,
											})
										}
										placeholder="https://..."
										className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Display Order
									</label>
									<input
										type="number"
										value={formData.order}
										onChange={(e) =>
											setFormData({
												...formData,
												order: parseInt(e.target.value) || 0,
											})
										}
										className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
								<div className="flex justify-end space-x-4 pt-4">
									<button
										type="button"
										onClick={() => {
											setIsModalOpen(false);
											resetForm();
										}}
										className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">
										Cancel
									</button>{" "}
									<button
										type="submit"
										disabled={loading || imageUploading}
										onClick={() =>
											console.log("Submit button clicked! Form data:", formData)
										}
										className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
										{loading
											? "Saving..."
											: editingBanner
											? "Update Banner"
											: "Create Banner"}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Dashboard;
