import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  // Redirect to home if not authenticated (middleware will handle auth)
  if (!userId) {
    redirect("/");
  }

  // Get user details
  const user = await currentUser();

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome back!</h2>
          <div className="space-y-2">
            <p className="text-gray-300">
              <span className="font-medium">Name:</span>{" "}
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-gray-300">
              <span className="font-medium">Email:</span>{" "}
              {user?.emailAddresses[0]?.emailAddress}
            </p>
            <p className="text-gray-300">
              <span className="font-medium">User ID:</span> {userId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Protected Content</h3>
            <p className="text-gray-400">
              This page is only accessible to authenticated users.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Account Status</h3>
            <p className="text-gray-400">
              Your account is active and verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

