import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import arrow from "../../../../public/icons/Vector 2.png"
import featuredImage from "../../../../public/image/blogs/featuredBanner.webp"
function FeaturedBanner() {
    return (
        <section className="relative w-full h-[700px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={featuredImage}
                    alt="Filmmaker working with camera"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
            </div>

            {/* Content Container */}
            <div className="relative h-full max-w-7xl mx-auto px-4 xl:px-0 flex flex-col justify-end pb-16">
                <div className="max-w-2xl">
                    <span className="font-jakarta font-[600] text-[18px] leading-[100%] tracking-[0.02em] text-white mb-4 block">
                        Featured
                    </span>
                    <h2 className="font-clash font-[600] text-[36px] md:text-[55px] text-white leading-[130%] tracking-[0.02em] mb-4">
                        Lighting the Vision: How We Frame Emotion
                    </h2>
                    <p className="font-jakarta font-[500] text-[16px] leading-[147%] tracking-[0.02em] text-white/90 mb-6">
                        Take a look at how we craft visual emotion through lighting design —
                        blending natural tones, shadows, and cinematic moods.
                    </p>
                </div>
                {/* Arrow/Navigation Link */}
                <Link href="/projects/lighting-vision" className="absolute right-8 bottom-36">
                    <div className="bg-transparent w-16 h-16  transition-all duration-300">
                        <Image
                            src={arrow}
                            alt="Filmmaker working with camera"
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </div>
                </Link>
            </div>
        </section>
    )
}

export default FeaturedBanner
