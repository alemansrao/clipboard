'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import StatusBanner from '@/components/ui/StatusBanner';

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === 'true';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const authError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (authError) {
      console.error('[Google Login Error]', authError);
    }
  }, [authError]);

  async function handleGoogleLogin() {
    try {
      console.log('[Google Login] Starting Google sign-in...');
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('[Google Login Error]', error);
    }
  }

  async function handleCredentials(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl
    });

    setSubmitting(false);

    if (!result || result.error) {
      setMessage('Incorrect email or password.');
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleCredentials} className="space-y-4">
      {googleEnabled ? (
        <>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-zinc-400">
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            or
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </>
      ) : null}

      <Field
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
      />

      <Field
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setEmail('test@test.com');
            setPassword('test1');
          }}
          className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Use guest account
        </button>

        <Link
          href="/signup"
          className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Need access?
        </Link>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
      >
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>

      {message ? <StatusBanner tone="error" message={message} /> : null}
    </form>
  );
}

function Field({ label, type, value, onChange, autoComplete }) {
  return (
    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
      {label}
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