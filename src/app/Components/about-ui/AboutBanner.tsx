import React from 'react'
import bannerImg from "../../../../public/image/About/aboutBanner.webp"
function AboutBanner() {
    return (
        <div className="relative w-full h-[450px]  lg:h-[655px] xl:h-[750px] bg-cover bg-center"
            style={{ backgroundImage: `url(${bannerImg.src})` }}>
            <div className="absolute inset-0  bg-gradient-to-b from-black/30 to-black/70 flex items-end">
                <div className="max-w-7xl mx-auto px-4 xl:px-0  pb-8  lg:mb-12 w-full">
                    <div className="text-white text-sm mb-2">
                        <p className="font-jakarta text-base font-[500] leading-none tracking-[0.02em]">Home &gt; About us</p>
                    </div>
                    <div className="mb-6">
                        <h1 className="font-clash text-3xl md:text-4xl lg:text-[55px] font-semibold text-white leading-none tracking-[0.02em]">
                            Driven by Passion.
                            <br className="hidden md:block" />
                            <span className="md:hidden"> </span>
                            Grounded in Story
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutBanner