
'use client';

import Image from 'next/image';
import type { CarOfTheWeekEntry } from '@/lib/types';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Award, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';

type VoteCardProps = {
  entry: CarOfTheWeekEntry;
  onVote: (entryId: string) => void;
  hasVoted: boolean;
  canVote: boolean;
};

export function VoteCard({ entry, onVote, hasVoted, canVote }: VoteCardProps) {
  return (
    <Card>
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full">
          <Image
            src={entry.imageUrl}
            alt={`${entry.carName}`}
            fill
            className="object-cover rounded-t-lg"
            data-ai-hint={entry.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-xl mb-2 flex items-center gap-2">
          <span>{entry.carName}</span>
          {entry.wins && entry.wins > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800">
              <Award className="h-4 w-4 mr-1" />
              {entry.wins > 1 ? `${entry.wins}x Winner` : 'Winner'}
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={entry.user.avatarUrl} alt={entry.user.name} />
                <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold text-sm">{entry.user.name}</p>
                <p className="text-xs text-muted-foreground">@{entry.user.handle}</p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Trophy className="h-5 w-5" />
          <span className="font-bold text-lg">{entry.votes.toLocaleString()}</span>
        </div>
        <Button onClick={() => onVote(entry.id)} disabled={hasVoted || !canVote}>
          {hasVoted ? <CheckCircle className="mr-2 h-4 w-4"/> : null}
          {hasVoted ? 'Voted' : 'Vote'}
        </Button>
      </CardFooter>
    </Card>
  );
}
