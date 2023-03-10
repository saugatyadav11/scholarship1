import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    scholarships: any;
  }
  interface Session {
    user: {
      scholarships: any;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      expires: ISODateString;
    };
  }
}
