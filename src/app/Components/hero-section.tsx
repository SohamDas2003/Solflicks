"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import BannerImg from "../../../public/image/banner.png";

interface Banner {
	_id: string;
	title: string;
	subtitle?: string;
	description: string;
	platform?: string;
	imageUrl: string;
	watchNowLink?: string;
	learnMoreLink?: string;
	isActive: boolean;
	order: number;
}

interface Slide {
	id?: number;
	_id?: string;
	title: string;
	subtitle?: string;
	platform?: string;
	image?: any;
	imageUrl?: string;
	description: string;
	watchNowLink?: string;
	learnMoreLink?: string;
}

// Fallback slides in case API fails or no banners exist
const fallbackSlides: Slide[] = [
	{
		id: 1,
		title: "",
		subtitle: "",
		platform: "Solflicks",
		image: BannerImg,
		description: "",
	},
];

export default function HeroSection() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlay, setIsAutoPlay] = useState(true);
	const [banners, setBanners] = useState<Banner[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch banners from API
	const fetchBanners = async () => {
		try {
			const response = await fetch("/api/banners");
			if (response.ok) {
				const data = await response.json();
				setBanners(data.banners || []);
			}
		} catch (error) {
			console.error("Error fetching banners:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBanners();
	}, []); // Use banners from API if available, otherwise use fallback
	const slides: Slide[] =
		banners.length > 0
			? banners
					.filter(
						(banner) =>
							// Only require image - all other fields are optional
							banner.imageUrl && banner.imageUrl.trim()
					)
					.map((banner) => ({
						_id: banner._id,
						title: banner.title,
						subtitle: banner.subtitle,
						platform: banner.platform,
						imageUrl: banner.imageUrl,
						description: banner.description,
						watchNowLink: banner.watchNowLink,
						learnMoreLink: banner.learnMoreLink,
					}))
			: fallbackSlides;

	// Navigation functions
	const goToNext = useCallback(() => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	}, [slides.length]);

	const goToPrev = useCallback(() => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	}, [slides.length]);

	const goToSlide = useCallback((index: number) => {
		setCurrentSlide(index);
	}, []);

	// Auto-advance slides
	useEffect(() => {
		if (!isAutoPlay || slides.length <= 1) return;

		const interval = setInterval(goToNext, 5000);
		return () => clearInterval(interval);
	}, [isAutoPlay, goToNext, slides.length]);

	// Keyboard navigation
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") goToPrev();
			if (e.key === "ArrowRight") goToNext();
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [goToNext, goToPrev]);
	return (
		<section className="relative w-full mx-auto overflow-hidden">
			{loading && (
				<div className="relative w-full aspect-[3/2] sm:aspect-[5/2] lg:aspect-[12/5] mt-22 bg-gray-900 animate-pulse">
					{/* Skeleton Background */}
					<div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>

					{/* Skeleton Content Overlay */}
					<div className="absolute bottom-4 left-10 sm:bottom-6 sm:left-12 lg:bottom-8 lg:left-60 z-10 max-w-[260px] sm:max-w-[300px] lg:max-w-md">
						{/* Platform badge skeleton */}
						<div className="mb-2 sm:mb-3">
							<div className="inline-block h-6 w-20 bg-white/20 rounded-full"></div>
						</div>

						{/* Title skeleton */}
						<div className="mb-1.5 sm:mb-2 lg:mb-3 space-y-2">
							<div className="h-6 sm:h-7 lg:h-8 bg-white/30 rounded w-full"></div>
							<div className="h-6 sm:h-7 lg:h-8 bg-white/30 rounded w-3/4"></div>
						</div>

						{/* Subtitle skeleton */}
						<div className="h-4 sm:h-5 lg:h-6 bg-white/20 rounded w-2/3 mb-1 sm:mb-1.5 lg:mb-2"></div>

						{/* Description skeleton */}
						<div className="mb-3 sm:mb-4 lg:mb-6 space-y-1.5">
							<div className="h-3 sm:h-4 lg:h-5 bg-white/20 rounded w-full"></div>
							<div className="h-3 sm:h-4 lg:h-5 bg-white/20 rounded w-5/6"></div>
							<div className="h-3 sm:h-4 lg:h-5 bg-white/20 rounded w-4/5"></div>
						</div>

						{/* Buttons skeleton */}
						<div className="flex gap-2 sm:gap-2.5 lg:gap-3">
							<div className="h-8 sm:h-9 lg:h-10 w-24 sm:w-28 lg:w-32 bg-white/40 rounded-full"></div>
							<div className="h-8 sm:h-9 lg:h-10 w-20 sm:w-24 lg:w-28 bg-white/20 rounded-full border border-white/30"></div>
						</div>
					</div>

					{/* Navigation arrows skeleton */}
					<div className="absolute left-1 sm:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20">
						<div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/10 rounded-full"></div>
					</div>
					<div className="absolute right-1 sm:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20">
						<div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/10 rounded-full"></div>
					</div>

					{/* Indicators skeleton */}
					<div className="absolute bottom-1.5 right-3 sm:bottom-2 sm:right-4 lg:bottom-4 lg:right-8 flex items-center space-x-1 sm:space-x-1.5 lg:space-x-2 z-20">
						<div className="h-1 sm:h-1.5 lg:h-2 w-5 sm:w-6 lg:w-8 bg-white/40 rounded-full"></div>
						<div className="h-1 sm:h-1.5 lg:h-2 w-1 sm:w-1.5 lg:w-2 bg-white/20 rounded-full"></div>
						<div className="h-1 sm:h-1.5 lg:h-2 w-1 sm:w-1.5 lg:w-2 bg-white/20 rounded-full"></div>
					</div>

					{/* Progress bar skeleton */}
					<div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
						<div className="h-full bg-white/40 w-1/3 animate-pulse"></div>
					</div>
				</div>
			)}{" "}
			{/* Show message when no active banners */}
			{!loading && slides.length === 0 && (
				<div className="relative w-full aspect-[3/2] sm:aspect-[5/2] md:aspect-[12/5] lg:aspect-[12/5] bg-gray-900 flex items-center justify-center">
					<div className="text-white text-center">
						<h2 className="text-2xl font-bold mb-4">No Active Banners</h2>
						<p className="text-gray-300">
							Please add banners from the dashboard to display content here.
						</p>
					</div>
				</div>
			)}{" "}
			{/* Carousel Container - Only show if there are slides */}
			{!loading && slides.length > 0 && (
				<>
					<div className="relative w-full aspect-[3/2] sm:aspect-[5/2] lg:aspect-[12/5] mt-22">
						{/* Background Images */}
						<div className="absolute inset-0 w-full h-full">
							<div className="relative w-full h-full overflow-hidden">
								{" "}
								{slides.map((slide, index) => (
									<div
										key={slide._id || slide.id || index}
										className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
											index === currentSlide
												? "opacity-100 scale-100"
												: "opacity-0 scale-105"
										}`}>
										{/* Only render image if imageUrl exists */}
										{slide.imageUrl || slide.image ? (
											<Image
												src={slide.imageUrl || slide.image}
												alt={slide.title}
												fill
												priority={index === 0}
												className=""
											/>
										) : (
											// Fallback background if no image
											<div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
										)}
										{/* Gradient overlay */}
										<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Fixed Content Overlay - Responsive Positioning */}
					<div className="absolute bottom-4 left-10 sm:bottom-6 sm:left-12 lg:bottom-8 lg:left-60 z-10 max-w-[260px] sm:max-w-[300px] lg:max-w-md">
						{slides.map((slide, index) => (
							<div
								key={slide._id || slide.id || index}
								className={`transition-all duration-700 ease-out ${
									index === currentSlide
										? "opacity-100 translate-y-0"
										: "opacity-0 translate-y-8 pointer-events-none absolute"
								}`}>
								{/* Platform badge - Only show if platform exists */}
								{slide.platform && slide.platform.trim() && (
									<div className="mb-2 sm:mb-3">
										<span className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium">
											{slide.platform}
										</span>
									</div>
								)}{" "}
								{/* Title - Only show if title exists */}
								{slide.title && slide.title.trim() && (
									<h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-white mb-1.5 sm:mb-2 lg:mb-3 leading-tight font-clash">
										{slide.title}
									</h1>
								)}
								{/* Subtitle - Only show if subtitle exists */}
								{slide.subtitle && slide.subtitle.trim() && (
									<p className="text-xs font-jakarta sm:text-sm md:text-base lg:text-lg text-white/90 mb-1 sm:mb-1.5 lg:mb-2 font-medium">
										{slide.subtitle}
									</p>
								)}
								{/* Description - Only show if description exists */}
								{slide.description && slide.description.trim() && (
									<p className="text-xs font-jakarta sm:text-sm lg:text-xl text-white/80 mb-3 sm:mb-4 lg:mb-6 leading-relaxed line-clamp-2 sm:line-clamp-3 lg:line-clamp-none">
										{slide.description}
									</p>
								)}{" "}
								{/* Buttons - Only show buttons that have valid links */}
								{((slide.watchNowLink && slide.watchNowLink.trim()) ||
									(slide.learnMoreLink && slide.learnMoreLink.trim())) && (
									<div className="flex flex-wrap gap-2 sm:gap-2.5 lg:gap-3">
										{/* Watch Now Button - Only show if link exists */}
										{slide.watchNowLink && slide.watchNowLink.trim() && (
											<a
												href={slide.watchNowLink}
												target="_blank"
												rel="noopener noreferrer"
												className="bg-white text-black mb-4 px-6 py-2 rounded-full font-semibold hover:bg-white/90 transition-colors inline-flex items-center group text-xs sm:text-sm">
												Watch Now
												<svg
													className="ml-1 sm:ml-1.5 lg:ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
													viewBox="0 0 24 24"
													fill="currentColor">
													<path d="M8 5v14l11-7L8 5z" />
												</svg>
											</a>
										)}

										{/* Learn More Button - Only show if link exists */}
										{slide.learnMoreLink && slide.learnMoreLink.trim() && (
											<a
												href={slide.learnMoreLink}
												target="_blank"
												rel="noopener noreferrer"
												className="border border-white mb-4 sm:border-2 text-white px-3 py-1 sm:px-4 sm:py-1.5 lg:px-6 lg:py-2 rounded-full font-semibold hover:bg-white hover:text-black transition-colors text-xs sm:text-sm">
												Learn More
											</a>
										)}
									</div>
								)}
							</div>
						))}
					</div>

					{/* Navigation Arrows - Only show if more than 1 slide */}
					{slides.length > 1 && (
						<>
							<button
								onClick={goToPrev}
								onMouseEnter={() => setIsAutoPlay(false)}
								onMouseLeave={() => setIsAutoPlay(true)}
								className="absolute left-1 sm:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-1.5 sm:p-2 lg:p-3 text-white transition-all duration-300 hover:scale-110 group"
								aria-label="Previous slide">
								<svg
									className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:-translate-x-0.5 transition-transform"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</button>
							<button
								onClick={goToNext}
								onMouseEnter={() => setIsAutoPlay(false)}
								onMouseLeave={() => setIsAutoPlay(true)}
								className="absolute right-1 sm:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-1.5 sm:p-2 lg:p-3 text-white transition-all duration-300 hover:scale-110 group"
								aria-label="Next slide">
								<svg
									className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:translate-x-0.5 transition-transform"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>
						</>
					)}

					{/* Slide Indicators - Only show if more than 1 slide */}
					{slides.length > 1 && (
						<div className="absolute bottom-1.5 right-3 sm:bottom-2 sm:right-4 lg:bottom-4 lg:right-8 flex items-center space-x-1 sm:space-x-1.5 lg:space-x-2 z-20">
							{slides.map((_, index) => (
								<button
									key={index}
									onClick={() => goToSlide(index)}
									onMouseEnter={() => setIsAutoPlay(false)}
									onMouseLeave={() => setIsAutoPlay(true)}
									className={`h-1 sm:h-1.5 lg:h-2 rounded-full transition-all duration-300 hover:scale-110 ${
										index === currentSlide
											? "bg-white w-5 sm:w-6 lg:w-8"
											: "bg-white/40 w-1 sm:w-1.5 lg:w-2 hover:bg-white/60"
									}`}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>
					)}

					{/* Progress Bar - Only show if more than 1 slide */}
					{slides.length > 1 && (
						<div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
							<div
								className="h-full bg-white transition-all duration-300 ease-linear"
								style={{
									width: `${((currentSlide + 1) / slides.length) * 100}%`,
								}}
							/>
						</div>
					)}
				</>
			)}
		</section>
	);
}
