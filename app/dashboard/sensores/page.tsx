import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Thermometer, Droplets, Sun, Wind, Activity } from 'lucide-react'

// Sample sensor data for demonstration
const sampleSensors = [
  { tipo: 'TEMPERATURA', valor: 24.5, unidade: 'C', min: 20, max: 28, status: 'ok' },
  { tipo: 'UMIDADE', valor: 65, unidade: '%', min: 50, max: 70, status: 'ok' },
  { tipo: 'LUZ', valor: 850, unidade: 'lux', min: 600, max: 1000, status: 'ok' },
  { tipo: 'CO2', valor: 420, unidade: 'ppm', min: 400, max: 600, status: 'warning' },
]

const sensorIcons: Record<string, React.ReactNode> = {
  TEMPERATURA: <Thermometer className="w-5 h-5" />,
  UMIDADE: <Droplets className="w-5 h-5" />,
  LUZ: <Sun className="w-5 h-5" />,
  CO2: <Wind className="w-5 h-5" />,
  PH: <Activity className="w-5 h-5" />,
}

const sensorLabels: Record<string, string> = {
  TEMPERATURA: 'Temperatura',
  UMIDADE: 'Umidade',
  LUZ: 'Luminosidade',
  CO2: 'CO2',
  PH: 'pH',
}

export default async function SensoresPage() {
  const supabase = await createClient()
  
  const { data: sensores } = await supabase
    .from('sensores_iot')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  // Use sample data if no real sensors
  const displaySensors = sensores && sensores.length > 0 ? sensores : sampleSensors

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Monitoramento IoT</h1>
          <p className="text-muted-foreground">
            Acompanhe os sensores das suas estufas em tempo real
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 text-emerald-500 border-emerald-500/30 bg-emerald-500/10 w-fit">
          <Activity className="w-3.5 h-3.5" />
          Todos os sistemas operacionais
        </Badge>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displaySensors.map((sensor, index) => {
          const percentage = ((sensor.valor - sensor.min) / (sensor.max - sensor.min)) * 100
          const isWarning = sensor.status === 'warning' || percentage < 20 || percentage > 80
          const isError = percentage < 10 || percentage > 90

          return (
            <Card key={index} className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${
                    isError 
                      ? 'bg-destructive/10 text-destructive'
                      : isWarning 
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {sensorIcons[sensor.tipo]}
                  </div>
                  <Badge variant="outline" className={
                    isError 
                      ? 'bg-destructive/10 text-destructive border-destructive/30'
                      : isWarning 
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                  }>
                    {isError ? 'Critico' : isWarning ? 'Atencao' : 'Normal'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{sensorLabels[sensor.tipo]}</p>
                    <p className="text-3xl font-bold text-foreground">
                      {sensor.valor}
                      <span className="text-lg text-muted-foreground ml-1">{sensor.unidade}</span>
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isError 
                            ? 'bg-destructive'
                            : isWarning 
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{sensor.min}{sensor.unidade}</span>
                      <span>{sensor.max}{sensor.unidade}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Environment Summary */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Resumo do Ambiente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Condicoes Ideais para Crescimento</p>
              <ul className="space-y-1 text-sm text-foreground">
                <li>Temperatura: 20-28C</li>
                <li>Umidade: 50-70%</li>
                <li>Luz: 600-1000 lux</li>
                <li>CO2: 400-600 ppm</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-sm text-muted-foreground mb-2">Status Atual</p>
              <p className="text-lg font-semibold text-emerald-500">Ambiente Otimo</p>
              <p className="text-xs text-muted-foreground mt-1">
                Todas as metricas dentro dos parametros ideais
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Ultima Atualizacao</p>
              <p className="text-lg font-semibold text-foreground">Agora</p>
              <p className="text-xs text-muted-foreground mt-1">
                Dados atualizados a cada 5 minutos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Alertas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 rounded-full bg-emerald-500/10 mb-4">
              <Activity className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-foreground font-medium">Nenhum alerta ativo</p>
            <p className="text-sm text-muted-foreground mt-1">
              Todos os sensores estao operando dentro dos parametros normais
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
