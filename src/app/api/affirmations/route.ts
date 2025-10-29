import { NextResponse } from 'next/server';

const affirmations = [
  "I am worthy of love and respect.",
  "I believe in my ability to succeed.",
  "I am resilient and can overcome any challenge.",
  "I am grateful for all the good in my life.",
  "I choose to be happy and to love myself today.",
  "My potential to succeed is infinite.",
  "I am calm, confident, and powerful.",
  "I am surrounded by positivity.",
  "I trust myself to make the right decisions.",
  "Every day is a new opportunity to grow.",
  "I am capable of achieving my dreams.",
  "I radiate confidence and positivity.",
  "I am deserving of happiness and success.",
  "I embrace change and welcome new opportunities.",
  "I am strong, capable, and worthy.",
  "I trust the journey of my life.",
  "I am exactly where I need to be.",
  "I choose thoughts that serve me well.",
  "I am open to receiving abundance.",
  "I forgive myself and others with compassion.",
];

export async function GET() {
  try {
    // Return a random affirmation
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    const response = NextResponse.json({
      affirmation: affirmations[randomIndex],
      index: randomIndex,
      total: affirmations.length,
    });
    
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return response;
  } catch (error) {
    console.error('Error fetching affirmation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
