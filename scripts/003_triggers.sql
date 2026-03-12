-- CannTrace Care - Triggers e Funções
-- Auto-criação de perfis e auditoria

-- ============================================
-- TRIGGER: Criar perfil automaticamente no signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, 
    email, 
    nome_completo, 
    role,
    cpf,
    crm,
    cnpj
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'nome_completo', 'Usuário'),
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'PACIENTE'),
    new.raw_user_meta_data ->> 'cpf',
    new.raw_user_meta_data ->> 'crm',
    new.raw_user_meta_data ->> 'cnpj'
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

-- ============================================
-- TRIGGER: Atualizar updated_at automaticamente
-- ============================================
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Aplicar em todas as tabelas com updated_at
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at();

drop trigger if exists update_lotes_updated_at on public.lotes;
create trigger update_lotes_updated_at
  before update on public.lotes
  for each row
  execute function public.update_updated_at();

drop trigger if exists update_prescricoes_updated_at on public.prescricoes;
create trigger update_prescricoes_updated_at
  before update on public.prescricoes
  for each row
  execute function public.update_updated_at();

drop trigger if exists update_consultas_updated_at on public.consultas;
create trigger update_consultas_updated_at
  before update on public.consultas
  for each row
  execute function public.update_updated_at();

-- ============================================
-- TRIGGER: Log de auditoria automático
-- ============================================
create or replace function public.audit_trigger_func()
returns trigger
language plpgsql
security definer
as $$
begin
  if TG_OP = 'INSERT' then
    insert into public.audit_logs (usuario_id, acao, tabela_afetada, registro_id, dados_novos)
    values (auth.uid(), 'INSERT', TG_TABLE_NAME, new.id, to_jsonb(new));
    return new;
  elsif TG_OP = 'UPDATE' then
    insert into public.audit_logs (usuario_id, acao, tabela_afetada, registro_id, dados_anteriores, dados_novos)
    values (auth.uid(), 'UPDATE', TG_TABLE_NAME, new.id, to_jsonb(old), to_jsonb(new));
    return new;
  elsif TG_OP = 'DELETE' then
    insert into public.audit_logs (usuario_id, acao, tabela_afetada, registro_id, dados_anteriores)
    values (auth.uid(), 'DELETE', TG_TABLE_NAME, old.id, to_jsonb(old));
    return old;
  end if;
  return null;
end;
$$;

-- Aplicar auditoria nas tabelas críticas
drop trigger if exists audit_lotes on public.lotes;
create trigger audit_lotes
  after insert or update or delete on public.lotes
  for each row
  execute function public.audit_trigger_func();

drop trigger if exists audit_prescricoes on public.prescricoes;
create trigger audit_prescricoes
  after insert or update or delete on public.prescricoes
  for each row
  execute function public.audit_trigger_func();

drop trigger if exists audit_lote_timeline on public.lote_timeline;
create trigger audit_lote_timeline
  after insert or update or delete on public.lote_timeline
  for each row
  execute function public.audit_trigger_func();

-- ============================================
-- TRIGGER: Verificar validade de prescrições
-- ============================================
create or replace function public.check_prescricao_validade()
returns trigger
language plpgsql
as $$
begin
  -- Atualizar status para EXPIRADA se passou da validade
  if new.validade < current_date and new.status = 'ATIVA' then
    new.status = 'EXPIRADA';
  end if;
  return new;
end;
$$;

drop trigger if exists check_prescricao_validade_trigger on public.prescricoes;
create trigger check_prescricao_validade_trigger
  before update on public.prescricoes
  for each row
  execute function public.check_prescricao_validade();

-- ============================================
-- FUNÇÃO: Gerar código de receita único
-- ============================================
create or replace function public.generate_receita_codigo()
returns text
language plpgsql
as $$
declare
  codigo text;
begin
  codigo := 'RX-' || to_char(now(), 'YYYYMMDD') || '-' || 
            upper(substr(md5(random()::text), 1, 6));
  return codigo;
end;
$$;

-- ============================================
-- FUNÇÃO: Gerar QR Code único para lote
-- ============================================
create or replace function public.generate_lote_qr()
returns text
language plpgsql
as $$
declare
  qr_code text;
begin
  qr_code := 'CT-' || to_char(now(), 'YYYYMMDD') || '-' || 
             upper(substr(md5(random()::text), 1, 8));
  return qr_code;
end;
$$;
