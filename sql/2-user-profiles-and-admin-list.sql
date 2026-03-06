-- 5. 用户档案表 (前端匿名使用)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  temp_nickname text not null,               -- 随机生成的匿名，如“深海的小鱼”
  last_active_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 6. 管理员名单表 (独立于业务用户，供管理系统使用)
create table admin_users (
  user_id uuid references auth.users on delete cascade primary key,
  role text default 'editor',                -- 'super_admin', 'editor'
  created_at timestamptz default now()
);
