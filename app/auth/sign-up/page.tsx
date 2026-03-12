import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Leaf, ChevronLeft } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  const params = await searchParams
  const error = params.error_description

  async function handleSignUp(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const nome_completo = formData.get('nome_completo') as string
    const role = formData.get('role') as 'MEDICO' | 'PACIENTE' | 'CULTIVADOR' | 'SUPORTE'

    const supabase = await createClient()

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
        data: {
          nome_completo,
          role,
        },
      },
    })

    if (signUpError) {
      return redirect(`/auth/sign-up?error_description=${signUpError.message}`)
    }

    redirect('/auth/sign-up-success')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-slate-800 to-background p-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">CannTrace Care</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Criar sua conta na plataforma
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Signup Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Cadastro</CardTitle>
              <CardDescription>
                Preencha os dados para criar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="nome_completo" className="text-sm font-medium text-foreground">
                    Nome Completo
                  </label>
                  <Input
                    id="nome_completo"
                    name="nome_completo"
                    type="text"
                    placeholder="João da Silva"
                    required
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Senha
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium text-foreground">
                    Tipo de Usuário
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      required
                      className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground appearance-none cursor-pointer"
                    >
                      <option value="">Selecione o tipo de usuário</option>
                      <option value="PACIENTE">Paciente</option>
                      <option value="MEDICO">Médico</option>
                      <option value="CULTIVADOR">Cultivador</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground">
                      ▼
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Criar Conta
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-center text-sm text-muted-foreground">
                  Já tem uma conta?{' '}
                  <Link
                    href="/auth/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Faça login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Role Info */}
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="p-2 rounded bg-card/50 border border-border">
              <p className="font-semibold text-foreground mb-1">👨‍⚕️ Médico</p>
              <p>Prescrever, consultar pacientes e emitir receitas</p>
            </div>
            <div className="p-2 rounded bg-card/50 border border-border">
              <p className="font-semibold text-foreground mb-1">👤 Paciente</p>
              <p>Visualizar receitas, histórico e diário de sintomas</p>
            </div>
            <div className="p-2 rounded bg-card/50 border border-border">
              <p className="font-semibold text-foreground mb-1">🌱 Cultivador</p>
              <p>Registrar lotes, IoT e participar da rastreabilidade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-4">
        <Link href="/auth/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
      </div>
    </div>
  )
}
