'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { 
  createCard as dbCreateCard,
  updateCard as dbUpdateCard,
  deleteCard as dbDeleteCard
} from '@/db/queries/cards';

// Create card schema
const createCardSchema = z.object({
  deckId: z.number().int().positive(),
  front: z.string().min(1, 'Front text is required').max(1000, 'Front text is too long'),
  back: z.string().min(1, 'Back text is required').max(1000, 'Back text is too long'),
});

type CreateCardInput = z.infer<typeof createCardSchema>;

export async function createCard(input: CreateCardInput) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Validate input
  const validatedInput = createCardSchema.parse(input);

  // Create card
  const newCard = await dbCreateCard({
    userId,
    deckId: validatedInput.deckId,
    front: validatedInput.front,
    back: validatedInput.back,
  });

  // Revalidate the deck page to show the new card
  revalidatePath(`/decks/${validatedInput.deckId}`);

  return newCard;
}

// Update card schema
const updateCardSchema = z.object({
  cardId: z.number().int().positive(),
  front: z.string().min(1, 'Front text is required').max(1000, 'Front text is too long'),
  back: z.string().min(1, 'Back text is required').max(1000, 'Back text is too long'),
});

type UpdateCardInput = z.infer<typeof updateCardSchema>;

export async function updateCard(input: UpdateCardInput) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Validate input
  const validatedInput = updateCardSchema.parse(input);

  // Update card
  const updatedCard = await dbUpdateCard({
    userId,
    cardId: validatedInput.cardId,
    front: validatedInput.front,
    back: validatedInput.back,
  });

  // Revalidate the deck page to show the updated card
  revalidatePath(`/decks/${updatedCard.deckId}`);

  return updatedCard;
}

// Delete card schema
const deleteCardSchema = z.object({
  cardId: z.number().int().positive(),
  deckId: z.number().int().positive(),
});

type DeleteCardInput = z.infer<typeof deleteCardSchema>;

export async function deleteCard(input: DeleteCardInput) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Validate input
  const validatedInput = deleteCardSchema.parse(input);

  // Delete card
  await dbDeleteCard(validatedInput.cardId, userId);

  // Revalidate the deck page to remove the deleted card
  revalidatePath(`/decks/${validatedInput.deckId}`);
}

