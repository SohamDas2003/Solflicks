"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { apiService } from "../../utils/apiService";
import { IFilm } from "../../_models/Film";

interface FilmSlugBannerProps {
	slug: string;
}

export default function FilmSlugBanner({ slug }: FilmSlugBannerProps) {
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const [film, setFilm] = useState<IFilm | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
	const trailerUrl = film
		? `https://www.youtube.com/embed/${film.trailerUrl}?autoplay=1`
		: "";

	// Function to truncate description
	const truncateDescription = (text: string, maxLength: number = 150) => {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength).trim();
	};

	const shouldShowExpandButton =
		film?.description && film.description.length > 150;

	useEffect(() => {
		const fetchFilm = async () => {
			try {
				setLoading(true);
				const response = await apiService.getFilmBySlug(slug);

				if (response.success && response.film) {
					setFilm(response.film);
				} else {
					setError(response.message || "Film not found");
				}
			} catch (err) {
				setError("Error loading film");
				console.error("Error fetching film:", err);
			} finally {
				setLoading(false);
			}
		};

		if (slug) {
			fetchFilm();
		}
	}, [slug]);

	if (loading) {
		return (
			<section className="relative w-full bg-[#f8f6f1]">
				<div className="flex justify-center items-center min-h-[600px]">
					<div className="text-xl text-gray-600">Loading film details...</div>
				</div>
			</section>
		);
	}

	if (error || !film) {
		return (
			<section className="relative w-full bg-[#f8f6f1]">
				<div className="flex justify-center items-center min-h-[600px]">
					<div className="text-xl text-red-600">
						Error: {error || "Film not found"}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="relative w-full bg-[#fbf7ef]">
			{/* Background Banner */}
			<div className="relative w-full h-[300px] sm:h-[350px] md:h-[480px] lg:h-[520px] xl:h-[600px] overflow-hidden">
				<Image
					src={film.imageUrl || "/image/ImageNotFound.png"}
					alt={`${film.title} Banner`}
					fill
					priority
					className="object-cover object-center"
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						target.src = "/image/ImageNotFound.png";
					}}
				/>
				<div className="absolute inset-0 bg-black/50 bg-opacity-60 z-[1]"></div>
			</div>

			{/* Overlayed Content */}
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 -mt-16 sm:-mt-24 md:-mt-40 lg:-mt-[200px]">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
					{/* Poster Section */}
					<div className="lg:col-span-3 mx-auto lg:mx-0">
						<div className="w-[250px] sm:w-[300px] lg:w-full max-w-[300px]">
							<Image
								src={film.imageUrl || "/image/ImageNotFound.png"}
								alt={`${film.title} Poster`}
								width={300}
								height={450}
								className="w-full h-auto rounded-lg shadow-2xl"
								priority
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src = "/image/ImageNotFound.png";
								}}
							/>
						</div>
					</div>
					{/* Film Details Section */}
					<div className="lg:col-span-9 text-center lg:text-left">
						{/* Title and Tags */}
						<div className="mb-2">
							<p className="text-sm mb-2 text-gray-700 lg:text-white/80 font-medium mt-10">
								{film.year}
							</p>
							<h1
								className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 lg:text-white mb-4"
								style={{
									fontFamily: "'Plus Jakarta Sans', sans-serif",
									lineHeight: "1.1",
									letterSpacing: "-0.02em",
								}}>
								{film.title}
							</h1>
							<div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
								{[...film.genres, film.duration].map((tag, index) => (
									<span
										key={index}
										className="px-4 py-2 border border-gray-400 lg:border-white/30 rounded-full text-sm font-medium text-gray-800 lg:text-white bg-white/10 lg:bg-transparent backdrop-blur-sm">
										{tag}
									</span>
								))}
							</div>
						</div>
						<div className="space-y-6">
							<div className="space-y-2">
								<p
									className="text-gray-800 lg:text-black/90 text-base lg:text-lg"
									style={{
										fontFamily: "'Plus Jakarta Sans', sans-serif",
										fontWeight: 400,
										lineHeight: "1.6",
									}}>
									{isDescriptionExpanded
										? film.description
										: truncateDescription(film.description || "")}
									{!isDescriptionExpanded && shouldShowExpandButton && "..."}
								</p>
								{shouldShowExpandButton && (
									<button
										onClick={() =>
											setIsDescriptionExpanded(!isDescriptionExpanded)
										}
										className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
										aria-label={
											isDescriptionExpanded ? "Show less" : "Show more"
										}>
										{isDescriptionExpanded ? (
											<>
												<span>Show less</span>
												<svg
													className="w-4 h-4 ml-1 transform rotate-180"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</>
										) : (
											<>
												<span>Show more</span>
												<svg
													className="w-4 h-4 ml-1"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</>
										)}
									</button>
								)}
							</div>{" "}
							<div className="flex gap-2 sm:gap-4 justify-center lg:justify-start">
								{film.streamingUrl ? (
									<a
										href={film.streamingUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium sm:font-semibold px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-200 shadow-lg text-sm sm:text-base">
										<svg
											viewBox="0 0 24 24"
											fill="currentColor"
											className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2">
											<path d="M8 5v14l11-7L8 5z" />
										</svg>
										Watch Now
									</a>
								) : (
									<button
										disabled
										className="inline-flex items-center bg-gray-400 text-white font-medium sm:font-semibold px-3 sm:px-6 py-2 sm:py-3 rounded-full cursor-not-allowed opacity-50 text-sm sm:text-base">
										<svg
											viewBox="0 0 24 24"
											fill="currentColor"
											className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2">
											<path d="M8 5v14l11-7L8 5z" />
										</svg>
										Coming Soon
									</button>
								)}
								<button
									onClick={() => setIsVideoPlaying(true)}
									className="inline-flex items-center bg-transparent border-2 border-black/30 text-black font-medium sm:font-semibold px-3 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white/10 transition-all duration-200 text-sm sm:text-base">
									<svg
										viewBox="0 0 24 24"
										fill="currentColor"
										className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2">
										<path d="M8 5v14l11-7L8 5z" />
									</svg>
									Trailer
								</button>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
							<p
								className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-800 "
								style={{
									fontFamily: "'Plus Jakarta Sans', sans-serif",
									lineHeight: "157%",
									letterSpacing: "0%",
									textTransform: "capitalize",
								}}>
								<strong>Starring:</strong> {film.starring}
							</p>
							<p
								className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-800 "
								style={{
									fontFamily: "'Plus Jakarta Sans', sans-serif",
									lineHeight: "157%",
									letterSpacing: "0%",
									textTransform: "capitalize",
								}}>
								<strong>Director:</strong> {film.director}
							</p>
							<p
								className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-800 "
								style={{
									fontFamily: "'Plus Jakarta Sans', sans-serif",
									lineHeight: "157%",
									letterSpacing: "0%",
									textTransform: "capitalize",
								}}>
								<strong>Produced By:</strong> {film.producers}
							</p>
							<p
								className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-800 "
								style={{
									fontFamily: "'Plus Jakarta Sans', sans-serif",
									lineHeight: "157%",
									letterSpacing: "0%",
									textTransform: "capitalize",
								}}>
								<strong>Production Company:</strong> {film.productionCompany}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Trailer Video Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
				<h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 lg:text-black font-jakarta">
					Watch Trailer
				</h3>
				<div className="relative rounded-xl overflow-hidden aspect-video shadow-lg bg-gray-900">
					{isVideoPlaying ? (
						<>
							<div
								className="absolute inset-0 bg-gray-900 animate-pulse"
								id="video-loading"></div>
							<iframe
								width="100%"
								height="100%"
								src={trailerUrl}
								title="Trailer"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="absolute top-0 left-0 w-full h-full z-10"
								onLoad={() => {
									const loader = document.getElementById("video-loading");
									if (loader) loader.style.display = "none";
								}}></iframe>
							<button
								onClick={() => setIsVideoPlaying(false)}
								className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all duration-200"
								aria-label="Close trailer">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round">
									<line
										x1="18"
										y1="6"
										x2="6"
										y2="18"></line>
									<line
										x1="6"
										y1="6"
										x2="18"
										y2="18"></line>
								</svg>
							</button>
						</>
					) : (
						<div
							className="cursor-pointer relative w-full h-full group"
							onClick={() => setIsVideoPlaying(true)}
							role="button"
							aria-label="Play trailer">
							<Image
								src={film.imageUrl || "/image/ImageNotFound.png"}
								alt="Trailer Thumbnail"
								fill
								className="object-cover rounded-xl"
								priority
							/>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/80 group-hover:bg-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
									<svg
										viewBox="0 0 24 24"
										className="w-8 h-8 sm:w-10 sm:h-10 text-teal-800 group-hover:text-teal-700 ml-1"
										fill="currentColor">
										<path d="M8 5v14l11-7L8 5z" />
									</svg>
								</div>
							</div>
							<div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300 rounded-xl"></div>
							<div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded-lg backdrop-blur-sm transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
								<span className="text-sm sm:text-base font-semibold">
									{film.title} Official Trailer
								</span>
								<p className="text-xs sm:text-sm mt-1 text-gray-200">
									Click to watch the full trailer
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
