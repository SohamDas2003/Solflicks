"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import BlogForm1 from "../../components/BlogForm1";

const EditBlogForm = () => {
	const router = useRouter();
	const params = useParams();
	const [blogData, setBlogData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchBlog = async () => {
			try {
				const response = await fetch(`/api/blogs/${params.id}`);
				if (!response.ok) {
					throw new Error("Failed to fetch blog");
				}
				const data = await response.json();
				setBlogData(data);
			} catch (error: any) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (params.id) {
			fetchBlog();
		}
	}, [params.id]);

	const handleCancel = () => {
		router.push("/dashboard/blogs");
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					Error: {error}
				</div>
				<button
					onClick={handleCancel}
					className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
					Back to Blogs
				</button>
			</div>
		);
	}

	return (
		<BlogForm1
			initialData={blogData}
			onCancel={handleCancel}
		/>
	);
};

export default EditBlogForm;
