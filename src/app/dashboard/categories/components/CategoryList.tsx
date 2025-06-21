"use client";

import React, { useState, useMemo } from "react";
import { ICategory } from "@/app/_models/Category";

interface CategoryListProps {
	categories: ICategory[];
	loading: boolean;
	error: string | null;
	onEdit: (category: ICategory) => void;
	onDelete: (id: string) => void;
}

export default function CategoryList({
	categories,
	loading,
	error,
	onEdit,
	onDelete,
}: CategoryListProps) {
	const [searchQuery, setSearchQuery] = useState("");

	// Filter categories based on search query
	const filteredCategories = useMemo(() => {
		if (!searchQuery.trim()) return categories;

		const query = searchQuery.toLowerCase();
		return categories.filter(
			(category) =>
				category.name.toLowerCase().includes(query) ||
				category.description?.toLowerCase().includes(query) ||
				false
		);
	}, [categories, searchQuery]);

	return (
		<div className="bg-white p-6 rounded-lg shadow">
			<h2 className="text-lg font-medium mb-4">Existing Categories</h2>

			{/* Search Input */}
			<div className="relative mb-4">
				<input
					type="text"
					placeholder="Search categories..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				/>
				<div className="absolute left-3 top-2.5 h-5 w-5 text-gray-400">🔍</div>
			</div>

			{loading ? (
				<div className="flex justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
				</div>
			) : error ? (
				<div className="text-red-500">{error}</div>
			) : filteredCategories.length === 0 ? (
				<p className="text-gray-500">
					{searchQuery
						? "No categories found matching your search."
						: "No categories found."}
				</p>
			) : (
				<div className="h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
					{filteredCategories.map((category) => (
						<div
							key={category._id}
							className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
							<div>
								<h3 className="font-medium">{category.name}</h3>
								<p className="text-sm text-gray-500">{category.description}</p>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => onEdit(category)}
									className="p-1 text-blue-600 hover:bg-blue-50 rounded"
									title="Edit">
									✏️
								</button>
								<button
									onClick={() => onDelete(category._id)}
									className="p-1 text-red-600 hover:bg-red-50 rounded"
									title="Delete">
									🗑️
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
