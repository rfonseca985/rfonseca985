import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BatchTimeline } from '@/components/dashboard/batch-timeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  QrCode, 
  Leaf, 
  Calendar, 
  Scale, 
  FileText, 
  Shield,
  Download,
  Edit
} from 'lucide-react'
import type { Lote, LoteStatus, TimelineEvent } from '@/lib/types'

const statusStyles: Record<LoteStatus, { label: string; className: string }> = {
  CULTIVO: { label: 'Em Cultivo', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
  COLHEITA: { label: 'Colheita', className: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
  EXTRACAO: { label: 'Extracao', className: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  DISPENSADO: { label: 'Dispensado', className: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
}

export default async function LoteDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: lote } = await supabase
    .from('lotes')
    .select('*')
    .eq('id', id)
    .single()

  if (!lote) {
    notFound()
  }

  // Fetch history
  const { data: historico } = await supabase
    .from('lote_historico')
    .select('*')
    .eq('lote_id', id)
    .order('created_at', { ascending: false })

  const batch = lote as Lote
  const events: TimelineEvent[] = (historico || []).map((h) => ({
    id: h.id,
    status: h.status_novo as LoteStatus,
    descricao: h.descricao,
    data: h.created_at,
    hash: h.hash_momento,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/lotes">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{batch.strain}</h1>
              <Badge variant="outline" className={statusStyles[batch.status].className}>
                {statusStyles[batch.status].label}
              </Badge>
            </div>
            <p className="text-muted-foreground font-mono">{batch.codigo_qr}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar Laudo
          </Button>
          <Button className="gap-2">
            <Edit className="w-4 h-4" />
            Atualizar Status
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                Informacoes do Lote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <InfoItem 
                  icon={<QrCode className="w-4 h-4" />}
                  label="Codigo QR"
                  value={batch.codigo_qr}
                  mono
                />
                <InfoItem 
                  icon={<Leaf className="w-4 h-4" />}
                  label="Strain"
                  value={batch.strain}
                />
                <InfoItem 
                  icon={<FileText className="w-4 h-4" />}
                  label="CBD:THC"
                  value={batch.cbd_thc_ratio}
                />
                <InfoItem 
                  icon={<Calendar className="w-4 h-4" />}
                  label="Data Plantio"
                  value={batch.data_plantio 
                    ? new Date(batch.data_plantio).toLocaleDateString('pt-BR')
                    : 'N/A'}
                />
                {batch.data_colheita && (
                  <InfoItem 
                    icon={<Calendar className="w-4 h-4" />}
                    label="Data Colheita"
                    value={new Date(batch.data_colheita).toLocaleDateString('pt-BR')}
                  />
                )}
                {batch.peso_bruto_g && (
                  <InfoItem 
                    icon={<Scale className="w-4 h-4" />}
                    label="Peso Bruto"
                    value={`${batch.peso_bruto_g}g`}
                  />
                )}
                {batch.peso_final_g && (
                  <InfoItem 
                    icon={<Scale className="w-4 h-4" />}
                    label="Peso Final"
                    value={`${batch.peso_final_g}g`}
                  />
                )}
              </div>

              {batch.notas && (
                <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-sm font-medium text-foreground mb-1">Observacoes</p>
                  <p className="text-sm text-muted-foreground">{batch.notas}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <BatchTimeline 
            events={events}
            currentStatus={batch.status}
            hashIntegridade={batch.hash_integridade}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Integrity Card */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                Selo de Integridade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-xs text-muted-foreground mb-2">Hash SHA-256</p>
                <code className="text-xs font-mono text-emerald-500 break-all">
                  {batch.hash_integridade}
                </code>
              </div>
              <p className="text-sm text-muted-foreground">
                Este hash garante a integridade dos dados do lote. 
                Qualquer alteracao sera detectada e registrada.
              </p>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center p-4">
                <QrCode className="w-full h-full text-background" />
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Escaneie para verificar a autenticidade do lote
              </p>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                <Download className="w-4 h-4 mr-2" />
                Baixar QR Code
              </Button>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {batch.laudo_laboratorial_url ? (
                <a 
                  href={batch.laudo_laboratorial_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Laudo Laboratorial</p>
                    <p className="text-xs text-muted-foreground">PDF</p>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground" />
                </a>
              ) : (
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nenhum documento anexado
                  </p>
                  <Button variant="link" size="sm" className="mt-1">
                    Anexar Laudo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ 
  icon, 
  label, 
  value, 
  mono = false 
}: { 
  icon: React.ReactNode
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className={`text-sm font-medium text-foreground ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  )
}
