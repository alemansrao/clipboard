import GoogleProvider from "next-auth/providers/google";
import { signJwt } from "@/lib/jwt";



const authOptions = {
	providers: [
		GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, }),
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


//export { authOptions };
export default authOptions;