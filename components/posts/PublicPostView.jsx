import Link from 'next/link';
import CopyButton from '../ui/CopyButton.jsx';

export default function PublicPostView({ post }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-10 text-zinc-950 dark:text-zinc-50">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Shared clipboard item
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              {post.shareId}
            </h1>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Created on {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>

          <div className='flex flex-row items-center gap-2'>
            <CopyButton text={post.content} />
            <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
          >
            Open app
          </Link>
          </div>
        </div>

        

        <pre className="mt-6 whitespace-pre-wrap wrap-anywhere rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
          {post.content}
        </pre>
      </section>
    </main>
  );
}