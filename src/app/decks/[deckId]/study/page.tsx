import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDeckById } from '@/db/queries/decks';
import { Button } from '@/components/ui/button';
import { DeckNotFound } from '@/app/decks/components';
import Link from 'next/link';
import { StudyFlashcard } from './components/study-flashcard';

interface StudyPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
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

  // Handle empty deck
  if (deck.cards.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href={`/decks/${deck.id}`}>
            <Button variant="outline">← Back to Deck</Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">No Cards to Study</h1>
          <p className="text-muted-foreground mb-6">
            This deck doesn&apos;t have any cards yet. Add some cards to start studying!
          </p>
          <Link href={`/decks/${deck.id}`}>
            <Button>Go to Deck</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <div className="mb-6">
        <Link href={`/decks/${deck.id}`}>
          <Button variant="outline">← Back to Deck</Button>
        </Link>
      </div>

      {/* Study header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">{deck.name}</h1>
        {deck.description && (
          <p className="text-muted-foreground">{deck.description}</p>
        )}
      </div>

      {/* Study flashcard component */}
      <StudyFlashcard cards={deck.cards} />
    </div>
  );
}

