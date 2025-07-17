"use client";
import React, { useState } from "react";
import Image from "next/image";
import videos from "../../../../public/image/About/videoThumbnail.webp";

function VideoSection() {
    const [isPlaying, setIsPlaying] = useState(false);

    const handleVideoPlay = () => {
        setIsPlaying(true);
    };

    return (
        <section className="w-full bg-black flex justify-center items-center">
            <div className="relative w-full h-[75vh]  mx-auto aspect-video overflow-hidden shadow-2xl">
                {!isPlaying ? (
                    <div
                        className="relative w-full h-full cursor-pointer group overflow-hidden"
                        onClick={handleVideoPlay}
                    >
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            {/* Outer soft circle (translucent ring) */}
                            <div className="relative w-24 h-24 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center">

                                {/* Inner solid circle */}
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="w-8 h-8 text-black ml-[1px]"
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
                            layout="fill"
                            objectFit="cover"
                            priority
                            className="transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                ) : (
                    <iframe
                        src="https://www.youtube.com/embed/cjlEOZM4EgU?autoplay=1&rel=0"
                        title="SolFlicks Showreel"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full aspect-video"
                        style={{ minHeight: "500px" }}
                    ></iframe>
                )}
            </div>
        </section>
    );
}

export default VideoSection;