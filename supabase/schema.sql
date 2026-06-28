-- Run this in the Supabase SQL editor if save/load meal plans fails.

create table if not exists public.saved_meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_name text not null,
  plan_data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_meal_plans_user_id_idx on public.saved_meal_plans (user_id);

alter table public.saved_meal_plans enable row level security;

drop policy if exists "Users can read own meal plans" on public.saved_meal_plans;
create policy "Users can read own meal plans"
  on public.saved_meal_plans for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own meal plans" on public.saved_meal_plans;
create policy "Users can insert own meal plans"
  on public.saved_meal_plans for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own meal plans" on public.saved_meal_plans;
create policy "Users can update own meal plans"
  on public.saved_meal_plans for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own meal plans" on public.saved_meal_plans;
create policy "Users can delete own meal plans"
  on public.saved_meal_plans for delete
  using (auth.uid() = user_id);

create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  age integer not null default 0,
  gender text not null default '',
  height numeric not null default 0,
  weight numeric not null default 0,
  goals jsonb not null default '[]'::jsonb,
  activity text not null default '',
  cooking_time text not null default '',
  meals_per_day integer not null default 3,
  loved_foods jsonb not null default '[]'::jsonb,
  disliked_foods jsonb not null default '[]'::jsonb,
  diet_type text not null default '',
  allergies jsonb not null default '[]'::jsonb,
  conditions jsonb not null default '[]'::jsonb,
  budget text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

drop policy if exists "Users can read own preferences" on public.user_preferences;
create policy "Users can read own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own preferences" on public.user_preferences;
create policy "Users can insert own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own preferences" on public.user_preferences;
create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);
