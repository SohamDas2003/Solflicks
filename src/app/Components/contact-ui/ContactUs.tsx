'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneIcon from "../../../../public/icons/PhoneIcon.svg";
import LocationIcon from "../../../../public/icons/LocationMarker.svg";
import EmailIcon from "../../../../public/icons/EmailIcon.svg";
import FacebookSVG from "../../../../public/icons/Facebook.svg";
import InstagramSVG from "../../../../public/icons/Instagram.svg";
import TelegramSVG from "../../../../public/icons/telegram.svg";
import LinkedInSVG from "../../../../public/icons/LinkedIn.svg";
import arrowdown from "../../../../public/icons/arrowdown.svg";
import circles from "../../../../public/icons/circles.svg";
import { toast } from 'react-hot-toast';
// Define validation schema with Zod
const contactFormSchema = z.object({
  fullName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  mobile: z.string().regex(/^[0-9]{10}$/, { message: "Please enter a valid 10-digit mobile number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  service: z.string().min(1, { message: "Please select a service" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      toast.success('Thank you! We have received your message and will get back to you soon.', {
        duration: 5000,
        style: {
          background: '#F9FAFB',
          color: '#1F2937',
          border: '1px solid #E5E7EB',
          padding: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      });
      reset(); // Clear form
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error((error as Error).message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
		<section className="py-16 md:py-24">
			<div className="max-w-7xl mx-auto px-4 xl:px-0">
				<div className="flex flex-col lg:flex-row lg:h-[647px] bg-white border border-[#B0B0B0] rounded-lg overflow-hidden p-2 shadow-[0px_0px_60px_30px_#00000008]">
					{/* Left Section - Contact Information */}
					<div className="w-full lg:w-[494.2px] bg-[#1A1A1A] p-4 md:p-6 rounded-md relative overflow-hidden">
						{/* Circles SVG at bottom left */}
						<div className="absolute right-0 bottom-0 pointer-events-none">
							<Image
								src={circles}
								alt="Decorative circles"
								width={100}
								height={100}
								className="lg:w-[200px] lg:h-[200px] w-[150px] h-[150px]"
							/>
						</div>
						<div className="h-full flex flex-col relative z-10">
							{/* Contact Information wrapped in 337px div */}
							<div className="w-full lg:w-[337px]">
								<h2 className="font-clash font-[600] text-[28px] leading-[100%] tracking-[0.02em] text-white mb-4">
									Contact Information
								</h2>
								<p className="font-jakarta font-[400] text-[18px] leading-[100%] text-[#C9C9C9] mb-10">
									Say something to start a live chat!
								</p>

								<div className="space-y-6 mb-10">
									{/* Phone */}
									<div className="flex items-center gap-1">
										<div className="w-10 h-10 rounded-full flex items-center justify-left">
											<Image
												src={PhoneIcon}
												alt="Phone"
												width={21}
												height={18}
											/>
										</div>
										<p className="font-jakarta font-[400] text-[18px] leading-[100%] text-[#C9C9C9]">
											+91 9820129600 / +91 9167307450
										</p>
									</div>

									{/* Email */}
									<div className="flex items-center gap-1">
										<div className="w-10 h-10 rounded-full flex items-center justify-left">
											<Image
												src={EmailIcon}
												alt="Email"
												width={21}
												height={18}
											/>
										</div>
                    <div className="flex flex-col gap-2">
                      <p className="font-jakarta font-[400] text-[18px] leading-[100%] text-[#C9C9C9]">
                      business@solflicks.com
                      </p>
                      <p className="font-jakarta font-[400] text-[18px] leading-[100%] text-[#C9C9C9]">
                      pragyasingh@solflicks.com
                      </p>
                      <p className="font-jakarta font-[400] text-[18px] leading-[100%] text-[#C9C9C9]">
                      vijendrasahaani@solflicks.com
                      </p>
                    </div>
									</div>

									{/* Address */}
									<div className="flex items-center gap-2">
										<div className="w-10 h-10 rounded-full flex items-center justify-left">
											<Image
												src={LocationIcon}
												alt="Location"
												width={17}
												height={17}
											/>
										</div>
										<p className="font-jakarta font-[400] text-[18px] leading-[100%] text-[#C9C9C9]">
											F-304, Serenity Complex, Andheri West, 400102
										</p>
									</div>
								</div>
							</div>

							{/* Social Icons */}
							<div className="mt-auto flex gap-4">
								<a
									href="#"
									className="bg-white rounded-full p-2 flex items-center justify-center h-8 w-8 hover:bg-[#1A1A1A] hover:opacity-90 transition-all duration-300 group">
									<Image
										src={FacebookSVG}
										alt="Facebook"
										width={8}
										height={8}
										className="fill-[#1A1A1A] group-hover:brightness-0 group-hover:invert"
									/>
								</a>
								<a
									href="#"
									className="bg-white rounded-full p-2 flex items-center justify-center h-8 w-8 hover:bg-[#1A1A1A] hover:opacity-90 transition-all duration-300 group">
									<Image
										src={InstagramSVG}
										alt="Instagram"
										width={14}
										height={14}
										className="fill-[#1A1A1A] group-hover:brightness-0 group-hover:invert"
									/>
								</a>
								<a
									href="#"
									className="bg-white rounded-full p-2 flex items-center justify-center h-8 w-8 hover:bg-[#1A1A1A] hover:opacity-90 transition-all duration-300 group">
									<Image
										src={TelegramSVG}
										alt="Telegram"
										width={14}
										height={14}
										className="fill-[#1A1A1A] group-hover:brightness-0 group-hover:invert"
									/>
								</a>
								<a
									href="#"
									className="bg-white rounded-full p-2 flex items-center justify-center h-8 w-8 hover:bg-[#1A1A1A] hover:opacity-90 transition-all duration-300 group">
									<Image
										src={LinkedInSVG}
										alt="LinkedIn"
										width={14}
										height={14}
										className="fill-[#1A1A1A] group-hover:brightness-0 group-hover:invert"
									/>
								</a>
							</div>
						</div>
					</div>

					{/* Right Section - Contact Form */}
					<div className="w-full lg:flex-1 bg-white px-1 py-2 lg:p-12 lg:pt-16">
						<form
							onSubmit={handleSubmit(onSubmit)}
							noValidate>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
								{/* Full Name */}
								<div className="relative">
									<input
										type="text"
										id="fullName"
										className={`w-full px-4 py-3 border ${
											errors.fullName ? "border-red-500" : "border-gray-300"
										} rounded-md focus:outline-none focus:ring-2 focus:ring-[#671E45] focus:border-transparent`}
										placeholder="Full Name"
										{...register("fullName")}
									/>
									<span className="text-red-500 absolute top-3 left-24 text-lg">
										*
									</span>
									{errors.fullName && (
										<p className="text-red-500 text-xs mt-1">
											{errors.fullName.message}
										</p>
									)}
								</div>

								{/* Mobile No */}
								<div className="relative">
									<input
										type="tel"
										id="mobile"
										className={`w-full px-4 py-3 border ${
											errors.mobile ? "border-red-500" : "border-gray-300"
										} rounded-md focus:outline-none focus:ring-2 focus:ring-[#671E45] focus:border-transparent`}
										placeholder="Mobile No"
										{...register("mobile")}
									/>
									<span className="text-red-500 absolute top-3 left-24 text-lg">
										*
									</span>
									{errors.mobile && (
										<p className="text-red-500 text-xs mt-1">
											{errors.mobile.message}
										</p>
									)}
								</div>

								{/* Email */}
								<div className="relative">
									<input
										type="email"
										id="email"
										className={`w-full px-4 py-3 border ${
											errors.email ? "border-red-500" : "border-gray-300"
										} rounded-md focus:outline-none focus:ring-2 focus:ring-[#671E45] focus:border-transparent`}
										placeholder="Email Id"
										{...register("email")}
									/>
									<span className="text-red-500 absolute top-3 left-20 text-lg">
										*
									</span>
									{errors.email && (
										<p className="text-red-500 text-xs mt-1">
											{errors.email.message}
										</p>
									)}
								</div>

								{/* Service */}
								<div className="relative">
									<select
										id="service"
										className={`w-full px-4 py-3 border ${
											errors.service ? "border-red-500" : "border-gray-300"
										} rounded-md focus:outline-none focus:ring-2 focus:ring-[#671E45] focus:border-transparent bg-white appearance-none`}
										{...register("service")}
										defaultValue="">
										<option
											value=""
											disabled>
											Select Enquiry Type
										</option>
										<option value="skill">Skill Development Enquiry</option>
										<option value="donation">Donation Enquiry</option>
										<option value="volunteer">Volunteer Enquiry</option>
									</select>
									<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
										<Image
											src={arrowdown}
											alt="Arrow Down"
											width={16}
											height={16}
											className="text-gray-500"
										/>
									</div>
									{errors.service && (
										<p className="text-red-500 text-xs mt-1">
											{errors.service.message}
										</p>
									)}
								</div>
							</div>

							{/* Message Box with Fixed Height using textarea */}
							<div className="mb-4 md:mb-8 relative">
								<textarea
									id="message"
									className={`w-full px-4 py-3 border ${
										errors.message ? "border-red-500" : "border-gray-300"
									} rounded-md focus:outline-none focus:ring-2 focus:ring-[#671E45] focus:border-transparent resize-none h-[238px]`}
									placeholder="Your Message"
									{...register("message")}></textarea>
								{errors.message && (
									<p className="text-red-500 text-xs mt-1">
										{errors.message.message}
									</p>
								)}
							</div>

							{/* Submit Button */}
							<div className="flex justify-end">
								<button
									type="submit"
									disabled={isSubmitting}
									className={`${
										isSubmitting
											? "bg-gray-400"
											: "bg-[#1A1A1A] hover:bg-opacity-90"
									} text-white font-['Poppins'] font-[600] text-[16px] px-12 py-3 rounded-[40px] transition-colors duration-300 flex items-center justify-center min-w-[150px]`}>
									{isSubmitting ? (
										<>
											<svg
												className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24">
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Sending...
										</>
									) : (
										"Submit"
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}

export default ContactUs;