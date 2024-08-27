import NextAuth from "next-auth"
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const AUTH_GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_CLIENT_ID
const AUTH_GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_CLIENT_SECRET

async function upsertUser(profile: any) {
  const { id, login, email, html_url, avatar_url } = profile as any

  try {
    await prisma.user.upsert({
      where: { id: `${id}` },
      update: {}, // 不更新任何字段
      create: {
        id: `${id}`,
        nickName: login,
        account: email,
        password: '',
        accountType: '01', // '00 账号密码 01 github'
        role: '01', // 角色: 00 admin 01 普通用户
        homepage: html_url,
        avatar: avatar_url,
      },
    });
  } catch (error) {
    console.log(error)
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        account: { label: "Account", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 校验用户信息
        const user = await prisma.user.findUnique({
          where: { account: credentials?.account, password: credentials?.password },
        });

        return { id: user!.id, name: user?.nickName, email: user?.account, image: user?.avatar }
      },
    }),
    GitHubProvider({
      clientId: AUTH_GITHUB_CLIENT_ID ?? '',
      clientSecret: AUTH_GITHUB_CLIENT_SECRET ?? '',
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
    // maxAge: 24 * 60 * 60 // 过期时间,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github') {
        upsertUser(profile)
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session }) {
      const userInfo = await prisma.user.findUnique({
        where: { account: session.user!.email as string },
      });

      session.user.role = userInfo?.role

      return session;
    }
  },
})

export { handler as GET, handler as POST };