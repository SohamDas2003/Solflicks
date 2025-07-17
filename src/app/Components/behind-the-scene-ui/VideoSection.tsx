"use client";
import Image from 'next/image'
import React, { useState } from 'react'
import videos from "../../../../public/image/About/videoThumbnail.webp";

function VideoSection() {
    const [isPlaying, setIsPlaying] = useState(false);
    
    const handleVideoPlay = () => {
        setIsPlaying(true);
    };
    
    return (
        <section className="w-full bg-[#F4F1E8] px-4 sm:px-6 py-12 md:py-20">
            <div className="max-w-7xl  mx-auto">
                <div className="relative w-full aspect-video rounded-lg md:rounded-2xl overflow-hidden shadow-lg md:shadow-2xl">
                    {!isPlaying ? (
                        <div
                            className="relative w-full h-full cursor-pointer group overflow-hidden"
                            onClick={handleVideoPlay}
                        >
                            {/* Play button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                {/* Outer soft circle (translucent ring) */}
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center">
                                    {/* Inner solid circle */}
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-black ml-[1px]"
                                        >
                                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Semi-transparent overlay */}
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10"></div>

                            {/* Thumbnail image */}
                            <Image
                                src={videos}
                                alt="Filmmaker with professional camera equipment"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px"
                                priority
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    ) : (
                        <iframe
                            src="https://www.youtube.com/embed/UsLpm9i2qw8?autoplay=1&rel=0"
                            title="SolFlicks Showreel"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full aspect-video"
                        ></iframe>
                    )}
                </div>
            </div>
        </section>
    )
}

export default VideoSection