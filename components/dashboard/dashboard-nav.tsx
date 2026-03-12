'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, Home, FileText, Users, Microscope, Settings, LogOut, Droplet, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardNavProps {
  userRole: 'MEDICO' | 'PACIENTE' | 'CULTIVADOR' | 'SUPORTE'
}

export function DashboardNav({ userRole }: DashboardNavProps) {
  const pathname = usePathname()

  const menuItems = {
    PACIENTE: [
      { href: '/dashboard', icon: Home, label: 'Inicio' },
      { href: '/dashboard/prescricoes', icon: FileText, label: 'Minhas Receitas' },
      { href: '/dashboard/diario-sintomas', icon: BarChart3, label: 'Diário de Sintomas' },
      { href: '/dashboard/consultas', icon: Users, label: 'Minhas Consultas' },
      { href: '/dashboard/perfil', icon: Settings, label: 'Perfil' },
    ],
    MEDICO: [
      { href: '/dashboard', icon: Home, label: 'Inicio' },
      { href: '/dashboard/consultas', icon: Users, label: 'Consultas' },
      { href: '/dashboard/prescricoes', icon: FileText, label: 'Prescrições' },
      { href: '/dashboard/pacientes', icon: Users, label: 'Meus Pacientes' },
      { href: '/dashboard/rwe', icon: BarChart3, label: 'Real World Evidence' },
      { href: '/dashboard/perfil', icon: Settings, label: 'Perfil' },
    ],
    CULTIVADOR: [
      { href: '/dashboard', icon: Home, label: 'Inicio' },
      { href: '/dashboard/lotes', icon: Droplet, label: 'Meus Lotes' },
      { href: '/dashboard/iot', icon: Microscope, label: 'Monitoramento IoT' },
      { href: '/dashboard/rastreabilidade', icon: FileText, label: 'Rastreabilidade' },
      { href: '/dashboard/perfil', icon: Settings, label: 'Perfil' },
    ],
    SUPORTE: [
      { href: '/dashboard', icon: Home, label: 'Painel' },
      { href: '/dashboard/usuarios', icon: Users, label: 'Usuários' },
      { href: '/dashboard/audit-logs', icon: FileText, label: 'Auditoria' },
      { href: '/dashboard/perfil', icon: Settings, label: 'Perfil' },
    ],
  }

  const items = menuItems[userRole]

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <Link href="/dashboard" className="p-6 flex items-center gap-2 border-b border-border hover:bg-slate-700/30 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Leaf className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-foreground text-sm">CannTrace</p>
          <p className="text-xs text-muted-foreground">Care</p>
        </div>
      </Link>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-slate-700/30'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <form action="/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
