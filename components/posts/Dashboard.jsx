'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import EmptyState from '@/components/ui/EmptyState';
import PostCard from '@/components/posts/PostCard';
import StatusBanner from '@/components/ui/StatusBanner';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/posts', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to fetch posts.');
      }
      setPosts(
        (Array.isArray(data) ? data : []).map((post) => ({
          ...post,
          _id: post?._id ?? post?.id ?? ''
        }))
      );
    } catch (err) {
      setError(err.message || 'Unable to fetch posts.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const favoriteCount = useMemo(() => posts.filter((post) => post.favorite).length, [posts]);

  async function handleDelete(id) {
    if (!id) {
      setError('Missing post id.');
      return;
    }

    const previous = posts;
    setPosts((current) => current.filter((post) => post._id !== id));

    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to delete post.');
      }
    } catch (err) {
      setPosts(previous);
      setError(err.message || 'Unable to delete post.');
    }
  }

  async function handleFavorite(id, favorite) {
    if (!id) {
      setError('Missing post id.');
      return;
    }

    const previous = posts;
    setPosts((current) =>
      current.map((post) => (post._id === id ? { ...post, favorite } : post))
    );

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to update favorite.');
      }
    } catch (err) {
      setPosts(previous);
      setError(err.message || 'Unable to update favorite.');
    }
  }
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Your clipboard library</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Securely store snippets, quick notes, and copied text. Favorite the important ones so they always stay on top.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:w-auto">
          <StatCard label="Total items" value={String(posts.length)} />
          <StatCard label="Favorites" value={String(favoriteCount)} />
        </div>
      </div>

      {error ? <StatusBanner tone="error" message={error} /> : null}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="Create your first clipboard item and it will appear here."
          actionHref="/add"
          actionLabel="Create your first item"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handleDelete}
              onToggleFavorite={handleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 
    shadow-sm dark:border-zinc-800 dark:bg-zinc-900 
    flex flex-row md:flex-col justify-between items-center gap-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{value}</p>
    </div>
  );
}
