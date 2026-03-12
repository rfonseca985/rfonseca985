import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Upload, Download, Shield, Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import type { DocumentoANVISA } from '@/lib/types'

const tipoLabels: Record<string, string> = {
  AUTORIZACAO_IMPORTACAO: 'Autorizacao de Importacao',
  TERMO_RESPONSABILIDADE: 'Termo de Responsabilidade',
  LAUDO_MEDICO: 'Laudo Medico',
  OUTRO: 'Outro Documento',
}

export default async function DocumentosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: documentos } = await supabase
    .from('documentos_anvisa')
    .select('*')
    .eq('paciente_id', user?.id)
    .order('created_at', { ascending: false })

  const docs = (documentos || []) as DocumentoANVISA[]

  const isExpired = (validade?: string) => validade ? new Date(validade) < new Date() : false
  const isExpiringSoon = (validade?: string) => {
    if (!validade) return false
    const validadeDate = new Date(validade)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return validadeDate < thirtyDaysFromNow && validadeDate > new Date()
  }

  // Required documents checklist
  const requiredDocs = [
    { tipo: 'AUTORIZACAO_IMPORTACAO', label: 'Autorizacao de Importacao ANVISA' },
    { tipo: 'TERMO_RESPONSABILIDADE', label: 'Termo de Responsabilidade' },
    { tipo: 'LAUDO_MEDICO', label: 'Laudo Medico' },
  ]

  const hasDoc = (tipo: string) => docs.some(d => d.tipo === tipo && !isExpired(d.validade))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documentos ANVISA</h1>
          <p className="text-muted-foreground">
            Gerencie seus documentos de compliance regulatorio
          </p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Enviar Documento
        </Button>
      </div>

      {/* Compliance Checklist */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Checklist de Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {requiredDocs.map((doc) => {
              const has = hasDoc(doc.tipo)
              return (
                <div
                  key={doc.tipo}
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    has 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : 'bg-destructive/5 border-destructive/20'
                  }`}
                >
                  {has ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${has ? 'text-emerald-500' : 'text-destructive'}`}>
                      {doc.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {has ? 'Documento valido' : 'Documento pendente'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Meus Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          {docs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Nenhum documento enviado</p>
              <p className="text-sm text-muted-foreground mt-1">
                Envie seus documentos para manter o compliance
              </p>
              <Button className="mt-4">
                <Upload className="w-4 h-4 mr-2" />
                Enviar Primeiro Documento
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {docs.map((doc) => {
                const expired = isExpired(doc.validade)
                const expiringSoon = isExpiringSoon(doc.validade)

                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-foreground">{tipoLabels[doc.tipo]}</p>
                        <Badge
                          variant="outline"
                          className={
                            expired
                              ? 'bg-destructive/10 text-destructive border-destructive/30'
                              : expiringSoon
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                          }
                        >
                          {expired ? 'Vencido' : expiringSoon ? 'Vencendo' : 'Valido'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        {doc.numero_documento && (
                          <p className="text-sm text-muted-foreground">
                            Numero: {doc.numero_documento}
                          </p>
                        )}
                        {doc.validade && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Validade: {new Date(doc.validade).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={doc.arquivo_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* RDC Info */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Sobre a Regulamentacao</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Conforme a RDC 660/22 e RDC 327/19 da ANVISA, pacientes que utilizam
                produtos a base de Cannabis para fins medicinais devem manter documentacao
                atualizada que comprove a autorizacao para uso do tratamento.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Autorizacao de Importacao: valida por 2 anos</li>
                <li>• Prescricao Medica: valida por 6 meses</li>
                <li>• Termo de Responsabilidade: renovacao anual</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
