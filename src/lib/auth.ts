import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isGuest?: boolean;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isGuest?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isGuest?: boolean;
  }
}

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      id: 'guest',
      name: 'Guest',
      credentials: {},
      async authorize() {
        return {
          id: `guest-${crypto.randomUUID()}`,
          name: 'Guest User',
          email: 'guest@example.com',
          isGuest: true,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.isGuest = user.isGuest || false;
      }

      // Enforce 30-minute session for guests
      if (token.isGuest) {
        const now = Math.floor(Date.now() / 1000);
        const tokenCreatedAt = (token.iat as number) || now;
        const guestSessionDuration = 30 * 60; // 30 minutes in seconds

        if (now - tokenCreatedAt > guestSessionDuration) {
          // Return an empty object or throw an error to invalidate the session
          // NextAuth will interpret this as an invalid token
          throw new Error('Guest session expired');
        }
      }

      return token;
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (session?.user) {
        session.user.id = token.sub!;
        session.user.isGuest = token.isGuest || false;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days for regular users
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
};
