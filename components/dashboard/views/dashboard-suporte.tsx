'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, AlertCircle, LogSquare, Activity } from 'lucide-react'

interface DashboardSuporteProps {
  userId: string
}

export function DashboardSuporte({ userId }: DashboardSuporteProps) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuários Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">156</div>
            <p className="text-xs text-muted-foreground mt-1">Na plataforma</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes de Verificação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">8</div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alertas Críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">2</div>
            <p className="text-xs text-muted-foreground mt-1">Requer ação imediata</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sistema Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Online</div>
            <p className="text-xs text-muted-foreground mt-1">100% operacional</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usuários pendentes */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              Usuários Pendentes de Verificação
            </CardTitle>
            <CardDescription>Documentação aguardando análise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { nome: 'Dr. Fernando Silva', tipo: 'MEDICO', data: '2024-03-10', crm: 'Aguardando CRM' },
                { nome: 'João Cultivador', tipo: 'CULTIVADOR', data: '2024-03-08', docs: 'CNPJ em validação' },
                { nome: 'Maria Patient', tipo: 'PACIENTE', data: '2024-03-05', docs: 'CPF confirmado' },
              ].map((user, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-700/30 border border-border/50">
                  <div className="flex items-between justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">{user.nome}</p>
                      <p className="text-xs text-muted-foreground">{user.tipo}</p>
                    </div>
                    <span className="text-xs text-yellow-500">Desde {user.data}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                      Aprovar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-xs border-border">
                      Rejeitar
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
            <CardTitle className="text-base">Ações de Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 justify-start">
              <Users className="w-4 h-4 mr-2" />
              Gerenciar Usuários
            </Button>
            <Button variant="outline" className="w-full justify-start border-border">
              <LogSquare className="w-4 h-4 mr-2" />
              Auditoria
            </Button>
            <Button variant="outline" className="w-full justify-start border-border">
              <Activity className="w-4 h-4 mr-2" />
              Status Sistema
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      <Card className="border-red-500/30 bg-red-500/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Alertas Críticos
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <div className="p-2 rounded bg-red-500/10 border border-red-500/30">
            <p className="font-medium text-red-400">Integridade comprometida em lote LOT-2024-005</p>
            <p className="text-xs mt-1">Hash diferente detectado. Investigação necessária.</p>
          </div>
          <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/30">
            <p className="font-medium text-yellow-400">Sensor IoT offline - Estufa B</p>
            <p className="text-xs mt-1">Sensor de temperatura sem comunicação há 2 horas.</p>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Preview */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogSquare className="w-5 h-5 text-primary" />
            Últimas Atividades
          </CardTitle>
          <CardDescription>Log de auditoria resumido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {[
              { acao: 'Receita emitida', usuario: 'Dr. Silva', data: '10 min atrás' },
              { acao: 'Lote registrado', usuario: 'João Cult', data: '25 min atrás' },
              { acao: 'Usuário aprovado', usuario: 'Sistema', data: '2 horas atrás' },
              { acao: 'Consulta iniciada', usuario: 'Dra. Maria', data: '3 horas atrás' },
            ].map((log, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-700/30 border border-border/50 flex justify-between">
                <span className="text-foreground">{log.acao}</span>
                <span className="text-muted-foreground">{log.data}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
