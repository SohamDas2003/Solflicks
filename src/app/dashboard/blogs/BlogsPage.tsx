/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	FiEdit2,
	FiTrash2,
	FiCalendar,
	FiUser,
	FiFilter,
	FiSearch,
	FiImage,
} from "react-icons/fi";

interface Blog {
	_id: string;
	title: string;
	shortDescription: string;
	content: string;
	thumbnailImage: {
		url: string;
		alt: string;
	};
	bannerImage: {
		url: string;
		alt: string;
	};
	categories: any[];
	tags: any[];
	author: {
		name: string;
	};
	published: boolean;
	createdAt: string;
	updatedAt: string;
}

function BlogsPage() {
	// State management
	const [posts, setPosts] = useState<Blog[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [totalItems, setTotalItems] = useState(0);
	const [gotoPage, setGotoPage] = useState("");

	// Filter/sort state
	const [publishedFilter, setPublishedFilter] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		const fetchBlogsData = async () => {
			setLoading(true);
			setError(null);
			try {
				// Build query params for pagination and filters
				const queryParams = new URLSearchParams();
				queryParams.append("page", currentPage.toString());
				queryParams.append("limit", itemsPerPage.toString());

				if (publishedFilter !== "all") {
					queryParams.append(
						"published",
						publishedFilter === "published" ? "true" : "false"
					);
				}

				if (searchTerm) {
					queryParams.append("search", searchTerm);
				}

				const response = await fetch(`/api/blogs?${queryParams.toString()}`);
				if (!response.ok) {
					throw new Error("Failed to fetch blogs");
				}

				const data = await response.json();
				setPosts(data.blogs);

				// Update pagination state
				setTotalPages(data.pagination.totalPages);
				setTotalItems(data.pagination.totalItems);
			} catch (error: any) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchBlogsData();
	}, [currentPage, itemsPerPage, publishedFilter, searchTerm]);

	const handleDelete = async (blogId: string) => {
		if (window.confirm("Are you sure you want to delete this blog?")) {
			setIsDeleting(true);
			try {
				const response = await fetch(`/api/blogs/${blogId}`, {
					method: "DELETE",
				});

				if (!response.ok) {
					throw new Error("Failed to delete blog");
				}

				// Remove the deleted blog from state
				setPosts(posts.filter((post) => post._id !== blogId));

				// Check if we're on the last page and it's now empty
				if (posts.length === 1 && currentPage > 1) {
					setCurrentPage(currentPage - 1);
				}
			} catch (error: any) {
				console.error("Error deleting blog:", error);
				setError("Failed to delete blog");
			} finally {
				setIsDeleting(false);
			}
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo(0, 0); // Scroll to top when changing pages
	};

	const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPublishedFilter(e.target.value);
		setCurrentPage(1); // Reset to first page on filter change
	};

	const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setItemsPerPage(Number(e.target.value));
		setCurrentPage(1); // Reset to first page on limit change
	};

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setCurrentPage(1); // Reset to first page on search
	};

	const handleGotoPage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const pageNumber = parseInt(gotoPage);
		if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
			handlePageChange(pageNumber);
			setGotoPage("");
		}
	};

	if (loading && posts.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-75"></div>
				<p className="mt-4 text-gray-600">Loading blog posts...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-64 bg-red-50 rounded-lg p-6 border border-red-200">
				<div className="text-red-500 text-xl mb-2">
					Error loading blog posts
				</div>
				<p className="text-gray-600">{error}</p>
				<button
					onClick={() => window.location.reload()}
					className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
					Try Again
				</button>
			</div>
		);
	}

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			{/* Header with filtering options */}
			<div className="bg-white rounded-xl shadow p-6 mb-6">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
						Blog Management
						{totalItems > 0 && (
							<span className="ml-3 text-lg font-normal text-gray-500">
								({totalItems} {totalItems === 1 ? "post" : "posts"})
							</span>
						)}
					</h1>
					<Link
						href="/dashboard/blogs/new"
						className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm">
						<span className="mr-2">+</span> Create New Blog
					</Link>
				</div>

				{/* Search and filters */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<form
						onSubmit={handleSearch}
						className="md:col-span-2">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FiSearch className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="text"
								placeholder="Search blogs by title or description..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
							<button
								type="submit"
								className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
								Search
							</button>
						</div>
					</form>

					<div className="flex gap-2">
						<div className="flex-1 relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FiFilter className="h-4 w-4 text-gray-400" />
							</div>
							<select
								value={publishedFilter}
								onChange={handleFilterChange}
								className="w-full pl-9 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
								<option value="all">All Posts</option>
								<option value="published">Published</option>
								<option value="draft">Drafts</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Loading overlay */}
			{isDeleting && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg flex items-center shadow-xl">
						<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500 mr-3"></div>
						<p>Deleting post...</p>
					</div>
				</div>
			)}

			{posts.length === 0 ? (
				<div className="bg-white rounded-xl shadow p-12 text-center">
					<div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-10 w-10 text-blue-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
							/>
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-gray-800 mb-2">
						No blog posts found
					</h3>
					<p className="text-gray-500 mb-6">
						{searchTerm || publishedFilter !== "all"
							? "No posts match your filters. Try changing your search criteria."
							: "Get started by creating your first blog post."}
					</p>
					<Link
						href="/dashboard/blogs/new"
						className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
						<span className="mr-2">+</span> Create your first blog post
					</Link>
				</div>
			) : (
				<>
					{/* Blog card grid - improved design */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{posts.map((blog: any) => (
							<div
								key={blog._id}
								className="bg-white hover:shadow transition-shadow duration-200">
								{/* Thumbnail */}
								<div className="relative h-40 overflow-hidden">
									{blog.thumbnailImage?.url ? (
										<Image
											src={blog.thumbnailImage.url}
											alt={blog.title}
											fill
											className="object-cover"
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										/>
									) : (
										<div className="w-full h-full bg-gray-100 flex items-center justify-center">
											<FiImage className="h-8 w-8 text-gray-400" />
										</div>
									)}

									{/* Status indicator - small dot */}
									<div className="absolute top-3 right-3">
										<span
											className={`h-2.5 w-2.5 rounded-full block ${
												blog.published ? "bg-green-500" : "bg-amber-500"
											}`}
										/>
									</div>
								</div>

								{/* Content */}
								<div className="p-4">
									{/* Title */}
									<h2 className="font-medium text-gray-900 mb-1 line-clamp-1">
										{blog.title}
									</h2>

									{/* Meta info in single line */}
									<div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
										<span className="flex items-center">
											<FiCalendar className="mr-1 h-3 w-3" />
											{new Date(blog.createdAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
											})}
										</span>
										<span className="flex items-center">
											<FiUser className="mr-1 h-3 w-3" />
											{blog.author?.name || "Unknown"}
										</span>
									</div>

									{/* Categories - simplified */}
									{blog.categories?.length > 0 && (
										<div className="flex flex-wrap gap-1 mb-3">
											{blog.categories.slice(0, 2).map((category: any) => (
												<span
													key={category._id}
													className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
													{category.name}
												</span>
											))}
										</div>
									)}

									{/* Actions - minimal buttons */}
									<div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
										<Link
											href={`/dashboard/blogs/edit/${blog._id}`}
											className="flex-1 flex items-center justify-center py-1.5 text-xs text-gray-600 hover:text-blue-600 transition-colors">
											<FiEdit2 className="mr-1.5 h-3 w-3" /> Edit
										</Link>
										<button
											onClick={() => handleDelete(blog._id)}
											className="flex-1 flex items-center justify-center py-1.5 text-xs text-gray-600 hover:text-red-600 transition-colors">
											<FiTrash2 className="mr-1.5 h-3 w-3" /> Delete
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Enhanced Pagination Controls */}
					<div className="mt-8 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow">
						<div className="text-sm text-gray-600 mb-4 md:mb-0">
							Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
							{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
							items
						</div>

						<div className="flex items-center space-x-4">
							{/* Items per page selector */}
							<div className="flex items-center">
								<label
									htmlFor="perPage"
									className="mr-2 text-sm text-gray-600">
									Show:
								</label>
								<select
									id="perPage"
									value={itemsPerPage}
									onChange={handleLimitChange}
									className="border border-gray-300 rounded px-2 py-1 text-sm">
									<option value="5">5</option>
									<option value="10">10</option>
									<option value="20">20</option>
									<option value="50">50</option>
								</select>
							</div>

							{/* Go to specific page */}
							<form
								onSubmit={handleGotoPage}
								className="flex items-center">
								<label
									htmlFor="gotoPage"
									className="mr-2 text-sm text-gray-600">
									Go to:
								</label>
								<input
									type="number"
									id="gotoPage"
									min="1"
									max={totalPages}
									value={gotoPage}
									onChange={(e) => setGotoPage(e.target.value)}
									className="border border-gray-300 rounded w-12 px-2 py-1 text-sm"
								/>
								<button
									type="submit"
									className="ml-1 px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm">
									Go
								</button>
							</form>

							{/* Previous/Next buttons */}
							<div className="flex space-x-2">
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									className={`px-3 py-1 rounded ${
										currentPage === 1
											? "bg-gray-100 text-gray-400 cursor-not-allowed"
											: "border border-gray-300 hover:bg-gray-100"
									}`}>
									Previous
								</button>

								<span className="px-3 py-1 bg-blue-600 text-white rounded">
									{currentPage} / {totalPages}
								</span>

								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									className={`px-3 py-1 rounded ${
										currentPage === totalPages
											? "bg-gray-100 text-gray-400 cursor-not-allowed"
											: "border border-gray-300 hover:bg-gray-100"
									}`}>
									Next
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default BlogsPage;
