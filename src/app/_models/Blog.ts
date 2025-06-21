import mongoose, { Schema } from "mongoose";
import "./Category";
import "./Tag";
import "./Author";

const blogSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		shortDescription: {
			type: String,
			required: [true, "Short description is required"],
		},
		content: {
			type: String,
			required: [true, "Content is required"],
		},
		thumbnailImage: {
			url: {
				type: String,
				required: [true, "Thumbnail image URL is required"],
			},
			alt: String,
			publicId: String,
		},
		bannerImage: {
			url: {
				type: String,
				required: [true, "Banner image URL is required"],
			},
			alt: String,
			publicId: String,
		},
		categories: [
			{
				type: Schema.Types.ObjectId,
				ref: "Category",
				required: true,
			},
		],
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: "Tag",
			},
		],
		author: {
			type: Schema.Types.ObjectId,
			ref: "Author",
			required: true,
		},
		published: {
			type: Boolean,
			default: false,
		},
		// Add SEO metadata fields
		metaTitle: {
			type: String,
			trim: true,
		},
		metaDescription: {
			type: String,
			trim: true,
		},
		metaKeywords: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export interface IBlog {
	_id: string;
	title: string;
	slug: string;
	shortDescription: string;
	content: string;
	thumbnailImage: {
		url: string;
		alt?: string;
		publicId?: string;
	};
	bannerImage: {
		url: string;
		alt?: string;
		publicId?: string;
	};
	categories: Array<{
		_id: string;
		name: string;
		slug: string;
	}>;
	tags: Array<{
		_id: string;
		name: string;
	}>;
	author: {
		_id: string;
		name: string;
	};
	published: boolean;
	metaTitle?: string;
	metaDescription?: string;
	metaKeywords?: string;
	createdAt: Date;
	updatedAt: Date;
}

export default Blog;
