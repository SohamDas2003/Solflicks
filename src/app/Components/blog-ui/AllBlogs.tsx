"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { apiService } from "../../utils/apiService";
import { IBlog } from "../../_models/Blog";
import arrow from "../../../../public/icons/Vector 2.png";

// Dynamic Blog Banner Component
function DynamicBlogBanner({ latestBlog }: { latestBlog: IBlog | null }) {
	if (!latestBlog) return null;

	return (
		<section className="relative w-full h-[700px] overflow-hidden mt-22">
			{/* Background Image */}
			<div className="absolute inset-0">
				<Image
					src={latestBlog.thumbnailImage.url}
					alt={latestBlog.thumbnailImage.alt || latestBlog.title}
					fill
					style={{ objectFit: "cover" }}
					priority
				/>
				{/* Dark gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
			</div>

			{/* Content Container */}
			<div className="relative h-full max-w-7xl mx-auto px-4 xl:px-0 flex flex-col justify-end pb-16">
				<div className="max-w-2xl">
					{/* Blog Title and Description */}
					<h2 className="font-clash font-[500] text-[35px] text-white leading-[110%] tracking-[0.02em] mb-4">
						{latestBlog.title.length > 60
							? latestBlog.title.slice(0, 60) + "..."
							: latestBlog.title}
					</h2>
					<p className="font-jakarta font-[500] text-[16px] leading-[147%] tracking-[0.02em] text-white/90 mb-6">
						{latestBlog.shortDescription.length > 60
							? latestBlog.shortDescription.slice(0, 60) + "..."
							: latestBlog.shortDescription}
					</p>
				</div>{" "}
				{/* Arrow/Navigation Link */}
				<Link
					href={`/blog/${latestBlog.slug}`}
					className="absolute right-8 bottom-36">
					<div className="bg-transparent w-16 h-16 transition-all duration-300">
						<Image
							src={arrow}
							alt="View blog post"
							fill
							style={{ objectFit: "cover" }}
							priority
						/>
					</div>
				</Link>
			</div>
		</section>
	);
}

function AllBlogs() {
	const [blogs, setBlogs] = useState<IBlog[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [displayedBlogs, setDisplayedBlogs] = useState<number>(6);
	const [loadingMore, setLoadingMore] = useState(false);
	const BLOGS_PER_PAGE = 6;

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				setLoading(true);
				console.log("Starting to fetch blogs..."); // Debug log

				const response = await apiService.getBlogs({
					published: true,
					limit: 50, // Get more blogs to enable view more functionality
					page: 1,
				});
				console.log("API Response:", response); // Debug log

				if (response.success && response.blogs) {
					setBlogs(response.blogs);
					console.log("Blogs loaded successfully:", response.blogs.length); // Debug log
				} else {
					setError(response.message || "Failed to fetch blogs");
					console.error("API Error:", response.message); // Debug log
				}
			} catch (err) {
				setError("Error loading blogs");
				console.error("Error fetching blogs:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchBlogs();
	}, []);

	const handleViewMore = () => {
		setLoadingMore(true);
		setTimeout(() => {
			setDisplayedBlogs((prev) => prev + BLOGS_PER_PAGE);
			setLoadingMore(false);
		}, 500); // Small delay for better UX
	};

	const blogsToShow = blogs.slice(0, displayedBlogs);
	const hasMoreBlogs = displayedBlogs < blogs.length;

	if (loading) {
		return (
			<section className="bg-[#FAF7EF] py-16">
				<div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
					<h1 className="text-[45px] font-[500] leading-[123%] tracking-[0.02em] font-clash mb-8">
						Recent Blog Post
					</h1>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[...Array(3)].map((_, index) => (
							<div
								key={index}
								className="flex flex-col bg-white overflow-hidden shadow-sm">
								<div className="relative h-56 w-full bg-gray-200 animate-pulse"></div>
								<div className="p-6">
									<div className="h-6 bg-gray-200 animate-pulse mb-3 rounded"></div>
									<div className="h-4 bg-gray-200 animate-pulse mb-2 rounded"></div>
									<div className="h-4 bg-gray-200 animate-pulse mb-4 rounded w-3/4"></div>
									<div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="bg-[#FAF7EF] py-16">
				<div className="max-w-7xl mx-auto px-4 lg:px-0 py-8">
					<h1 className="text-[45px] font-[500] leading-[123%] tracking-[0.02em] font-clash mb-8">
						Recent Blog Post
					</h1>
					<div className="text-center py-12">
						<p className="text-red-600 text-lg">{error}</p>
					</div>
				</div>
			</section>
		);
	}

	const latestBlog = blogs.length > 0 ? blogs[0] : null;

	return (
		<>
			{/* Dynamic Blog Banner */}
			<DynamicBlogBanner latestBlog={latestBlog} />

			<section className="bg-[#FAF7EF] py-16">
				<div className="max-w-7xl mx-auto px-4 lg:px-0 py-8 ">
					<h1 className="text-[45px] font-[500] leading-[123%] tracking-[0.02em] font-clash mb-8">
						Recent Blog Post
					</h1>{" "}
					{blogs.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-600 text-lg">No blog posts available</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{blogsToShow.map((blog) => (
								<Link
									key={blog._id}
									href={`/blog/${blog.slug}`}
									className="flex flex-col bg-white overflow-hidden shadow-sm hover:-translate-y-1 transition-transform duration-300">
									<div className="relative h-56 w-full overflow-hidden">
										<Image
											src={blog.thumbnailImage.url}
											alt={blog.thumbnailImage.alt || blog.title}
											fill
											className="object-cover"
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										/>
									</div>
									<div className="p-6">
										<h3 className="font-clash font-[500] text-[18px] leading-[30px] capitalize mb-3">
											{blog.title.length > 65
												? blog.title.slice(0, 65) + "..."
												: blog.title}
										</h3>
										<p className="font-jakarta font-normal text-[16px] leading-[22px] capitalize text-gray-600 mb-4">
											{blog.shortDescription.length > 125
												? blog.shortDescription.slice(0, 125) + "..."
												: blog.shortDescription}
										</p>
										<div className="flex items-center justify-between">
											{blog.author && (
												<span className="text-sm text-gray-500">
													By {blog.author.name}
												</span>
											)}
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
					{/* View More Button */}
					{hasMoreBlogs && (
						<div className="flex justify-center mt-10">
							<button
								onClick={handleViewMore}
								disabled={loadingMore}
								className={`group relative inline-flex h-[36px] lg:h-[48px] items-stretch bg-[#184952] text-white overflow-hidden ${
									loadingMore ? "opacity-50 cursor-not-allowed" : ""
								}`}>
								<div className="flex items-center justify-between w-full">
									<div className="px-3 lg:px-5 py-3 flex-1">
										<span className="font-medium lg:text-lg">
											{loadingMore ? "Loading..." : "View More"}
										</span>
									</div>

									<div className="relative h-full border-l border-dashed border-[#FAF7EF]">
										<div className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FAF7EF] rounded-full" />
										<div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FAF7EF] rounded-full" />
									</div>

									<div className="px-2 lg:px-3 py-3">
										<span className="text-lg font-extrabold">
											<MoveRight />
										</span>
									</div>
								</div>
								<div className="absolute -top-[8px] -left-[8px] w-4 h-4 bg-[#FAF7EF] rounded-full" />
								<div className="absolute -bottom-[8px] -left-[8px] w-4 h-4 bg-[#FAF7EF] rounded-full" />
								<div className="absolute -top-[8px] -right-[8px] w-4 h-4 bg-[#FAF7EF] rounded-full" />
								<div className="absolute -bottom-[8px] -right-[8px] w-4 h-4 bg-[#FAF7EF] rounded-full" />
							</button>
						</div>
					)}
				</div>
			</section>
		</>
	);
}

export default AllBlogs;
