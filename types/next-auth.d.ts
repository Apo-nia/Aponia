// types/next-auth.d.ts

import NextAuth from "next-auth";

// augmenting the default Session type to include custom accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

// augmenting the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}