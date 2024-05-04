import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials:any):Promise<any>{
        await dbConnect();
        try {
          if (!credentials.identifier || !credentials.password) {
            throw new Error('Please provide both credentials');
          }
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          throw new Error(err);
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
  })
  ],
  callbacks: {
    async signIn({ account, profile, user}) {

      if (account?.provider === "google") {
          await dbConnect(); // Ensure this function is working correctly

          try {
              let User = await UserModel.findOne({ email: profile?.email });

              if (!User) {
                  User = new UserModel({
                      username: profile?.name?.replace(/\s/g, ''),
                      email: profile?.email,
                      isVerified: true,
                      isAcceptingMessages: true,
                      messages: [],
                      
                  });

                  await User.save({ validateBeforeSave: false });
                  console.log("New User Created: ", User);
              }

              return true; // Return true after handling the Google sign-in
          } catch (error) {
              console.error("Error in Google Sign In", error);
              return false; // Return false if there's an error
          }
      }

      if (account?.provider === "credentials") {
          return true; // Return true for other authentication providers
      }

      return false; // Return false if no provider matches
  },
    async jwt({token}) {
      await dbConnect()
      const user = await UserModel.findOne({email: token.email})

      
      if (user) {
        token._id = user._id?.toString() ; // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
};
