-- 7. 场地表 (大地点)
create table venues (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  status app_status default 'pending',       -- 只有 approved 状态才会在前端显示
  geom geography(point, 4326),               -- 场地的中心坐标
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);
create index venues_geom_idx on venues using gist (geom);

-- 8. 子分层表 (1层, 停车场等)
create table sub_layers (
  id uuid default gen_random_uuid() primary key,
  venue_id uuid references venues(id) on delete cascade,
  name text not null,
  sort_order int default 0,                  -- 排序
  is_official boolean default false,         -- 是否为官方认证分层
  created_at timestamptz default now()
);
