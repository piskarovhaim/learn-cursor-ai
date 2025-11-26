import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDeckById } from '@/db/queries/decks';
import { Button } from '@/components/ui/button';
import { DeckHeader, FlashcardList, DeckNotFound, DeleteDeckButton } from '@/app/decks/components';
import Link from 'next/link';

interface DeckPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
  // Check authentication
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  // Get deck ID from params
  const { deckId } = await params;
  const deckIdNumber = parseInt(deckId, 10);

  // Validate deck ID
  if (isNaN(deckIdNumber)) {
    redirect('/dashboard');
  }

  // Fetch deck with cards
  const deck = await getDeckById(deckIdNumber, userId);

  // Handle deck not found
  if (!deck) {
    return <DeckNotFound />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button and action buttons */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
        <div className="flex items-center gap-2">
          {deck.cards.length > 0 && (
            <Link href={`/decks/${deck.id}/study`}>
              <Button>Study Deck</Button>
            </Link>
          )}
          <DeleteDeckButton deckId={deck.id} deckName={deck.name} />
        </div>
      </div>

      {/* Deck header */}
      <DeckHeader
        name={deck.name}
        description={deck.description}
        cardCount={deck.cards.length}
        createdAt={deck.createdAt}
      />

      {/* Cards section */}
      <FlashcardList deckId={deck.id} cards={deck.cards} />
    </div>
  );
}

