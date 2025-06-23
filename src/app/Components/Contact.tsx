"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

function Contact() {
	const [form, setForm] = useState({
		name: "",
		phone: "",
		email: "",
		inquiryType: "",
		message: "",
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({
		name: "",
		phone: "",
		email: "",
		inquiryType: "",
		message: "",
	});

	const validateForm = () => {
		const newErrors = {
			name: "",
			phone: "",
			email: "",
			inquiryType: "",
			message: "",
		};

		// Name validation
		if (!form.name.trim()) {
			newErrors.name = "Name is required";
		} else if (form.name.trim().length < 3) {
			newErrors.name = "Name must be at least 3 characters";
		}

		// Phone validation
		if (!form.phone.trim()) {
			newErrors.phone = "Phone number is required";
		} else if (!/^[0-9]{10}$/.test(form.phone.replace(/\s/g, ""))) {
			newErrors.phone = "Please enter a valid 10-digit phone number";
		}

		// Email validation
		if (!form.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		// Inquiry type validation
		if (!form.inquiryType) {
			newErrors.inquiryType = "Please select an inquiry type";
		}

		// Message validation
		if (!form.message.trim()) {
			newErrors.message = "Message is required";
		} else if (form.message.trim().length < 10) {
			newErrors.message = "Message must be at least 10 characters";
		}

		setErrors(newErrors);
		return Object.values(newErrors).every((error) => error === "");
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });

		// Clear specific field error when user starts typing
		if (errors[name as keyof typeof errors]) {
			setErrors({ ...errors, [name]: "" });
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error("Please fix the errors below");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			const data = await res.json();

			if (res.ok) {
				toast.success(
					"Thank you! We have received your message and will get back to you soon.",
					{
						duration: 5000,
						style: {
							background: "#F9FAFB",
							color: "#1F2937",
							border: "1px solid #E5E7EB",
							padding: "16px",
							boxShadow:
								"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
						},
					}
				);
				setForm({
					name: "",
					phone: "",
					email: "",
					inquiryType: "",
					message: "",
				});
				setErrors({
					name: "",
					phone: "",
					email: "",
					inquiryType: "",
					message: "",
				});
			} else {
				toast.error(data.message || "Something went wrong. Please try again.");
			}
		} catch (err) {
			console.error("Error submitting form:", err);
			toast.error("Network error. Please check your connection and try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-black text-white py-8 md:py-12 lg:py-24">
			<div className="max-w-7xl mx-auto px-4 xl:px-0 flex flex-col lg:flex-row gap-8">
				{/* Left side - Heading and text */}
				<div className="w-full lg:w-[45%] space-y-4 md:space-y-6">
					<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-medium leading-tight lg:leading-[70px] tracking-wide font-clash capitalize">
						Create Something Powerful Together
					</h1>
					<p className="text-gray-300 mt-2 sm:mt-4 mb-6 sm:mb-8 font-jakarta text-sm sm:text-base leading-relaxed tracking-wide">
						Interested In Collaborating Or Learning More About Solflicks
						Filmwork? Reach Out - We&apos;d Love To Hear From You.
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
						</div>
						<p className="font-jakarta text-sm sm:text-base font-medium leading-tight sm:leading-[27px] tracking-wide text-gray-300">
							Serenity Complex, Behind Oshiwara Police Station Road,
							<br className="hidden xs:block" />
							Oshiwara, Andheri West, Mumbai, Maharashtra 400047
						</p>
					</div>
				</div>

				{/* Right side - Contact form */}
				<div className="w-full lg:w-[55%] lg:pl-12 mt-8 lg:mt-0">
					<form
						className="space-y-3 sm:space-y-4"
						onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
							<div>
								<input
									type="text"
									name="name"
									placeholder="Full Name*"
									className={`w-full bg-white bg-opacity-10 border ${
										errors.name ? "border-red-500" : "border-gray-700"
									} rounded px-3 sm:px-4 py-2.5 sm:py-3 text-[#5E6366] text-base focus:outline-none focus:ring-2 focus:ring-[#DB8D12] focus:border-transparent`}
									required
									value={form.name}
									onChange={handleChange}
								/>
								{errors.name && (
									<p className="text-red-400 text-xs mt-1">{errors.name}</p>
								)}
							</div>
							<div>
								<input
									type="tel"
									name="phone"
									placeholder="Mobile No*"
									className={`w-full bg-white bg-opacity-10 border ${
										errors.phone ? "border-red-500" : "border-gray-700"
									} rounded px-3 sm:px-4 py-2.5 sm:py-3 text-[#5E6366] text-base focus:outline-none focus:ring-2 focus:ring-[#DB8D12] focus:border-transparent`}
									required
									value={form.phone}
									onChange={handleChange}
								/>
								{errors.phone && (
									<p className="text-red-400 text-xs mt-1">{errors.phone}</p>
								)}
							</div>
						</div>
						<div>
							<input
								type="email"
								name="email"
								placeholder="Email*"
								className={`w-full bg-white bg-opacity-10 border ${
									errors.email ? "border-red-500" : "border-gray-700"
								} rounded px-3 sm:px-4 py-2.5 sm:py-3 text-[#5E6366] text-base focus:outline-none focus:ring-2 focus:ring-[#DB8D12] focus:border-transparent`}
								required
								value={form.email}
								onChange={handleChange}
							/>
							{errors.email && (
								<p className="text-red-400 text-xs mt-1">{errors.email}</p>
							)}
						</div>
						<div>
							<div className="relative">
								<select
									name="inquiryType"
									className={`w-full appearance-none bg-white bg-opacity-10 border ${
										errors.inquiryType ? "border-red-500" : "border-gray-700"
									} rounded px-3 sm:px-4 py-2.5 sm:py-3 text-[#5E6366] text-base focus:outline-none focus:ring-2 focus:ring-[#DB8D12] focus:border-transparent`}
									required
									value={form.inquiryType}
									onChange={handleChange}>
									<option value="">Inquiry Type</option>
									<option value="collaboration">Collaboration</option>
									<option value="project_inquiry">Project Inquiry</option>
									<option value="information">Information</option>
									<option value="other">Other</option>
								</select>
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#5E6366]">
									<svg
										className="w-4 h-4 fill-current"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20">
										<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
									</svg>
								</div>
							</div>
							{errors.inquiryType && (
								<p className="text-red-400 text-xs mt-1">
									{errors.inquiryType}
								</p>
							)}
						</div>
						<div>
							<textarea
								name="message"
								placeholder="Your Message..."
								className={`w-full bg-white bg-opacity-10 border ${
									errors.message ? "border-red-500" : "border-gray-700"
								} rounded px-3 sm:px-4 py-2.5 sm:py-3 text-[#5E6366] text-base h-28 sm:h-36 focus:outline-none focus:ring-2 focus:ring-[#DB8D12] focus:border-transparent resize-none`}
								required
								value={form.message}
								onChange={handleChange}></textarea>
							{errors.message && (
								<p className="text-red-400 text-xs mt-1">{errors.message}</p>
							)}
						</div>
						<button
							type="submit"
							className={`w-full ${
								loading
									? "bg-[#DB8D12]/70"
									: "bg-[#DB8D12] hover:bg-[#DB8D12]/90"
							} h-[45px] sm:h-[54px] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded transition duration-300 text-base sm:text-lg font-semibold leading-tight tracking-wide flex items-center justify-center`}
							disabled={loading}>
							{loading ? (
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
								"Submit Now"
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Contact;
