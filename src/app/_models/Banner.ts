import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
	title: string;
	subtitle?: string;
	description: string;
	platform?: string;
	imageUrl: string;
	watchNowLink?: string;
	learnMoreLink?: string;
	isActive: boolean;
	order: number;
	createdAt: Date;
	updatedAt: Date;
	createdBy?: mongoose.Types.ObjectId;
}

const BannerSchema: Schema = new Schema(
	{
		title: { type: String },
		subtitle: { type: String },
		description: { type: String },
		platform: { type: String },
		imageUrl: { type: String, required: true },
		watchNowLink: { type: String },
		learnMoreLink: { type: String },
		isActive: { type: Boolean, default: true },
		order: { type: Number, default: 0 },
		createdBy: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

// Create indexes for better query performance
BannerSchema.index({ isActive: 1, order: 1 });
BannerSchema.index({ title: "text", description: "text" });

// Prevent duplicate model compilation error in development
export default mongoose.models.Banner ||
	mongoose.model<IBanner>("Banner", BannerSchema);
