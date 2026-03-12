'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, MoreHorizontal, Eye, QrCode, FileText, Plus, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Lote, LoteStatus } from '@/lib/types'

const statusStyles: Record<LoteStatus, { label: string; className: string }> = {
  CULTIVO: { label: 'Cultivo', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
  COLHEITA: { label: 'Colheita', className: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
  EXTRACAO: { label: 'Extracao', className: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  DISPENSADO: { label: 'Dispensado', className: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
}

interface BatchesTableProps {
  batches: Lote[]
  showActions?: boolean
}

export function BatchesTable({ batches, showActions = true }: BatchesTableProps) {
  const [search, setSearch] = useState('')

  const filteredBatches = batches.filter(
    (batch) =>
      batch.codigo_qr.toLowerCase().includes(search.toLowerCase()) ||
      batch.strain.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Lotes Registrados</CardTitle>
            {showActions && (
              <Button asChild size="sm" className="lg:hidden">
                <Link href="/dashboard/lotes/novo">
                  <Plus className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar lote..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background/50 w-full"
              />
            </div>
            {showActions && (
              <Button asChild className="hidden lg:flex">
                <Link href="/dashboard/lotes/novo">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Lote
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        {/* Desktop Table */}
        <div className="hidden md:block rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Codigo QR</TableHead>
                <TableHead className="font-semibold">Strain</TableHead>
                <TableHead className="font-semibold">CBD/THC</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Data</TableHead>
                <TableHead className="font-semibold text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <p className="text-muted-foreground">Nenhum lote encontrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBatches.map((batch) => (
                  <TableRow key={batch.id} className="hover:bg-muted/20">
                    <TableCell className="font-mono text-sm">{batch.codigo_qr}</TableCell>
                    <TableCell className="font-medium">{batch.strain}</TableCell>
                    <TableCell>{batch.cbd_thc_ratio}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(statusStyles[batch.status].className)}>
                        {statusStyles[batch.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(batch.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/lotes/${batch.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <QrCode className="w-4 h-4 mr-2" />
                            Gerar QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="w-4 h-4 mr-2" />
                            Exportar Laudo
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 px-4">
          {filteredBatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Nenhum lote encontrado</p>
            </div>
          ) : (
            filteredBatches.map((batch) => (
              <Link 
                key={batch.id} 
                href={`/dashboard/lotes/${batch.id}`}
                className="block"
              >
                <div className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-primary truncate">
                          {batch.codigo_qr}
                        </span>
                        <Badge variant="outline" className={cn('text-xs', statusStyles[batch.status].className)}>
                          {statusStyles[batch.status].label}
                        </Badge>
                      </div>
                      <p className="font-medium text-foreground">{batch.strain}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{batch.cbd_thc_ratio}</span>
                        <span>{new Date(batch.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/lotes/${batch.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <QrCode className="w-4 h-4 mr-2" />
                          Gerar QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          Exportar Laudo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
