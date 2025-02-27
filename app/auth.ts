import { prisma } from "@/prisma/client";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInSchema } from "./lib/schema";
import { verifyPassword } from "./lib/bcryptHandler";
import { ZodError } from "zod";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const { email, password } = await signInSchema.parseAsync({
            email: credentials.email,
            password: credentials.password,
          });

          // Find user in the database
          const user = await prisma.users.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }

          // Verify password
          const passwordsMatch = await verifyPassword(password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            // Add any other user properties you need
          };
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation error:", error.errors);
          } else {
            console.error("Authentication error:", error);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
