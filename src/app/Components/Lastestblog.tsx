"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import mainblog from "../../../public/image/blogs/mainblogs.png";
import TicketButton from "./contact-button";
import { apiService } from "../utils/apiService";
import { IBlog } from "../_models/Blog";

function Lastestblog() {
	const [blogs, setBlogs] = useState<IBlog[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				setLoading(true);
				const response = await apiService.getBlogs({
					limit: 6, // Increased to 6: 1 for banner + 5 for right side
					published: true,
				});

				if (response.success && response.blogs) {
					setBlogs(response.blogs);
				} else {
					setError(response.message || "Failed to fetch blogs");
				}
			} catch (err) {
				console.error("Error fetching blogs:", err);
				setError("Failed to load blogs");
			} finally {
				setLoading(false);
			}
		};

		fetchBlogs();
	}, []); // Helper function to format relative time
	const getRelativeTime = (dateInput: string | Date): string => {
		const date =
			typeof dateInput === "string" ? new Date(dateInput) : dateInput;
		const now = new Date();
		const diffInMinutes = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60)
		);

		if (diffInMinutes < 1) return "Just now";
		if (diffInMinutes < 60)
			return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24)
			return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7)
			return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

		const diffInWeeks = Math.floor(diffInDays / 7);
		if (diffInWeeks < 4)
			return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;

		const diffInMonths = Math.floor(diffInDays / 30);
		return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
	};
	// Separate featured blog and other blogs
	const featuredBlog = blogs[0]; // First blog for the banner
	const displayBlogs = blogs.slice(1, 5); // Remaining blogs for the right side

	// Loading state
	if (loading) {
		return (
			<section className="bg-[#0e1215]">
				<div className="bg-[#0e1215] text-white px-4 xl:px-0 py-8 md:py-12 lg:py-24 font-sans max-w-7xl mx-auto">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
						<h2 className="text-3xl lg:text-4xl font-semibold font-jakarta">
							Latest Blogs
						</h2>
						<div className="hidden sm:block">
							<TicketButton
								label="View All"
								href="/blog"
							/>
						</div>
					</div>{" "}
					<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
						{/* Loading skeleton for featured blog */}
						<div className="w-full lg:w-3/5 relative">
							<div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[500px] rounded-lg overflow-hidden bg-gray-800 animate-pulse">
								<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:px-6 md:px-8 flex items-end h-1/2">
									<div className="h-8 lg:h-12 bg-gray-600 rounded w-3/4 animate-pulse"></div>
								</div>
							</div>
						</div>
						{/* Loading skeleton for other blogs */}
						<div className="w-full lg:w-2/5 flex flex-col gap-4">
							{[...Array(4)].map((_, index) => (
								<div
									key={index}
									className="flex gap-4 h-auto sm:h-[70px]">
									<div className="flex-shrink-0 rounded-md overflow-hidden w-[80px] sm:w-[100px] h-[60px] sm:h-[70px] bg-gray-800 animate-pulse"></div>
									<div className="flex flex-col justify-between flex-1">
										<div className="h-4 bg-gray-600 rounded w-full mb-2 animate-pulse"></div>
										<div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		);
	}
	return (
		<section className="bg-[#0e1215]">
			<div className="bg-[#0e1215] text-white px-4 xl:px-0 py-8 md:py-12 lg:py-24 font-sans max-w-7xl mx-auto">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
					<h2 className="text-3xl lg:text-3xl font-semibold font-jakarta">
						Latest Blogs
					</h2>
					<div className="hidden sm:block">
						<TicketButton
							label="View All"
							href="/blog"
						/>
					</div>
				</div>
				{error && (
					<div className="text-center py-4 mb-6">
						<p className="text-yellow-400 text-sm">
							Note: Using sample content as blog data is currently unavailable.
						</p>
					</div>
				)}{" "}
				<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
					{/* Featured blog (top on mobile, left on desktop) - NOW DYNAMIC */}
					<div className="w-full lg:w-3/5 relative">
						{featuredBlog ? (
							<Link
								href={`/blog/${featuredBlog.slug}`}
								className="block">
								<div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[500px] rounded-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300">
									<Image
										src={
											featuredBlog.bannerImage?.url ||
											featuredBlog.thumbnailImage?.url ||
											mainblog
										}
										alt={featuredBlog.bannerImage?.alt || featuredBlog.title}
										fill
										className="object-cover"
									/>
									<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:px-6 md:px-8 flex items-end h-1/2">
										<h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[35px] font-[600] font-jakarta leading-[144%] m-0 hover:text-blue-200 transition-colors">
											{featuredBlog.title}
										</h3>
									</div>
								</div>
							</Link>
						) : (
							// Fallback to default content if no blogs available
							<div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[500px] rounded-lg overflow-hidden">
								<Image
									src={mainblog}
									alt="Director's Cut"
									fill
									className="object-cover"
								/>
								<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:px-6 md:px-8 flex items-end h-1/2">
									<h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[35px] font-[600] font-jakarta leading-[144%] m-0">
										The Director&apos;s Cut: Ideas, Inspiration, and BTS Stories
										From Concept to Cinematic Reality
									</h3>
								</div>
							</div>
						)}
					</div>{" "}
					{/* List of smaller blogs (bottom on mobile, right on desktop) */}
					<div className="w-full lg:w-2/5 flex flex-col gap-4">
						{displayBlogs.length > 0 ? (
							displayBlogs.map((blog) => (
								<Link
									key={blog._id}
									href={`/blog/${blog.slug}`}
									className="block">
									<div className="flex gap-4 h-auto sm:h-[70px] hover:bg-gray-800/20 rounded-lg p-2 transition-colors duration-200">
										<div className="flex-shrink-0 rounded-md overflow-hidden w-[80px] sm:w-[100px] h-[60px] sm:h-[70px]">
											<Image
												src={blog.thumbnailImage?.url || mainblog}
												alt={blog.thumbnailImage?.alt || blog.title}
												width={100}
												height={70}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="flex flex-col justify-between flex-1">
											<h4 className="m-0 text-[0.85rem] sm:text-[0.9rem] leading-tight font-semibold line-clamp-2 hover:text-blue-200 transition-colors">
												{blog.title}
											</h4>
											<p className="text-[10px] sm:text-xs m-0 text-gray-400 sm:mt-0">
												{blog.author?.name || "Admin"}{" "}
												<span>· {getRelativeTime(blog.createdAt)}</span>
											</p>
										</div>
									</div>
								</Link>
							))
						) : !error ? (
							// Show placeholder if no error but also no blogs
							<div className="flex items-center justify-center h-32 text-gray-400">
								<p>No blogs available at the moment.</p>
							</div>
						) : (
							// Fallback static content when there's an error
							<>
								<div className="flex gap-4 h-auto sm:h-[70px] hover:bg-gray-800/20 rounded-lg p-2 transition-colors duration-200">
									<div className="flex-shrink-0 rounded-md overflow-hidden w-[80px] sm:w-[100px] h-[60px] sm:h-[70px]">
										<Image
											src={mainblog}
											alt="Sample Blog"
											width={100}
											height={70}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex flex-col justify-between flex-1">
										<h4 className="m-0 text-[0.85rem] sm:text-[0.95rem] leading-tight sm:leading-relaxed font-semibold line-clamp-2">
											Frames, Focus, and Filmmaking — The Solflicks Blog of
											Vision, Craft, and Cinematic Soul
										</h4>
										<p className="text-[10px] sm:text-xs m-0 text-gray-400 mt-1 sm:mt-0">
											Admin <span>· 1 day ago</span>
										</p>
									</div>
								</div>
								<div className="flex gap-4 h-auto sm:h-[70px] hover:bg-gray-800/20 rounded-lg p-2 transition-colors duration-200">
									<div className="flex-shrink-0 rounded-md overflow-hidden w-[80px] sm:w-[100px] h-[60px] sm:h-[70px]">
										<Image
											src={mainblog}
											alt="Sample Blog"
											width={100}
											height={70}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex flex-col justify-between flex-1">
										<h4 className="m-0 text-[0.85rem] sm:text-[0.95rem] leading-tight sm:leading-relaxed font-semibold line-clamp-2">
											Behind the Camera: Thoughts, Stories & Creative Sparks
											That Drive Every Frame Forward
										</h4>
										<p className="text-[10px] sm:text-xs m-0 text-gray-400 mt-1 sm:mt-0">
											Admin <span>· 2 days ago</span>
										</p>
									</div>
								</div>
								<div className="flex gap-4 h-auto sm:h-[70px] hover:bg-gray-800/20 rounded-lg p-2 transition-colors duration-200">
									<div className="flex-shrink-0 rounded-md overflow-hidden w-[80px] sm:w-[100px] h-[60px] sm:h-[70px]">
										<Image
											src={mainblog}
											alt="Sample Blog"
											width={100}
											height={70}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex flex-col justify-between flex-1">
										<h4 className="m-0 text-[0.85rem] sm:text-[0.95rem] leading-tight sm:leading-relaxed font-semibold line-clamp-2">
											Inside Solflicks: Crafting and Cinema, One Frame at a Time
											With Passion, Innovation
										</h4>
										<p className="text-[10px] sm:text-xs m-0 text-gray-400 mt-1 sm:mt-0">
											Admin <span>· 3 days ago</span>
										</p>
									</div>
								</div>
								<div className="flex gap-4 h-auto sm:h-[70px] hover:bg-gray-800/20 rounded-lg p-2 transition-colors duration-200">
									<div className="flex-shrink-0 rounded-md overflow-hidden w-[80px] sm:w-[100px] h-[60px] sm:h-[70px]">
										<Image
											src={mainblog}
											alt="Sample Blog"
											width={100}
											height={70}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex flex-col justify-between flex-1">
										<h4 className="m-0 text-[0.85rem] sm:text-[0.95rem] leading-tight sm:leading-relaxed font-semibold line-clamp-2">
											Cinematic Notes: What We Create, Think & Explore Through
											Stories, Sets, and Screens
										</h4>
										<p className="text-[10px] sm:text-xs m-0 text-gray-400 mt-1 sm:mt-0">
											Admin <span>· 4 days ago</span>
										</p>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
				<div className="sm:hidden mt-8 flex justify-center">
					<TicketButton
						label="View All"
						href="/blog"
					/>
				</div>
			</div>
		</section>
	);
}

export default Lastestblog;
