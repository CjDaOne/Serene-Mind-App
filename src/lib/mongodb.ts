import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
export const dbName = process.env.MONGODB_DB || 'serene-mind';

// Optimized for Vercel serverless functions
// Each function instance maintains its own connection
// Low pool sizes prevent connection exhaustion in MongoDB Atlas
const options: MongoClientOptions = {
  maxPoolSize: 1,        // Serverless: 1 connection per function instance
  minPoolSize: 0,        // Serverless: no minimum to reduce idle connections
  maxIdleTimeMS: 10000,  // Close idle connections after 10s
  serverSelectionTimeoutMS: 5000,  // Faster timeout for serverless cold starts
  connectTimeoutMS: 10000,         // Connection timeout
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((error) => {
      console.error('MongoDB connection error:', error);
      throw error;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((error) => {
    console.error('MongoDB connection error:', error);
    throw error;
  });
}

export default clientPromise;
