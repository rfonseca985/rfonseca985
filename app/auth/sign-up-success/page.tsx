import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Leaf, Mail } from 'lucide-react'

export default function SignUpSuccessPage() {
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

        {/* Success Card */}
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-foreground">Conta Criada com Sucesso!</CardTitle>
            <CardDescription>
              Sua conta foi criada e um email de confirmação foi enviado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Confirmation Box */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Confirme seu email
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Próximos passos:</p>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex-shrink-0">
                    1
                  </span>
                  <span>Verifique seu email</span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex-shrink-0">
                    2
                  </span>
                  <span>Clique no link de confirmação</span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex-shrink-0">
                    3
                  </span>
                  <span>Acesse sua conta no painel</span>
                </li>
              </ol>
            </div>

            {/* Button */}
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Fazer Login
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Não recebeu o email?{' '}
            <button className="text-primary hover:underline font-medium">
              Solicitar novamente
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
