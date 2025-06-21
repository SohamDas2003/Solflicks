import Image from 'next/image'
import React from 'react'
import notes from "../../../../public/image/behind-scene/notes.webp";
import fittings from "../../../../public/image/behind-scene/fittings.webp"
import created from "../../../../public/image/behind-scene/created.webp"
import productions from "../../../../public/image/behind-scene/production.webp"
const moments = [
    {
        title: 'Director giving notes',
        img: notes,
        alt: 'Director giving notes',
    },
    {
        title: 'Costume fittings',
        img: fittings,
        alt: 'Costume fittings',
    },
    {
        title: 'Set design being created',
        img: created,
        alt: 'Set design being created',
    },
    {
        title: 'Editing in post-production',
        img: productions,
        alt: 'Editing in post-production',
    },
]

function CrewAction() {
    return (
        <div className="bg-[#f8f6ef] flex flex-col items-center justify-center px-4 py-12 lg:py-16">
            <h2 className="text-[45px] font-[500] font-clash text-center mb-10 leading-[123%] tracking-[0.02em]">
                CrewAction That Make the Magic
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-7xl mx-6 ">
                {moments.map((moment) => (
                    <div key={moment.title} className="flex flex-col ">
                        <div className="w-full aspect-square overflow-hidden rounded">
                            <Image
                                src={moment.img}
                                alt={moment.alt}
                                width={200}
                                height={400}
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

export default CrewAction;