import { db } from '@/db';
import { decksTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Get all decks for a specific user with their cards
 */
export async function getUserDecks(userId: string) {
  return await db.query.decksTable.findMany({
    where: eq(decksTable.userId, userId),
    with: {
      cards: true,
    },
    orderBy: (decks, { desc }) => [desc(decks.updatedAt)],
  });
}

/**
 * Get a single deck by ID for a specific user
 */
export async function getDeckById(deckId: number, userId: string) {
  const deck = await db.query.decksTable.findFirst({
    where: and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ),
    with: {
      cards: true,
    },
  });
  
  return deck || null;
}

/**
 * Create a new deck for a user
 */
export async function createDeck(data: {
  userId: string;
  name: string;
  description?: string;
}) {
  const [newDeck] = await db.insert(decksTable)
    .values({
      userId: data.userId,
      name: data.name,
      description: data.description,
    })
    .returning();

  return newDeck;
}

/**
 * Delete a deck
 * Verifies ownership before deletion
 * Cards will be automatically deleted due to cascade foreign key constraint
 */
export async function deleteDeck(deckId: number, userId: string) {
  // Verify the deck exists and belongs to the user
  const deck = await getDeckById(deckId, userId);

  if (!deck) {
    throw new Error('Deck not found or unauthorized');
  }

  // Delete the deck (cards will cascade delete automatically)
  await db.delete(decksTable)
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ));
}

