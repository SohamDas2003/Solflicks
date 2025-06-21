"use client";
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ourstory1 from "../../../../public/image/About/ourstory1.webp"
import ourstory2 from "../../../../public/image/About/ourstory2.webp"
import ourstory3 from "../../../../public/image/About/ourstory3.webp"
import ourstory4 from "../../../../public/image/About/ourstory4.webp"
import Image from 'next/image';

function OurStory() {
  // Main container ref
  const sectionRef = useRef(null)
  // Element refs
  const titleRef = useRef(null)
  const textRef = useRef(null)
  // Create refs array for image containers
  const imageRefs = useRef<Array<HTMLDivElement | null>>([])
  
  // Set up image refs properly
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el)
    }
  }

  useEffect(() => {
    // Register plugin
    gsap.registerPlugin(ScrollTrigger)
    
    // Create a GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // Create main timeline for better sequencing
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reset"
        }
      })
      
      // Add title animation to timeline
      mainTl.from(titleRef.current, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out"
      })
      
      // Add text content animation
      mainTl.from(textRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out"
      }, "-=0.7") // Start slightly before the previous animation finishes
      
      // Create separate timeline for images with staggered effect
      const imagesTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reset"
        }
      })
      
      // Add images animation with enhanced stagger
      imagesTl.from(imageRefs.current, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.2)",
        clearProps: "all" // Clean up transformations after animation
      })
    }, sectionRef) // Scope GSAP context to our section
    
    // Cleanup function
    return () => {
      ctx.revert() // This handles all the animation cleanup
    }
  }, [])

  return (
    <div ref={sectionRef} className="bg-white py-16 md:py-24  ">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Left Column - Title */}
          <div>
            <h2 
              ref={titleRef} 
              className="text-5xl md:text-6xl font-extrabold text-black font-clash"
            >
              Our Story
            </h2>
          </div>
          
          {/* Right Column - Text */}
          <div 
            ref={textRef} 
            className="text-[16px] lg:text-[18px] xl:text-[22px] leading-[159%] tracking-[0.02em] font-jakarta"
          >
            <p>
              <span className="font-bold">Solflicks Filmworks</span> is an independent production company 
              committed to crafting meaningful narratives across formats 
              — from feature films and series to documentaries and shorts. 
              With a passion for storytelling and a dedication to high 
              <span className="font-bold"> production value</span>, we bring creative visions to life with 
              authenticity, depth, and cinematic flair.
            </p>
          </div>
        </div>
        
        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ourstory1,
            ourstory2,
            ourstory3,
            ourstory4,
          ].map((src, index) => (
            <div 
              key={index} 
              ref={addToRefs}
              className="rounded-lg overflow-hidden md:h-96 will-change-transform"
            >
              <Image 
                src={src} 
                alt={`Production image ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OurStory