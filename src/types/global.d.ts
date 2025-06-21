import { MongooseCache } from "mongoose";

declare global {
	// eslint-disable-next-line no-var
	let mongoose: MongooseCache | undefined;
}

export {};
