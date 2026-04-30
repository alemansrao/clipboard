'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusBanner from '@/components/ui/StatusBanner';

export default function CreatePostForm() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState('success');
  const formRef = useRef(null);
  const remaining = useMemo(() => 5000 - content.length, [content.length]);

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const trimmedText = text.trim();

      if (!trimmedText || submitting) return;

      setContent(text);

      setSubmitting(true);
      setMessage('');

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmedText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to create item.');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setTone('error');
      setMessage(error.message || 'Unable to create item.');
    } finally {
      setSubmitting(false);
    }
  };


  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to create item.');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setTone('error');
      setMessage(error.message || 'Unable to create item.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <label className="block">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Content</span>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Paste your content here"
          rows={14}
          maxLength={5000}
          className="mt-3 w-full rounded-2xl border border-zinc-200 bg-transparent px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
        />
      </label>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className={`text-xs ${remaining < 0 ? 'text-red-600 dark:text-red-300' : 'text-zinc-500 dark:text-zinc-400'}`}>
          {remaining} characters remaining
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={pasteFromClipboard}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Paste from clipboard
          </button>
          <button
            type="submit"
            disabled={submitting || !content.trim() || remaining < 0}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
          >
            {submitting ? 'Saving…' : 'Save item'}
          </button>
        </div>
      </div>

      {message ? <div className="mt-4"><StatusBanner tone={tone} message={message} /></div> : null}
    </form>
  );
}
