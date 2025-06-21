import React from "react";
import Image from "next/image";
import TalkIcon from "../../../../public/icons/Profile.svg";
import ChatIcon from "../../../../public/icons//chat.svg";
import MailIcon from "../../../../public/icons//chat.svg";

function GetInTouch() {
	return (
		<section className="py-10 md:py-16 bg-[#F4F1E8]">
			<div className="max-w-7xl mx-auto px-4 xl:px-0">
				<h2 className="font-['Montserrat'] font-[700] text-[28px] sm:text-[32px] md:text-[36px] text-[#151E2B] mb-10 text-left">
					Get in Touch
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
					<div className="bg-white border border-[#CFCFCF] rounded-lg p-6 md:p-8 flex flex-col h-full">
						<div className="flex items-center gap-4 mb-4">
							<Image
								src={TalkIcon}
								alt="Talk to Expert"
								width={24}
								height={24}
								className="text-[#671E45]"
							/>
							<h3 className="font-['Montserrat'] font-[700] text-[18px] sm:text-[20px] text-[#151E2B]">
								Talk to Expert
							</h3>
						</div>
						<p className="font-jakarta font-[400] text-[18px] leading-[100%]  text-[#6C6C6C] mb-6 flex-grow">
							Our expert will help you solve your query. Please book an
							appointment with us.
						</p>
						<div className="flex justify-center md:justify-start">
							<button className="bg-[#1A1A1A] hover:bg-opacity-90 text-white font-['Poppins'] font-[600] text-[16px] px-6 py-3 rounded-[5px] transition-colors duration-300 w-full sm:w-auto min-w-[120px]">
								Book Now
							</button>
						</div>
					</div>

					<div className="bg-white border border-[#CFCFCF] rounded-lg p-6 md:p-8 flex flex-col h-full">
						<div className="flex items-center gap-4 mb-4">
							<Image
								src={ChatIcon}
								alt="Chat With Us"
								width={24}
								height={24}
								className="text-[#1A1A1A]"
							/>
							<h3 className="font-['Montserrat'] font-[700] text-[18px] sm:text-[20px] text-[#151E2B]">
								Chat With Us
							</h3>
						</div>
						<p className="font-jakarta font-[400] text-[18px] leading-[100%] text-[#6C6C6C] mb-6 flex-grow">
							For an instant solution, you can chat directly with our expert.
						</p>
						<div className="flex justify-center md:justify-start">
							<button className="bg-[#1A1A1A] hover:bg-opacity-90 text-white font-['Poppins'] font-[600] text-[16px] px-6 py-3 rounded-[5px] transition-colors duration-300 w-full sm:w-auto min-w-[120px]">
								Chat Now
							</button>
						</div>
					</div>

					<div className="bg-white border border-[#CFCFCF] rounded-lg p-6 md:p-8 flex flex-col h-full">
						<div className="flex items-center gap-4 mb-4">
							<Image
								src={MailIcon}
								alt="Mail Us"
								width={24}
								height={24}
								className="text-[#1A1A1A]"
							/>
							<h3 className="font-['Montserrat'] font-[700] text-[18px] sm:text-[20px] text-[#151E2B]">
								Mail Us
							</h3>
						</div>
						<p className="font-jakarta font-[400] text-[18px] leading-[100%] text-[#6C6C6C] mb-6 flex-grow">
							If you have an inquiry, you can also email us, and our executive
							will be happy to assist you.
						</p>
						<a
							href="mailto:business@solflicks.com"
							className="font-['Roboto'] font-[400] text-[16px] text-[#1A1A1A] hover:underline">
							business@solflicks.com
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}

export default GetInTouch;
