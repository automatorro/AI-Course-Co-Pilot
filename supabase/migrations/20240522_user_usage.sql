create table if not exists public.user_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  model text,
  input_tokens int,
  output_tokens int,
  total_tokens int,
  action text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_usage enable row level security;

create policy "Users can view their own usage"
  on public.user_usage for select
  using (auth.uid() = user_id);

create policy "Service role can insert usage"
  on public.user_usage for insert
  with check (true);
