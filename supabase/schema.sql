-- GEPAA 2026 — Banco de dados e políticas de segurança
-- Execute este arquivo inteiro no SQL Editor do seu projeto Supabase.
-- O público pode SOMENTE inserir avaliações. Somente administradores cadastrados leem os registros.

create table if not exists public.gepaa_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  answers jsonb not null
);

create table if not exists public.gepaa_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists gepaa_responses_created_at_idx
  on public.gepaa_responses (created_at desc);

grant usage on schema public to anon, authenticated;

alter table public.gepaa_responses enable row level security;
alter table public.gepaa_admins enable row level security;

-- Comece removendo privilégios padrão; depois conceda somente o necessário.
revoke all on table public.gepaa_responses from public, anon, authenticated;
revoke all on table public.gepaa_admins from public, anon, authenticated;

grant insert (answers) on table public.gepaa_responses to anon;
grant select on table public.gepaa_responses to authenticated;
grant select on table public.gepaa_admins to authenticated;

drop policy if exists "Public can submit GEPAA responses" on public.gepaa_responses;
create policy "Public can submit GEPAA responses"
on public.gepaa_responses
for insert
to anon
with check (
  jsonb_typeof(answers) = 'object'
  and answers ->> 'formVersion' = 'GEPAA-2026-v1'
  and jsonb_typeof(answers -> 'profile') = 'array'
  and jsonb_typeof(answers -> 'general') = 'object'
  and jsonb_typeof(answers -> 'cycles') = 'object'
  and jsonb_typeof(answers -> 'activities') = 'object'
  and jsonb_typeof(answers -> 'perception') = 'object'
  and jsonb_typeof(answers -> 'comments') = 'object'
  and length(coalesce(answers ->> 'courseArea', '')) <= 120
  and length(coalesce(answers #>> '{comments,memorable}', '')) <= 1200
  and length(coalesce(answers #>> '{comments,nextCycle}', '')) <= 1200
  and length(coalesce(answers #>> '{comments,suggestions}', '')) <= 1200
);

drop policy if exists "Admins can read their own authorization" on public.gepaa_admins;
create policy "Admins can read their own authorization"
on public.gepaa_admins
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Only GEPAA admins can read responses" on public.gepaa_responses;
create policy "Only GEPAA admins can read responses"
on public.gepaa_responses
for select
to authenticated
using (
  exists (
    select 1
    from public.gepaa_admins as admins
    where admins.user_id = (select auth.uid())
  )
);

-- Não há políticas de UPDATE ou DELETE para o público ou para administradores no painel.
-- Para apagar registros, somente o proprietário do projeto pode fazê-lo pelo Dashboard do Supabase.
