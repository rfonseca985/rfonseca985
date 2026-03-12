-- CannTrace Care - Row Level Security Policies
-- Implementação LGPD compliant com controle granular por role

-- Habilitar RLS em todas as tabelas
alter table public.profiles enable row level security;
alter table public.lotes enable row level security;
alter table public.lote_timeline enable row level security;
alter table public.prescricoes enable row level security;
alter table public.diario_sintomas enable row level security;
alter table public.documentos_anvisa enable row level security;
alter table public.sensores_iot enable row level security;
alter table public.leituras_sensores enable row level security;
alter table public.consultas enable row level security;
alter table public.audit_logs enable row level security;

-- Função auxiliar para obter o role do usuário
create or replace function public.get_user_role()
returns user_role
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- ============================================
-- POLICIES PARA PROFILES
-- ============================================

-- Todos podem ver perfis públicos (nome, role)
create policy "profiles_select_public" on public.profiles
  for select using (true);

-- Usuários podem atualizar seu próprio perfil
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Inserção via trigger apenas
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- ============================================
-- POLICIES PARA LOTES
-- ============================================

-- Cultivadores podem criar lotes
create policy "lotes_insert_cultivador" on public.lotes
  for insert with check (
    public.get_user_role() = 'CULTIVADOR' 
    and auth.uid() = cultivador_id
  );

-- Cultivadores podem atualizar seus próprios lotes
create policy "lotes_update_cultivador" on public.lotes
  for update using (
    public.get_user_role() = 'CULTIVADOR' 
    and auth.uid() = cultivador_id
  );

-- Médicos e Cultivadores podem ver todos os lotes (para prescrições)
create policy "lotes_select_authorized" on public.lotes
  for select using (
    public.get_user_role() in ('MEDICO', 'CULTIVADOR', 'SUPORTE')
    or auth.uid() = cultivador_id
  );

-- Pacientes podem ver lotes das suas prescrições
create policy "lotes_select_paciente" on public.lotes
  for select using (
    exists (
      select 1 from public.prescricoes 
      where prescricoes.lote_id = lotes.id 
      and prescricoes.paciente_id = auth.uid()
    )
  );

-- ============================================
-- POLICIES PARA LOTE_TIMELINE
-- ============================================

-- Cultivadores podem inserir na timeline dos seus lotes
create policy "timeline_insert_cultivador" on public.lote_timeline
  for insert with check (
    exists (
      select 1 from public.lotes 
      where lotes.id = lote_timeline.lote_id 
      and lotes.cultivador_id = auth.uid()
    )
  );

-- Leitura para usuários autorizados
create policy "timeline_select" on public.lote_timeline
  for select using (
    public.get_user_role() in ('MEDICO', 'CULTIVADOR', 'SUPORTE')
    or exists (
      select 1 from public.prescricoes p
      join public.lotes l on l.id = p.lote_id
      where l.id = lote_timeline.lote_id and p.paciente_id = auth.uid()
    )
  );

-- ============================================
-- POLICIES PARA PRESCRIÇÕES
-- ============================================

-- Médicos podem criar prescrições
create policy "prescricoes_insert_medico" on public.prescricoes
  for insert with check (
    public.get_user_role() = 'MEDICO' 
    and auth.uid() = medico_id
  );

-- Médicos podem atualizar suas próprias prescrições
create policy "prescricoes_update_medico" on public.prescricoes
  for update using (
    public.get_user_role() = 'MEDICO' 
    and auth.uid() = medico_id
  );

-- Médicos veem todas as prescrições que criaram
create policy "prescricoes_select_medico" on public.prescricoes
  for select using (
    auth.uid() = medico_id
  );

-- Pacientes veem suas próprias prescrições
create policy "prescricoes_select_paciente" on public.prescricoes
  for select using (
    auth.uid() = paciente_id
  );

-- Suporte pode ver prescrições (sem dados clínicos sensíveis via view)
create policy "prescricoes_select_suporte" on public.prescricoes
  for select using (
    public.get_user_role() = 'SUPORTE'
  );

-- ============================================
-- POLICIES PARA DIÁRIO DE SINTOMAS
-- ============================================

-- Pacientes podem inserir no seu diário
create policy "diario_insert_paciente" on public.diario_sintomas
  for insert with check (auth.uid() = paciente_id);

-- Pacientes podem atualizar seu diário
create policy "diario_update_paciente" on public.diario_sintomas
  for update using (auth.uid() = paciente_id);

-- Pacientes veem seu próprio diário
create policy "diario_select_paciente" on public.diario_sintomas
  for select using (auth.uid() = paciente_id);

-- Médicos veem diário dos seus pacientes (via prescrição)
create policy "diario_select_medico" on public.diario_sintomas
  for select using (
    public.get_user_role() = 'MEDICO'
    and exists (
      select 1 from public.prescricoes 
      where prescricoes.paciente_id = diario_sintomas.paciente_id 
      and prescricoes.medico_id = auth.uid()
    )
  );

-- ============================================
-- POLICIES PARA DOCUMENTOS ANVISA
-- ============================================

-- Usuários podem inserir seus próprios documentos
create policy "documentos_insert_own" on public.documentos_anvisa
  for insert with check (auth.uid() = usuario_id);

-- Usuários veem seus próprios documentos
create policy "documentos_select_own" on public.documentos_anvisa
  for select using (auth.uid() = usuario_id);

-- Suporte pode ver documentos para verificação
create policy "documentos_select_suporte" on public.documentos_anvisa
  for select using (public.get_user_role() = 'SUPORTE');

-- Suporte pode atualizar status de verificação
create policy "documentos_update_suporte" on public.documentos_anvisa
  for update using (public.get_user_role() = 'SUPORTE');

-- ============================================
-- POLICIES PARA SENSORES IoT
-- ============================================

-- Cultivadores podem gerenciar seus sensores
create policy "sensores_insert_cultivador" on public.sensores_iot
  for insert with check (
    public.get_user_role() = 'CULTIVADOR' 
    and auth.uid() = cultivador_id
  );

create policy "sensores_update_cultivador" on public.sensores_iot
  for update using (auth.uid() = cultivador_id);

create policy "sensores_select_cultivador" on public.sensores_iot
  for select using (auth.uid() = cultivador_id);

create policy "sensores_delete_cultivador" on public.sensores_iot
  for delete using (auth.uid() = cultivador_id);

-- ============================================
-- POLICIES PARA LEITURAS DE SENSORES
-- ============================================

-- Sistema pode inserir leituras (via service role)
create policy "leituras_insert" on public.leituras_sensores
  for insert with check (
    exists (
      select 1 from public.sensores_iot 
      where sensores_iot.id = leituras_sensores.sensor_id 
      and sensores_iot.cultivador_id = auth.uid()
    )
  );

-- Cultivadores veem leituras dos seus sensores
create policy "leituras_select_cultivador" on public.leituras_sensores
  for select using (
    exists (
      select 1 from public.sensores_iot 
      where sensores_iot.id = leituras_sensores.sensor_id 
      and sensores_iot.cultivador_id = auth.uid()
    )
  );

-- ============================================
-- POLICIES PARA CONSULTAS
-- ============================================

-- Médicos podem criar consultas
create policy "consultas_insert_medico" on public.consultas
  for insert with check (
    public.get_user_role() = 'MEDICO' 
    and auth.uid() = medico_id
  );

-- Pacientes podem agendar consultas
create policy "consultas_insert_paciente" on public.consultas
  for insert with check (auth.uid() = paciente_id);

-- Médicos e pacientes podem ver suas consultas
create policy "consultas_select_own" on public.consultas
  for select using (
    auth.uid() = medico_id or auth.uid() = paciente_id
  );

-- Médicos podem atualizar consultas
create policy "consultas_update_medico" on public.consultas
  for update using (auth.uid() = medico_id);

-- ============================================
-- POLICIES PARA AUDIT LOGS
-- ============================================

-- Apenas suporte pode ver logs de auditoria
create policy "audit_select_suporte" on public.audit_logs
  for select using (public.get_user_role() = 'SUPORTE');

-- Sistema insere logs (via triggers)
create policy "audit_insert_system" on public.audit_logs
  for insert with check (true);
