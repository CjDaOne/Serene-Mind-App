import clientPromise, { dbName } from './mongodb';
import { Db, MongoClient } from 'mongodb';

export async function initializeDatabase(): Promise<Db> {
  try {
    const client: MongoClient = await clientPromise;
    const db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
    await createIndexes(db);
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

async function createIndexes(db: Db): Promise<void> {
  try {
    await db.collection('tasks').createIndex(
      { userId: 1, createdAt: -1 },
      { name: 'userId_createdAt_idx', background: true }
    );

    await db.collection('journal').createIndex(
      { userId: 1, date: -1 },
      { name: 'userId_date_idx', background: true }
    );

    await db.collection('rewards').createIndex(
      { userId: 1 },
      { name: 'userId_idx', background: true }
    );

    // Stores lastActiveAt + currentMode — keyed by userId, unique
    await db.collection('user_preferences').createIndex(
      { userId: 1 },
      { name: 'user_prefs_userId_idx', unique: true, background: true }
    );

    console.log('✓ Indexes verified');
  } catch (error) {
    if ((error as { code?: number }).code === 85) {
      console.log('Indexes already exist, skipping...');
    } else {
      console.error('Index creation error:', error);
      throw error;
    }
  }
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
