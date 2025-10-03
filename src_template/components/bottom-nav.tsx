
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Users,
  Flag,
  MessageCircle,
  User,
  Calendar,
  Search,
  Gamepad2,
  Vote,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Feed', icon: LayoutGrid },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/races', label: 'Speed Dating', icon: Flag },
  { href: '/tire-slayer', label: 'Tire Slayer', icon: Flame },
  { href: '/vote', label: 'Vote', icon: Vote },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full max-w-lg grid-cols-6 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex flex-col items-center justify-center px-5 hover:bg-muted group',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
