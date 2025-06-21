"use client"
import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ThreeJsBackground from './ThreeJsBackground'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const BehindScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const textMaskRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Video setup
    const video = videoRef.current
    if (video) {
      // Fix path - remove "public" from the beginning
      video.setAttribute('src', '/video.mp4')
      
      // Handle video loading
      video.addEventListener('loadeddata', () => {
        video.play()
        setIsLoaded(true)
      })
      
      video.muted = true
      video.load()
    }
    
    // GSAP animations
    const setupAnimations = () => {
      if (containerRef.current && textRef.current) {
        // Create animation timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }
        })
        
        // Text scale animation
        tl.fromTo(textRef.current, 
          { scale: 1, opacity: 0.8 },
          { scale: 1.2, opacity: 1, duration: 1 }
        )
        
        // Corner borders animation
        gsap.fromTo(".corner-border", 
          { width: "0px", height: "0px", opacity: 0 },
          { 
            width: "64px", 
            height: "64px", 
            opacity: 1,
            duration: 1, 
            stagger: 0.2,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
            }
          }
        )
      }
    }
    
    // Run animations after a brief delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setupAnimations()
    }, 100)
    
    return () => {
      clearTimeout(timer)
      
      // Clean up ScrollTrigger instances
      const triggers = ScrollTrigger.getAll()
      triggers.forEach(trigger => trigger.kill())
    }
  }, [])
  
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black" id="behind-scene">
       {/* Add ThreeJS Background */}
       <div className="absolute inset-0 z-0 opacity-70">
        <ThreeJsBackground />
      </div>
      <div 
        ref={containerRef}
        className="relative w-full h-full flex flex-col items-center justify-center px-4 z-10"
      >
        {/* Background video with noise texture overlay */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          autoPlay
          loop
          muted
          playsInline
        >
          <source type="/video.mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] opacity-10"></div>
        
        {/* Border frame with white corners */}
        <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center">
          {/* Top left corner */}
          <div className="corner-border absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white"></div>
          
          {/* Top right corner */}
          <div className="corner-border absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white"></div>
          
          {/* Bottom left corner */}
          <div className="corner-border absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-white"></div>
          
          {/* Bottom right corner */}
          <div className="corner-border absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white"></div>
          
          {/* Text content */}
          <div 
            ref={textRef}
            className="flex flex-col items-center justify-center text-center"
          >
            {/* Text mask container */}
            <div ref={textMaskRef} className="relative">
              {/* Hidden video that will be used for the text mask */}
              <video 
                className="text-mask-video hidden" 
                src="/video.mp4" 
                muted 
                autoPlay 
                loop 
                playsInline
              />
              
              {/* Main heading with special styling */}
              <h2 className="text-video-mask text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-red-500">
                Behind The Camera
              </h2>
            </div>
            
            <p className="text-white text-lg sm:text-xl md:text-2xl mt-6">
              Experience Moments Behind The Camera
            </p>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for text video mask effect */}
      <style jsx>{`
        .text-video-mask {
          -webkit-background-clip: text;
          background-clip: text;
        }
        
        @keyframes textBackground {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .text-video-mask {
          background-size: 200% auto;
          animation: textBackground 5s ease infinite;
        }
      `}</style>
    </section>
  )
}

export default BehindScene