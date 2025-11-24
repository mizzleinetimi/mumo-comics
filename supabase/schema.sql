-- Comics Table
create table if not exists comics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  publish_date timestamptz not null default now(),
  synopsis text not null,
  tags text[] default array[]::text[],
  reading_time int default 5,
  cover_image_url text,
  author text default 'Mumo Team',
  featured boolean default false,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index on slug for faster lookups
create index if not exists comics_slug_idx on comics(slug);

-- Create index on publish_date for sorting
create index if not exists comics_publish_date_idx on comics(publish_date desc);

-- Create index on featured for filtering
create index if not exists comics_featured_idx on comics(featured) where featured = true;

-- Enable Row Level Security
alter table comics enable row level security;

-- Allow public read access to all comics
create policy "Comics are viewable by everyone"
  on comics for select
  using (true);

-- Allow authenticated users to insert/update/delete comics
create policy "Authenticated users can insert comics"
  on comics for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update comics"
  on comics for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete comics"
  on comics for delete
  using (auth.role() = 'authenticated');

-- Storage bucket for comic images
insert into storage.buckets (id, name, public)
values ('comic-images', 'comic-images', true)
on conflict (id) do nothing;

-- Allow public read access to comic images
create policy "Comic images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'comic-images');

-- Allow authenticated users to upload comic images
create policy "Authenticated users can upload comic images"
  on storage.objects for insert
  with check (bucket_id = 'comic-images' and auth.role() = 'authenticated');

-- Allow authenticated users to update comic images
create policy "Authenticated users can update comic images"
  on storage.objects for update
  using (bucket_id = 'comic-images' and auth.role() = 'authenticated');

-- Allow authenticated users to delete comic images
create policy "Authenticated users can delete comic images"
  on storage.objects for delete
  using (bucket_id = 'comic-images' and auth.role() = 'authenticated');
