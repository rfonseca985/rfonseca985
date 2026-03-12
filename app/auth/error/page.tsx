import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Leaf, ChevronLeft } from 'lucide-react'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-slate-800 to-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">CannTrace Care</h1>
          </div>
        </div>

        {/* Error Card */}
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-foreground">Erro na Autenticação</CardTitle>
            <CardDescription>
              Ocorreu um problema durante a autenticação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Desculpe, não conseguimos autenticá-lo. Por favor, tente novamente ou entre em contato com o suporte.
            </p>

            <div className="space-y-2">
              <Link href="/auth/login" className="block">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Tentar Novamente
                </Button>
              </Link>
              <Link href="/auth/sign-up" className="block">
                <Button variant="outline" className="w-full border-border">
                  Criar Conta
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  )
}
