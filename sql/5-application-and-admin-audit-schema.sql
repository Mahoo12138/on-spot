-- 11. 申请表 (用户提交的场地/分层建议)
create table applications (
  id uuid default gen_random_uuid() primary key,
  applicant_id uuid references profiles(id),
  app_type text check (app_type in ('new_venue', 'new_layer')),
  target_venue_id uuid references venues(id), -- 若是申请分层，则关联主场地
  suggested_name text not null,
  location_data jsonb,                        -- 经纬度等元数据
  status app_status default 'pending',
  admin_note text,                            -- 审核备注
  created_at timestamptz default now()
);

-- 12. 管理员审计日志 (记录后台所有操作)
create table admin_audit_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references admin_users(user_id),
  action_type admin_action not null,
  target_id uuid not null,                    -- 目标对象 ID
  reason text,
  created_at timestamptz default now()
);
