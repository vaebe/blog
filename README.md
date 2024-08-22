# blog

一个简单的博客

## prisma

prisma 不支持 `.env.local` 类型的文件

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
npx shadcn-ui@latest add button
```
