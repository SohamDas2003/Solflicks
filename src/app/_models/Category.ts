import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
	_id: string;
	name: string;
	slug: string;
	description?: string;
	createdAt: Date;
	updatedAt: Date;
}

const categorySchema = new mongoose.Schema(
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

const Category =
	mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
