"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import TicketButton from "./contact-button";
import TicketButton2 from "./button2";

function BehindSceneAbout() {
	const [isMobile, setIsMobile] = useState(false);
	const [currentSlide, setCurrentSlide] = useState(0);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const slides = [
		{
			id: 1,
			src: "/image/behindSceneImg/CreativeProcess.webp",
			alt: "Rehearsing Emotion",
			caption: "Rehearsing Emotion",
		},
		{
			id: 2,
			src: "/image/behindSceneImg/CreativeProcess2.webp",
			alt: "Camera Blocking",
			caption: "Camera Blocking",
		},
		{
			id: 3,
			src: "/image/behindSceneImg/CreativeProcess3.webp",
			alt: "Sound Check",
			caption: "Sound Check",
		},
		{
			id: 4,
			src: "/image/behindSceneImg/CreativeProcess4.webp",
			alt: "Lighting Setup",
			caption: "Lighting Setup",
		},
	];
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			const scrollAmount = isMobile ? window.innerWidth * 0.8 : 300;
			scrollContainerRef.current.scrollBy({
				left: -scrollAmount,
				behavior: "smooth",
			});
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			const scrollAmount = isMobile ? window.innerWidth * 0.8 : 300;
			scrollContainerRef.current.scrollBy({
				left: scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<section className="bg-[#0f0f0f] text-white py-8 lg:py-[100px] relative flex items-center">
			<div className="flex max-w-7xl mx-auto px-4 xl:px-0 w-full items-start md:flex-row flex-col">
				{/* Text Content */}
				<div className="md:flex-[0_0_45%] md:pr-10 pr-0 md:pb-0 pb-10 text-left">
					<h2 className="font-clash font-medium text-[55px] leading-[123%] tracking-[0.02em] mb-[clamp(20px,3vw,30px)] text-white">
						Behind the scenes
					</h2>
					<p className="font-jakarta font-normal text-base leading-[171%] tracking-[0.02em] mb-[clamp(25px,4vw,35px)] opacity-90 max-w-[560px]">
						Go beyond the final cut and experience the raw, unscripted energy
						that brings every frame to life. From concept to creation, our
						behind-the-scenes moments reveal the passion, people, and process
						behind our productions.
					</p>
					<TicketButton
						label="View All"
						href="/behind-the-scene"
					/>
				</div>{" "}
				{/* Image Cards */}
				<div className="md:flex-[0_0_55%] overflow-hidden relative w-full">
					{/* Navigation Buttons */}
					<button
						onClick={scrollLeft}
						className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
						aria-label="Scroll left">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M15 18L9 12L15 6"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
					<button
						onClick={scrollRight}
						className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300"
						aria-label="Scroll right">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M9 18L15 12L9 6"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>{" "}
			<div
				ref={scrollContainerRef}
				className="flex w-full md:w-max overflow-x-auto scrollbar-hide"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
						{slides.map((slide, index) => (
							<div
								key={slide.id}
								className="flex-[0_0_80vw] md:flex-[0_0_50%] mx-2 md:mx-[1%] relative">
								<div
									className={`relative h-[250px] md:h-[350px] w-full overflow-hidden rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] group`}>
									<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-60 z-10 transition-opacity group-hover:opacity-40"></div>
									<Image
										src={slide.src}
										alt={slide.alt}
										fill
										sizes="(max-width: 768px) 100vw, 450px"
										priority={index === 0}
										className="object-cover group-hover:scale-110 transition-transform duration-800"
									/>
									<div className="absolute bottom-0 left-0 right-0 p-4 z-20">
										<div className="h-1 w-12 bg-white mb-3 opacity-80 group-hover:w-20 transition-all duration-300"></div>
									</div>
								</div>
								<p className="mt-4 font-jakarta text-[20px] text-center font-medium tracking-[0.02em] leading-[113%] text-white">
									{slide.caption}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default BehindSceneAbout;
