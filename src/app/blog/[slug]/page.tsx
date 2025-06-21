"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiService } from "../../utils/apiService";
import { IBlog } from "../../_models/Blog";
import Footer from "../../Components/Footer";
import arrow from "../../../../public/icons/Vector 2.png";

export default function BlogSlugPage() {
	const params = useParams();
	const slug = params.slug as string;

	const [blog, setBlog] = useState<IBlog | null>(null);
	const [otherBlogs, setOtherBlogs] = useState<IBlog[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchBlog = async () => {
			if (!slug) return;

			try {
				setLoading(true);
				const response = await apiService.getBlogBySlug(slug);

				if (response.success && response.blog) {
					setBlog(response.blog);
					// Fetch other blogs
					const otherBlogsResponse = await apiService.getBlogs();
					if (otherBlogsResponse.success && otherBlogsResponse.blogs) {
						// Filter out current blog and limit to 5 other blogs
						const filteredBlogs = otherBlogsResponse.blogs
							.filter((b: IBlog) => b.slug !== slug)
							.slice(0, 5);
						setOtherBlogs(filteredBlogs);
					}
				} else {
					setError(response.message || "Blog not found");
				}
			} catch (err) {
				setError("Error loading blog");
				console.error("Error fetching blog:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchBlog();
	}, [slug]);

	if (loading) {
		return (
			<div className="min-h-screen bg-white">
				<div className="max-w-4xl mx-auto px-4 py-16">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded mb-4"></div>
						<div className="h-64 bg-gray-200 rounded mb-8"></div>
						<div className="space-y-4">
							<div className="h-4 bg-gray-200 rounded"></div>
							<div className="h-4 bg-gray-200 rounded"></div>
							<div className="h-4 bg-gray-200 rounded w-3/4"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !blog) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						Blog Not Found
					</h1>
					<p className="text-gray-600 mb-8">
						{error || "The blog post you're looking for doesn't exist."}
					</p>
					<Link
						href="/blog"
						className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
						Back to Blogs
					</Link>
				</div>
			</div>
		);
	}
	return (
		<div className="bg-[#faf7ef] min-h-screen">
			{/* Dynamic Featured Banner */}
			<section className="relative w-full h-[700px] overflow-hidden mt-22">
				{/* Background Image */}
				<div className="absolute inset-0">
					<Image
						src={blog.bannerImage.url}
						alt={blog.bannerImage.alt || blog.title}
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
						<h2 className="font-clash font-[600] text-[24px] md:text-[36px] text-white leading-[130%] tracking-[0.02em] mb-4">
							{blog.title}
						</h2>
					</div>
					{/* Arrow/Navigation Link */}
					<Link
						href="/blog"
						className="absolute right-8 bottom-36">
						<div className="bg-transparent w-16 h-16 transition-all duration-300">
							<Image
								src={arrow}
								alt="Back to all blogs"
								fill
								style={{ objectFit: "cover" }}
								priority
							/>
						</div>
					</Link>
				</div>
			</section>{" "}
			<div
				id="content"
				className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
					{/* Left Side - Blog Content */}
					<div className="lg:col-span-2">
						{/* Blog Header */}
						<div className="">
							<h1 className="text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 mb-6 font-clash leading-tight">
								{blog.title}
							</h1>

							{/* Meta Information */}
							<div className="flex flex-wrap items-center gap-6 mb-2 text-base text-gray-600">
								{blog.author && (
									<span className="text-lg">
										By <strong>{blog.author.name}</strong>
									</span>
								)}
								<span className="text-lg">
									{new Date(blog.createdAt).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
							</div>
						</div>

						{/* Blog Content */}
						<div className="blog-content font-jakarta prose prose-xl max-w-none prose-headings:font-jakarta prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-l-teal-500 prose-blockquote:bg-gray-50 prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:text-lg">
							<div dangerouslySetInnerHTML={{ __html: blog.content }} />
						</div>
					</div>{" "}
					{/* Right Side - Other Blogs */}
					<div className="lg:col-span-1">
						<div className="sticky top-25">
							{" "}
							<div className="space-y-8">
								{otherBlogs.map((otherBlog) => (
									<Link
										key={otherBlog._id}
										href={`/blog/${otherBlog.slug}`}
										className="block group">
										<div className="flex gap-6">
											<div className="flex-shrink-0">
												<Image
													src={otherBlog.thumbnailImage.url}
													alt={otherBlog.thumbnailImage.alt || otherBlog.title}
													width={120}
													height={100}
													className="w-[120px] h-24 object-cover rounded-lg"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="text-lg font-jakarta  text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2 mb-2 leading-tight">
													{otherBlog.title}
												</h4>
												<div className="flex items-center gap-3 mb-2">
													{/* <div className="bg-black text-white px-4 py-2 text-[12px] font-clash font-[500] border border-[#222] box-border">
														{otherBlog.author?.name || "Unknown Author"}
													</div> */}
													<div className="bg-black text-white px-4 py-2 text-[12px] font-clash font-[500] border border-[#222] box-border">
														<span>
															{new Date(otherBlog.createdAt).toLocaleDateString(
																"en-US",
																{
																	month: "short",
																	day: "numeric",
																	year: "numeric",
																}
															)}
														</span>
													</div>
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
				{/* Categories and Tags */}
				<div className="flex flex-wrap gap-3 mb-8 mt-5">
					{blog.tags &&
						blog.tags.map((tag) => (
							<span
								key={tag._id}
								className="px-4 py-2 bg-teal-100 text-teal-700 text-base rounded-full font-medium">
								#{tag.name}
							</span>
						))}
				</div>
			</div>
			<Footer />
		</div>
	);
}
