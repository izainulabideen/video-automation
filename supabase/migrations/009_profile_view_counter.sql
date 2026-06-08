-- View counter on scenarios
alter table scenarios add column if not exists view_count integer not null default 0;

-- Default user preferences stored in users table
alter table users add column if not exists default_niche text;
alter table users add column if not exists timezone text default 'UTC';

-- Helper function to increment view count atomically
create or replace function increment_view_count(scenario_id_param uuid)
returns void language sql security definer as $$
  update scenarios set view_count = view_count + 1 where id = scenario_id_param;
$$;
