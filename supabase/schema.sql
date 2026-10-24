-- Run this in the Supabase SQL Editor. All application access uses the server's
-- service-role key, so RLS stays enabled and browsers cannot access tables.
create extension if not exists "pgcrypto";

create table if not exists judges (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  project_title text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  weight numeric not null check (weight > 0),
  sort_order integer not null unique,
  rubric_baseline text not null,
  rubric_winning text not null
);
create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  judge_id uuid not null references judges(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  stars integer not null check (stars between 1 and 5),
  updated_at timestamptz not null default now(),
  unique (judge_id, team_id, category_id)
);
create table if not exists judge_status (
  judge_id uuid primary key references judges(id) on delete cascade,
  status text not null default 'scoring' check (status in ('scoring', 'picking', 'finished')),
  finished_at timestamptz
);
create table if not exists judge_picks (
  judge_id uuid primary key references judges(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Pre-create each judge's state row.
create or replace function create_judge_status() returns trigger language plpgsql as $$
begin insert into judge_status (judge_id) values (new.id) on conflict do nothing; return new; end; $$;
drop trigger if exists judges_status_trigger on judges;
create trigger judges_status_trigger after insert on judges for each row execute function create_judge_status();

insert into judges (name, sort_order) values
  ('Judge 1', 1), ('Judge 2', 2), ('Judge 3', 3), ('Judge 4', 4)
on conflict (name) do nothing;
insert into judge_status (judge_id) select id from judges on conflict do nothing;

insert into categories (name, weight, sort_order, rubric_baseline, rubric_winning) values
('Visual & Interactive Impact', 30, 1,
 'Constructs a simple, static chart, spreadsheet display, or basic geographic representation illustrating population dataset percentages without real-time elements.',
 'Constructs an interactive, dynamic user interface or live dashboard (for example clickable regional map filters, responsive color-coded heatmaps, or live user input variables) that immediately exposes severe global data distribution blindspots at a single glance.'),
('Depth of Ethical Analysis', 30, 2,
 'States the baseline problem abstractly, noting that genomic data bias exists or that automated algorithmic bias is problematic, without deeper scientific framing.',
 'Delivers a clear, research-supported synthesis explaining the specific medical and clinical hazards of demographic dataset bias, such as heightened diagnostic failure rates, sub-optimal therapeutics, or inaccurate polygenic risk modeling for diverse groups.'),
('Usability & User Experience', 20, 3,
 'Outputs the necessary mathematical distributions, but has an unoptimized layout or dense arrangement that requires technical experience to parse.',
 'Presents a clean, high-fidelity, intuitive design interface. A non-technical professional, frontline clinician, or medical policymaker could easily navigate the pipeline and comprehend the underlying equity trends within 30 seconds.'),
('Pitch & Storytelling', 20, 4,
 'Focuses primarily on technical descriptions of the specific software frameworks or dependencies used to sort data.',
 'Delivers a highly compelling 2-minute project walkthrough that articulates the societal problem, presents a live end-to-end interface simulation, and provides clear, practical conclusions or system architecture takeaways.')
on conflict (name) do nothing;

-- Teams are intentionally not seeded: add the participating teams from /admin.

alter table judges enable row level security;
alter table teams enable row level security;
alter table categories enable row level security;
alter table scores enable row level security;
alter table judge_status enable row level security;
alter table judge_picks enable row level security;
-- No browser-facing policies are created. The service_role bypasses RLS only on the server.
