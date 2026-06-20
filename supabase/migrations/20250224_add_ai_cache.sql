-- Create a table for AI response caching
create table if not exists ai_cache (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  prompt_hash text not null,
  prompt text,
  response text not null,
  model text,
  provider text
);

-- Add a unique constraint on prompt_hash to prevent duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ai_cache_prompt_hash_key'
  ) THEN
    ALTER TABLE ai_cache ADD CONSTRAINT ai_cache_prompt_hash_key UNIQUE (prompt_hash);
  END IF;
END $$;

-- Enable Row Level Security
alter table ai_cache enable row level security;

-- Allow all authenticated users to read from the cache (shared cache)
drop policy if exists "Allow read access to authenticated users" on ai_cache;
create policy "Allow read access to authenticated users"
on ai_cache for select
to authenticated
using (true);

-- Allow all authenticated users to insert into the cache
drop policy if exists "Allow insert access to authenticated users" on ai_cache;
create policy "Allow insert access to authenticated users"
on ai_cache for insert
to authenticated
with check (true);

-- Allow service role to do everything
drop policy if exists "Allow service role full access" on ai_cache;
create policy "Allow service role full access"
on ai_cache
to service_role
using (true)
with check (true);
