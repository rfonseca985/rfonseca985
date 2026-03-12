'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Sprout, 
  Scissors, 
  FlaskConical, 
  UserCheck,
  CheckCircle,
  Shield
} from 'lucide-react'
import type { LoteStatus, TimelineEvent } from '@/lib/types'

const statusConfig: Record<LoteStatus, { label: string; icon: React.ReactNode; color: string }> = {
  CULTIVO: {
    label: 'Cultivo',
    icon: <Sprout className="w-4 h-4" />,
    color: 'bg-emerald-500',
  },
  COLHEITA: {
    label: 'Colheita',
    icon: <Scissors className="w-4 h-4" />,
    color: 'bg-amber-500',
  },
  EXTRACAO: {
    label: 'Extracao',
    icon: <FlaskConical className="w-4 h-4" />,
    color: 'bg-blue-500',
  },
  DISPENSADO: {
    label: 'Dispensado',
    icon: <UserCheck className="w-4 h-4" />,
    color: 'bg-purple-500',
  },
}

interface BatchTimelineProps {
  events: TimelineEvent[]
  currentStatus: LoteStatus
  hashIntegridade: string
}

export function BatchTimeline({ events, currentStatus, hashIntegridade }: BatchTimelineProps) {
  const statusOrder: LoteStatus[] = ['CULTIVO', 'COLHEITA', 'EXTRACAO', 'DISPENSADO']
  const currentIndex = statusOrder.indexOf(currentStatus)

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Linha do Tempo - Rastreabilidade</CardTitle>
          <Badge variant="outline" className="gap-1.5 text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
            <Shield className="w-3 h-3" />
            Integridade Verificada
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground font-mono mt-2 truncate">
          Hash: {hashIntegridade}
        </p>
      </CardHeader>
      <CardContent>
        {/* Visual Timeline */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / statusOrder.length) * 100}%` }}
            />
          </div>

          {/* Status Steps */}
          <div className="relative flex justify-between">
            {statusOrder.map((status, index) => {
              const config = statusConfig[status]
              const isCompleted = index <= currentIndex
              const isCurrent = index === currentIndex

              return (
                <div key={status} className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all',
                      isCompleted
                        ? `${config.color} border-transparent text-white`
                        : 'bg-muted border-border text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      isCurrent ? config.icon : <CheckCircle className="w-5 h-5" />
                    ) : (
                      config.icon
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-3 text-sm font-medium',
                      isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {config.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Event List */}
        {events.length > 0 && (
          <div className="mt-8 space-y-3">
            <h4 className="text-sm font-medium text-foreground">Historico de Eventos</h4>
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                >
                  <div className={cn('p-2 rounded-lg', statusConfig[event.status].color)}>
                    {statusConfig[event.status].icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{event.descricao}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <code className="text-xs text-muted-foreground font-mono hidden lg:block">
                    {event.hash.slice(0, 12)}...
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
