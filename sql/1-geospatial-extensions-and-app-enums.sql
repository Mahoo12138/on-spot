-- 1. 开启地理信息扩展 (必运行，否则无法处理坐标)
create extension if not exists postgis;

-- 2. 定义审核状态枚举
create type app_status as enum('pending', 'approved', 'rejected');

-- 3. 定义内容标签枚举
create type post_tag as enum('排队情况', '人流拥挤', '失物招领', '突发提醒', '场地资讯');

-- 4. 定义管理操作类型枚举
create type admin_action as enum(
  'delete_post',
  'approve_venue',
  'block_user',
  'update_layer'
);
