"use client";
import React, { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { apiService } from "../../utils/apiService";
import { ISeries } from "../../_models/Series";

interface SeriesRecommendationProps {
	currentSlug?: string; // Optional prop to exclude current series
}

function SeriesRecommendation({ currentSlug }: SeriesRecommendationProps) {
	const [series, setSeries] = useState<ISeries[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		containScroll: "trimSnaps",
		dragFree: true,
		loop: false,
		slidesToScroll: 1,
	});

	// Status badge function
	const getStatusBadge = (status: string) => {
		const statusColors = {
			ongoing: "bg-blue-600 text-white",
			completed: "bg-green-600 text-white",
			upcoming: "bg-yellow-600 text-white",
		};

		return (
			<span
				className={`px-2 py-1 text-xs font-medium rounded-full ${
					statusColors[status as keyof typeof statusColors] ||
					"bg-gray-600 text-white"
				}`}>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</span>
		);
	};

	useEffect(() => {
		const fetchSeries = async () => {
			try {
				setLoading(true);
				const response = await apiService.getSeries();

				if (response.success && response.series) {
					// Filter out current series and limit to 8 recommendations
					let filteredSeries = response.series;
					if (currentSlug) {
						filteredSeries = response.series.filter(
							(s) => s.slug !== currentSlug
						);
					}
					setSeries(filteredSeries.slice(0, 8));
				} else {
					setError(response.message || "Failed to fetch series");
				}
			} catch (err) {
				setError("Error loading series");
				console.error("Error fetching series:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchSeries();
	}, [currentSlug]);

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	if (loading) {
		return (
			<section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-black text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[55px] font-medium leading-tight sm:leading-[1.2] mb-4 sm:mb-6 lg:mb-8 font-clash">
						Recommended Series
					</h2>
					<div className="flex justify-center items-center py-12">
						<div className="text-lg text-gray-400">
							Loading recommendations...
						</div>
					</div>
				</div>
			</section>
		);
	}

	if (error || series.length === 0) {
		return (
			<section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-black text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[55px] font-medium leading-tight sm:leading-[1.2] mb-4 sm:mb-6 lg:mb-8 font-clash">
						Recommended Series
					</h2>
					<div className="flex justify-center items-center py-12">
						<div className="text-lg text-gray-400">
							{error || "No recommendations available"}
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-black text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[55px] font-medium leading-tight sm:leading-[1.2] mb-4 sm:mb-6 lg:mb-8 font-clash">
					Recommended Series
				</h2>

				<div className="relative">
					{/* Navigation buttons */}
					<button
						onClick={scrollPrev}
						className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 sm:-ml-3 lg:-ml-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-1.5 sm:p-2 hidden md:flex items-center justify-center"
						aria-label="Previous">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="sm:w-6 sm:h-6">
							<polyline points="15 18 9 12 15 6"></polyline>
						</svg>
					</button>

					<button
						onClick={scrollNext}
						className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 sm:-mr-3 lg:-mr-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-1.5 sm:p-2 hidden md:flex items-center justify-center"
						aria-label="Next">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="sm:w-6 sm:h-6">
							<polyline points="9 18 15 12 9 6"></polyline>
						</svg>
					</button>

					{/* Embla Carousel */}
					<div
						className="overflow-hidden"
						ref={emblaRef}>
						<div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6">
							{series.map((s) => (
								<div
									key={s._id?.toString() || s.slug}
									className="flex-none w-[140px] sm:w-[180px] md:w-[230px] lg:w-[260px]">
									<Link
										href={`/series/${s.slug}`}
										className="group">
										<div className="relative aspect-[3/4] rounded-md sm:rounded-lg overflow-hidden mb-2 bg-gray-800">
											<Image
												src={s.imageUrl || "/image/ImageNotFound.png"}
												alt={s.title}
												fill
												sizes="(max-width: 640px) 140px, (max-width: 768px) 180px, (max-width: 1024px) 230px, 260px"
												className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
												onError={(e) => {
													const target = e.target as HTMLImageElement;
													target.src = "/image/ImageNotFound.png";
												}}
											/>
											{/* Status Badge */}
											<div className="absolute top-2 right-2">
												{getStatusBadge(s.status)}
											</div>
											<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
											<div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
												<div className="bg-black/60 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded text-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
													<span className="text-white text-xs sm:text-sm font-medium font-jakarta">
														WATCH NOW
													</span>
												</div>
											</div>
										</div>
										<h3 className="text-white text-sm sm:text-base font-medium font-jakarta truncate">
											{s.title}
										</h3>
										<p className="text-gray-400 text-xs sm:text-sm font-jakarta">
											{s.year} • {s.seasons} season{s.seasons > 1 ? "s" : ""}
										</p>
										<p className="text-gray-500 text-xs font-jakarta">
											{s.episodes} episodes
										</p>
									</Link>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default SeriesRecommendation;
