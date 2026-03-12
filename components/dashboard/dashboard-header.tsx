'use client'

import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardHeaderProps {
  user: {
    nome_completo: string
    role: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bem-vindo</h1>
        <p className="text-sm text-muted-foreground">{user.nome_completo}</p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground text-xs">{user.role}</p>
            <p className="text-xs text-muted-foreground">{user.nome_completo}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
