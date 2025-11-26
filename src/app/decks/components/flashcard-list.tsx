import { FlashcardCard } from './flashcard-card';
import { EmptyDeckState } from './empty-deck-state';
import { AddCardButton } from './add-card-button';

interface Card {
  id: number;
  front: string;
  back: string;
  createdAt: Date;
}

interface FlashcardListProps {
  deckId: number;
  cards: Card[];
}

export function FlashcardList({ deckId, cards }: FlashcardListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Flashcards</h2>
        <AddCardButton deckId={deckId} />
      </div>

      {cards.length === 0 ? (
        <EmptyDeckState deckId={deckId} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <FlashcardCard
              key={card.id}
              id={card.id}
              deckId={deckId}
              front={card.front}
              back={card.back}
              createdAt={card.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

