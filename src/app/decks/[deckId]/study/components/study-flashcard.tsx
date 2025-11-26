'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shuffle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Card {
  id: number;
  front: string;
  back: string;
}

interface StudyFlashcardProps {
  cards: Card[];
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function StudyFlashcard({ cards }: StudyFlashcardProps) {
  const [shuffledCards, setShuffledCards] = useState<Card[]>(() => shuffleArray(cards));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = shuffledCards[currentIndex];
  const cardNumber = currentIndex + 1;
  const totalCards = shuffledCards.length;
  const progress = ((cardNumber / totalCards) * 100);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for spacebar to avoid page scrolling
      if (event.key === ' ') {
        event.preventDefault();
        setIsFlipped((prev) => !prev);
        return;
      }

      // Handle arrow keys
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
          setIsFlipped(false);
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (currentIndex < shuffledCards.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setIsFlipped(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, shuffledCards.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, shuffledCards.length]);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleShuffle = () => {
    const newShuffled = shuffleArray(cards);
    setShuffledCards(newShuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!currentCard) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar and controls */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Badge variant="secondary" className="text-sm px-4 py-1">
            Card {cardNumber} of {totalCards}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShuffle}
            className="shrink-0"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Shuffle
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <Card 
        className="min-h-[400px] cursor-pointer transition-all hover:shadow-lg"
        onClick={handleFlip}
      >
        <CardContent className="flex items-center justify-center h-full min-h-[400px] p-8">
          <div className="text-center w-full">
            {!isFlipped ? (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                  Front
                </p>
                <p className="text-2xl md:text-3xl font-medium leading-relaxed">
                  {currentCard.front}
                </p>
                <p className="text-xs text-muted-foreground mt-6">
                  Press Spacebar or click to flip
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                  Back
                </p>
                <p className="text-2xl md:text-3xl font-medium leading-relaxed">
                  {currentCard.back}
                </p>
                <p className="text-xs text-muted-foreground mt-6">
                  Press Spacebar or click to flip
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation controls */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1"
        >
          ← Previous
        </Button>

        <Button
          variant="outline"
          onClick={handleFlip}
          className="flex-1"
        >
          {isFlipped ? 'Show Front' : 'Show Back'}
        </Button>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === shuffledCards.length - 1}
          className="flex-1"
        >
          Next →
        </Button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Keyboard shortcuts: ← Previous | → Next | Spacebar Flip
        </p>
      </div>
    </div>
  );
}

