# blog

vaebe 的个人博客，记录自己的一些想法

## 项目介绍

项目依赖 Neon（Serverless Postgres）、Neon Auth（鉴权）、github 仓库 api_key，需要在 `.env` 文件中配置

Neon（Postgres）：存储博客的相关的数据，用户信息、文章信息、留言信息。通过 Prisma + `@prisma/adapter-neon` 连接，`.env` 中需配置 `DATABASE_URL`（连接池 / pooled，运行时使用）与 `DATABASE_URL_UNPOOLED`（直连 / unpooled，Prisma CLI 迁移使用）

github 仓库 api_key：目前仅是为了 github acitons 调用同步掘金文章接口的时候做鉴权防止恶意调用

Neon Auth（基于 Better Auth）：实现邮箱验证码（Email OTP）、Google 登录。鉴权用户存于数据库的 `neon_auth.user`，应用侧 `profiles` 表镜像并承载自定义 `role`（`00` 管理员 / `01` 普通用户）。

- 在 Neon 控制台开通 Neon Auth，启用 Email OTP，并配置 Google OAuth（client id/secret 填控制台；callback URL = `{NEON_AUTH_BASE_URL}/callback/google`，按分支区分环境）。
- `.env` 配置 `NEON_AUTH_BASE_URL`、`NEON_AUTH_COOKIE_SECRET`（≥32 字符）。
- 开通后依次执行：`pnpm prisma migrate deploy` 创建业务表，再执行 `prisma/neon-auth-profiles-sync.sql` 建立 `profiles` 与 `neon_auth.user` 的外键和同步触发器；管理员权限直接在数据库执行 `UPDATE public.profiles SET role = '00' WHERE email = '你的邮箱';`。

## 启动项目

执行 `pnpm i` 安装依赖

执行 `npx prisma generate` 生成 prisma 模型的 ts 类型

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

## neo skils

`npx neonctl@latest init`

## ui

添加组件

```bash
npx shadcn@latest add scroll-area
```

## 性能看起来还行

![image](https://github.com/user-attachments/assets/9f198e59-4d3e-4f3f-a035-3c291a648785)
