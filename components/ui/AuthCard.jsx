import Link from 'next/link';

export default function AuthCard({ title, subtitle, footerText, footerLink, footerLabel, children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Clipboard Vault</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{title}</h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        </div>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
          {footerText} <Link href={footerLink} className="font-medium text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50">{footerLabel}</Link>
        </div>
      </div>
    </main>
  );
}
