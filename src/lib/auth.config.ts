import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth;
      const role = auth?.user?.role;

      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false;
        if (role !== "ADMIN")
          return Response.redirect(new URL("/dashboard", request.url));
        return true;
      }

      if (
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/courses/")
      ) {
        return isLoggedIn;
      }

      if (pathname === "/login" || pathname === "/register") {
        if (isLoggedIn) {
          const dest = role === "ADMIN" ? "/admin" : "/dashboard";
          return Response.redirect(new URL(dest, request.url));
        }
      }

      return true;
    },
  },
  providers: [], // Providers are added in the full auth.ts
};
