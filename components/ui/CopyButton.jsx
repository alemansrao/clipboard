'use client';

import { useState } from 'react';
import { MdOutlineContentCopy } from 'react-icons/md';

export default function CopyButton({ text, label = '' }) {
  const [message, setMessage] = useState('');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setMessage('Copied');

    } catch {
      setMessage('Unable to copy');
    }

    window.setTimeout(() => setMessage(''), 10000);
  }

  return (
    <div className="flex items-center gap-3">
      {message ? (
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {message}
        </span>
      ) : null}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
        aria-label={label}
      >
        <MdOutlineContentCopy className="h-4 w-4" />
        {label}
      </button>

    </div>
  );
}