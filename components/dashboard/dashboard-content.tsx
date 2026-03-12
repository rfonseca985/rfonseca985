'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardPaciente } from './views/dashboard-paciente'
import { DashboardMedico } from './views/dashboard-medico'
import { DashboardCultivador } from './views/dashboard-cultivador'
import { DashboardSuporte } from './views/dashboard-suporte'

interface DashboardContentProps {
  userRole: 'MEDICO' | 'PACIENTE' | 'CULTIVADOR' | 'SUPORTE'
  userId: string
}

export function DashboardContent({ userRole, userId }: DashboardContentProps) {
  return (
    <main className="p-6 space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-foreground">Bem-vindo ao CannTrace Care</CardTitle>
          <CardDescription>
            Plataforma de rastreabilidade e telemedicina para Cannabis Medicinal
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Role-specific content */}
      {userRole === 'PACIENTE' && <DashboardPaciente userId={userId} />}
      {userRole === 'MEDICO' && <DashboardMedico userId={userId} />}
      {userRole === 'CULTIVADOR' && <DashboardCultivador userId={userId} />}
      {userRole === 'SUPORTE' && <DashboardSuporte userId={userId} />}
    </main>
  )
}
