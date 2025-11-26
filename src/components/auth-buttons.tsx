'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SignIn, SignUp } from '@clerk/nextjs';

export function AuthButtons() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {/* Sign In with Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Sign In</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Sign in to your account to continue
            </DialogDescription>
          </DialogHeader>
          <SignIn 
            routing="virtual"
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
          />
        </DialogContent>
      </Dialog>

      {/* Sign Up with Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Sign Up</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>
              Create a new account to get started
            </DialogDescription>
          </DialogHeader>
          <SignUp 
            routing="virtual"
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

