
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Users,
  Calendar,
  User,
  PlusSquare,
  Flag,
  Search,
  Gamepad2,
  Vote,
  Flame,
} from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { useSidebar } from './ui/sidebar';

const navItems = [
  { href: '/', label: 'Feed', icon: LayoutGrid },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/clubs', label: 'Clubs', icon: Users },
  { href: '/races', label: 'Speed Dating', icon: Flag },
  { href: '/game', label: 'Drag Race', icon: Gamepad2 },
  { href: '/vote', label: 'Vote', icon: Vote },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/tire-slayer', label: 'Tire Slayer', icon: Flame },
  { href: '/profile', label: 'Profile', icon: User },
];

export function MainNav() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const isCollapsed = state === 'collapsed';

  return (
    <nav className="flex flex-col gap-2 px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Tooltip key={item.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  buttonVariants({
                    variant: isActive ? 'default' : 'ghost',
                    size: 'icon',
                  }),
                  'h-10 w-10 justify-start',
                  isCollapsed ? 'justify-center' : 'justify-start w-full px-3'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className={cn('ml-3', isCollapsed && 'hidden')}>
                  {item.label}
                </span>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">{item.label}</TooltipContent>
            )}
          </Tooltip>
        );
      })}
      <div className="mt-4">
         <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href="/post/new"
                className={cn(
                  buttonVariants({
                    variant: 'default',
                    size: 'icon',
                  }),
                  'h-10 w-full justify-start bg-accent text-accent-foreground hover:bg-accent/90',
                  isCollapsed ? 'justify-center' : 'justify-start w-full px-3'
                )}
              >
                <PlusSquare className="h-5 w-5" />
                <span className={cn('ml-3', isCollapsed && 'hidden')}>
                  Create Post
                </span>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Create Post</TooltipContent>
            )}
          </Tooltip>
      </div>
    </nav>
  );
}
