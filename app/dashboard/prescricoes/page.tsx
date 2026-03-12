import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileText, Plus, Eye, Download, Calendar, AlertCircle } from 'lucide-react'
import type { Prescricao, UserRole } from '@/lib/types'

export default async function PrescricoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userRole = (user?.user_metadata?.role as UserRole) || 'PACIENTE'

  // Fetch prescriptions based on role
  let query = supabase.from('prescricoes').select('*')
  
  if (userRole === 'MEDICO') {
    query = query.eq('medico_id', user?.id)
  } else if (userRole === 'PACIENTE') {
    query = query.eq('paciente_id', user?.id)
  }
  
  const { data: prescricoes } = await query.order('created_at', { ascending: false })

  const isExpired = (validade: string) => new Date(validade) < new Date()
  const isExpiringSoon = (validade: string) => {
    const validadeDate = new Date(validade)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return validadeDate < thirtyDaysFromNow && validadeDate > new Date()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prescricoes</h1>
          <p className="text-muted-foreground">
            {userRole === 'MEDICO' 
              ? 'Gerencie as prescricoes emitidas'
              : 'Visualize suas prescricoes medicas'}
          </p>
        </div>
        {userRole === 'MEDICO' && (
          <Button asChild>
            <Link href="/dashboard/prescricoes/nova">
              <Plus className="w-4 h-4 mr-2" />
              Nova Prescricao
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold text-foreground">
                  {(prescricoes || []).filter(p => !isExpired(p.validade)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vencendo em 30 dias</p>
                <p className="text-2xl font-bold text-foreground">
                  {(prescricoes || []).filter(p => isExpiringSoon(p.validade)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted border border-border/50">
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {(prescricoes || []).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prescriptions Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Lista de Prescricoes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">
                    {userRole === 'MEDICO' ? 'Paciente' : 'Medico'}
                  </TableHead>
                  <TableHead className="font-semibold">Dosagem</TableHead>
                  <TableHead className="font-semibold">Indicacao</TableHead>
                  <TableHead className="font-semibold">Validade</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(prescricoes || []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <p className="text-muted-foreground">Nenhuma prescricao encontrada</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  (prescricoes as Prescricao[]).map((prescricao) => {
                    const expired = isExpired(prescricao.validade)
                    const expiringSoon = isExpiringSoon(prescricao.validade)
                    
                    return (
                      <TableRow key={prescricao.id} className="hover:bg-muted/20">
                        <TableCell className="font-mono text-sm">
                          {prescricao.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {userRole === 'MEDICO' 
                            ? prescricao.paciente_id.slice(0, 8) + '...'
                            : prescricao.medico_id.slice(0, 8) + '...'}
                        </TableCell>
                        <TableCell>{prescricao.dosagem_diaria}</TableCell>
                        <TableCell className="max-w-48 truncate">
                          {prescricao.indicacao}
                        </TableCell>
                        <TableCell>
                          {new Date(prescricao.validade).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
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
                            {expired ? 'Vencida' : expiringSoon ? 'Vencendo' : 'Ativa'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <Link href={`/dashboard/prescricoes/${prescricao.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            {prescricao.pdf_url && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <a href={prescricao.pdf_url} target="_blank" rel="noopener noreferrer">
                                  <Download className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
