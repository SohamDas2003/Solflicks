import React from 'react'

function AboutContact() {
    return (
        <div className="bg-[#161C20] text-white py-8 md:py-12 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 xl:px-0 flex flex-col lg:flex-row gap-8">
            {/* Left side - Heading and text */}
            <div className="w-full lg:w-[45%] space-y-4 md:space-y-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-medium leading-tight lg:leading-[70px] tracking-wide font-clash capitalize">
                    Create Something Powerful Together
                </h1>
                <p className="text-gray-300 mt-2 sm:mt-4 mb-6 sm:mb-8 font-jakarta text-sm sm:text-base leading-relaxed tracking-wide">
                    Interested In Collaborating Or Learning More About Solflicks Filmwork? Reach Out - We&apos;d Love To Hear From You.
                </p>
                <div className="border-t border-gray-700 pt-4 sm:pt-6 mt-6 sm:mt-8"></div>
                {/* Address with location icon */}
                <div className="flex items-start gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <div className="mt-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0 mt-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                            />
                        </svg>
                    </div>
                    <p className="font-jakarta text-sm sm:text-base font-medium leading-tight sm:leading-[27px] tracking-wide text-gray-300">
                        Serenity Complex, Behind Oshiwara Police Station Road,
                        <br className="hidden xs:block" />Oshiwara, Andheri West, Mumbai, Maharashtra 400047
                    </p>
                </div>
            </div>

            {/* Right side - Contact form */}
            <div className="w-full lg:w-[55%] lg:pl-12 mt-8 lg:mt-0">
                <form className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <input
                            type="text"
                            placeholder="Full Name*"
                            className="w-full bg-white bg-opacity-10 border border-gray-700 rounded px-3 sm:px-4 py-2.5 sm:py-3 text-[#5E6366] text-base"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Mobile No*"
                            className="w-full bg-white bg-opacity-10 border border-gray-700 rounded px-3 sm:px-4 py-2.5 sm:py-3 text-[#5E6366] text-base"
                            required
                        />
                    </div>
                    <input
                        type="email"
                        placeholder="Email*"
                        className="w-full bg-white bg-opacity-10 border border-gray-700 rounded px-3 sm:px-4 py-2.5 sm:py-3 text-[#5E6366] text-base"
                        required
                    />
                    <div className="relative">
                        <select
                            className="w-full appearance-none bg-white bg-opacity-10 border border-gray-700 rounded px-3 sm:px-4 py-2.5 sm:py-3 text-[#5E6366] text-base"
                            required
                        >
                            <option value="">Inquiry Type</option>
                            <option value="collaboration">Collaboration</option>
                            <option value="project">Project Inquiry</option>
                            <option value="information">Information</option>
                            <option value="other">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#5E6366]">
                            <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                    <textarea
                        placeholder="Your Message..."
                        className="w-full bg-white bg-opacity-10 border border-gray-700 rounded px-3 sm:px-4 py-2.5 sm:py-3 text-[#5E6366] text-base h-28 sm:h-36"
                        required
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full bg-[#DB8D12] h-[45px] sm:h-[54px] hover:bg-[#DB8D12]/90 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded transition duration-300 text-base sm:text-lg font-semibold leading-tight tracking-wide"
                    >
                        Submit Now
                    </button>
                </form>
            </div>
        </div>
    </div>
    )
}

export default AboutContact