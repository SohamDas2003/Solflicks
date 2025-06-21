/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";
import { apiService } from "@/app/utils/apiService";
import { ICategory } from "@/app/_models/Category";

export default function CategoryManager() {
	// State management
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
	});
	const [editMode, setEditMode] = useState(false);
	const [editId, setEditId] = useState<string | null>(null);

	// Fetch categories
	const fetchCategories = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await apiService.getCategories();
			if (response.success && response.data) {
				setCategories(response.data);
			} else {
				setError(response.message || "Failed to fetch categories");
			}
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (editMode && editId) {
				// Update category
				const response = await fetch("/api/categories", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id: editId, ...formData }),
				});

				if (!response.ok) {
					throw new Error("Failed to update category");
				}

				const updatedCategory = await response.json();
				setCategories(
					categories.map((cat) => (cat._id === editId ? updatedCategory : cat))
				);
			} else {
				// Create category
				const response = await apiService.createCategory(formData);
				if (response.success && response.data) {
					setCategories([response.data, ...categories]);
				} else {
					throw new Error(response.message || "Failed to create category");
				}
			}

			handleCancel();
		} catch (error: any) {
			setError(error.message);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleEdit = (category: ICategory) => {
		setFormData({
			name: category.name,
			description: category.description || "",
		});
		setEditMode(true);
		setEditId(category._id);
	};

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this category?")) {
			try {
				const response = await apiService.deleteCategory(id);
				if (response.success) {
					setCategories(categories.filter((cat) => cat._id !== id));
				} else {
					throw new Error(response.message || "Failed to delete category");
				}
			} catch (error: any) {
				setError(error.message);
			}
		}
	};

	const handleCancel = () => {
		setFormData({ name: "", description: "" });
		setEditMode(false);
		setEditId(null);
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<CategoryForm
				formData={formData}
				editMode={editMode}
				onSubmit={handleSubmit}
				onChange={handleChange}
				onCancel={handleCancel}
			/>

			<CategoryList
				categories={categories}
				loading={loading}
				error={error}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
		</div>
	);
}
