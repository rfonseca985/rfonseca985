'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Leaf, 
  LayoutDashboard, 
  Package, 
  FileText, 
  Stethoscope, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  ShieldCheck,
  Thermometer,
  ClipboardList,
  Video,
  Menu,
  X
} from 'lucide-react'
import type { UserRole } from '@/lib/types'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Painel',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['MEDICO', 'PACIENTE', 'CULTIVADOR', 'SUPORTE'],
  },
  {
    href: '/dashboard/lotes',
    label: 'Lotes',
    icon: <Package className="w-5 h-5" />,
    roles: ['CULTIVADOR', 'SUPORTE'],
  },
  {
    href: '/dashboard/sensores',
    label: 'Sensores IoT',
    icon: <Thermometer className="w-5 h-5" />,
    roles: ['CULTIVADOR'],
  },
  {
    href: '/dashboard/prescricoes',
    label: 'Prescricoes',
    icon: <FileText className="w-5 h-5" />,
    roles: ['MEDICO', 'PACIENTE'],
  },
  {
    href: '/dashboard/consultas',
    label: 'Telemedicina',
    icon: <Video className="w-5 h-5" />,
    roles: ['MEDICO', 'PACIENTE'],
  },
  {
    href: '/dashboard/pacientes',
    label: 'Pacientes',
    icon: <Users className="w-5 h-5" />,
    roles: ['MEDICO'],
  },
  {
    href: '/dashboard/diario',
    label: 'Diario de Sintomas',
    icon: <ClipboardList className="w-5 h-5" />,
    roles: ['PACIENTE'],
  },
  {
    href: '/dashboard/documentos',
    label: 'Documentos ANVISA',
    icon: <ShieldCheck className="w-5 h-5" />,
    roles: ['PACIENTE', 'MEDICO'],
  },
  {
    href: '/dashboard/analytics',
    label: 'Analytics RWE',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['MEDICO', 'SUPORTE'],
  },
  {
    href: '/dashboard/auditoria',
    label: 'Auditoria',
    icon: <Stethoscope className="w-5 h-5" />,
    roles: ['SUPORTE'],
  },
]

interface SidebarProps {
  userRole: UserRole
  userName: string
}

function SidebarContent({ userRole, userName, onNavigate }: SidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole))

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      MEDICO: 'Medico',
      PACIENTE: 'Paciente',
      CULTIVADOR: 'Cultivador',
      SUPORTE: 'Suporte',
    }
    return labels[role]
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-primary/10 border border-sidebar-primary/20">
          <Leaf className="w-6 h-6 text-sidebar-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">CannTrace</h1>
          <p className="text-xs text-sidebar-foreground/60">Care</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-sidebar-accent text-sidebar-accent-foreground font-medium text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {userName}
            </p>
            <p className="text-xs text-sidebar-foreground/60">
              {getRoleLabel(userRole)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link
          href="/dashboard/configuracoes"
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          )}
        >
          <Settings className="w-5 h-5" />
          Configuracoes
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </div>
    </div>
  )
}

export function Sidebar({ userRole, userName }: SidebarProps) {
  const [open, setOpen] = useState(false)

  // Close mobile menu on route change
  const pathname = usePathname()
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-foreground">CannTrace</span>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
              <SidebarContent 
                userRole={userRole} 
                userName={userName} 
                onNavigate={() => setOpen(false)} 
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
        <SidebarContent userRole={userRole} userName={userName} />
      </aside>
    </>
  )
}
