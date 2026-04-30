'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/login' });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-sm text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
      Signing you out...
    </main>
  );
}
