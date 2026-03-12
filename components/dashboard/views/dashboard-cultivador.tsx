'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Droplet, Microscope, QrCode, TrendingUp } from 'lucide-react'

interface DashboardCultivadorProps {
  userId: string
}

export function DashboardCultivador({ userId }: DashboardCultivadorProps) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lotes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">5</div>
            <p className="text-xs text-muted-foreground mt-1">Em diferentes estágios</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sensores Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">12/12</div>
            <p className="text-xs text-muted-foreground mt-1">Funcionando normalmente</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dispensado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24</div>
            <p className="text-xs text-muted-foreground mt-1">kg este mês</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Integridade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">100%</div>
            <p className="text-xs text-muted-foreground mt-1">Sem alterações</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lotes */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-primary" />
              Meus Lotes
            </CardTitle>
            <CardDescription>Status e rastreabilidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { codigo: 'LOT-2024-001', cepa: 'CBD 15%', status: 'COLHEITA', dias: '12 dias' },
                { codigo: 'LOT-2024-002', cepa: 'THC 5%', status: 'CULTIVO', dias: '35 dias' },
                { codigo: 'LOT-2024-003', cepa: 'CBD 20%', status: 'EXTRACAO', dias: '5 dias' },
              ].map((lote, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-700/30 border border-border/50">
                  <div className="flex items-between justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">{lote.codigo}</p>
                      <p className="text-xs text-muted-foreground">{lote.cepa}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded">{lote.status}</p>
                    </div>
                  </div>
                  <div className="flex items-between justify-between text-xs">
                    <span className="text-muted-foreground">Estágio: {lote.dias}</span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-primary">
                      Ver Detalhes
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
              <QrCode className="w-4 h-4 mr-2" />
              Novo Lote
            </Button>
            <Button variant="outline" className="w-full justify-start border-border">
              <Microscope className="w-4 h-4 mr-2" />
              IoT Dashboard
            </Button>
            <Button variant="outline" className="w-full justify-start border-border">
              <TrendingUp className="w-4 h-4 mr-2" />
              Relatórios
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Monitoramento IoT */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Microscope className="w-5 h-5 text-primary" />
            Monitoramento IoT - Estufa Principal
          </CardTitle>
          <CardDescription>Parâmetros em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { nome: 'Temperatura', valor: '24°C', status: 'normal' },
              { nome: 'Umidade', valor: '65%', status: 'normal' },
              { nome: 'CO2', valor: '600 ppm', status: 'normal' },
              { nome: 'pH', valor: '6.2', status: 'normal' },
            ].map((param, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-700/30 border border-border/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">{param.nome}</p>
                <p className="text-lg font-bold text-primary">{param.valor}</p>
                <p className="text-xs text-green-500 mt-1">✓ {param.status}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
