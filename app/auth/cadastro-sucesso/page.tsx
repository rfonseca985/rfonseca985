import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Leaf, Mail, CheckCircle } from 'lucide-react'

export default function CadastroSucessoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
            <Leaf className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">CannTrace Care</h1>
            <p className="text-sm text-muted-foreground">Cannabis Medicinal</p>
          </div>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Cadastro realizado!</CardTitle>
            <CardDescription>
              Enviamos um email de confirmacao para voce
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Verifique sua caixa de entrada
                </p>
                <p className="text-xs text-muted-foreground">
                  Clique no link enviado para ativar sua conta
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Nao recebeu o email? Verifique a pasta de spam ou solicite um novo envio.
              </p>
            </div>

            <div className="pt-4 border-t border-border/50">
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  Ir para o login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
