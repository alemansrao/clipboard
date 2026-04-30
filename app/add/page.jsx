import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AppShell from '@/components/layout/AppShell';
import CreatePostForm from '@/components/posts/CreatePostForm';

export default async function AddPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.userId) {
    redirect('/login');
  }

  return (
    <AppShell session={session}>
      <section className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Create</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Save something worth keeping</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Paste a note, snippet, or temporary content. Everything is stored privately under your account.
          </p>
        </div>
        <CreatePostForm />
      </section>
    </AppShell>
  );
}
