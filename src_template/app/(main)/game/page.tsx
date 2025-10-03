
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Zap, Circle, Flag, Share2, Send, Star, Flame, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth-provider';
import type { User } from '@/lib/types';


type GameState = 'idle' | 'staging' | 'racing' | 'finished';
type LightState = 'off' | 'amber' | 'green' | 'red';
type TreeType = 'sportsman' | 'pro';

export default function GamePage() {
  const [gameState, setGameState] = React.useState<GameState>('idle');
  const [lights, setLights] = React.useState<LightState[]>(['off', 'off', 'off']);
  const [result, setResult] = React.useState<string | null>(null);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = React.useState(false);
  const [treeType, setTreeType] = React.useState<TreeType>('sportsman');
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const [reactionTime, setReactionTime] = React.useState<string | null>(null);
  const { toast } = useToast();
  const { appUser, setAppUser } = useAuth();
  
  const hasAccess = appUser?.subscriptionTier === 'player' || appUser?.subscriptionTier === 'enthusiast' || appUser?.subscriptionTier === 'pro';

  // In a real app, this would be fetched from Firestore.
  const users: User[] = []; 

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!hasAccess) {
      setShowSubscriptionDialog(true);
    }
  }, [hasAccess]);
  
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  const handleSubscribe = (tier: 'player' | 'enthusiast' | 'pro') => {
    if (appUser && setAppUser) {
        setAppUser({...appUser, subscriptionTier: tier});
    }
    setShowSubscriptionDialog(false);
    toast({
        title: 'Subscription Successful!',
        description: `You subscribed to the ${tier} plan and can now play the Drag Race Mini-Game.`,
    });
  }

  const startRace = () => {
    setGameState('staging');
    setResult(null);
    setReactionTime(null);
    setLights(['off', 'off', 'off']);
    
    if (timerRef.current) clearTimeout(timerRef.current);

    if (treeType === 'sportsman') {
      setTimeout(() => setLights(prev => ['amber', prev[1], prev[2]]), 500);
      setTimeout(() => setLights(prev => [prev[0], 'amber', prev[2]]), 1000);
      setTimeout(() => setLights(prev => [prev[0], prev[1], 'amber']), 1500);
      timerRef.current = setTimeout(() => {
        setLights(['off', 'off', 'green']);
        setGameState('racing');
        startTimeRef.current = performance.now();
      }, 2000);
    } else {
      setTimeout(() => setLights(['amber', 'amber', 'amber']), 500);
      timerRef.current = setTimeout(() => {
        setLights(['off', 'off', 'green']);
        setGameState('racing');
        startTimeRef.current = performance.now();
      }, 900);
    }
  };
  
  const handleLaunch = () => {
    if (gameState === 'staging') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('finished');
      setLights(['off', 'off', 'red']);
      setResult('Foul Start! You launched too early.');
      setReactionTime(null);
    } else if (gameState === 'racing') {
      const endTime = performance.now();
      const rt = (endTime - (startTimeRef.current ?? endTime)).toFixed(3);
      setGameState('finished');
      setLights(['off', 'off', 'green']);
      setResult(`Reaction Time: ${rt}ms`);
      setReactionTime(rt);
    }
  };

  const handleSend = () => {
    setShowShareDialog(false);
    toast({
      title: 'Result Sent!',
      description: `Your reaction time has been sent.`,
    });
  };

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-full">
        <AlertDialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
          <AlertDialogContent className="max-w-4xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Zap className="text-primary" />
                Unlock the Drag Race Mini-Game!
              </AlertDialogTitle>
              <AlertDialogDescription>
                The Drag Race Mini-Game is a Player feature. Choose a plan to unlock this and other great benefits.
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
                      <Button className="w-full" onClick={() => handleSubscribe('player')}>Subscribe</Button>
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
                        <Button className="w-full" onClick={() => handleSubscribe('enthusiast')}>Subscribe</Button>
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
                        <Button className="w-full" onClick={() => handleSubscribe('pro')}>Go Pro</Button>
                    </CardFooter>
                </Card>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
         <Card className="max-w-md mx-auto text-center">
            <CardHeader>
                <CardTitle>Drag Race Mini-Game</CardTitle>
                <CardDescription>This is a premium feature.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Subscribe to play!</p>
            </CardContent>
             <CardFooter>
                <Button onClick={() => setShowSubscriptionDialog(true)}>Unlock Game</Button>
            </CardFooter>
         </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-2 font-headline">Drag Race</h1>
        <p className="text-muted-foreground mb-6">Test your reaction time. Hit launch on green!</p>
        
        <div className="flex items-center space-x-2 mb-6">
          <Label htmlFor="tree-type" className={cn(treeType === 'sportsman' && 'text-primary')}>Sportsman Tree</Label>
          <Switch
            id="tree-type"
            checked={treeType === 'pro'}
            onCheckedChange={(checked) => setTreeType(checked ? 'pro' : 'sportsman')}
            disabled={gameState !== 'idle' && gameState !== 'finished'}
          />
          <Label htmlFor="tree-type" className={cn(treeType === 'pro' && 'text-primary')}>Pro Tree</Label>
        </div>


        <Card className="w-full max-w-xs">
          <CardContent className="p-6">
            <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center gap-4 w-24 mx-auto">
              <Circle className={cn('h-12 w-12 text-gray-600 transition-colors', lights[0] === 'amber' && 'text-amber-400')} />
              <Circle className={cn('h-12 w-12 text-gray-600 transition-colors', lights[1] === 'amber' && 'text-amber-400')} />
              <Circle className={cn('h-12 w-12 text-gray-600 transition-colors', (lights[2] === 'amber' && 'text-amber-400') || (lights[2] === 'red' && 'text-red-500'))} />
              <Circle className={cn('h-12 w-12 transition-colors', lights[2] === 'green' ? 'text-green-500' : 'text-gray-600')} />
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 w-full max-w-xs">
          {gameState === 'idle' || gameState === 'finished' ? (
              <Button onClick={startRace} className="w-full h-16 text-lg">
                  <Flag className="mr-2 h-6 w-6" /> Start Race
              </Button>
          ) : (
              <Button onClick={handleLaunch} className="w-full h-16 text-lg bg-green-600 hover:bg-green-700">
                  <Zap className="mr-2 h-6 w-6" /> Launch
              </Button>
          )}
        </div>

        {result && (
          <Card className="mt-6 w-full max-w-xs">
              <CardHeader>
                  <CardTitle>Result</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-2xl font-bold">{result}</p>
              </CardContent>
              {reactionTime && (
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setShowShareDialog(true)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Result
                    </Button>
                </CardFooter>
              )}
          </Card>
        )}
      </div>
      
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Result</DialogTitle>
            <DialogDescription>
              Share your reaction time of {reactionTime}ms with a friend.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4 max-h-60 overflow-y-auto">
            {appUser && users.filter(u => u.id !== appUser.id).map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                 <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">@{user.handle}</p>
                    </div>
                  </div>
                <Button onClick={handleSend} variant="secondary">
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
