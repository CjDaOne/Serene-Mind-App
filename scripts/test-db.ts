import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

console.log('Testing MongoDB connection...');
console.log('URI length:', uri.length); // Don't log the full URI for security

const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
});

async function testConnection() {
    try {
        await client.connect();
        console.log('✅ Successfully connected to MongoDB!');
        const db = client.db();
        const result = await db.command({ ping: 1 });
        console.log('Ping result:', result);
    } catch (error) {
        console.error('❌ Connection failed:', error);
    } finally {
        await client.close();
    }
}

testConnection();
