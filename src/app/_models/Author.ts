import mongoose, { Document } from "mongoose";

export interface IAuthor extends Document {
	_id: string;
	name: string;
	slug: string;
	bio?: string;
	email: string;
	avatar?: {
		url: string;
		alt: string;
		publicId?: string;
	};
	socialLinks?: {
		twitter?: string;
		facebook?: string;
		instagram?: string;
		linkedin?: string;
	};
	createdAt: Date;
	updatedAt: Date;
}

const authorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		bio: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
		},
		avatar: {
			url: String,
			alt: String,
			publicId: String,
		},
		socialLinks: {
			twitter: String,
			facebook: String,
			instagram: String,
			linkedin: String,
		},
	},
	{
		timestamps: true,
	}
);

const Author = mongoose.models.Author || mongoose.model("Author", authorSchema);

export default Author;
