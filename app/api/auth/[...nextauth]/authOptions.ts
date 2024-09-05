import type { AuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
        avatar: avatar_url
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        account: { label: 'Account', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // 校验用户信息
        const user = await prisma.user.findUnique({
          where: { account: credentials?.account, password: credentials?.password }
        })

        return { id: user!.id, name: user?.nickName, email: user?.account, image: user?.avatar }
      }
    }),
    GitHubProvider({
      clientId: AUTH_GITHUB_CLIENT_ID ?? '',
      clientSecret: AUTH_GITHUB_CLIENT_SECRET ?? ''
    })
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    // strategy: "jwt",
    // maxAge: 24 * 60 * 60 // 过期时间,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'github') {
        upsertUser(profile)
      }
      return true
    },
    async redirect({ baseUrl }) {
      return baseUrl
    },
    async jwt({ token, user }) {
      if (user) {
        const userInfo = await prisma.user.findUnique({
          where: { account: user.email as string }
        })

        if (userInfo) {
          token.role = userInfo.role
        }
      }
      return token
    },
    async session({ session, token }) {
      const info = { ...session }
      info.user.role = token?.role as string
      return info
    }
  }
}
