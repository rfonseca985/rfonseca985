-- CannTrace Care - Schema Completo
-- Sistema de Rastreabilidade Seed-to-Patient para Cannabis Medicinal

-- Habilitar extensões necessárias
create extension if not exists "uuid-ossp";

-- Enum para tipos de usuário (RBAC)
create type user_role as enum ('MEDICO', 'PACIENTE', 'CULTIVADOR', 'SUPORTE');

-- Enum para status do lote
create type lote_status as enum ('SEMENTE', 'CULTIVO', 'COLHEITA', 'EXTRACAO', 'LABORATORIO', 'DISPENSADO');

-- Tabela de Perfis de Usuário com RBAC
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nome_completo text not null,
  role user_role not null default 'PACIENTE',
  cpf text unique,
  crm text, -- Para médicos
  cnpj text, -- Para cultivadores
  telefone text,
  avatar_url text,
  documento_verificado boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de Lotes com Auditoria e Hash de Integridade
create table if not exists public.lotes (
  id uuid primary key default uuid_generate_v4(),
  codigo_qr text unique not null,
  cultivador_id uuid references public.profiles(id) on delete set null,
  strain text not null,
  cbd_percent numeric(5,2),
  thc_percent numeric(5,2),
  cbd_thc_ratio text,
  status lote_status default 'SEMENTE',
  hash_integridade text not null,
  data_plantio date,
  data_colheita date,
  data_extracao date,
  quantidade_gramas numeric(10,2),
  laudo_laboratorial_url text,
  notas text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de Timeline do Lote (Rastreabilidade)
create table if not exists public.lote_timeline (
  id uuid primary key default uuid_generate_v4(),
  lote_id uuid references public.lotes(id) on delete cascade,
  status lote_status not null,
  descricao text,
  responsavel_id uuid references public.profiles(id),
  hash_anterior text,
  hash_atual text not null,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- Tabela de Prescrições (Vínculo Médico-Paciente)
create table if not exists public.prescricoes (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references public.profiles(id) on delete cascade,
  medico_id uuid references public.profiles(id) on delete set null,
  lote_id uuid references public.lotes(id) on delete set null,
  codigo_receita text unique not null,
  diagnostico text not null,
  dosagem_diaria text not null,
  forma_uso text,
  duracao_tratamento text,
  pdf_url text,
  assinatura_digital text, -- ICP-Brasil
  validade date default (current_date + interval '6 months'),
  status text default 'ATIVA' check (status in ('ATIVA', 'EXPIRADA', 'CANCELADA', 'DISPENSADA')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de Diário de Sintomas (RWE - Real World Evidence)
create table if not exists public.diario_sintomas (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references public.profiles(id) on delete cascade,
  prescricao_id uuid references public.prescricoes(id) on delete set null,
  data_registro date default current_date,
  sintomas_antes jsonb, -- {dor: 8, ansiedade: 7, insonia: 9}
  sintomas_depois jsonb, -- {dor: 3, ansiedade: 4, insonia: 5}
  dose_utilizada text,
  efeitos_colaterais text,
  notas text,
  created_at timestamp with time zone default now()
);

-- Tabela de Documentos ANVISA
create table if not exists public.documentos_anvisa (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references public.profiles(id) on delete cascade,
  tipo_documento text not null check (tipo_documento in ('AUTORIZACAO_IMPORTACAO', 'TERMO_RESPONSABILIDADE', 'LAUDO_MEDICO', 'RECEITA', 'OUTRO')),
  nome_arquivo text not null,
  url_arquivo text not null,
  data_validade date,
  verificado boolean default false,
  created_at timestamp with time zone default now()
);

-- Tabela de Sensores IoT (Monitoramento de Estufa)
create table if not exists public.sensores_iot (
  id uuid primary key default uuid_generate_v4(),
  cultivador_id uuid references public.profiles(id) on delete cascade,
  lote_id uuid references public.lotes(id) on delete set null,
  nome_sensor text not null,
  tipo_sensor text not null check (tipo_sensor in ('TEMPERATURA', 'UMIDADE', 'CO2', 'LUZ', 'PH', 'EC')),
  localizacao text,
  ativo boolean default true,
  created_at timestamp with time zone default now()
);

-- Tabela de Leituras dos Sensores
create table if not exists public.leituras_sensores (
  id uuid primary key default uuid_generate_v4(),
  sensor_id uuid references public.sensores_iot(id) on delete cascade,
  valor numeric(10,2) not null,
  unidade text not null,
  alerta boolean default false,
  created_at timestamp with time zone default now()
);

-- Tabela de Consultas de Telemedicina
create table if not exists public.consultas (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid references public.profiles(id) on delete cascade,
  medico_id uuid references public.profiles(id) on delete set null,
  data_hora timestamp with time zone not null,
  duracao_minutos integer default 30,
  status text default 'AGENDADA' check (status in ('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA')),
  link_sala text,
  notas_medico text,
  prescricao_id uuid references public.prescricoes(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de Logs de Auditoria
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references public.profiles(id) on delete set null,
  acao text not null,
  tabela_afetada text not null,
  registro_id uuid,
  dados_anteriores jsonb,
  dados_novos jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default now()
);

-- Índices para performance
create index if not exists idx_lotes_cultivador on public.lotes(cultivador_id);
create index if not exists idx_lotes_status on public.lotes(status);
create index if not exists idx_prescricoes_paciente on public.prescricoes(paciente_id);
create index if not exists idx_prescricoes_medico on public.prescricoes(medico_id);
create index if not exists idx_prescricoes_validade on public.prescricoes(validade);
create index if not exists idx_diario_paciente on public.diario_sintomas(paciente_id);
create index if not exists idx_leituras_sensor on public.leituras_sensores(sensor_id);
create index if not exists idx_audit_usuario on public.audit_logs(usuario_id);
create index if not exists idx_timeline_lote on public.lote_timeline(lote_id);
