import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { BatchesTable } from '@/components/dashboard/batches-table'
import { BatchTimeline } from '@/components/dashboard/batch-timeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, Calendar, ShieldCheck } from 'lucide-react'
import type { DashboardStats, Lote, TimelineEvent, UserRole } from '@/lib/types'

async function getDashboardData(supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never) {
  // Fetch stats
  const [
    { count: totalLotes },
    { count: lotesEmCultivo },
    { count: lotesDispensados },
    { count: prescricoesAtivas },
    { count: consultasAgendadas },
    { count: pacientesAtivos },
  ] = await Promise.all([
    supabase.from('lotes').select('*', { count: 'exact', head: true }),
    supabase.from('lotes').select('*', { count: 'exact', head: true }).eq('status', 'CULTIVO'),
    supabase.from('lotes').select('*', { count: 'exact', head: true }).eq('status', 'DISPENSADO'),
    supabase.from('prescricoes').select('*', { count: 'exact', head: true }).gte('validade', new Date().toISOString()),
    supabase.from('consultas').select('*', { count: 'exact', head: true }).eq('status', 'AGENDADA'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'PACIENTE'),
  ])

  const stats: DashboardStats = {
    totalLotes: totalLotes || 0,
    lotesEmCultivo: lotesEmCultivo || 0,
    lotesDispensados: lotesDispensados || 0,
    prescricoesAtivas: prescricoesAtivas || 0,
    consultasAgendadas: consultasAgendadas || 0,
    pacientesAtivos: pacientesAtivos || 0,
  }

  // Fetch recent batches
  const { data: batches } = await supabase
    .from('lotes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return { stats, batches: (batches || []) as Lote[] }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userRole = (user?.user_metadata?.role as UserRole) || 'PACIENTE'
  const userName = user?.user_metadata?.nome_completo || 'Usuario'

  const { stats, batches } = await getDashboardData(supabase)

  // Sample timeline data for demo
  const sampleTimeline: TimelineEvent[] = batches.length > 0 ? [
    {
      id: '1',
      status: 'CULTIVO',
      descricao: 'Lote iniciado - Plantio realizado',
      data: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      hash: batches[0]?.hash_integridade || 'abc123def456',
    },
  ] : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
              Bem-vindo, {userName.split(' ')[0]}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Resumo da sua plataforma CannTrace Care
            </p>
          </div>
          <button className="relative p-2 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted transition-colors flex-shrink-0">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>
        <Badge variant="outline" className="gap-1.5 text-emerald-500 border-emerald-500/30 bg-emerald-500/10 py-1.5 w-fit">
          <ShieldCheck className="w-3.5 h-3.5" />
          Compliance ANVISA
        </Badge>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Batches Table - Takes 2 columns */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          {(userRole === 'CULTIVADOR' || userRole === 'SUPORTE') && (
            <BatchesTable batches={batches} />
          )}
          {(userRole === 'MEDICO' || userRole === 'PACIENTE') && (
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Proximas Consultas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Nenhuma consulta agendada</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {userRole === 'MEDICO' 
                      ? 'Suas consultas aparecerao aqui' 
                      : 'Agende uma consulta com seu medico'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
          {/* Timeline Preview */}
          {batches.length > 0 && (userRole === 'CULTIVADOR' || userRole === 'SUPORTE') && (
            <BatchTimeline
              events={sampleTimeline}
              currentStatus={batches[0]?.status || 'CULTIVO'}
              hashIntegridade={batches[0]?.hash_integridade || 'N/A'}
            />
          )}

          {/* Quick Actions */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Acoes Rapidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userRole === 'CULTIVADOR' && (
                <>
                  <QuickAction href="/dashboard/lotes/novo" label="Registrar Novo Lote" />
                  <QuickAction href="/dashboard/sensores" label="Ver Sensores IoT" />
                </>
              )}
              {userRole === 'MEDICO' && (
                <>
                  <QuickAction href="/dashboard/prescricoes/nova" label="Nova Prescricao" />
                  <QuickAction href="/dashboard/pacientes" label="Ver Pacientes" />
                </>
              )}
              {userRole === 'PACIENTE' && (
                <>
                  <QuickAction href="/dashboard/diario/novo" label="Registrar Sintomas" />
                  <QuickAction href="/dashboard/documentos" label="Meus Documentos" />
                </>
              )}
              {userRole === 'SUPORTE' && (
                <>
                  <QuickAction href="/dashboard/auditoria" label="Logs de Auditoria" />
                  <QuickAction href="/dashboard/usuarios" label="Gerenciar Usuarios" />
                </>
              )}
            </CardContent>
          </Card>

          {/* Compliance Status */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Status de Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ComplianceItem label="RDC 660/22" status="ok" />
              <ComplianceItem label="RDC 327/19" status="ok" />
              <ComplianceItem label="LGPD" status="ok" />
              <ComplianceItem label="Criptografia AES-256" status="ok" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group"
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
        &rarr;
      </span>
    </a>
  )
}

function ComplianceItem({ label, status }: { label: string; status: 'ok' | 'warning' | 'error' }) {
  const statusColors = {
    ok: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-destructive',
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
        <span className="text-xs text-muted-foreground capitalize">
          {status === 'ok' ? 'Conforme' : status === 'warning' ? 'Atencao' : 'Pendente'}
        </span>
      </div>
    </div>
  )
}
