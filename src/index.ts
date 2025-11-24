import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { decksTable, cardsTable } from './db/schema';

async function main() {
  // Example: Create a new deck for learning Indonesian
  const deck: typeof decksTable.$inferInsert = {
    userId: 'user_example_clerk_id',
    name: 'Indonesian Language Basics',
    description: 'Learn basic Indonesian words and phrases',
  };

  const [newDeck] = await db.insert(decksTable).values(deck).returning();
  console.log('New deck created:', newDeck);

  // Example: Add cards to the deck
  const cards: typeof cardsTable.$inferInsert[] = [
    {
      deckId: newDeck.id,
      front: 'Dog',
      back: 'Anjing',
    },
    {
      deckId: newDeck.id,
      front: 'Cat',
      back: 'Kucing',
    },
    {
      deckId: newDeck.id,
      front: 'Hello',
      back: 'Halo',
    },
  ];

  await db.insert(cardsTable).values(cards);
  console.log('Cards added to deck!');

  // Example: Get all cards in the deck
  const deckCards = await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.deckId, newDeck.id));
  console.log('All cards in deck:', deckCards);

  // Example: Update a card
  await db
    .update(cardsTable)
    .set({
      front: 'Good morning',
      back: 'Selamat pagi',
      updatedAt: new Date(),
    })
    .where(eq(cardsTable.id, deckCards[0].id));
  console.log('Card updated!');

  // Example: Delete a specific card
  await db.delete(cardsTable).where(eq(cardsTable.id, deckCards[2].id));
  console.log('Card deleted!');

  // Example: Delete the deck (remaining cards will be automatically deleted due to cascade)
  await db.delete(decksTable).where(eq(decksTable.id, newDeck.id));
  console.log('Deck and all its cards deleted!');
}

main();

