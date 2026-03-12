'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateBatchSeal, generateQRCode } from '@/lib/crypto'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, AlertCircle, Sprout, QrCode, Shield } from 'lucide-react'
import Link from 'next/link'

const strainOptions = [
  'Charlotte\'s Web',
  'ACDC',
  'Harlequin',
  'Cannatonic',
  'Ringo\'s Gift',
  'Sour Tsunami',
  'Pennywise',
  'Harle-Tsu',
  'Outro',
]

const ratioOptions = [
  '20:1 CBD:THC',
  '10:1 CBD:THC',
  '5:1 CBD:THC',
  '2:1 CBD:THC',
  '1:1 CBD:THC',
  '1:2 THC:CBD',
  'Alto THC',
  'Personalizado',
]

export default function NovoLotePage() {
  const [strain, setStrain] = useState('')
  const [customStrain, setCustomStrain] = useState('')
  const [cbdThcRatio, setCbdThcRatio] = useState('')
  const [customRatio, setCustomRatio] = useState('')
  const [dataPlantio, setDataPlantio] = useState('')
  const [pesoBruto, setPesoBruto] = useState('')
  const [notas, setNotas] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [generatedQR, setGeneratedQR] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleGenerateQR = () => {
    const qr = generateQRCode()
    setGeneratedQR(qr)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const finalStrain = strain === 'Outro' ? customStrain : strain
    const finalRatio = cbdThcRatio === 'Personalizado' ? customRatio : cbdThcRatio
    const codigoQR = generatedQR || generateQRCode()

    if (!finalStrain || !finalRatio) {
      setError('Preencha todos os campos obrigatorios')
      setLoading(false)
      return
    }

    // Generate integrity hash
    const hashIntegridade = await generateBatchSeal({
      codigo_qr: codigoQR,
      strain: finalStrain,
      status: 'CULTIVO',
    })

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('Usuario nao autenticado')
      setLoading(false)
      return
    }

    // Insert batch
    const { error: insertError } = await supabase.from('lotes').insert({
      codigo_qr: codigoQR,
      strain: finalStrain,
      cbd_thc_ratio: finalRatio,
      status: 'CULTIVO',
      hash_integridade: hashIntegridade,
      cultivador_id: user.id,
      data_plantio: dataPlantio || null,
      peso_bruto_g: pesoBruto ? parseFloat(pesoBruto) : null,
      notas: notas || null,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/lotes')
    router.refresh()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/lotes">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Registrar Novo Lote</h1>
          <p className="text-muted-foreground">
            Crie um novo lote com rastreabilidade completa
          </p>
        </div>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary" />
            Informacoes do Lote
          </CardTitle>
          <CardDescription>
            Preencha os dados do lote. Um hash de integridade sera gerado automaticamente.
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

            {/* QR Code Section */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Codigo QR</span>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleGenerateQR}>
                  Gerar Codigo
                </Button>
              </div>
              {generatedQR && (
                <div className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border/50">
                  <code className="text-sm font-mono text-primary">{generatedQR}</code>
                  <Shield className="w-4 h-4 text-emerald-500 ml-auto" />
                </div>
              )}
            </div>

            {/* Strain Selection */}
            <div className="space-y-2">
              <Label>Strain / Variedade</Label>
              <Select value={strain} onValueChange={setStrain}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Selecione a variedade" />
                </SelectTrigger>
                <SelectContent>
                  {strainOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {strain === 'Outro' && (
                <Input
                  placeholder="Nome da variedade personalizada"
                  value={customStrain}
                  onChange={(e) => setCustomStrain(e.target.value)}
                  className="mt-2 bg-background/50"
                />
              )}
            </div>

            {/* CBD/THC Ratio */}
            <div className="space-y-2">
              <Label>Proporcao CBD:THC</Label>
              <Select value={cbdThcRatio} onValueChange={setCbdThcRatio}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Selecione a proporcao" />
                </SelectTrigger>
                <SelectContent>
                  {ratioOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {cbdThcRatio === 'Personalizado' && (
                <Input
                  placeholder="Ex: 15:1 CBD:THC"
                  value={customRatio}
                  onChange={(e) => setCustomRatio(e.target.value)}
                  className="mt-2 bg-background/50"
                />
              )}
            </div>

            {/* Planting Date */}
            <div className="space-y-2">
              <Label htmlFor="dataPlantio">Data do Plantio</Label>
              <Input
                id="dataPlantio"
                type="date"
                value={dataPlantio}
                onChange={(e) => setDataPlantio(e.target.value)}
                className="bg-background/50"
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="peso">Peso Bruto Estimado (g)</Label>
              <Input
                id="peso"
                type="number"
                step="0.01"
                placeholder="Ex: 500.00"
                value={pesoBruto}
                onChange={(e) => setPesoBruto(e.target.value)}
                className="bg-background/50"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notas">Observacoes</Label>
              <Textarea
                id="notas"
                placeholder="Informacoes adicionais sobre o lote..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="bg-background/50 min-h-24"
              />
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Seguranca e Rastreabilidade</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Ao criar este lote, um hash SHA-256 sera gerado para garantir a integridade dos dados.
                Qualquer alteracao posterior sera registrada na auditoria e um novo hash sera criado.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Registrando...' : 'Registrar Lote'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/lotes">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
