# blog

一个简单的博客

## 启动项目

项目依赖 mysql、vercel kv 数据库、github auth app 信息、github 仓库 api_key 、next-auth 邮箱登录 需要在 `.env` 文件中配置

mysql：存储博客的相关的数据，用户信息、文章信息、留言信息

vercel kv：目前仅是为了存储同步掘金文章接口的同步时间防止恶意调用

github 仓库 api_key：目前仅是为了 github acitons 调用同步掘金文章接口的时候做鉴权防止恶意调用

github auth app： 为了实现 github 登录功能

next-auth 邮箱登录：为了实现邮箱登录功能

执行 `pnpm run dev 启动项目`

## prisma

prisma 仅支持 `.env` 文件配置的环境变量

生成数据库迁移

```bash
npx prisma migrate dev --name update_string_fields
```

生成 ts 类型

```bash
npx prisma generate
```

## ui

添加组件

```bash
npx shadcn@latest add scroll-area
```

