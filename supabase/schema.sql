create table if not exists public.diet_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.diet_states enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_diet_states_updated_at on public.diet_states;
create trigger set_diet_states_updated_at
before update on public.diet_states
for each row
execute function public.set_updated_at();

drop policy if exists "usuario le proprio plano" on public.diet_states;
create policy "usuario le proprio plano"
on public.diet_states
for select
using (auth.uid() = user_id);

drop policy if exists "usuario cria proprio plano" on public.diet_states;
create policy "usuario cria proprio plano"
on public.diet_states
for insert
with check (auth.uid() = user_id);

drop policy if exists "usuario atualiza proprio plano" on public.diet_states;
create policy "usuario atualiza proprio plano"
on public.diet_states
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
