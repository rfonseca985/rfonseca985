'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, TrendingUp, AlertCircle } from 'lucide-react'

interface DashboardPacienteProps {
  userId: string
}

export function DashboardPaciente({ userId }: DashboardPacienteProps) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receitas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2</div>
            <p className="text-xs text-muted-foreground mt-1">Prescrições válidas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Próxima Consulta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">25 Mar</div>
            <p className="text-xs text-muted-foreground mt-1">Com Dr. Silva</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lote Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">CBD 15%</div>
            <p className="text-xs text-muted-foreground mt-1">THC 0.2%</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aderência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">92%</div>
            <p className="text-xs text-muted-foreground mt-1">Últimas 2 semanas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Receitas */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Minhas Receitas
            </CardTitle>
            <CardDescription>Receitas médicas ativas e histórico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { medico: 'Dr. João Silva', cepa: 'CBD 15%', data: '2024-02-15', validade: '2024-08-15' },
                { medico: 'Dra. Maria Santos', cepa: 'THC 5%', data: '2024-02-10', validade: '2024-08-10' },
              ].map((rec, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-700/30 border border-border/50 flex items-between justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{rec.medico}</p>
                    <p className="text-xs text-muted-foreground">{rec.cepa}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Válida até</p>
                    <p className="text-sm font-medium text-foreground">{rec.validade.split('-').reverse().join('/')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximas Consultas */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5 text-primary" />
              Próximas Consultas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { medico: 'Dr. Silva', data: '25 Mar, 14:00' },
                { medico: 'Dra. Santos', data: '02 Abr, 10:00' },
              ].map((cons, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-700/30 border border-border/50">
                  <p className="font-medium text-foreground text-sm">{cons.medico}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cons.data}</p>
                  <Button size="sm" className="w-full mt-2 h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                    Acessar Consulta
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      <Card className="border-yellow-500/30 bg-yellow-500/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Avisos Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="space-y-1">
            <li>• Receita expira em 45 dias</li>
            <li>• Preencha o diário de sintomas regularmente</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
