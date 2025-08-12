// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createConnection } from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const db = await createConnection();
        const [rows]: any = await db.query(
          "SELECT * FROM users WHERE email = ?",
          [credentials?.email]
        );
        console.log("Database query result:", rows);

        if (!rows || rows.length === 0) {
          console.log("User not found.");
          return null;
        }

        const user = rows[0];
        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password_hash
        );
        console.log("Password comparison result:", isValid);

        if (!isValid) {
          console.log("Incorrect password.");
          return null;
        }

        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token) (session.user as any).id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
