"use client";
import React from 'react';
import Image, { StaticImageData } from 'next/image';
import team1 from "../../../../public/image/team/team1.png"
import team2 from "../../../../public/image/team/team2.png"
import team3 from "../../../../public/image/team/team3.png"



type TeamMember = {
    id: number;
    name: string;
    position: string;
    bio: string;
    image: StaticImageData;
}

const TeamMemberCard = ({ member, isReversed }: { member: TeamMember, isReversed: boolean }) => {
    return (
        <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 mb-12 lg:mb-24`}>
            <div className={`w-full lg:w-5/12 h-72 lg:h-[400px] xl:h-[500px] bg-zinc-800 rounded-md overflow-hidden ${isReversed ? 'lg:ml-8' : 'lg:mr-8'}`}>
                <Image
                    src={member.image}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain object-center"
                />
            </div>
            <div className={`w-full lg:w-7/12 flex flex-col justify-center ${isReversed ? 'lg:mr-8' : 'lg:ml-8'}`}>
                <h3 className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px] font-clash font-semibold text-white mb-1 leading-[123%] tracking-[0.02em]">{member.name}</h3>
                <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-clash font-medium text-gray-400 mb-4 leading-[123%] tracking-[0.02em]">{member.position}</p>
                <div className="h-px w-full bg-zinc-700 mb-6"></div>
                <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-normal text-gray-400 mb-4 leading-[175%] font-jakarta capitalize">
                    {member.bio}
                </p>
            </div>
        </div>
    );
};
function OurTeam() {

    const teamMembers: TeamMember[] = [
        {
            id: 1,
            name: "PRAGYA SINGH",
            position: "FOUNDER",
            bio: "Manika Sharma is Recognized For Her Work As A Filmmaker And Writer. Her Debut Movie, 'The Wishing Tree,' Focuses On Creating Awareness About The Significance Of Trees. She Is Known For Weaving Socially Conscious Themes Into Her Storytelling, Blending Emotion With Meaningful Messages.",
            image: team1
        },
        {
            id: 2,
            name: "PRAGYA SINGH",
            position: "FOUNDER",
            bio: "Manika Sharma is Recognized For Her Work As A Filmmaker And Writer. Her Debut Movie, 'The Wishing Tree,' Focuses On Creating Awareness About The Significance Of Trees. She Is Known For Weaving Socially Conscious Themes Into Her Storytelling, Blending Emotion With Meaningful Messages.",
            image: team2
        },
        {
            id: 3,
            name: "PRAGYA SINGH",
            position: "FOUNDER",
            bio: "Manika Sharma is Recognized For Her Work As A Filmmaker And Writer. Her Debut Movie, 'The Wishing Tree,' Focuses On Creating Awareness About The Significance Of Trees. She Is Known For Weaving Socially Conscious Themes Into Her Storytelling, Blending Emotion With Meaningful Messages.",
            image: team3
        },
        {
            id: 4,
            name: "PRAGYA SINGH",
            position: "FOUNDER",
            bio: "Manika Sharma is Recognized For Her Work As A Filmmaker And Writer. Her Debut Movie, 'The Wishing Tree,' Focuses On Creating Awareness About The Significance Of Trees. She Is Known For Weaving Socially Conscious Themes Into Her Storytelling, Blending Emotion With Meaningful Messages.",
            image: team1
        },
    ];

    return (
        <section className="w-full bg-black py-8 md:pt-24">
            <div className="max-w-7xl mx-auto px-4 xl:px-0">
                <h2 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[55px] font-clash font-medium text-white text-center mb-8 lg:mb-16 leading-[123%] tracking-[0.02em]">
                    Meet Our Team
                </h2>


                <div className="flex flex-col">
                    {teamMembers.map((member, index) => (
                        <TeamMemberCard
                            key={member.id}
                            member={member}
                            isReversed={index % 2 !== 0}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default OurTeam;
