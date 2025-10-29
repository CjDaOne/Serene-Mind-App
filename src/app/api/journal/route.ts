import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { CreateJournalEntrySchema, JournalEntryDTO, toJournalEntryDTO } from '@/lib/domain/journal';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('serene-mind');

    const entries = await db.collection('journal')
      .find({ userId: session.user.id })
      .sort({ date: -1 })
      .toArray();

    const entryDTOs: JournalEntryDTO[] = entries.map(entry => ({
      id: entry._id.toString(),
      date: entry.date.toISOString(),
      mood: entry.mood,
      content: entry.content,
    }));

    return NextResponse.json(entryDTOs);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = CreateJournalEntrySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid journal entry data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const entry = validationResult.data;
    const client = await clientPromise;
    const db = client.db('serene-mind');

    const entryDoc = {
      ...entry,
      userId: session.user.id,
      createdAt: new Date(),
    };

    const result = await db.collection('journal').insertOne(entryDoc);

    const createdEntry: JournalEntryDTO = {
      id: result.insertedId.toString(),
      date: entry.date.toISOString(),
      mood: entry.mood,
      content: entry.content,
    };

    return NextResponse.json(createdEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
