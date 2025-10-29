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
    const tasksCollection = db.collection('tasks');
    await tasksCollection.createIndex(
      { userId: 1, createdAt: -1 },
      { name: 'userId_createdAt_idx', background: true }
    );
    console.log('✓ Created index: tasks.userId_createdAt');

    const journalCollection = db.collection('journal');
    await journalCollection.createIndex(
      { userId: 1, date: -1 },
      { name: 'userId_date_idx', background: true }
    );
    console.log('✓ Created index: journal.userId_date');

    const rewardsCollection = db.collection('rewards');
    await rewardsCollection.createIndex(
      { userId: 1 },
      { name: 'userId_idx', background: true }
    );
    console.log('✓ Created index: rewards.userId');

  } catch (error) {
    if ((error as any).code === 85) {
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
