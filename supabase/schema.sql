-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  handle text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);
create policy "Users can delete own profile." on public.profiles for delete using (auth.uid() = id);

-- Create portfolios table
create table public.portfolios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  handle text unique not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for portfolios
alter table public.portfolios enable row level security;
create policy "Public portfolios are viewable by everyone." on public.portfolios for select using (true);
create policy "Users can insert their own portfolio." on public.portfolios for insert with check (auth.uid() = user_id);
create policy "Users can update their own portfolio." on public.portfolios for update using (auth.uid() = user_id);
create policy "Users can delete their own portfolio." on public.portfolios for delete using (auth.uid() = user_id);

-- RPC for handle login
create or replace function get_email_by_handle(p_handle text)
returns text
language sql
security definer
as $$
  select email from auth.users
  join public.profiles on auth.users.id = profiles.id
  where profiles.handle = p_handle;
$$;

-- Trigger to create profile automatically on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, handle)
  values (new.id, new.raw_user_meta_data->>'handle');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to allow a user to delete their own account
-- This must be security definer to have permission to delete from auth.users
create or replace function delete_user_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  -- The delete policies on profiles and portfolios will be checked if we delete from there first,
  -- or we can rely on ON DELETE CASCADE if configured.
  -- But since we want to be explicit:
  delete from public.profiles where id = auth.uid();
  delete from public.portfolios where user_id = auth.uid();
  delete from auth.users where id = auth.uid();
end;
$$;
