-- CannTrace Care - Database Schema
-- Sistema de Rastreabilidade Seed-to-Patient para Cannabis Medicinal

-- Habilitar extensões necessárias
create extension if not exists "uuid-ossp";

-- Enum para roles de usuário (RBAC)
create type user_role as enum ('MEDICO', 'PACIENTE', 'CULTIVADOR', 'SUPORTE');

-- Enum para status de lotes
create type batch_status as enum ('CULTIVO', 'COLHEITA', 'EXTRACAO', 'DISPENSADO');

-- Tabela de Perfis de Usuário
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'PACIENTE',
  cpf text unique,
  crm text, -- Para médicos
  license_number text, -- Para cultivadores
  phone text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de Lotes com Auditoria (Rastreabilidade)
create table if not exists public.lotes (
  id uuid primary key default uuid_generate_v4(),
  codigo_qr text unique not null,
  strain text not null,
  cbd_percentage decimal(5,2),
  thc_percentage decimal(5,2),
  cbd_thc_ratio text,
  status batch_status default 'CULTIVO',
  hash_integridade text not null, -- DNA Digital do Lote (SHA-256)
  cultivador_id uuid references public.profiles(id),
  data_plantio date,
  data_colheita date,
  data_extracao date,
  peso_inicial_kg decimal(10,3),
  peso_final_kg decimal(10,3),
  laudo_laboratorial_url text,
  laudo_hash text, -- Hash do laudo para verificar integridade
  notas text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de Histórico de Lotes (Timeline Seed-to-Patient)
create table if not exists public.lote_historico (
  id uuid primary key default uuid_generate_v4(),
  lote_id uuid references public.lotes(id) on delete cascade,
  status batch_status not null,
  descricao text,
  responsavel_id uuid references public.profiles(id),
  hash_evento text not null, -- Hash do evento para auditoria
  created_at timestamp with time zone default now()
);

-- Tabela de Prescrições (Vínculo Médico-Paciente)
create table if not exists public.prescricoes (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references public.profiles(id) on delete cascade,
  medico_id uuid references public.profiles(id),
  lote_id uuid references public.lotes(id),
  dosagem_diaria text not null,
  frequencia text not null,
  via_administracao text,
  indicacao_clinica text,
  observacoes text,
  pdf_url text,
  validade date default (current_date + interval '6 months'),
  status text default 'ATIVA' check (status in ('ATIVA', 'EXPIRADA', 'CANCELADA')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de Documentos ANVISA
create table if not exists public.documentos_anvisa (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references public.profiles(id) on delete cascade,
  tipo text not null check (tipo in ('AUTORIZACAO_IMPORTACAO', 'TERMO_RESPONSABILIDADE', 'LAUDO_MEDICO', 'OUTROS')),
  numero_documento text,
  data_emissao date,
  data_validade date,
  arquivo_url text,
  status text default 'VALIDO' check (status in ('VALIDO', 'EXPIRADO', 'PENDENTE')),
  created_at timestamp with time zone default now()
);

-- Tabela de Diário de Sintomas (Paciente)
create table if not exists public.diario_sintomas (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references public.profiles(id) on delete cascade,
  prescricao_id uuid references public.prescricoes(id),
  data_registro date default current_date,
  sintomas_antes jsonb, -- {dor: 8, ansiedade: 7, insonia: 9}
  sintomas_depois jsonb, -- {dor: 3, ansiedade: 4, insonia: 5}
  dosagem_utilizada text,
  efeitos_colaterais text,
  notas text,
  created_at timestamp with time zone default now()
);

-- Tabela de Sensores IoT (Monitoramento de Estufas)
create table if not exists public.sensores_iot (
  id uuid primary key default uuid_generate_v4(),
  lote_id uuid references public.lotes(id) on delete cascade,
  cultivador_id uuid references public.profiles(id),
  temperatura decimal(5,2),
  umidade decimal(5,2),
  co2_ppm integer,
  luminosidade_lux integer,
  ph_solo decimal(4,2),
  timestamp_leitura timestamp with time zone default now()
);

-- Tabela de Consultas (Telemedicina)
create table if not exists public.consultas (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references public.profiles(id) on delete cascade,
  medico_id uuid references public.profiles(id),
  data_hora timestamp with time zone not null,
  duracao_minutos integer default 30,
  tipo text default 'VIDEO' check (tipo in ('VIDEO', 'PRESENCIAL', 'CHAT')),
  status text default 'AGENDADA' check (status in ('AGENDADA', 'REALIZADA', 'CANCELADA', 'NAO_COMPARECEU')),
  link_sala text,
  prontuario_notas text,
  created_at timestamp with time zone default now()
);

-- Tabela de Logs de Auditoria
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  action text not null,
  table_name text,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  created_at timestamp with time zone default now()
);

-- Habilitar RLS em todas as tabelas
alter table public.profiles enable row level security;
alter table public.lotes enable row level security;
alter table public.lote_historico enable row level security;
alter table public.prescricoes enable row level security;
alter table public.documentos_anvisa enable row level security;
alter table public.diario_sintomas enable row level security;
alter table public.sensores_iot enable row level security;
alter table public.consultas enable row level security;
alter table public.audit_logs enable row level security;

-- Políticas RLS para Profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Médicos podem ver perfis de pacientes vinculados
create policy "medicos_view_pacientes" on public.profiles for select using (
  exists (
    select 1 from public.prescricoes p
    where p.medico_id = auth.uid() and p.paciente_id = profiles.id
  )
);

-- Políticas RLS para Lotes
create policy "lotes_select_all" on public.lotes for select to authenticated using (true);
create policy "lotes_insert_cultivador" on public.lotes for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'CULTIVADOR')
);
create policy "lotes_update_cultivador" on public.lotes for update using (cultivador_id = auth.uid());

-- Políticas RLS para Prescrições
create policy "prescricoes_select_paciente" on public.prescricoes for select using (paciente_id = auth.uid());
create policy "prescricoes_select_medico" on public.prescricoes for select using (medico_id = auth.uid());
create policy "prescricoes_insert_medico" on public.prescricoes for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'MEDICO')
);
create policy "prescricoes_update_medico" on public.prescricoes for update using (medico_id = auth.uid());

-- Políticas RLS para Documentos ANVISA
create policy "docs_select_own" on public.documentos_anvisa for select using (paciente_id = auth.uid());
create policy "docs_insert_own" on public.documentos_anvisa for insert with check (paciente_id = auth.uid());
create policy "docs_update_own" on public.documentos_anvisa for update using (paciente_id = auth.uid());

-- Políticas RLS para Diário de Sintomas
create policy "diario_select_own" on public.diario_sintomas for select using (paciente_id = auth.uid());
create policy "diario_insert_own" on public.diario_sintomas for insert with check (paciente_id = auth.uid());
create policy "diario_select_medico" on public.diario_sintomas for select using (
  exists (
    select 1 from public.prescricoes p
    where p.medico_id = auth.uid() and p.paciente_id = diario_sintomas.paciente_id
  )
);

-- Políticas RLS para Sensores IoT
create policy "sensores_select_cultivador" on public.sensores_iot for select using (cultivador_id = auth.uid());
create policy "sensores_insert_cultivador" on public.sensores_iot for insert with check (cultivador_id = auth.uid());

-- Políticas RLS para Consultas
create policy "consultas_select_paciente" on public.consultas for select using (paciente_id = auth.uid());
create policy "consultas_select_medico" on public.consultas for select using (medico_id = auth.uid());
create policy "consultas_insert_medico" on public.consultas for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'MEDICO')
);

-- Suporte pode ver logs de auditoria
create policy "audit_select_suporte" on public.audit_logs for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'SUPORTE')
);

-- Trigger para criar perfil automaticamente após signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, cpf, crm)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Usuário'),
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'PACIENTE'),
    new.raw_user_meta_data ->> 'cpf',
    new.raw_user_meta_data ->> 'crm'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Função para gerar hash de integridade de lote
create or replace function generate_batch_hash(
  p_codigo_qr text,
  p_strain text,
  p_status batch_status
) returns text
language plpgsql
as $$
begin
  return encode(sha256((p_codigo_qr || '-' || p_strain || '-' || p_status::text)::bytea), 'hex');
end;
$$;

-- Trigger para atualizar hash quando lote é modificado
create or replace function update_lote_hash()
returns trigger
language plpgsql
as $$
begin
  new.hash_integridade := generate_batch_hash(new.codigo_qr, new.strain, new.status);
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists lote_hash_update on public.lotes;
create trigger lote_hash_update
  before insert or update on public.lotes
  for each row
  execute function update_lote_hash();

-- Trigger para registrar histórico de lote
create or replace function log_lote_status_change()
returns trigger
language plpgsql
as $$
begin
  if (old.status is distinct from new.status) then
    insert into public.lote_historico (lote_id, status, descricao, responsavel_id, hash_evento)
    values (
      new.id,
      new.status,
      'Status alterado de ' || coalesce(old.status::text, 'NOVO') || ' para ' || new.status::text,
      new.cultivador_id,
      encode(sha256((new.id::text || '-' || new.status::text || '-' || now()::text)::bytea), 'hex')
    );
  end if;
  return new;
end;
$$;

drop trigger if exists lote_status_log on public.lotes;
create trigger lote_status_log
  after update on public.lotes
  for each row
  execute function log_lote_status_change();

-- Índices para performance
create index if not exists idx_lotes_status on public.lotes(status);
create index if not exists idx_lotes_cultivador on public.lotes(cultivador_id);
create index if not exists idx_prescricoes_paciente on public.prescricoes(paciente_id);
create index if not exists idx_prescricoes_medico on public.prescricoes(medico_id);
create index if not exists idx_diario_paciente on public.diario_sintomas(paciente_id);
create index if not exists idx_sensores_lote on public.sensores_iot(lote_id);
create index if not exists idx_consultas_paciente on public.consultas(paciente_id);
create index if not exists idx_consultas_medico on public.consultas(medico_id);
