import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Mock users - replace with your database in production
const users = [
	{
		_id: "1",
		name: "Admin User",
		email: "admin@solflicksfilmwork.com",
		password: "Solflicks@123", // In production, use hashed passwords!
		role: "admin",
	},
	{
		_id: "2",
		name: "Admin User",
		email: "admin@solflicks.com",
		password: "Solflicks@123",
		role: "admin",
	},
];

// Secret key for JWT tokens - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
	try {
		// Get credentials from request body
		const body = await request.json();
		const { email, password } = body;

		// Find user by email
		const user = users.find((u) => u.email === email);

		// Check if user exists and password matches
		if (!user || user.password !== password) {
			return NextResponse.json(
				{ message: "Invalid email or password" },
				{ status: 401 }
			);
		}
		// Create user object without password
		const userWithoutPassword = {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		};

		// Generate JWT token
		const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
			expiresIn: "7d",
		});

		return NextResponse.json({
			message: "Login successful",
			user: userWithoutPassword,
			token,
		});
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
