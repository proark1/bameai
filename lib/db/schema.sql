-- Agent Kingdom schema (Supabase/Postgres)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  company_name text,
  theme text default 'Sci-Fi',
  preferred_tone text default 'Strategic',
  created_at timestamptz default now()
);

create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  role text,
  name text,
  level integer default 1,
  xp integer default 0,
  mood text,
  summary text,
  building_level integer default 1,
  skill_points integer default 0,
  created_at timestamptz default now()
);

create table if not exists missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  agent_id uuid references agents(id) on delete cascade,
  title text,
  objective text,
  steps jsonb,
  status text,
  priority text,
  created_at timestamptz default now(),
  due_at timestamptz,
  reward_xp integer,
  reward_resources jsonb
);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  coins integer default 0,
  focus integer default 0,
  intel integer default 0,
  reputation integer default 0,
  updated_at timestamptz default now()
);

create table if not exists skills (
  id text primary key,
  name text,
  description text,
  cost_points integer,
  prerequisites jsonb,
  effects jsonb
);

create table if not exists user_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  agent_id uuid references agents(id) on delete cascade,
  skill_id text references skills(id),
  unlocked_at timestamptz default now()
);
