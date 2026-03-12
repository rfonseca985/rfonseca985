'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, AlertCircle, FileText, User, Pill, Shield } from 'lucide-react'
import type { Profile, Lote } from '@/lib/types'

const formaUsoOptions = [
  'Oleo Sublingual',
  'Capsula',
  'Vaporizacao',
  'Topico',
  'Comestivel',
  'Outro',
]

const indicacaoOptions = [
  'Dor Cronica',
  'Epilepsia',
  'Ansiedade',
  'Insonia',
  'Esclerose Multipla',
  'Nausea (Quimioterapia)',
  'Fibromialgia',
  'Parkinson',
  'Outro',
]

export default function NovaPrescricaoPage() {
  const [pacientes, setPacientes] = useState<Profile[]>([])
  const [lotes, setLotes] = useState<Lote[]>([])
  const [pacienteId, setPacienteId] = useState('')
  const [loteId, setLoteId] = useState('')
  const [dosagem, setDosagem] = useState('')
  const [formaUso, setFormaUso] = useState('')
  const [indicacao, setIndicacao] = useState('')
  const [customIndicacao, setCustomIndicacao] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      // Fetch patients
      const { data: pacientesData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'PACIENTE')
      
      setPacientes((pacientesData || []) as Profile[])

      // Fetch available batches
      const { data: lotesData } = await supabase
        .from('lotes')
        .select('*')
        .in('status', ['EXTRACAO', 'DISPENSADO'])
      
      setLotes((lotesData || []) as Lote[])
    }

    fetchData()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const finalIndicacao = indicacao === 'Outro' ? customIndicacao : indicacao

    if (!pacienteId || !dosagem || !formaUso || !finalIndicacao) {
      setError('Preencha todos os campos obrigatorios')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('Usuario nao autenticado')
      setLoading(false)
      return
    }

    // Calculate validity (6 months per RDC 660)
    const validade = new Date()
    validade.setMonth(validade.getMonth() + 6)

    const { error: insertError } = await supabase.from('prescricoes').insert({
      paciente_id: pacienteId,
      medico_id: user.id,
      lote_id: loteId || null,
      dosagem_diaria: dosagem,
      forma_uso: formaUso,
      indicacao: finalIndicacao,
      observacoes: observacoes || null,
      validade: validade.toISOString(),
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/prescricoes')
    router.refresh()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/prescricoes">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nova Prescricao</h1>
          <p className="text-muted-foreground">
            Emitir prescricao para paciente
          </p>
        </div>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Dados da Prescricao
          </CardTitle>
          <CardDescription>
            A prescricao tera validade de 6 meses conforme RDC 660/22
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

            {/* Patient Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Paciente
              </Label>
              <Select value={pacienteId} onValueChange={setPacienteId}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((paciente) => (
                    <SelectItem key={paciente.id} value={paciente.id}>
                      {paciente.nome_completo} ({paciente.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {pacientes.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nenhum paciente cadastrado no sistema
                </p>
              )}
            </div>

            {/* Batch Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Lote (opcional)
              </Label>
              <Select value={loteId} onValueChange={setLoteId}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Vincular a um lote especifico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum lote especifico</SelectItem>
                  {lotes.map((lote) => (
                    <SelectItem key={lote.id} value={lote.id}>
                      {lote.codigo_qr} - {lote.strain} ({lote.cbd_thc_ratio})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dosage */}
            <div className="space-y-2">
              <Label htmlFor="dosagem">Dosagem Diaria</Label>
              <Input
                id="dosagem"
                placeholder="Ex: 3 gotas (15mg CBD), 2x ao dia"
                value={dosagem}
                onChange={(e) => setDosagem(e.target.value)}
                className="bg-background/50"
                required
              />
            </div>

            {/* Usage Form */}
            <div className="space-y-2">
              <Label>Forma de Uso</Label>
              <Select value={formaUso} onValueChange={setFormaUso}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Selecione a forma de uso" />
                </SelectTrigger>
                <SelectContent>
                  {formaUsoOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Indication */}
            <div className="space-y-2">
              <Label>Indicacao Clinica</Label>
              <Select value={indicacao} onValueChange={setIndicacao}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Selecione a indicacao" />
                </SelectTrigger>
                <SelectContent>
                  {indicacaoOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {indicacao === 'Outro' && (
                <Input
                  placeholder="Descreva a indicacao"
                  value={customIndicacao}
                  onChange={(e) => setCustomIndicacao(e.target.value)}
                  className="mt-2 bg-background/50"
                />
              )}
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observacoes Medicas</Label>
              <Textarea
                id="observacoes"
                placeholder="Orientacoes adicionais para o paciente..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="bg-background/50 min-h-24"
              />
            </div>

            {/* Compliance Info */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Compliance RDC 660/22</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Validade automatica de 6 meses</li>
                <li>• Assinatura digital ICP-Brasil (opcional)</li>
                <li>• Rastreabilidade completa do lote</li>
                <li>• Registro em prontuario eletronico</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Emitindo...' : 'Emitir Prescricao'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/prescricoes">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
