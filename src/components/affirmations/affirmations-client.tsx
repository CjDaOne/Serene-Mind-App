'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Heart } from 'lucide-react';

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
    "Every day is a new opportunity to grow."
];

export default function AffirmationsClient() {
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);

  const showNextAffirmation = () => {
    setCurrentAffirmationIndex((prevIndex) => (prevIndex + 1) % affirmations.length);
  };

  const toggleFavorite = () => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(currentAffirmationIndex)) {
        return prevFavorites.filter((index) => index !== currentAffirmationIndex);
      } else {
        return [...prevFavorites, currentAffirmationIndex];
      }
    });
  };

  const isFavorite = favorites.includes(currentAffirmationIndex);

  return (
    <div className="flex flex-col gap-8 items-center text-center">
      <div>
        <h1 className="text-3xl font-bold font-headline">Daily Affirmations</h1>
        <p className="text-muted-foreground">Start your day with a positive mindset.</p>
      </div>

      <Card className="w-full max-w-2xl bg-primary/20 border-primary/30">
        <CardContent className="p-8 flex flex-col items-center gap-6">
          <p className="text-2xl font-semibold text-primary-foreground">
            "{affirmations[currentAffirmationIndex]}"
          </p>
        </CardContent>
      </Card>
      
      <div className="flex items-center gap-4">
        <Button onClick={showNextAffirmation} variant="outline" size="lg">
          <RefreshCw className="w-5 h-5 mr-2" />
          New Affirmation
        </Button>
        <Button onClick={toggleFavorite} variant={isFavorite ? 'secondary' : 'ghost'} size="icon">
          <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
          <span className="sr-only">Favorite</span>
        </Button>
      </div>

      {favorites.length > 0 && (
        <div className="w-full max-w-2xl mt-8">
            <h2 className="text-2xl font-bold font-headline mb-4">Your Favorites</h2>
            <div className="space-y-4">
                {favorites.map((favIndex) => (
                    <Card key={favIndex}>
                        <CardContent className="p-4">
                            <p className="text-center font-medium">{affirmations[favIndex]}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
