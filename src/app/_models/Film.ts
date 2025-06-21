import mongoose, { Schema, Document } from "mongoose";

export interface IFilm extends Document {
	title: string;
	year: number;
	duration: string;
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
	createdAt: Date;
	updatedAt: Date;
	createdBy?: mongoose.Types.ObjectId;
}

const FilmSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		year: { type: Number, required: true },
		duration: { type: String, required: true },
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
		createdBy: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

// Create a text index for search functionality
FilmSchema.index({ title: "text", description: "text" });

// Prevent duplicate model compilation error in development
export default mongoose.models.Film ||
	mongoose.model<IFilm>("Film", FilmSchema);
