import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import type { UserRole } from '@/lib/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }

  const userRole = (user.user_metadata?.role as UserRole) || 'PACIENTE'
  const userName = user.user_metadata?.nome_completo || user.email || 'Usuario'

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} userName={userName} />
      {/* Main content - responsive padding for mobile header and desktop sidebar */}
      <main className="pt-16 lg:pt-0 lg:pl-64">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
