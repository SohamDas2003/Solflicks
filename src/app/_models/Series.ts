import mongoose, { Schema, Document } from "mongoose";

export interface ISeries extends Document {
	title: string;
	year: number;
	seasons: number;
	episodes: number;
	genres: string[];
	description: string;
	starring?: string;
	director?: string;
	producers?: string;
	productionCompany?: string;
	trailerUrl?: string;
	streamingUrl?: string;
	slug: string;
	imageUrl?: string;
	status: "ongoing" | "completed" | "upcoming";
	createdAt: Date;
	updatedAt: Date;
	createdBy?: mongoose.Types.ObjectId;
}

const SeriesSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		year: { type: Number, required: true },
		seasons: { type: Number, required: true, min: 1 },
		episodes: { type: Number, required: true, min: 1 },
		genres: { type: [String], required: true },
		description: { type: String, required: true },
		starring: { type: String },
		director: { type: String },
		producers: { type: String },
		productionCompany: { type: String, default: "Solflicks Filmwork" },
		trailerUrl: { type: String },
		streamingUrl: { type: String },
		slug: { type: String, required: true, unique: true },
		imageUrl: { type: String },
		status: {
			type: String,
			enum: ["ongoing", "completed", "upcoming"],
			default: "ongoing",
		},
		createdBy: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

// Create a text index for search functionality
SeriesSchema.index({ title: "text", description: "text" });

// Prevent duplicate model compilation error in development
export default mongoose.models.Series ||
	mongoose.model<ISeries>("Series", SeriesSchema);
