import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import ConnectMongoDb from '@/lib/db';
import { getRequiredEnv, getOptionalEnv } from '@/lib/env';
import User from '@/models/User';

const googleClientId = getOptionalEnv('GOOGLE_CLIENT_ID');
const googleClientSecret = getOptionalEnv('GOOGLE_CLIENT_SECRET');

const providers = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      await ConnectMongoDb();
      const email = String(credentials.email).trim().toLowerCase();
      const user = await User.findOne({ email });

      if (!user?.passwordHash) {
        return null;
      }

      const valid = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!valid) {
        return null;
      }

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.userName,
        role: user.role
      };
    }
  })
];

if (googleClientId && googleClientSecret) {
  providers.unshift(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret
    })
  );
}

export const authOptions = {
  secret: getRequiredEnv('NEXTAUTH_SECRET'),
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google' || !user?.email) {
        return true;
      }

      await ConnectMongoDb();
      const email = user.email.trim().toLowerCase();
      const existing = await User.findOne({ email });

      if (!existing) {
        await User.create({
          userName: user.name || email.split('@')[0],
          email,
          authProviders: ['google'],
          role: 'user'
        });
      } else if (!existing.authProviders.includes('google')) {
        existing.authProviders.push('google');
        await existing.save();
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        await ConnectMongoDb();
        const dbUser = await User.findOne({ email: user.email.trim().toLowerCase() });
        if (dbUser) {
          token.userId = dbUser._id.toString();
          token.role = dbUser.role;
          token.name = dbUser.userName;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.userId = token.userId;
        session.user.role = token.role;
        session.user.name = token.name || session.user.name;
      }
      return session;
    }
  }
};
