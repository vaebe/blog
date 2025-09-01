# blog

vaebe 的个人博客，记录自己的一些想法

## 项目介绍

项目依赖 mysql、 github 仓库 api_key 、next-auth(邮箱登录、github 登录) 需要在 `.env` 文件中配置

mysql：存储博客的相关的数据，用户信息、文章信息、留言信息

github 仓库 api_key：目前仅是为了 github acitons 调用同步掘金文章接口的时候做鉴权防止恶意调用

next-auth: 实现 github 登录、邮箱登录、账号密码登录功能

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

## ui

添加组件

```bash
npx shadcn@latest add scroll-area
```

## 性能看起来还行

<img width="1727" alt="image" src="https://github.com/user-attachments/assets/9f198e59-4d3e-4f3f-a035-3c291a648785" />
