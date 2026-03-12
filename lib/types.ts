// CannTrace Care - Type Definitions

export type UserRole = 'MEDICO' | 'PACIENTE' | 'CULTIVADOR' | 'SUPORTE';

export type LoteStatus = 'CULTIVO' | 'COLHEITA' | 'EXTRACAO' | 'DISPENSADO';

export type ConsultaStatus = 'AGENDADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';

export interface Profile {
  id: string;
  email: string;
  nome_completo: string;
  role: UserRole;
  crm?: string;
  cpf?: string;
  telefone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Lote {
  id: string;
  codigo_qr: string;
  strain: string;
  cbd_thc_ratio: string;
  status: LoteStatus;
  hash_integridade: string;
  cultivador_id: string;
  data_plantio?: string;
  data_colheita?: string;
  data_extracao?: string;
  peso_bruto_g?: number;
  peso_final_g?: number;
  laudo_laboratorial_url?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
}

export interface LoteHistorico {
  id: string;
  lote_id: string;
  status_anterior?: LoteStatus;
  status_novo: LoteStatus;
  descricao: string;
  hash_momento: string;
  usuario_id: string;
  created_at: string;
}

export interface Prescricao {
  id: string;
  paciente_id: string;
  medico_id: string;
  lote_id?: string;
  dosagem_diaria: string;
  forma_uso: string;
  indicacao: string;
  observacoes?: string;
  pdf_url?: string;
  validade: string;
  assinatura_digital?: string;
  created_at: string;
}

export interface DocumentoANVISA {
  id: string;
  paciente_id: string;
  tipo: 'AUTORIZACAO_IMPORTACAO' | 'TERMO_RESPONSABILIDADE' | 'LAUDO_MEDICO' | 'OUTRO';
  numero_documento?: string;
  arquivo_url: string;
  validade?: string;
  created_at: string;
}

export interface DiarioSintomas {
  id: string;
  paciente_id: string;
  prescricao_id?: string;
  data_registro: string;
  sintomas: string[];
  intensidade: number;
  melhora_percebida: number;
  efeitos_colaterais?: string[];
  notas?: string;
  created_at: string;
}

export interface SensorIoT {
  id: string;
  lote_id: string;
  tipo: 'TEMPERATURA' | 'UMIDADE' | 'LUZ' | 'CO2' | 'PH';
  valor: number;
  unidade: string;
  created_at: string;
}

export interface Consulta {
  id: string;
  medico_id: string;
  paciente_id: string;
  data_hora: string;
  status: ConsultaStatus;
  link_video?: string;
  notas_medico?: string;
  prescricao_id?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  usuario_id: string;
  acao: string;
  tabela: string;
  registro_id: string;
  dados_anteriores?: Record<string, unknown>;
  dados_novos?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalLotes: number;
  lotesEmCultivo: number;
  lotesDispensados: number;
  prescricoesAtivas: number;
  consultasAgendadas: number;
  pacientesAtivos: number;
}

// Chart Data Types
export interface RWEChartData {
  strain: string;
  cbd_ratio: number;
  thc_ratio: number;
  melhora_media: number;
  total_pacientes: number;
}

export interface TimelineEvent {
  id: string;
  status: LoteStatus;
  descricao: string;
  data: string;
  hash: string;
}
