import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signJwt } from "@/lib/jwt";
import Users from "@/models/users";
import ConnectMongoDb from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [ 
    GoogleProvider({clientId: process.env.GOOGLE_CLIENT_ID,clientSecret: process.env.GOOGLE_CLIENT_SECRET,}),
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     await ConnectMongoDb();
    //     const user = await Users.findOne({ email: credentials.email });
    //     if (!user) return null;
    //     const isValid = await bcrypt.compare(credentials.password, user.password);
    //     if (!isValid) return null;
    //     // Return user object for session
    //     return {
    //       id: user._id.toString(),
    //       email: user.email,
    //       name: user.user_name,
    //       role: user.role,
    //     };
    //   },
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // On sign in, add user info to token
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user info to session
      if (token) {
        session.user.userId = token.userId;
        session.user.role = token.role;
      }
      // Optionally, add a custom JWT for API usage
      session.apiToken = signJwt({
        userId: token.userId,
        email: token.email,
        role: token.role,
      });
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.JWT_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
