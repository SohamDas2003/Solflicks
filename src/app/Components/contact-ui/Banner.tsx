import React from 'react'
import Image from 'next/image'
import banner from "../../../../public/image/ContactBanner.png"

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="relative h-[450px] w-full">
        <Image 
          src={banner} 
          alt="Contact Banner" 
          fill 
          className="object-cover brightness-[0.85]"
          priority
        />
        
        {/* Banner Content */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 xl:px-0 flex flex-col justify-center items-start">
          <div className="w-full max-w-xl mb-[170px] sm:mb-[155px]">
            {/* <h1 className="font-clash font-[600] text-[55px] leading-[130%] tracking-[0.02em] text-white mb-3">
              Contact Us
            </h1> */}
          </div>
        </div>
      </div>
      
      {/* Contact Form Overlay - positioned to overlap banner */}
    <div className="absolute left-0 right-0 top-[100px]">
      {children}
    </div>
    </div>
  )
}

export default Banner