import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AuthCard from '@/components/ui/AuthCard';
import SignupForm from '@/components/ui/SignupForm';

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.userId) {
    redirect('/');
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="A minimal clipboard manager with secure sharing."
      footerText="Already have an account?"
      footerLink="/login"
      footerLabel="Sign in"
    >
      <SignupForm />
    </AuthCard>
  );
}
