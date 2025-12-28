-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Table: categories
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  slug text unique not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: posts
create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image text,
  published boolean default false not null,
  published_at timestamp with time zone,
  category text, -- Storing category name or slug as text per prompt, though FK to categories(name) is better.
  tags text[],
  reading_time integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies

-- Categories: Public read
alter table categories enable row level security;
create policy "Allow public read access" on categories for select using (true);
create policy "Allow authenticated insert" on categories for insert with check (auth.role() = 'authenticated'); -- Or check for specific admin role
create policy "Allow authenticated update" on categories for update using (auth.role() = 'authenticated');

-- Posts: Public read published
alter table posts enable row level security;
create policy "Allow public read published posts" on posts for select using (published = true);
create policy "Allow admin read all posts" on posts for select using (auth.role() = 'authenticated' or auth.role() = 'service_role'); -- service_role bypasses RLS anyway usually, but good to be explicit for authenticated admin user
create policy "Allow authenticated insert" on posts for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update" on posts for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete" on posts for delete using (auth.role() = 'authenticated');

-- Create storage bucket for images if not exists (needs to be done via UI or API usually, SQL can create buckets in 'storage' schema)
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "Public Access" on storage.objects for select using ( bucket_id = 'images' );
create policy "Auth Upload" on storage.objects for insert with check ( bucket_id = 'images' and auth.role() = 'authenticated' );
