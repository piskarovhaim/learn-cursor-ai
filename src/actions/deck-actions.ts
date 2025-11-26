'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { 
  createDeck as dbCreateDeck,
  deleteDeck as dbDeleteDeck
} from '@/db/queries/decks';

// Create deck schema
const createDeckSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
});

type CreateDeckInput = z.infer<typeof createDeckSchema>;

export async function createDeck(input: CreateDeckInput) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Validate input
  const validatedInput = createDeckSchema.parse(input);

  // Create deck
  const newDeck = await dbCreateDeck({
    userId,
    name: validatedInput.name,
    description: validatedInput.description,
  });

  // Revalidate the dashboard to show the new deck
  revalidatePath('/dashboard');
  // Also revalidate the deck page in case user navigates there
  revalidatePath(`/decks/${newDeck.id}`);

  return newDeck;
}

// Delete deck schema
const deleteDeckSchema = z.object({
  deckId: z.number().int().positive(),
});

type DeleteDeckInput = z.infer<typeof deleteDeckSchema>;

export async function deleteDeck(input: DeleteDeckInput) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Validate input
  const validatedInput = deleteDeckSchema.parse(input);

  // Delete deck (cards will cascade delete automatically)
  await dbDeleteDeck(validatedInput.deckId, userId);

  // Revalidate the dashboard to remove the deleted deck
  revalidatePath('/dashboard');
  // Also revalidate the deck page in case user is on that page
  revalidatePath(`/decks/${validatedInput.deckId}`);

  // Redirect to dashboard after deletion
  redirect('/dashboard');
}

