"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { apiService } from "../../utils/apiService";
import { IFilm } from "../../_models/Film";

function AllFilms() {
	const [films, setFilms] = useState<IFilm[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [displayedFilms, setDisplayedFilms] = useState<number>(12);
	const [loadingMore, setLoadingMore] = useState(false);
	const FILMS_PER_PAGE = 12;

	useEffect(() => {
		const fetchFilms = async () => {
			try {
				setLoading(true);
				const response = await apiService.getFilms();

				if (response.success && response.films) {
					setFilms(response.films);
				} else {
					setError(response.message || "Failed to fetch films");
				}
			} catch (err) {
				setError("Error loading films");
				console.error("Error fetching films:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchFilms();
	}, []);

	const handleViewMore = () => {
		setLoadingMore(true);
		setTimeout(() => {
			setDisplayedFilms((prev) => prev + FILMS_PER_PAGE);
			setLoadingMore(false);
		}, 500); // Small delay for better UX
	};

	const filmsToShow = films.slice(0, displayedFilms);
	const hasMoreFilms = displayedFilms < films.length;
	if (loading) {
		return (
			<section className="w-full bg-[#f9f9f9] py-16 md:py-16">
				<div className="max-w-7xl mx-auto px-4 xl:px-0">
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
						{[...Array(12)].map((_, index) => (
							<div
								key={index}
								className="film-card flex flex-col lg:mb-[30px]">
								<div className="relative w-full aspect-[3/4] mb-[15px] overflow-hidden bg-gray-200 animate-pulse rounded"></div>
								<div className="h-6 bg-gray-200 animate-pulse mb-2 rounded w-4/5"></div>
								<div className="h-5 bg-gray-200 animate-pulse rounded w-1/3"></div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}
	if (error) {
		return (
			<section className="w-full bg-[#f9f9f9] py-16 md:py-16">
				<div className="max-w-7xl mx-auto px-4 xl:px-0">
					<div className="flex justify-center items-center min-h-[400px]">
						<div className="text-xl text-red-600">Error: {error}</div>
					</div>
				</div>
			</section>
		);
	}

	if (films.length === 0) {
		return (
			<section className="w-full bg-[#f9f9f9] py-16 md:py-16">
				<div className="max-w-7xl mx-auto px-4 xl:px-0">
					<div className="flex justify-center items-center min-h-[400px]">
						<div className="text-xl text-gray-600">No films found</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="w-full bg-[#f9f9f9] py-16 md:py-16">
			{" "}
			<div className="max-w-7xl mx-auto px-4 xl:px-0">
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
					{" "}
					{filmsToShow.map((film) => (
						<Link
							href={`/films/${film.slug}`}
							key={film._id?.toString() || film.slug}>
							<div className="film-card flex flex-col lg:mb-[30px]">
								<div className="relative w-full aspect-[3/4] mb-[15px] overflow-hidden">
									{" "}
									<Image
										src={film.imageUrl || "/image/ImageNotFound.png"}
										alt={film.title}
										fill
										className="object-cover hover:scale-105 transition-transform duration-300"
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											target.src = "/image/ImageNotFound.png";
										}}
									/>
								</div>
								<h3 className="font-[500] text-[18px] sm:text-[20px] md:text-[22px] lg:text-[26px] leading-[123%] text-gray-800 font-jakarta">
									{film.title}
								</h3>
								<p className="font-jakarta font-[500] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[123%] text-[#6C6C6C]">
									{film.year}
								</p>
							</div>
						</Link>
					))}{" "}
				</div>

				{/* View All Button with View More functionality */}
				{hasMoreFilms && (
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
	);
}

export default AllFilms;
