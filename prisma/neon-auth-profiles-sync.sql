-- ============================================================================
-- Neon Auth ↔ public.profiles 同步
-- ----------------------------------------------------------------------------
-- 用途：鉴权用户存于 neon_auth.user（Neon Auth 管理，不在 Prisma 内）。
--       本脚本把 profiles 作为应用侧镜像，承载自定义 role 并作为外键目标，
--       并通过触发器在 neon_auth.user 增改时自动同步。
--
-- 运行时机（务必按序）：
--   1) 在 Neon 控制台开通 Neon Auth（生成 neon_auth schema 与 neon_auth.user 表）
--   2) pnpm prisma migrate deploy   （创建 public.profiles 等业务表）
--   3) 执行本脚本：psql "$DATABASE_URL_UNPOOLED" -f prisma/neon-auth-profiles-sync.sql
-- ============================================================================

-- 1) profiles.id 外键指向 neon_auth.user(id)，用户删除时级联清理
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES neon_auth.user(id) ON DELETE CASCADE;

-- 2) 同步函数：插入/更新 neon_auth.user 时写入 profiles
CREATE OR REPLACE FUNCTION public.handle_neon_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, image)
  VALUES (NEW.id, NEW.email, NEW.name, NEW.image)
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        name  = EXCLUDED.name,
        image = EXCLUDED.image;
  RETURN NEW;
END;
$$;

-- 3) 触发器：neon_auth.user 插入或更新后同步到 profiles
DROP TRIGGER IF EXISTS on_neon_auth_user_change ON neon_auth.user;
CREATE TRIGGER on_neon_auth_user_change
  AFTER INSERT OR UPDATE ON neon_auth.user
  FOR EACH ROW EXECUTE FUNCTION public.handle_neon_auth_user();

-- 4) 回填：把已存在的 neon_auth.user 同步进 profiles（首次运行用）
INSERT INTO public.profiles (id, email, name, image)
SELECT id, email, name, image FROM neon_auth.user
ON CONFLICT (id) DO NOTHING;

-- 5) 指定管理员（role = '00'）：把邮箱替换为你的登录邮箱后取消注释执行
-- UPDATE public.profiles SET role = '00' WHERE email = 'admin@example.com';
