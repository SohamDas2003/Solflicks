import React from "react";
import bannerImg from "../../../../public/image/About/aboutBanner.webp";
function FilmBanner({ title }: { title: string }) {
	return (
		<div
			className="relative w-full h-[450px]  bg-cover bg-center"
			style={{ backgroundImage: `url(${bannerImg.src})` }}>
			<div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 flex items-end justify-center">
				<div className="max-w-7xl mx-auto px-4 xl:px-0 w-full">
					<div className="text-white text-sm mb-2 text-center">
						<p className="font-jakarta text-base font-[500] leading-none tracking-[0.02em]">
							Home &gt; {title}
						</p>
					</div>
					<div className="mb-6 text-center">
						<h1 className="font-clash text-3xl md:text-4xl lg:text-[55px] font-semibold text-white capitalize leading-none tracking-[0.02em]">
							{title}
						</h1>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FilmBanner;
