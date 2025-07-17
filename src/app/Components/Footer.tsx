import React from "react";
import Link from "next/link";

function Footer() {
	return (
		<footer className="bg-[#0E1012] text-white">
			<div className="max-w-7xl mx-auto px-4 xl:px-0 py-12 md:py-16 lg:pt-24">
				{/* Main footer content */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 lg:mb-24">
					{/* Left Column - Brand */}
					<div className="space-y-4">
						<h2 className="text-[32px] font-[700] leading-none tracking-[0.02em] font-clash">
							Solflicks Filmwork
						</h2>
						<p className="text-gray-300 font-jakarta text-[16px] leading-[157%] font-[400] max-w-sm">
							Creating Cinematic Narratives That Reflect Humanity, Stir
							Emotions, and Resonate with Soul & Substance
						</p>

						{/* Social Media Icons */}
						<div className="flex space-x-6 pt-4">
							{/* Social Icons Container */}
							<div className="flex items-center space-x-6">
								{/* Facebook */}
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors duration-300">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true">
										<path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
									</svg>
								</a>

								{/* Instagram */}
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors duration-300">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true">
										<path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a5.885 5.885 0 0 0 1.384 2.126A5.868 5.868 0 0 0 4.14 23.37c.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558a5.898 5.898 0 0 0 2.126-1.384 5.86 5.86 0 0 0 1.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913a5.89 5.89 0 0 0-1.384-2.126A5.847 5.847 0 0 0 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0Zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.415 2.227.055 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 0 1-.899 1.382 3.744 3.744 0 0 1-1.38.896c-.42.164-1.065.36-2.235.415-1.274.055-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.716 3.716 0 0 1-1.379-.899 3.644 3.644 0 0 1-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03Zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324ZM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4Zm7.846-10.405a1.441 1.441 0 0 1-2.883 0 1.44 1.44 0 0 1 2.883 0Z" />
									</svg>
								</a>

								{/* LinkedIn */}
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors duration-300">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true">
										<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
									</svg>
								</a>

								{/* X/Twitter */}
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors duration-300">
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true">
										<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
									</svg>
								</a>
							</div>
						</div>
					</div>

					{/* Middle Column - Company Links */}
					<div className="grid grid-cols-2">
						{/* Company */}
						<div>
							<h3 className="text-lg font-semibold uppercase mb-4">Company</h3>
							<ul className="space-y-2 text-gray-300 font-jakarta text-[16px] leading-[157%] font-[400] ">
								<li>
									<Link
										href="#"
										className="text-gray-300 hover:text-white">
										About us
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="text-gray-300 hover:text-white">
										Our Team
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="text-gray-300 hover:text-white">
										Contact us
									</Link>
								</li>
							</ul>
						</div>

						{/* Quick Links */}
						<div>
							<h3 className="text-lg font-semibold uppercase mb-4">
								Quick Links
							</h3>
							<ul className="space-y-2 text-gray-300 font-jakarta text-[16px] leading-[157%] font-[400]">
								<li>
									<Link
										href="#"
										className="text-gray-300 hover:text-white">
										Home
									</Link>
								</li>
								
								<li>
									<Link
										href="#"
										className="text-gray-300 hover:text-white">
										Behind the scene
									</Link>
								</li>
							</ul>
						</div>
					</div>

					{/* Right Column - Contact */}
					<div>
						<h3 className="text-lg font-semibold uppercase mb-4">
							Contact Information
						</h3>
						<ul className="space-y-4 text-gray-300 font-jakarta text-[16px] leading-[157%] font-[400]">
							<li className="flex items-start">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 mr-2 text-white flex-shrink-0 mt-1"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={1.5}>
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
								<span className="text-gray-300 flex-1">
									F-304, Serenity Complex, Andheri West, 400102
								</span>
							</li>
							<li className="flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 mr-2 text-white flex-shrink-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
								<div className="flex flex-col">
									<span className="text-gray-300">+91 9820129600</span>
									<span className="text-gray-300">+91 9167307450</span>
								</div>
							</li>
							<li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div className="flex flex-col">
                  <span className="text-gray-300">business@solflicks.com</span>
                  <span className="text-gray-300">pragyasingh@solflicks.com</span>
                  <span className="text-gray-300">
                    vijendrasahaani@solflicks.com
                  </span>
                </div>
							</li>
						</ul>
					</div>
				</div>

				{/* Divider */}
				<div className="border-t border-gray-700 pt-8">
					<p className="text-center text-gray-300 font-jakarta text-[16px] leading-[157%] font-[400]">
						© {new Date().getFullYear()} Solflicks Filmwork. All rights
						reserved.
					</p>
				</div>
			</div>

			{/* Orange bottom line */}
			<div className="h-2 bg-yellow-500"></div>
		</footer>
	);
}

export default Footer;
