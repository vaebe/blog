import NextAuth from "next-auth"
import GitHubProvider from 'next-auth/providers/github';

const AUTH_GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_CLIENT_ID
const AUTH_GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_CLIENT_SECRET

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: AUTH_GITHUB_CLIENT_ID ?? '',
      clientSecret: AUTH_GITHUB_CLIENT_SECRET ?? '',
    })
  ],
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST };