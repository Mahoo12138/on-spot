-- 9. 现场公告表
create table posts (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references profiles(id),
  venue_id uuid references venues(id),
  sub_layer_id uuid references sub_layers(id),
  
  -- 自关联字段。如果是主贴，则为 null；如果是补充，则指向主贴 ID
  parent_id uuid references posts(id) on delete cascade, 
  
  tag post_tag,                            -- 补充贴可以不带标签，继承主贴
  content text check (char_length(content) <= 140),
  
  -- 计数与状态
  up_votes int default 0,
  down_votes int default 0,
  is_hidden boolean default false,
  
  -- 空间与时间
  geom geography(point, 4326),
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- 索引：加速查找某个帖子的所有补充说明
create index posts_parent_id_idx on posts (parent_id);


-- 10. 交互记录表 (点赞与举报)
create table interactions (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade,
  profile_id uuid references profiles(id),
  type text check (type in ('like', 'report')),
  created_at timestamptz default now(),
  unique(post_id, profile_id, type)          -- 防止重复操作
);