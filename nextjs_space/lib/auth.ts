import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user?.passwordHash) return null;
          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!isValid) return null;
          return { id: user.id, email: user.email, name: user.name, role: user.role, image: user.image };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      if (trigger === 'update' && session) {
        token.name = session?.name;
        token.image = session?.image;
      }
      // For OAuth users, fetch role from DB
      if (token?.id && !token.role) {
        try {
          const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
          if (dbUser) token.role = dbUser.role;
        } catch (e) {
          console.error('JWT callback error:', e);
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user && token?.id) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    newUser: '/dashboard',
  },
  cookies: {
    state: {
      name: 'next-auth.state',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};
