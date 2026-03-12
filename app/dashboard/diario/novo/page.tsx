'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { ArrowLeft, AlertCircle, ClipboardList } from 'lucide-react'

const sintomasOptions = [
  'Dor',
  'Ansiedade',
  'Insonia',
  'Nausea',
  'Fadiga',
  'Espasmos',
  'Inflamacao',
  'Falta de Apetite',
  'Tremores',
  'Convulsoes',
]

const efeitosColateraisOptions = [
  'Boca Seca',
  'Tontura',
  'Sonolencia',
  'Aumento de Apetite',
  'Alteracao de Humor',
  'Nenhum',
]

export default function NovoRegistroPage() {
  const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([])
  const [efeitosColaterais, setEfeitosColaterais] = useState<string[]>([])
  const [intensidade, setIntensidade] = useState([2])
  const [melhora, setMelhora] = useState([2])
  const [notas, setNotas] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const toggleSintoma = (sintoma: string) => {
    setSintomasSelecionados(prev =>
      prev.includes(sintoma)
        ? prev.filter(s => s !== sintoma)
        : [...prev, sintoma]
    )
  }

  const toggleEfeito = (efeito: string) => {
    setEfeitosColaterais(prev =>
      prev.includes(efeito)
        ? prev.filter(e => e !== efeito)
        : [...prev, efeito]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (sintomasSelecionados.length === 0) {
      setError('Selecione pelo menos um sintoma')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('Usuario nao autenticado')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('diario_sintomas').insert({
      paciente_id: user.id,
      data_registro: new Date().toISOString(),
      sintomas: sintomasSelecionados,
      intensidade: intensidade[0],
      melhora_percebida: melhora[0],
      efeitos_colaterais: efeitosColaterais.length > 0 ? efeitosColaterais : null,
      notas: notas || null,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/diario')
    router.refresh()
  }

  const intensidadeLabels = ['Muito Leve', 'Leve', 'Moderado', 'Intenso', 'Muito Intenso']
  const melhoraLabels = ['Nenhuma', 'Pouca', 'Moderada', 'Boa', 'Excelente']

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/diario">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Novo Registro</h1>
          <p className="text-muted-foreground">
            Registre como voce esta se sentindo hoje
          </p>
        </div>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Diario de Sintomas
          </CardTitle>
          <CardDescription>
            Seu registro ajuda a acompanhar a eficacia do tratamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Sintomas */}
            <div className="space-y-3">
              <Label>Sintomas Presentes</Label>
              <div className="grid grid-cols-2 gap-3">
                {sintomasOptions.map((sintoma) => (
                  <div
                    key={sintoma}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <Checkbox
                      id={sintoma}
                      checked={sintomasSelecionados.includes(sintoma)}
                      onCheckedChange={() => toggleSintoma(sintoma)}
                    />
                    <label
                      htmlFor={sintoma}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {sintoma}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Intensidade */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Intensidade dos Sintomas</Label>
                <span className="text-sm font-medium text-primary">
                  {intensidadeLabels[intensidade[0]]}
                </span>
              </div>
              <Slider
                value={intensidade}
                onValueChange={setIntensidade}
                max={4}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Muito Leve</span>
                <span>Muito Intenso</span>
              </div>
            </div>

            {/* Melhora */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Melhora Percebida com o Tratamento</Label>
                <span className="text-sm font-medium text-primary">
                  {melhoraLabels[melhora[0]]}
                </span>
              </div>
              <Slider
                value={melhora}
                onValueChange={setMelhora}
                max={4}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Nenhuma</span>
                <span>Excelente</span>
              </div>
            </div>

            {/* Efeitos Colaterais */}
            <div className="space-y-3">
              <Label>Efeitos Colaterais (se houver)</Label>
              <div className="grid grid-cols-2 gap-3">
                {efeitosColateraisOptions.map((efeito) => (
                  <div
                    key={efeito}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <Checkbox
                      id={efeito}
                      checked={efeitosColaterais.includes(efeito)}
                      onCheckedChange={() => toggleEfeito(efeito)}
                    />
                    <label
                      htmlFor={efeito}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {efeito}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notas">Observacoes Adicionais</Label>
              <Textarea
                id="notas"
                placeholder="Como voce se sentiu hoje? Algo diferente aconteceu?"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="bg-background/50 min-h-24"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Salvando...' : 'Salvar Registro'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/diario">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
