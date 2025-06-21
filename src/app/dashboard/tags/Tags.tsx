/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { apiService } from "@/app/utils/apiService";
import { ITag } from "@/app/_models/Tag";

export default function Tags() {
	const [tags, setTags] = useState<ITag[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
	});

	useEffect(() => {
		fetchTags();
	}, []);

	const fetchTags = async () => {
		try {
			const response = await apiService.getTags();
			if (response.success && response.data) {
				setTags(response.data);
			} else {
				setError(response.message || "Failed to fetch tags");
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
			const response = await apiService.createTag(formData);
			if (response.success && response.data) {
				setTags([response.data, ...tags]);
				setFormData({ name: "", description: "" });
				setShowForm(false);
			} else {
				throw new Error(response.message || "Failed to create tag");
			}
		} catch (err: any) {
			setError(err.message);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this tag?")) return;

		try {
			const response = await apiService.deleteTag(id);
			if (response.success) {
				setTags(tags.filter((tag) => tag._id !== id));
			} else {
				throw new Error(response.message || "Failed to delete tag");
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
				<h1 className="text-2xl font-bold">Tags</h1>
				<button
					onClick={() => setShowForm(!showForm)}
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
					{showForm ? "Cancel" : "Add New Tag"}
				</button>
			</div>

			{error && (
				<div className="mb-4 p-4 bg-red-100 text-red-600 rounded">{error}</div>
			)}

			{showForm && (
				<form
					onSubmit={handleSubmit}
					className="mb-6 p-4 bg-white rounded shadow">
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">Name</label>
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
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">
							Description
						</label>
						<textarea
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							className="w-full p-2 border rounded"
							rows={3}
						/>
					</div>
					<button
						type="submit"
						className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
						Create Tag
					</button>
				</form>
			)}

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{tags.map((tag) => (
					<div
						key={tag._id}
						className="p-4 bg-white rounded shadow">
						<div className="flex justify-between items-start">
							<div>
								<h3 className="font-medium">{tag.name}</h3>
								{tag.description && (
									<p className="text-sm text-gray-600 mt-1">
										{tag.description}
									</p>
								)}
							</div>
							<button
								onClick={() => handleDelete(tag._id)}
								className="text-red-600 hover:text-red-800">
								Delete
							</button>
						</div>
					</div>
				))}
			</div>

			{tags.length === 0 && !loading && (
				<div className="text-center text-gray-500 mt-6">
					No tags found. Create your first tag!
				</div>
			)}
		</div>
	);
}
