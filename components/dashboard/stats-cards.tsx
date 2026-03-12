import { Card, CardContent } from '@/components/ui/card'
import { 
  Package, 
  Sprout, 
  CheckCircle, 
  FileText, 
  Calendar, 
  Users,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DashboardStats } from '@/lib/types'

interface StatsCardsProps {
  stats: DashboardStats
}

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color: 'emerald' | 'blue' | 'amber' | 'purple'
}

function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  const colorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 md:space-y-2 min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground truncate">{title}</p>
            <p className="text-xl md:text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <div className="flex items-center gap-1">
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend.isPositive ? 'text-emerald-500' : 'text-destructive'
                  )}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">vs mes anterior</span>
              </div>
            )}
          </div>
          <div className={cn('p-2 md:p-3 rounded-lg border flex-shrink-0', colorClasses[color])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      <StatCard
        title="Total de Lotes"
        value={stats.totalLotes}
        icon={<Package className="w-5 h-5" />}
        trend={{ value: 12, isPositive: true }}
        color="emerald"
      />
      <StatCard
        title="Em Cultivo"
        value={stats.lotesEmCultivo}
        icon={<Sprout className="w-5 h-5" />}
        color="blue"
      />
      <StatCard
        title="Dispensados"
        value={stats.lotesDispensados}
        icon={<CheckCircle className="w-5 h-5" />}
        trend={{ value: 8, isPositive: true }}
        color="emerald"
      />
      <StatCard
        title="Prescricoes Ativas"
        value={stats.prescricoesAtivas}
        icon={<FileText className="w-5 h-5" />}
        color="purple"
      />
      <StatCard
        title="Consultas Agendadas"
        value={stats.consultasAgendadas}
        icon={<Calendar className="w-5 h-5" />}
        color="amber"
      />
      <StatCard
        title="Pacientes Ativos"
        value={stats.pacientesAtivos}
        icon={<Users className="w-5 h-5" />}
        trend={{ value: 5, isPositive: true }}
        color="blue"
      />
    </div>
  )
}
