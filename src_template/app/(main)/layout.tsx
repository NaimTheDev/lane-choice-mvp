
'use client';

import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { Logo } from '@/components/logo';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  useSidebar,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Notifications } from '@/components/notifications';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

function MainPanel({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const router = useRouter();

  return (
    <div
      className={cn(
        'transition-[margin-left] duration-200 ease-linear',
        'md:ml-[var(--sidebar-width-icon)]',
        state === 'expanded' && 'md:ml-[var(--sidebar-width)]'
      )}
    >
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <div className="md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg">Lane Choice</span>
          </Link>
        </div>
        <div className="relative flex-1 md:grow-0">
           <Button variant="ghost" size="icon" className="rounded-full md:hidden" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>
          <div className="relative flex-1 hidden md:flex">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[336px]"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        router.push(`/search?q=${target.value}`);
                    }
                }}
             />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/events">
              <Calendar className="h-5 w-5" />
              <span className="sr-only">Events</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/messages">
              <MessageCircle className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Link>
          </Button>
          <Notifications />
          <UserNav />
        </div>
      </header>
      <main className="flex-1 p-6 pb-20 sm:p-6 sm:pb-20 md:p-8">
        {children}
      </main>
    </div>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <div className="hidden md:block">
          <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader className="p-4">
              <Link
                href="/"
                className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center"
              >
                <Logo className="h-8 w-8 text-primary" />
                <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
                  Lane Choice
                </span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
            </SidebarContent>
          </Sidebar>
        </div>

        <MainPanel>{children}</MainPanel>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
