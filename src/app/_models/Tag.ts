import mongoose, { Document } from "mongoose";

export interface ITag extends Document {
	_id: string;
	name: string;
	slug: string;
	description?: string;
	createdAt: Date;
	updatedAt: Date;
}

const tagSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
			unique: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

const Tag = mongoose.models.Tag || mongoose.model("Tag", tagSchema);

export default Tag;
