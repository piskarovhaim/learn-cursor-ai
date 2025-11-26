import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Welcome to your FlashyCardy dashboard
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <p className="text-center text-zinc-600 dark:text-zinc-400">
              Your flashcard decks will appear here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

