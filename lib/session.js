import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function requireUserSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.userId) {
    throw new Error('Unauthorized');
  }
  return session;
}
