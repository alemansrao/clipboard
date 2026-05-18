'use client';

import { useMemo, useState } from 'react';
import { FiCopy, FiExternalLink, FiHeart, FiTrash2 } from 'react-icons/fi';
import StatusBanner from '@/components/ui/StatusBanner';

export default function PostCard({ post, onDelete, onToggleFavorite }) {
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState('success');
  const [expanded, setExpanded] = useState(false);

  const preview = useMemo(() => {
    if (expanded || post.content.length <= 180) {
      return post.content;
    }
    return `${post.content.slice(0, 180)}…`;
  }, [expanded, post.content]);

  function pushMessage(tone, text) {
    setMessageTone(tone);
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2200);
  }

  async function copyContent() {
    try {
      await navigator.clipboard.writeText(post.content);
      pushMessage('success', 'Content copied to clipboard.');
    } catch {
      pushMessage('error', 'Unable to copy content.');
    }
  }

  async function copyLink() {
    try {
      const url = `${window.location.origin}/${post.shareId}`;
      await navigator.clipboard.writeText(url);
      pushMessage('success', 'Share link copied.');
    } catch {
      pushMessage('error', 'Unable to copy share link.');
    }
  }

  return (
    <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-3">
        <div className='flex flex-row gap-2 items-center'>
          <p className="text-s font-medium uppercase tracking-[0.18em] text-blue-400 ">{post.shareId}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!post?._id) {
              setMessageTone('error');
              setMessage('Missing post id.');
              return;
            }

            onToggleFavorite(post._id, !post.favorite);
          }}
          disabled={!post?._id}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${post.favorite
            ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300'
            : 'border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          aria-label={post.favorite ? 'Remove favorite' : 'Mark as favorite'}
        >
          <FiHeart className={post.favorite ? 'fill-current' : ''} />
        </button>
      </div>

      <p className="mt-4 whitespace-pre-wrap wrap-anywhere text-sm leading-6 text-zinc-700 dark:text-zinc-300">{preview}</p>

      {post.content.length > 180 ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-3 self-start text-sm font-medium text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      ) : null}

      <div className="mt-5 flex flex-wrap justify-between">
        <div className='flex flex-wrap gap-2'>
          <ActionButton label="" icon={<FiCopy />} onClick={copyContent} />
          <ActionButton label="" icon={<FiExternalLink />} onClick={copyLink} />
        </div>
        <ActionButton label="" icon={<FiTrash2 />} onClick={() => onDelete(post._id)} danger />
      </div>

      {message ? <div className="mt-4"><StatusBanner tone={messageTone} message={message} compact /></div> : null}
    </article>
  );
}

function ActionButton({ label, icon, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition ${danger
        ? 'border-red-200 text-red-700 hover:bg-red-50 dark:border-red-950 dark:text-red-300 dark:hover:bg-red-950/30'
        : 'border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}
