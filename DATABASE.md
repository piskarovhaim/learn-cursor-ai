# Database Setup with Drizzle ORM

This project uses [Drizzle ORM](https://orm.drizzle.team/) with a [Neon Postgres](https://neon.tech/) database.

## Project Structure

```
├── drizzle/                 # Migration files (auto-generated)
├── src/
│   ├── db/
│   │   ├── index.ts        # Database connection instance
│   │   └── schema.ts       # Database schema definitions
│   └── index.ts            # Example CRUD operations
├── .env                    # Environment variables (not committed)
├── .env.example            # Environment variables template
└── drizzle.config.ts       # Drizzle Kit configuration
```

## Getting Started

### 1. Environment Variables

Copy `.env.example` to `.env` and add your Neon database connection string:

```bash
cp .env.example .env
```

Then edit `.env` with your actual database URL from Neon.

### 2. Push Schema to Database

To apply your schema to the database:

```bash
npm run db:push
```

This is the fastest way to sync your schema during development.

## Available Scripts

- `npm run db:push` - Push schema changes directly to the database (recommended for development)
- `npm run db:generate` - Generate SQL migration files from schema changes
- `npm run db:migrate` - Apply generated migrations to the database
- `npm run db:studio` - Open Drizzle Studio to browse and edit your database
- `npm run db:seed` - Run the seed file (`src/index.ts`)

## Database Schema

This flashcard app uses the following tables:

### Decks Table
- `id` - Auto-incrementing primary key
- `userId` - Clerk user ID (varchar)
- `name` - Deck name (e.g., "Indonesian Language", "British History")
- `description` - Optional deck description
- `createdAt` - Timestamp when deck was created
- `updatedAt` - Timestamp when deck was last updated

### Cards Table
- `id` - Auto-incrementing primary key
- `deckId` - Foreign key to decks table (cascade on delete)
- `front` - Front of the card (e.g., "Dog", "When was the battle of hastings?")
- `back` - Back of the card (e.g., "Anjing", "1066")
- `createdAt` - Timestamp when card was created
- `updatedAt` - Timestamp when card was last updated

## Using the Database in Your App

### Import the database instance

```typescript
import { db } from '@/db';
import { decksTable, cardsTable } from '@/db/schema';
```

### Query Examples

```typescript
import { eq } from 'drizzle-orm';

// Create a new deck
const [newDeck] = await db.insert(decksTable).values({
  userId: 'user_clerk_id_here',
  name: 'Indonesian Language',
  description: 'Learn basic Indonesian words',
}).returning();

// Get all decks for a user
const userDecks = await db
  .select()
  .from(decksTable)
  .where(eq(decksTable.userId, 'user_clerk_id_here'));

// Create a new card in a deck
await db.insert(cardsTable).values({
  deckId: newDeck.id,
  front: 'Dog',
  back: 'Anjing',
});

// Get all cards for a deck
const cards = await db
  .select()
  .from(cardsTable)
  .where(eq(cardsTable.deckId, newDeck.id));

// Update a card
await db
  .update(cardsTable)
  .set({ 
    front: 'Cat', 
    back: 'Kucing',
    updatedAt: new Date()
  })
  .where(eq(cardsTable.id, 1));

// Delete a deck (cards will be automatically deleted due to cascade)
await db
  .delete(decksTable)
  .where(eq(decksTable.id, newDeck.id));
```

## Adding New Features

You might want to extend the schema to add features like:
- Progress tracking (cards studied, correct/incorrect counts)
- Study sessions
- Card tags or categories
- Spaced repetition scheduling

Example of adding a study progress table:

```typescript
export const studyProgressTable = pgTable("study_progress", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull(),
  cardId: integer().notNull().references(() => cardsTable.id, { onDelete: "cascade" }),
  lastStudied: timestamp().notNull().defaultNow(),
  correctCount: integer().notNull().default(0),
  incorrectCount: integer().notNull().default(0),
});
```

After editing `src/db/schema.ts`, push changes to the database:

```bash
npm run db:push
```

## Migration Workflow (Production)

For production, use migrations instead of push:

1. Generate migration files:
```bash
npm run db:generate
```

2. Review the generated SQL in `drizzle/` folder

3. Apply migrations:
```bash
npm run db:migrate
```

## Drizzle Studio

To visually browse and edit your database:

```bash
npm run db:studio
```

This will open a web interface at `https://local.drizzle.studio`.

## Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Neon Docs](https://neon.tech/docs/introduction)
- [Drizzle Kit Docs](https://orm.drizzle.team/kit-docs/overview)

