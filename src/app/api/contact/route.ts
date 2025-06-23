import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Only POST is supported
export async function POST(req: NextRequest) {
	try {
		const { name, email, phone, inquiryType, message } = await req.json();

		if (!name || !email || !phone || !inquiryType || !message) {
			return NextResponse.json(
				{ message: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Map inquiry type values to readable names
		const inquiryTypeMap: { [key: string]: string } = {
			collaboration: "Collaboration",
			project_inquiry: "Project Inquiry",
			information: "Information",
			other: "Other",
			// Support old values for backward compatibility
			project: "Project Inquiry",
			skill: "Skill Development",
			donation: "Donation Inquiry",
			volunteer: "Volunteer Inquiry",
		};

		const readableInquiryType = inquiryTypeMap[inquiryType] || inquiryType;

		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT),
			secure: process.env.SMTP_SECURE === "true",
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});
		await transporter.sendMail({
			from: `"${name}" <${email}>`, // Use the user's name and email from the form
			to: process.env.SMTP_TO,
			subject: `New Contact Form Submission from ${name}`,
			text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInquiry Type: ${readableInquiryType}\nMessage: ${message}`,
			html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Inquiry Type:</strong> ${readableInquiryType}</p>
             <p><strong>Message:</strong> ${message}</p>`,
		});

		return NextResponse.json(
			{ message: "Email sent successfully" },
			{ status: 200 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ message: "Failed to send email", error: error.message },
			{ status: 500 }
		);
	}
}
