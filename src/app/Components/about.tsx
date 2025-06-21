"use client";
import TicketButton2 from "./button2";
import groupImg from "../../../public/image/group_photo.webp";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="bg-[#f5f5ea] overflow-hidden">
      <div className="px-4 xl:px-0 py-12 lg:py-24 max-w-7xl mx-auto text-black relative">
        <div className="absolute top-10 left-0 w-64 h-64 bg-[#184952] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-[#184952] opacity-5 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-8">
          <div className="max-w-xl">
            <h1 
              className="text-[32px] md:text-[36px] lg:text-[40px] font-medium leading-[123%] tracking-[2%] mb-6 font-clash animate-fadeInUp"
            >
              Where Stories Begin and <br className="hidden md:inline" /> Cinematic Journeys Unfold
            </h1>
            <div className="mb-8 md:mb-0 animate-fadeInUp animation-delay-200 hidden lg:block">
              <TicketButton2 label="Know More" href="/about" />
            </div>
          </div>
          <div className="lg:max-w-[50%]">
            <p 
              className=" md:text-[20px] font-jakarta font-normal leading-[168%] tracking-[1%] animate-fadeInUp animation-delay-400"
            >
              Solflicks Filmworks is an independent film and content production company
              dedicated to meaningful storytelling and powerful visual experiences. We
              specialize in feature films, OTT and TV series, documentaries, and short
              films — combining artistic integrity with high production values to tell
              stories that matter.
            </p>
          </div>
        </div>
        <div className="mt-16 rounded-2xl">
          <Image 
            src={groupImg} 
            alt="Solflicks Filmworks Team" 
            className="w-full h-auto shadow-lg object-cover transform animate-fadeInUp animation-delay-600 rounded-2xl lg:rounded-3xl" 
          />
        </div>
        <div className="mt-8 animate-fadeInUp animation-delay-200 block lg:hidden text-center">
          <TicketButton2 label="Know More" href="/about" />
        </div>
      </div>
    </section>
  );
}