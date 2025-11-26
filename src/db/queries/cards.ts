import { db } from '@/db';
import { cardsTable, decksTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Create a new card in a deck
 * Verifies that the deck belongs to the user before creating the card
 */
export async function createCard(data: {
  deckId: number;
  userId: string;
  front: string;
  back: string;
}) {
  // First, verify the deck exists and belongs to the user
  const deck = await db.query.decksTable.findFirst({
    where: and(
      eq(decksTable.id, data.deckId),
      eq(decksTable.userId, data.userId)
    ),
  });

  if (!deck) {
    throw new Error('Deck not found or unauthorized');
  }

  // Create the card
  const [newCard] = await db.insert(cardsTable)
    .values({
      deckId: data.deckId,
      front: data.front,
      back: data.back,
    })
    .returning();

  // Update the deck's updatedAt timestamp
  await db.update(decksTable)
    .set({ updatedAt: new Date() })
    .where(eq(decksTable.id, data.deckId));

  return newCard;
}

/**
 * Update an existing card
 * Verifies ownership through the deck relationship
 */
export async function updateCard(data: {
  cardId: number;
  userId: string;
  front: string;
  back: string;
}) {
  // Verify the card exists and belongs to a deck owned by the user
  const card = await db.query.cardsTable.findFirst({
    where: eq(cardsTable.id, data.cardId),
    with: {
      deck: true,
    },
  });

  if (!card || card.deck.userId !== data.userId) {
    throw new Error('Card not found or unauthorized');
  }

  // Update the card
  const [updatedCard] = await db.update(cardsTable)
    .set({
      front: data.front,
      back: data.back,
      updatedAt: new Date(),
    })
    .where(eq(cardsTable.id, data.cardId))
    .returning();

  // Update the deck's updatedAt timestamp
  await db.update(decksTable)
    .set({ updatedAt: new Date() })
    .where(eq(decksTable.id, card.deckId));

  return updatedCard;
}

/**
 * Delete a card
 * Verifies ownership through the deck relationship
 */
export async function deleteCard(cardId: number, userId: string) {
  // Verify the card exists and belongs to a deck owned by the user
  const card = await db.query.cardsTable.findFirst({
    where: eq(cardsTable.id, cardId),
    with: {
      deck: true,
    },
  });

  if (!card || card.deck.userId !== userId) {
    throw new Error('Card not found or unauthorized');
  }

  // Delete the card
  await db.delete(cardsTable)
    .where(eq(cardsTable.id, cardId));

  // Update the deck's updatedAt timestamp
  await db.update(decksTable)
    .set({ updatedAt: new Date() })
    .where(eq(decksTable.id, card.deckId));
}

