import NextAuth, { NextAuthOptions } from "next-auth";
import { default as CredentialsProvider } from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Look up user by email in DB
                const rows = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email.toLowerCase().trim()))
                    .limit(1);

                const user = rows[0];

                // No user found
                if (!user) return null;

                // Compare submitted password against stored hash
                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!passwordMatch) return null;

                // Return the user object - NextAuth puts this in the token
                return {
                    id: user.id,
                    email: user.email,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt", // store session in a JWT cookie, not the DB
    },

    callbacks: {
        // Called when JWT is created or updated
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },

        // Called whenever session is checked
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },

    pages: {
        signIn: "/",  // redirect to home page if unauthenticated
    },
};