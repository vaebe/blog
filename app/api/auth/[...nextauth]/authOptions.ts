import type { AuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/prisma/index'

const AUTH_GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_CLIENT_ID
const AUTH_GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_CLIENT_SECRET

async function upsertUser(profile: any) {
  const { id } = profile as any

  try {
    await prisma.user.upsert({
      where: { id: `${id}` },
      update: {}, // 不更新任何字段
      create: {
        id: `${id}`,
        password: ''
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        account: { label: 'Account', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials?.account, password: credentials?.password }
          })

          return {
            id: user!.id,
            name: user?.name,
            email: user?.email,
            image: user?.image,
            role: user?.role
          }
        } catch (error) {
          console.error('授权过程中发生错误:', error)
        }

        return null
      }
    }),
    GitHubProvider({
      clientId: AUTH_GITHUB_CLIENT_ID ?? '',
      clientSecret: AUTH_GITHUB_CLIENT_SECRET ?? '',
      httpOptions: {
        timeout: 10000 // 将超时时间设置为10秒（10000毫秒）
      }
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    })
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/auth/verify-request'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 过期时间,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      // todo 邮箱登录没有头像则设置一个默认头像
      if (account?.provider === 'github') {
        // upsertUser(profile)
      }
      return true
    },
    async redirect({ baseUrl }) {
      return baseUrl
    },
    async jwt({ token, user }) {
      // 如果 user 存在，存储角色信息
      if (user) {
        token.role = user.role // 将角色存储到 token 中
      }
      return token
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role as string
      }
      return session
    }
  }
}
