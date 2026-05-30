-- YouTube module — run this in your Supabase SQL editor

-- Ideas para videos
create table if not exists public.youtube_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  tag text,
  channel text not null default 'personal',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.youtube_ideas enable row level security;

create policy "owner_all" on public.youtube_ideas
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Guiones y borradores
create table if not exists public.youtube_scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  type text not null default 'borrador',   -- idea | borrador | guion
  channel text not null default 'personal',
  status text not null default 'borrador', -- idea | borrador | revision | aprobado
  progress int not null default 0,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.youtube_scripts enable row level security;

create policy "owner_all" on public.youtube_scripts
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Videos publicados y programados
create table if not exists public.youtube_videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  channel text not null default 'personal',
  published_date date,
  scheduled_date date,
  duration text,
  views int not null default 0,
  avg_watch_time text,
  ctr numeric(4,1) not null default 0,
  retention int not null default 0,
  status text not null default 'published', -- published | scheduled
  created_at timestamptz not null default now()
);

alter table public.youtube_videos enable row level security;

create policy "owner_all" on public.youtube_videos
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
