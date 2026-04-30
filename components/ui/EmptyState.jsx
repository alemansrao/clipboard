import Link from 'next/link';

export default function EmptyState({ title, description, actionHref, actionLabel }) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
