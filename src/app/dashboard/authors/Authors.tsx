/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { apiService } from "@/app/utils/apiService";
import { IAuthor } from "@/app/_models/Author";

export default function Authors() {
	const [authors, setAuthors] = useState<IAuthor[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		bio: "",
		socialLinks: {
			twitter: "",
			facebook: "",
			instagram: "",
			linkedin: "",
		},
	});

	useEffect(() => {
		fetchAuthors();
	}, []);

	const fetchAuthors = async () => {
		try {
			const response = await apiService.getAuthors();
			if (response.success && response.data) {
				setAuthors(response.data);
			} else {
				setError(response.message || "Failed to fetch authors");
			}
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await apiService.createAuthor(formData);
			if (response.success && response.data) {
				setAuthors([response.data, ...authors]);
				setFormData({
					name: "",
					email: "",
					bio: "",
					socialLinks: {
						twitter: "",
						facebook: "",
						instagram: "",
						linkedin: "",
					},
				});
				setShowForm(false);
			} else {
				throw new Error(response.message || "Failed to create author");
			}
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this author?")) return;

		try {
			const response = await apiService.deleteAuthor(id);
			if (response.success) {
				setAuthors(authors.filter((author) => author._id !== id));
			} else {
				throw new Error(response.message || "Failed to delete author");
			}
		} catch (err: any) {
			setError(err.message);
		}
	};

	if (loading) {
		return <div className="flex justify-center p-4">Loading...</div>;
	}

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Authors</h1>
				<button
					onClick={() => setShowForm(!showForm)}
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
					{showForm ? "Cancel" : "Add New Author"}
				</button>
			</div>

			{error && (
				<div className="mb-4 p-4 bg-red-100 text-red-600 rounded">{error}</div>
			)}

			{showForm && (
				<form
					onSubmit={handleSubmit}
					className="mb-6 p-4 bg-white rounded shadow">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">Name*</label>
							<input
								type="text"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								className="w-full p-2 border rounded"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Email*</label>
							<input
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								className="w-full p-2 border rounded"
								required
							/>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-sm font-medium mb-1">Bio</label>
						<textarea
							value={formData.bio}
							onChange={(e) =>
								setFormData({ ...formData, bio: e.target.value })
							}
							className="w-full p-2 border rounded"
							rows={3}
						/>
					</div>

					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">Twitter</label>
							<input
								type="url"
								value={formData.socialLinks.twitter}
								onChange={(e) =>
									setFormData({
										...formData,
										socialLinks: {
											...formData.socialLinks,
											twitter: e.target.value,
										},
									})
								}
								className="w-full p-2 border rounded"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">LinkedIn</label>
							<input
								type="url"
								value={formData.socialLinks.linkedin}
								onChange={(e) =>
									setFormData({
										...formData,
										socialLinks: {
											...formData.socialLinks,
											linkedin: e.target.value,
										},
									})
								}
								className="w-full p-2 border rounded"
							/>
						</div>
					</div>

					<div className="mt-6">
						<button
							type="submit"
							className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
							Create Author
						</button>
					</div>
				</form>
			)}

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{authors.map((author) => (
					<div
						key={author._id}
						className="p-4 bg-white rounded shadow">
						<div className="flex justify-between items-start">
							<div>
								<h3 className="font-medium">{author.name}</h3>
								<p className="text-sm text-gray-600">{author.email}</p>
								{author.bio && (
									<p className="text-sm text-gray-600 mt-2">{author.bio}</p>
								)}
								{author.socialLinks &&
									Object.keys(author.socialLinks).length > 0 && (
										<div className="mt-3 flex gap-2">
											{author.socialLinks.twitter && (
												<a
													href={author.socialLinks.twitter}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-500">
													Twitter
												</a>
											)}
											{author.socialLinks.linkedin && (
												<a
													href={author.socialLinks.linkedin}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-500">
													LinkedIn
												</a>
											)}
										</div>
									)}
							</div>
							<button
								onClick={() => handleDelete(author._id)}
								className="text-red-600 hover:text-red-800">
								Delete
							</button>
						</div>
					</div>
				))}
			</div>

			{authors.length === 0 && !loading && (
				<div className="text-center text-gray-500 mt-6">
					No authors found. Create your first author!
				</div>
			)}
		</div>
	);
}
