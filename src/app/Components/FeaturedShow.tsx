"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TicketButton from "./contact-button";

interface Film {
	_id: string;
	title: string;
	year: number;
	imageUrl?: string;
	slug: string;
	genres: string[];
	description: string;
}

interface Series {
	_id: string;
	title: string;
	year: number;
	imageUrl?: string;
	slug: string;
	genres: string[];
	description: string;
	seasons: number;
	episodes: number;
	status: string;
}

interface ShowItemProps {
	title: string;
	year: string;
	image: string;
	altText: string;
	index: number;
	slug: string;
	type: "film" | "series";
	extraInfo?: string;
}

const ShowItem = ({
	title,
	year,
	image,
	altText,
	index,
	slug,
	type,
	extraInfo,
}: ShowItemProps) => {
	return (
		<Link
			href={`/${type === "film" ? "films" : "series"}/${slug}`}
			className="relative flex-shrink-0 w-[250px] md:w-[280px] lg:w-[300px] transform transition-all hover:scale-105 duration-300 cursor-pointer group"
			style={{ animationDelay: `${index * 100}ms` }}>
			<div className="overflow-hidden rounded-lg aspect-[3/4] relative">
				<Image
					src={image || "/image/ImageNotFound.png"}
					alt={altText}
					fill
					className="object-cover transition-transform duration-700 group-hover:scale-110"
					sizes="(max-width: 768px) 250px, (max-width: 1024px) 280px, 300px"
				/>
			</div>
			<div className="mt-2">
				<h3 className="font-jakarta font-medium md:text-[26px] leading-[123%] tracking-[0%] text-white group-hover:text-blue-300 transition-colors duration-300">
					{title}
				</h3>
				<p className="font-jakarta font-medium md:text-[20px] leading-[123%] tracking-[0%] text-[#6C6C6C]">
					{year}
				</p>
				{extraInfo && (
					<p className="font-jakarta font-medium text-[16px] leading-[123%] tracking-[0%] text-[#8C8C8C]">
						{extraInfo}
					</p>
				)}
			</div>
		</Link>
	);
};

function FeaturedShow() {
	const [activeTab, setActiveTab] = useState("Films");
	const [films, setFilms] = useState<Film[]>([]);
	const [series, setSeries] = useState<Series[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Fetch films and series data from API
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);

				// Fetch both films and series
				const [filmsResponse, seriesResponse] = await Promise.all([
					fetch("/api/films?limit=10"),
					fetch("/api/series?limit=10"),
				]);

				const filmsData = await filmsResponse.json();
				const seriesData = await seriesResponse.json();

				if (filmsData.success) {
					setFilms(filmsData.films);
				}

				if (seriesData.success) {
					setSeries(seriesData.series);
				}

				if (!filmsData.success && !seriesData.success) {
					setError("Failed to fetch content");
				}
			} catch (err) {
				console.error("Error fetching data:", err);
				setError("An error occurred while fetching content");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Get current shows based on active tab
	const getCurrentShows = () => {
		if (activeTab === "Films") {
			return films.map((film) => ({
				...film,
				type: "film" as const,
				extraInfo: undefined,
			}));
		} else {
			return series.map((s) => ({
				...s,
				type: "series" as const,
				extraInfo: `${s.seasons} season${s.seasons > 1 ? "s" : ""} • ${
					s.episodes
				} episodes`,
			}));
		}
	};

	const currentShows = getCurrentShows();

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
		}
	};

	const handleTabChange = (tab: string) => {
		if (tab === activeTab) return;
		setActiveTab(tab);
	};

	// Loading state
	if (loading) {
		return (
			<section className="py-8 bg-[#121212] text-white overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 xl:px-0 md:py-12 lg:24">
					<div className="flex justify-center items-center h-64">
						<div className="text-white text-xl">Loading featured shows...</div>
					</div>
				</div>
			</section>
		);
	}

	// Error state
	if (error) {
		return (
			<section className="py-8 bg-[#121212] text-white overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 xl:px-0 md:py-12 lg:24">
					<div className="flex justify-center items-center h-64">
						<div className="text-red-400 text-xl">Error: {error}</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-8 bg-[#121212] text-white overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 xl:px-0 md:py-12 lg:24">
				<div className="mb-8 animate-fadeInUp">
					<h2 className="font-clash text-3xl md:text-4xl lg:text-[55px] font-semibold text-white capitalize leading-none tracking-[0.02em] mb-8">
						Featured Shows
					</h2>
					<div className="flex space-x-0 mb-6">
						<button
							className={`px-6 py-2 font-jakarta font-medium md:text-[26px] leading-[123%] tracking-[2%] relative transition-colors duration-300 ${
								activeTab === "Films" ? "bg-white text-black" : "text-white"
							}`}
							onClick={() => handleTabChange("Films")}>
							Films
							{activeTab === "Films" && (
								<div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
							)}
						</button>
						<button
							className={`px-6 py-2 font-jakarta font-medium md:text-[26px] leading-[123%] tracking-[2%] relative transition-colors duration-300 ${
								activeTab === "Series" ? "bg-white text-black" : "text-white"
							}`}
							onClick={() => handleTabChange("Series")}>
							Series
							{activeTab === "Series" && (
								<div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
							)}
						</button>
					</div>
					<div className="border-b border-[#FAF7EF] opacity-100"></div>
				</div>

				{/* Show scrollable container with navigation buttons */}
				<div className="relative">
					<div
						ref={scrollContainerRef}
						className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth ml-3"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
						{currentShows.length > 0 ? (
							currentShows.map((show, index) => (
								<ShowItem
									key={`${activeTab}-${show._id}`}
									index={index}
									title={show.title}
									year={show.year.toString()}
									image={show.imageUrl || "/image/ImageNotFound.png"}
									altText={`${show.title} poster`}
									slug={show.slug}
									type={show.type}
									extraInfo={show.extraInfo}
								/>
							))
						) : (
							<div className="text-white/60 text-lg">
								No {activeTab.toLowerCase()} available at the moment.
							</div>
						)}
					</div>

					{currentShows.length > 4 && (
						<>
							<button
								onClick={scrollLeft}
								className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/70 p-2 rounded-full text-white hover:bg-black transition-all hover:scale-110"
								aria-label="Scroll left">
								<ChevronLeft size={24} />
							</button>
							<button
								onClick={scrollRight}
								className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/70 p-2 rounded-full text-white hover:bg-black transition-all hover:scale-110"
								aria-label="Scroll right">
								<ChevronRight size={24} />
							</button>
						</>
					)}
				</div>
				<div className="mt-8 animate-fadeInUp w-full text-center block sm:hidden">
					<TicketButton
						label="Explore All"
						href={activeTab === "Films" ? "/films" : "/series"}
					/>
				</div>
			</div>
		</section>
	);
}

export default FeaturedShow;
