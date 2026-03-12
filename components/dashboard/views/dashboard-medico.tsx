'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Calendar, FileText, BarChart3 } from 'lucide-react'

interface DashboardMedicoProps {
  userId: string
}

export function DashboardMedico({ userId }: DashboardMedicoProps) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground mt-1">Sob sua supervisão</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Consultas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">3</div>
            <p className="text-xs text-muted-foreground mt-1">Agendadas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receitas Emitidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">28</div>
            <p className="text-xs text-muted-foreground mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">RWE Coletado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">89%</div>
            <p className="text-xs text-muted-foreground mt-1">Aderência dos pacientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consultas de hoje */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Consultas de Hoje
            </CardTitle>
            <CardDescription>Sua agenda de telemedicina</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { paciente: 'João Silva', hora: '10:00', tipo: 'Seguimento' },
                { paciente: 'Maria Santos', hora: '11:00', tipo: 'Inicial' },
                { paciente: 'Pedro Costa', hora: '14:00', tipo: 'Seguimento' },
              ].map((cons, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-700/30 border border-border/50 flex items-between justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{cons.paciente}</p>
                    <p className="text-xs text-muted-foreground">{cons.tipo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{cons.hora}</p>
                    <Button size="sm" className="w-24 mt-1 h-6 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                      Iniciar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações rápidas */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Nova Prescrição
            </Button>
            <Button variant="outline" className="w-full justify-start border-border">
              <Users className="w-4 h-4 mr-2" />
              Visualizar Pacientes
            </Button>
            <Button variant="outline" className="w-full justify-start border-border">
              <BarChart3 className="w-4 h-4 mr-2" />
              Relatório RWE
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pacientes Recentes */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Pacientes Recentes
          </CardTitle>
          <CardDescription>Últimas atividades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { nome: 'João Silva', cepas: 'CBD 15%', ultima: 'Ontem' },
              { nome: 'Maria Santos', cepas: 'THC 5%', ultima: 'Há 2 dias' },
              { nome: 'Pedro Costa', cepas: 'CBD 20%', ultima: 'Há 3 dias' },
            ].map((pac, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-700/30 border border-border/50 flex items-between justify-between text-sm">
                <div>
                  <p className="font-medium text-foreground">{pac.nome}</p>
                  <p className="text-xs text-muted-foreground">{pac.cepas}</p>
                </div>
                <p className="text-xs text-muted-foreground">{pac.ultima}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
