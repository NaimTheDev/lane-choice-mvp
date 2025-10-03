
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToConduct, setAgreedToConduct] = useState(false);
  const [agreedToAge, setAgreedToAge] = useState(false);
  const [isNotARobot, setIsNotARobot] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    if (!agreedToTerms || !agreedToConduct || !agreedToAge) {
      toast({
        title: 'Error',
        description: 'Please agree to all terms and conditions.',
        variant: 'destructive',
      });
      return;
    }
    if (!isNotARobot) {
      toast({
        title: 'Verification Required',
        description: 'Please confirm you are not a robot.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Create user document in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        id: user.uid,
        name: fullName,
        handle: username,
        email: user.email,
        avatarUrl: `https://placehold.co/100x100?text=${username.charAt(0)}`,
        coverUrl: "https://placehold.co/1200x300",
        isPrivate: false,
        followerCount: 0,
        followingCount: 0,
        createdAt: new Date(),
      });

      toast({
        title: 'Account Created!',
        description: 'Welcome to Lane Choice!',
      });

      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Sign Up Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSignUp}>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create an account to join the community.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                @
              </span>
              <Input
                id="username"
                placeholder="yourusername"
                className="pl-7"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[^a-zA-Z0-9_.]/g, ''))
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="items-top flex space-x-2">
              <Checkbox
                id="age"
                checked={agreedToAge}
                onCheckedChange={(checked) => setAgreedToAge(Boolean(checked))}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="age"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I confirm that I am 18 years of age or older.
                </label>
              </div>
            </div>
            <div className="items-top flex space-x-2">
              <Checkbox
                id="conduct"
                checked={agreedToConduct}
                onCheckedChange={(checked) =>
                  setAgreedToConduct(Boolean(checked))
                }
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="conduct"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{' '}
                  <Link
                    href="/terms#acceptable-use"
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    Acceptable Use & User Conduct Agreement
                  </Link>
                  .
                </label>
              </div>
            </div>
            <div className="items-top flex space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(Boolean(checked))
                }
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{' '}
                  <Link
                    href="/terms#terms-and-conditions"
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    Terms and Conditions of Use
                  </Link>
                  .
                </label>
              </div>
            </div>
             <div className="items-top flex space-x-2">
              <Checkbox
                id="robot"
                checked={isNotARobot}
                onCheckedChange={(checked) => setIsNotARobot(Boolean(checked))}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="robot"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I am not a robot.
                </label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading || !agreedToTerms || !agreedToConduct || !agreedToAge || !isNotARobot
            }
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Log In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

