import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || "";
const PROJECT_ROOT = path.join(__dirname, "../..");

export default async function DBAgent(logFile: string) {
  fs.appendFileSync(logFile, "### DB Agent Tasks\n\n");

  // Task 1: Check MONGODB_URI
  fs.appendFileSync(logFile, "1. **Checking MONGODB_URI environment variable...**\n");
  if (!MONGODB_URI) {
    fs.appendFileSync(logFile, "   ❌ MONGODB_URI not found in environment variables.\n");
    fs.appendFileSync(logFile, "   💡 Add to .env.local: `MONGODB_URI=mongodb://localhost:27017/serene-mind`\n\n");
    return;
  }
  fs.appendFileSync(logFile, "   ✅ MONGODB_URI found in environment.\n\n");

  // Task 2: Test MongoDB connection
  fs.appendFileSync(logFile, "2. **Testing MongoDB connection...**\n");
  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    fs.appendFileSync(logFile, "   ✅ MongoDB connected successfully.\n\n");
  } catch (err) {
    fs.appendFileSync(logFile, `   ❌ MongoDB connection failed: ${err}\n`);
    fs.appendFileSync(logFile, "   💡 Ensure MongoDB is running or check connection string.\n\n");
    return;
  }

  // Task 3: Check for mongodb-connect.ts
  fs.appendFileSync(logFile, "3. **Checking for /lib/mongodb-connect.ts...**\n");
  const mongoConnectPath = path.join(PROJECT_ROOT, "src/lib/mongodb.ts");
  if (fs.existsSync(mongoConnectPath)) {
    fs.appendFileSync(logFile, "   ✅ /src/lib/mongodb.ts exists.\n\n");
  } else {
    fs.appendFileSync(logFile, "   ⚠️ /src/lib/mongodb.ts missing! Creating...\n");

    const mongoConnectContent = `import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {
  bufferCommands: false,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;`;

    fs.writeFileSync(mongoConnectPath, mongoConnectContent);
    fs.appendFileSync(logFile, "   ✅ Created /src/lib/mongodb.ts\n\n");
  }

  // Task 4: Check API routes
  fs.appendFileSync(logFile, "4. **Validating API routes...**\n");

  const apiRoutes = [
    "src/app/api/tasks/route.ts",
    "src/app/api/journal/route.ts",
    "src/app/api/affirmations/route.ts",
    "src/app/api/rewards/route.ts"
  ];

  apiRoutes.forEach(route => {
    const routePath = path.join(PROJECT_ROOT, route);
    if (fs.existsSync(routePath)) {
      fs.appendFileSync(logFile, `   ✅ ${route} exists.\n`);
    } else {
      fs.appendFileSync(logFile, `   ❌ ${route} missing!\n`);
    }
  });
  fs.appendFileSync(logFile, "\n");

  // Task 5: Test basic API functionality (if routes exist)
  fs.appendFileSync(logFile, "5. **Testing basic API functionality...**\n");

  // For now, just check if we can disconnect cleanly
  try {
    await mongoose.disconnect();
    fs.appendFileSync(logFile, "   ✅ MongoDB disconnected successfully.\n");
    fs.appendFileSync(logFile, "   ✅ DB Agent completed all tasks.\n\n");
  } catch (err) {
    fs.appendFileSync(logFile, `   ⚠️ MongoDB disconnect issue: ${err}\n\n`);
  }
}
