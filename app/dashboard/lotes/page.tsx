import { createClient } from '@/lib/supabase/server'
import { BatchesTable } from '@/components/dashboard/batches-table'
import type { Lote } from '@/lib/types'

export default async function LotesPage() {
  const supabase = await createClient()
  
  const { data: batches } = await supabase
    .from('lotes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestao de Lotes</h1>
        <p className="text-muted-foreground">
          Gerencie todos os lotes de Cannabis com rastreabilidade completa
        </p>
      </div>

      <BatchesTable batches={(batches || []) as Lote[]} showActions={true} />
    </div>
  )
}
