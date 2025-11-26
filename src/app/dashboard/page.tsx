import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getUserDecks } from "@/db/queries/decks";
import { AddDeckButton } from "@/app/decks/components";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Fetch user's decks with their cards
  const decks = await getUserDecks(userId);
  
  type DeckWithCards = typeof decks[number];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
              Welcome to your FlashyCardy dashboard
            </p>
          </div>
          <AddDeckButton />
        </div>

        {decks.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <p className="text-center text-zinc-600 dark:text-zinc-400">
                You don&apos;t have any flashcard decks yet. Create your first deck to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck: DeckWithCards) => (
              <Link key={deck.id} href={`/decks/${deck.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">
                      {deck.name}
                    </h2>
                    
                    {deck.description && (
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                        {deck.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-500">
                      <span>{deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'}</span>
                      <span>
                        Updated {new Date(deck.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

