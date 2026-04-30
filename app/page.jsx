import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AppShell from '@/components/layout/AppShell';
import Dashboard from '@/components/posts/Dashboard';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.userId) {
    redirect('/login');
  }

  return (
    <AppShell session={session}>
      <Dashboard />
    </AppShell>
  );
}
