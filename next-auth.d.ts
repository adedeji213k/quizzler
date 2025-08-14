// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  /**
   * The `Session` type is returned by `useSession`, `getSession`
   * and received as a prop on the `SessionProvider` React Context.
   */
  interface Session {
    user: {
      id: string; // The custom 'id' property
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}