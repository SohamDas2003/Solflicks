/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint no-var: 0 */
import mongoose from 'mongoose';
const NEXT_PUBLIC_MongoDB_URI = process.env.NEXT_PUBLIC_MongoDB_URI || '';
console.log(NEXT_PUBLIC_MongoDB_URI);
if (!NEXT_PUBLIC_MongoDB_URI) {
  throw new Error(
    'Please define the NEXT_PUBLIC_MongoDB_URI environment variable inside .env file',
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}


async function dbConnect() {

  if (cached.conn) {
    return cached.conn;
  }


  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(NEXT_PUBLIC_MongoDB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;