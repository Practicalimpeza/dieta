create table if not exists public.diet_app_state (
  id text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.diet_app_state enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_diet_app_state_updated_at on public.diet_app_state;
create trigger set_diet_app_state_updated_at
before update on public.diet_app_state
for each row
execute function public.set_updated_at();

drop policy if exists "public le plano" on public.diet_app_state;
create policy "public le plano"
on public.diet_app_state
for select
to anon, authenticated
using (true);

drop policy if exists "public cria plano" on public.diet_app_state;
create policy "public cria plano"
on public.diet_app_state
for insert
to anon, authenticated
with check (true);

drop policy if exists "public atualiza plano" on public.diet_app_state;
create policy "public atualiza plano"
on public.diet_app_state
for update
to anon, authenticated
using (true)
with check (true);

insert into public.diet_app_state (id, state)
values ('principal', '{}'::jsonb)
on conflict (id) do nothing;
