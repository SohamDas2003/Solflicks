"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import Link from "next/link";

interface TeamMemberProps {
    name: string;
    role: string;
    bio: string;
    imageSrc: string;
    socialLinks: {
        instagram?: string;
        twitter?: string;
        linkedin?: string;
        facebook?: string;
    };
}

export default function TeamMemberCard({
    name,
    role,
    bio,
    imageSrc,
    socialLinks,
}: TeamMemberProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className="relative w-full aspect-[3/4] bg-[#121212] overflow-hidden"
        >
            {/* Member Image */}
            <div className="w-full h-full">
                <Image
                    src={imageSrc}
                    alt={name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Bio Overlay */}
            <div className="absolute  inset-0 bg-gradient-to-t from-black/90 to-transparent py-16 flex flex-col justify-end">
                {isExpanded && (
                    <div className="bg-white text-black py-4 mb-4">
                        <p className="mb-4 px-6 font-jakarta text-[15px] leading-[154%]">{bio}</p>

                        {/* Social Links */}
                        <div className="flex space-x-3 px-6">
                            {socialLinks.instagram && (
                                <Link
                                    href={socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-black/80 hover:bg-[#E4405F] transition-colors duration-300 rounded flex items-center justify-center"
                                >
                                    <span className="sr-only">Instagram</span>
                                    <svg className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                    </svg>
                                </Link>
                            )}
                            {socialLinks.twitter && (
                                <Link
                                    href={socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-black/80 hover:bg-[#1DA1F2] transition-colors duration-300 rounded flex items-center justify-center"
                                >
                                    <span className="sr-only">Twitter</span>
                                    <svg className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                                    </svg>
                                </Link>
                            )}
                            {socialLinks.linkedin && (
                                <Link
                                    href={socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-black/80 hover:bg-[#0077B5] transition-colors duration-300 rounded flex items-center justify-center"
                                >
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                                    </svg>
                                </Link>
                            )}
                            {socialLinks.facebook && (
                                <Link
                                    href={socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-black/80 hover:bg-[#1877F2] transition-colors duration-300 rounded flex items-center justify-center"
                                >
                                    <span className="sr-only">Facebook</span>
                                    <svg className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Name and Role */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#121212] p-4 flex justify-between items-center">
                <div>
                    <h3 className="text-white font-medium text-xl tracking-wide uppercase">{name}</h3>
                    <p className="text-gray-400 uppercase text-sm">{role}</p>
                </div>
                <button
                    className="text-white rounded-full hover:bg-black/20 transition-colors p-1"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label={isExpanded ? "Hide details" : "Show details"}
                >
                    {isExpanded ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <Plus size={20} />
                    )}
                </button>
            </div>
        </div>
    );
}