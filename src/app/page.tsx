import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { AuthButtons } from "@/components/auth-buttons";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <main className="flex flex-col items-center justify-center gap-8 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-black dark:text-white">
            FlashyCardy
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Your personal flashcard platform
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          {userId ? (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <AuthButtons />
          )}
        </div>
      </main>
    </div>
  );
}
