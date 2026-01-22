-- Create a public bucket named 'images'
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Policy to allow public access to view images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

-- Policy to allow authenticated users to upload images
create policy "Authenticated Upload"
on storage.objects for insert
with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

-- Policy to allow authenticated users to update/delete images (optional)
create policy "Authenticated Update"
on storage.objects for update
using ( bucket_id = 'images' and auth.role() = 'authenticated' );

create policy "Authenticated Delete"
on storage.objects for delete
using ( bucket_id = 'images' and auth.role() = 'authenticated' );
