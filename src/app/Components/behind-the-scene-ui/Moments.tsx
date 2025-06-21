import Image from 'next/image'
import React from 'react'
import rehearsing from "../../../../public/image/behindSceneImg/CreativeProcess.webp";
import camera from "../../../../public/image/behindSceneImg/CreativeProcess2.webp"
import sound from "../../../../public/image/behindSceneImg/CreativeProcess3.webp"
import lighting from "../../../../public/image/behindSceneImg/CreativeProcess4.webp"
const moments = [
    {
        title: 'Rehearsing Emotion',
        img: rehearsing,
        alt: 'Rehearsing Emotion',
    },
    {
        title: 'Camera Blocking',
        img: camera,
        alt: 'Camera Blocking',
    },
    {
        title: 'Sound Check',
        img: sound,
        alt: 'Sound Check',
    },
    {
        title: 'Lighting Setup',
        img: lighting,
        alt: 'Lighting Setup',
    },
]

function Moments() {
    return (
        <div className="bg-[#f8f6ef] flex flex-col items-center justify-center px-4 py-12">
            <h2 className="text-[45px] font-[500] font-clash text-center mb-10 leading-[123%] tracking-[0.02em]">
                Moments That Make the Magic
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-7xl mx-6 ">
                {moments.map((moment) => (
                    <div key={moment.title} className="flex flex-col ">
                        <div className="w-full h-[350px] overflow-hidden rounded">
                            <Image
                                src={moment.img}
                                alt={moment.alt}
                                width={600}
                                height={600}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <span className="mt-4 text-[20px] font-[500] font-jakarta leading-[123%] tracking-[0.02em] text-black text-left">
                            {moment.title}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Moments