import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Leaf, Zap, Lock, Database, Users, TrendingUp } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-slate-800 to-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">CannTrace Care</span>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-foreground hover:bg-slate-700/50">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Criar Conta
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Rastreabilidade Seed-to-Patient
            <span className="text-primary"> para Cannabis Medicinal</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            CannTrace Care: a plataforma completa que une cultivo com IoT, telemedicina HIPAA e rastreabilidade em compliance com ANVISA.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Começar Agora
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-border">
                Saiba Mais
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <p className="text-muted-foreground">Rastreabilidade de lotes</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">LGPD</div>
            <p className="text-muted-foreground">Criptografia de nível bancário</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">RDC 660</div>
            <p className="text-muted-foreground">Compliance ANVISA completo</p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-3xl font-bold text-foreground text-center mb-16">Recursos Principais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-border bg-card/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Rastreabilidade Completa</h3>
              <p className="text-muted-foreground text-sm">
                Cada lote gera um hash de integridade SHA-256. Timeline imutável de semente a paciente.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-border bg-card/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Telemedicina HIPAA</h3>
              <p className="text-muted-foreground text-sm">
                Consultas seguras em WebRTC, prontuários eletrônicos e receitas assinadas digitalmente (ICP-Brasil).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-border bg-card/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">IoT Dashboard</h3>
              <p className="text-muted-foreground text-sm">
                Monitoramento em tempo real de estufas: temperatura, umidade, CO2, pH e EC.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 4 */}
            <div className="p-6 rounded-lg border border-border bg-card/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Segurança LGPD</h3>
              <p className="text-muted-foreground text-sm">
                AES-256 para dados sensíveis. Row Level Security no Supabase. Conformidade total com lei de proteção de dados.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-lg border border-border bg-card/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Real World Evidence</h3>
              <p className="text-muted-foreground text-sm">
                Cruze cepas com redução de sintomas. Gráficos de aderência e eficácia para pesquisa clínica.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-lg border border-border bg-card/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">RBAC Completo</h3>
              <p className="text-muted-foreground text-sm">
                Médicos, Pacientes, Cultivadores e Suporte com permissões específicas e auditoria total.
              </p>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-slate-700/30 rounded-lg border border-border">
          <h2 className="text-3xl font-bold text-foreground text-center mb-16">Para Cada Usuário</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Paciente */}
            <div className="text-center">
              <div className="text-4xl mb-3">👤</div>
              <h3 className="font-bold text-foreground mb-2">Paciente</h3>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>✓ Receitas ativas</li>
                <li>✓ Diário de sintomas</li>
                <li>✓ Consultas telemedicina</li>
                <li>✓ Rastreio de lotes</li>
              </ul>
            </div>

            {/* Médico */}
            <div className="text-center">
              <div className="text-4xl mb-3">👨‍⚕️</div>
              <h3 className="font-bold text-foreground mb-2">Médico</h3>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>✓ Emissão de receitas</li>
                <li>✓ Telemedicina WebRTC</li>
                <li>✓ Prontuários eletrônicos</li>
                <li>✓ Real World Evidence</li>
              </ul>
            </div>

            {/* Cultivador */}
            <div className="text-center">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="font-bold text-foreground mb-2">Cultivador</h3>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>✓ Registrar lotes</li>
                <li>✓ IoT monitoring</li>
                <li>✓ Geração QR codes</li>
                <li>✓ Timeline rastreio</li>
              </ul>
            </div>

            {/* Suporte */}
            <div className="text-center">
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="font-bold text-foreground mb-2">Suporte</h3>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>✓ Gestão de usuários</li>
                <li>✓ Auditoria completa</li>
                <li>✓ Status do sistema</li>
                <li>✓ Compliance reports</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Pronto para Transformar seu Negócio?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Juntar-se à plataforma de confiança para cannabis medicinal em compliance com ANVISA.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Comece sua Jornada
            </Button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
            <p>© 2024 CannTrace Care. Compliance ANVISA RDC 660/22 e 327/19. Todos os direitos reservados.</p>
          </div>
        </footer>
      </main>
    </main>
  )
}
