
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, CreditCard, Moon, Sun, FileText, Check, Star, Flame, Gamepad2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
    </svg>
)

const colorThemes = [
  { name: 'Teal', primary: '180 84% 40%', accent: '180 84% 45%' },
  { name: 'Rose', primary: '346.8 77.2% 49.8%', accent: '346.8 77.2% 54.8%' },
  { name: 'Violet', primary: '262.1 83.3% 57.8%', accent: '262.1 83.3% 62.8%' },
  { name: 'Orange', primary: '24.6 95% 53.1%', accent: '24.6 95% 58.1%' },
  { name: 'Blue', primary: '221.2 83.2% 53.3%', accent: '221.2 83.2% 58.3%' },
];


export default function SettingsPage() {
  const { appUser, user, setAppUser } = useAuth();
  
  const [isPrivate, setIsPrivate] = React.useState(appUser?.isPrivate || false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = React.useState(false);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const subscriptionTier = appUser?.subscriptionTier || 'free';
  const isProSubscriber = subscriptionTier === 'pro';

  React.useEffect(() => {
    if (appUser) {
        setIsPrivate(appUser.isPrivate || false);
    }
  }, [appUser]);

  const handleSubscribe = (tier: 'player' | 'enthusiast' | 'pro') => {
    if (appUser && setAppUser) {
        setAppUser({...appUser, subscriptionTier: tier});
    }
    setShowSubscriptionDialog(false);
    toast({
        title: 'Subscription Successful!',
        description: `You now have access to all ${tier} features.`,
    });
  };

  const handlePrivacyChange = async (checked: boolean) => {
    if (checked && !isProSubscriber) {
      setShowSubscriptionDialog(true);
      return; 
    }
    
    if (!user) {
        toast({ title: 'Error', description: 'You must be logged in.', variant: 'destructive'});
        return;
    }

    setIsPrivate(checked);
    const userDocRef = doc(db, 'users', user.uid);
    try {
        await updateDoc(userDocRef, { isPrivate: checked });
        toast({
          title: 'Privacy Settings Updated',
          description: `Your account is now ${checked ? 'private' : 'public'}.`,
        });
    } catch (error) {
        console.error("Failed to update privacy setting:", error);
        toast({ title: 'Error', description: 'Could not update privacy setting.', variant: 'destructive'});
        setIsPrivate(!checked); // Revert UI on failure
    }
  };
  
  const handleThemeColorChange = async (themeName: string) => {
     if (!user || !isProSubscriber) {
        toast({ title: 'Pro Feature', description: 'Only Pro Enthusiasts can change the app theme.', variant: 'destructive'});
        return;
    }
    const userDocRef = doc(db, 'users', user.uid);
    try {
        await updateDoc(userDocRef, { themeColor: themeName.toLowerCase() });
         toast({
          title: 'Theme Updated!',
          description: `Your app theme is now set to ${themeName}.`,
        });
    } catch (error) {
        console.error("Failed to update theme color:", error);
        toast({ title: 'Error', description: 'Could not update your theme.', variant: 'destructive'});
    }
  }

  const handleCancelSubscription = () => {
    setShowCancelDialog(false);
    if (appUser && setAppUser) {
        setAppUser({...appUser, subscriptionTier: 'free', isPrivate: false });
    }
    setIsPrivate(false);
    toast({
      title: 'Subscription Cancelled',
      description: 'Your premium subscription has been cancelled.',
    });
  }

  const handleSaveSocials = async () => {
    if (!user || !appUser) return;
    
    const instagramInput = document.getElementById('instagram-link') as HTMLInputElement;
    const newInstagramUrl = instagramInput.value;

    const userDocRef = doc(db, 'users', user.uid);
    try {
        await updateDoc(userDocRef, { instagramUrl: newInstagramUrl });
        toast({
            title: 'Socials Updated',
            description: 'Your Instagram link has been saved.'
        });
    } catch (error) {
         toast({
            title: 'Error',
            description: 'Could not save your Instagram link.',
            variant: 'destructive',
        });
    }
  }

  return (
    <>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>
              Select a theme for the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {mounted && (
                <div className="grid grid-cols-3 gap-4">
                  <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')}>
                    System
                  </Button>
              </div>
             )}
          </CardContent>
        </Card>

        {isProSubscriber && (
          <Card>
            <CardHeader>
                <CardTitle>App Appearance</CardTitle>
                <CardDescription>Customize the look of the app. This is a Pro Enthusiast feature.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4">
                    {colorThemes.map((colorTheme) => {
                        const isActive = (appUser?.themeColor || 'teal') === colorTheme.name.toLowerCase();
                        return (
                            <Button
                                key={colorTheme.name}
                                variant={isActive ? 'default' : 'outline'}
                                onClick={() => handleThemeColorChange(colorTheme.name)}
                                className="flex items-center gap-2"
                            >
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${colorTheme.primary})` }} />
                                {colorTheme.name}
                                {isActive && <Check className="h-4 w-4" />}
                            </Button>
                        )
                    })}
                </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Account Privacy</CardTitle>
            <CardDescription>
              Change your account privacy settings here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
              <Label htmlFor="private-account" className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <span>Private Account</span>
                   {!isProSubscriber && <Badge variant="outline" className="text-primary border-primary flex items-center gap-1"><Zap className="h-3 w-3" /> Pro</Badge>}
                </div>
                <span className="font-normal leading-snug text-muted-foreground">
                  When your account is private, only people you approve can see your photos and posts.
                </span>
              </Label>
              <Switch
                id="private-account"
                checked={isPrivate}
                onCheckedChange={handlePrivacyChange}
                aria-readonly={!isProSubscriber}
                disabled={!isProSubscriber}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Linked Accounts</CardTitle>
                <CardDescription>Link your social media accounts to your profile.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="instagram-link">Instagram Profile</Label>
                    <div className="relative">
                        <InstagramIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="instagram-link" placeholder="https://instagram.com/your-username" className="pl-10" defaultValue={appUser?.instagramUrl} />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSaveSocials}>Save Socials</Button>
            </CardFooter>
        </Card>

        {subscriptionTier !== 'free' ? (
           <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>
                  You are currently on the <span className="font-bold capitalize">{subscriptionTier}</span> plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                       <CreditCard className="h-6 w-6 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">Lane Choice {subscriptionTier === 'player' ? 'Player' : subscriptionTier === 'enthusiast' ? 'Enthusiast' : 'Pro Enthusiast'}</p>
                            <p className="text-sm text-muted-foreground">Billed monthly. Renews next on Sep 1, 2025.</p>
                        </div>
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <Button variant="destructive" onClick={() => setShowCancelDialog(true)}>Cancel Subscription</Button>
                <Button onClick={() => setShowSubscriptionDialog(true)}>Manage Plan</Button>
              </CardFooter>
            </Card>
        ) : (
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap className="text-primary"/> Upgrade Your Ride</CardTitle>
                <CardDescription>
                  Unlock exclusive features by upgrading your plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                    <Button onClick={() => setShowSubscriptionDialog(true)}>View Subscription Plans</Button>
                </div>
              </CardContent>
            </Card>
        )}

        <Card>
            <CardHeader>
                <CardTitle>Legal</CardTitle>
                <CardDescription>View our terms and conditions.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" asChild>
                    <Link href="/terms">
                        <FileText className="mr-2 h-4 w-4" />
                        Terms and Conditions
                    </Link>
                </Button>
            </CardContent>
        </Card>

      </div>

      <AlertDialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade Your Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Choose a plan that fits your need to unlock more features.
            </AlertDialogDescription>
          </AlertDialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                <Card className="flex flex-col">
                  <CardHeader>
                      <Gamepad2 className="h-8 w-8 text-blue-500 mb-2" />
                      <CardTitle>Player</CardTitle>
                      <p className="text-2xl font-bold">$2.99/mo</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Play Drag Race Mini-Game</li>
                          <li>Vote for Car of the Week</li>
                          <li>Access Tire Slayer</li>
                      </ul>
                  </CardContent>
                  <CardFooter>
                      <Button className="w-full" onClick={() => handleSubscribe('player')} disabled={subscriptionTier === 'player'}>
                          {subscriptionTier === 'player' ? 'Current Plan' : 'Subscribe'}
                      </Button>
                  </CardFooter>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader>
                        <Star className="h-8 w-8 text-yellow-500 mb-2" />
                        <CardTitle>Enthusiast</CardTitle>
                        <p className="text-2xl font-bold">$5.99/mo</p>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>All Player features</li>
                            <li>Create Clubs</li>
                            <li>Create Events</li>
                            <li>Enter Car of the Week</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handleSubscribe('enthusiast')} disabled={subscriptionTier === 'enthusiast'}>
                            {subscriptionTier === 'enthusiast' ? 'Current Plan' : 'Subscribe'}
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col border-primary">
                    <CardHeader>
                        <Zap className="h-8 w-8 text-primary mb-2" />
                        <CardTitle>Pro Enthusiast</CardTitle>
                        <p className="text-2xl font-bold">$9.99/mo</p>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>All Enthusiast features</li>
                            <li>Unlimited Swipes in Speed Dating</li>
                            <li>Private Account option</li>
                            <li>Full App Theme Customization</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handleSubscribe('pro')} disabled={subscriptionTier === 'pro'}>
                             {subscriptionTier === 'pro' ? 'Current Plan' : 'Go Pro'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription will remain active until the end of the current billing period. You will lose access to all premium features after that.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
