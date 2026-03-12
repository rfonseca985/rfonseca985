import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, ClipboardList, TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react'
import type { DiarioSintomas } from '@/lib/types'

const intensidadeLabels = ['Muito Leve', 'Leve', 'Moderado', 'Intenso', 'Muito Intenso']
const melhoraLabels = ['Nenhuma', 'Pouca', 'Moderada', 'Boa', 'Excelente']

export default async function DiarioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: registros } = await supabase
    .from('diario_sintomas')
    .select('*')
    .eq('paciente_id', user?.id)
    .order('data_registro', { ascending: false })
    .limit(30)

  const diarios = (registros || []) as DiarioSintomas[]

  // Calculate average improvement
  const avgMelhora = diarios.length > 0
    ? diarios.reduce((acc, d) => acc + d.melhora_percebida, 0) / diarios.length
    : 0

  // Get trend (last 7 vs previous 7)
  const last7 = diarios.slice(0, 7)
  const prev7 = diarios.slice(7, 14)
  const last7Avg = last7.length > 0 ? last7.reduce((acc, d) => acc + d.melhora_percebida, 0) / last7.length : 0
  const prev7Avg = prev7.length > 0 ? prev7.reduce((acc, d) => acc + d.melhora_percebida, 0) / prev7.length : 0
  const trend = last7Avg - prev7Avg

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Diario de Sintomas</h1>
          <p className="text-muted-foreground">
            Registre seus sintomas e acompanhe sua evolucao
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/diario/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Registro
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Registros</p>
                <p className="text-2xl font-bold text-foreground">{diarios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Melhora Media</p>
                <p className="text-2xl font-bold text-foreground">
                  {melhoraLabels[Math.round(avgMelhora)] || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${
                trend > 0 
                  ? 'bg-emerald-500/10 border border-emerald-500/20' 
                  : trend < 0 
                  ? 'bg-destructive/10 border border-destructive/20'
                  : 'bg-muted border border-border/50'
              }`}>
                {trend > 0 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                ) : trend < 0 ? (
                  <TrendingDown className="w-5 h-5 text-destructive" />
                ) : (
                  <Minus className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tendencia (7 dias)</p>
                <p className={`text-2xl font-bold ${
                  trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-destructive' : 'text-foreground'
                }`}>
                  {trend > 0 ? 'Melhorando' : trend < 0 ? 'Piorando' : 'Estavel'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diary Entries */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Registros Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {diarios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <ClipboardList className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Nenhum registro encontrado</p>
              <p className="text-sm text-muted-foreground mt-1">
                Comece a registrar seus sintomas para acompanhar sua evolucao
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/diario/novo">
                  <Plus className="w-4 h-4 mr-2" />
                  Primeiro Registro
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {diarios.map((registro) => (
                <div
                  key={registro.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-medium text-foreground">
                        {new Date(registro.data_registro).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </p>
                      <Badge variant="outline" className={
                        registro.melhora_percebida >= 3 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                          : registro.melhora_percebida >= 2
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                          : 'bg-muted text-muted-foreground border-border/50'
                      }>
                        Melhora: {melhoraLabels[registro.melhora_percebida]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {registro.sintomas.map((sintoma, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {sintoma}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Intensidade: {intensidadeLabels[registro.intensidade]}
                    </p>
                    {registro.notas && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {registro.notas}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
