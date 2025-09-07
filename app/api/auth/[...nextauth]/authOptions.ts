import type { AuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { AnyObject } from '@/types'
import { generateUUID } from '@/lib/utils'

const AUTH_GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_CLIENT_ID
const AUTH_GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_CLIENT_SECRET

function createAvatar() {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${generateUUID()}&size=64`
}

// 更新用户头像-这里不走接口，更安全
async function updateUserProfilePicture(user?: AnyObject) {
  if (!user) {
    return
  }

  try {
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        image: user.image
      }
    })
  } catch (error) {
    console.error(error)
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
        const user = await prisma.user.findUnique({
          where: { email: credentials?.account, password: credentials?.password }
        })

        if (!user) {
          return null
        } else {
          return {
            id: user.id,
            name: user?.name,
            email: user?.email,
            image: user?.image,
            role: user.role
          }
        }
      }
    }),
    GitHubProvider({
      clientId: AUTH_GITHUB_CLIENT_ID ?? '',
      clientSecret: AUTH_GITHUB_CLIENT_SECRET ?? '',
      httpOptions: {
        timeout: 20000 // 将超时时间设置为10秒（10000毫秒）
      }
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT as string),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    })
  ],
  pages: {
    signIn: '/',
    verifyRequest: '/auth/verify-request'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 过期时间,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      // 登录没有头像则设置一个默认头像
      if (!user?.image) {
        user.image = createAvatar()
        updateUserProfilePicture(user)
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
        token.id = user.id // 将用户 id 存储到 token 中
      }
      return token
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role as string
      }

      if (token?.id) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}
