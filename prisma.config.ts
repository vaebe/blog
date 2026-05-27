import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // 迁移 / db push 使用直连（unpooled）连接，避免 PgBouncer 连接池下的 advisory lock 问题
    url: env('DATABASE_URL_UNPOOLED'),
  },
})