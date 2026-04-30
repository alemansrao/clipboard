'use client';

import { useMemo, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import StatusBanner from '@/components/ui/StatusBanner';

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === 'true';

export default function SignupForm() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState('error');

  const passwordHint = useMemo(() => {
    if (!password) return 'Use at least 8 characters with one letter and one number.';
    return 'Looks good.';
  }, [password]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to create account.');
      }

      setTone('success');
      setMessage('Account created. Redirecting to sign in…');
      window.setTimeout(() => router.push('/login'), 600);
    } catch (error) {
      setTone('error');
      setMessage(error.message || 'Unable to create account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {googleEnabled ? (
        <>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">or</span>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Username" type="text" value={userName} onChange={setUserName} autoComplete="name" />
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{passwordHint}</p>

        <button
          type="submit"
          disabled={submitting || !userName.trim() || !email.trim() || !password}
          className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      {message ? <StatusBanner tone={tone} message={message} /> : null}
    </div>
  );
}

function Field({ label, type, value, onChange, autoComplete }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className="mt-2 h-11 w-full rounded-2xl border border-zinc-200 bg-transparent px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
      />
    </label>
  );
}
