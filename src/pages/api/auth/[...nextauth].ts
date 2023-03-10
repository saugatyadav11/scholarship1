import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { connectToDatabase } from '@/common/lib/db';

export const authOptions: NextAuthOptions =
  // your configs
  {
    pages: {
      signIn: '/auth',
      signOut: '/',
      error: '/auth',
      newUser: '/onboarding',
    },
    jwt: {
      secret: 'secretCode',
    },
    callbacks: {
      async session({ session }) {
        let client;

        // Checking if the user already has credentials account
        try {
          client = await connectToDatabase();
        } catch (error) {
          throw new Error("Couldn't connect to database!");
        }
        const db = client.db();
        const userCollection = db.collection('users');
        let userFromDB;

        try {
          userFromDB = await userCollection.findOne({
            email: session.user.email,
          });
          session.user.role = userFromDB?.role || undefined; // Add role value to user object so it is passed along with session
          if (userFromDB?.role && userFromDB?.role === 'student') {
            const applied = [];
            const accepted = [];
            const rejected = [];
            try {
              const scholarshipsCollection = db.collection('scholarships');
              const scholarshipData = await scholarshipsCollection
                .find({
                  'data.email': session.user.email,
                })
                .toArray();
              scholarshipData.forEach((data) => {
                if (data?.state === 'applied') {
                  applied.push(data?.data?.universityId);
                }
                if (data?.state === 'accepted') {
                  accepted.push(data?.data?.universityId);
                }
                if (data?.state === 'rejected') {
                  rejected.push(data?.data?.universityId);
                }
              });
            } catch (error) {}

            client.close();

            session.user.scholarships = {
              applied,
              accepted,
              rejected,
            };
          }

          return session;
        } catch (error) {
          client.close();
          return session;
        }
      },

      async signIn({ account, profile, user }): Promise<boolean> {
        if (account.provider === 'google') {
          let client;

          // Checking if the user already has credentials account
          try {
            client = await connectToDatabase();
          } catch (error) {
            throw new Error("Couldn't connect to database!");
          }
          const db = client.db();
          const userCollection = db.collection('users');
          let userFromDB;

          try {
            userFromDB = await userCollection.findOne({
              email: profile.email,
            });
          } catch (error) {
            client.close();
            throw new Error(
              "Couldn't do find operation ! Please try again later.",
            );
          }

          if (!userFromDB) {
            try {
              await db.collection('users').insertOne({
                id: profile.sub,
                name: user.name,
                email: user.email,
                image: user.image,
                provider: account.provider,
              });
            } catch (error) {
              client.close();
              throw new Error('Storing user failed.');
            }
          }

          // user.role = 'some role ';
          // console.log(account, profile, user);

          client.close();

          return true;
        }
      },
    },
    secret: process.env.NEXT_PUBLIC_SECRET,
    providers: [
      // OAuth authentication providers...
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      }),
    ],
  };

export default NextAuth(authOptions);
