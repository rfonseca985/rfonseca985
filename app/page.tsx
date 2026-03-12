import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Leaf, 
  Shield, 
  QrCode, 
  Video, 
  BarChart3, 
  Lock, 
  ArrowRight,
  CheckCircle,
  Sprout,
  FlaskConical,
  UserCheck
} from 'lucide-react'

const features = [
  {
    icon: <QrCode className="w-6 h-6" />,
    title: 'Rastreabilidade Seed-to-Patient',
    description: 'Cada lote gera um hash de integridade unico. Rastreie desde a semente ate o paciente com blockchain de auditoria.',
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: 'Telemedicina Integrada',
    description: 'Consultas por video com prontuario eletronico e geracao automatica de receitas com validacao de lote.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Compliance ANVISA',
    description: 'Totalmente alinhado com RDC 660/22 e RDC 327/19. Validador de receitas e repositorio de documentos.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Real World Evidence',
    description: 'Analytics que cruzam cepa utilizada com melhora de sintomas. Dados para pesquisa e decisoes clinicas.',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Seguranca LGPD',
    description: 'Criptografia AES-256 para dados sensiveis, Row Level Security e auditoria completa de acessos.',
  },
  {
    icon: <Sprout className="w-6 h-6" />,
    title: 'Gestao IoT de Cultivo',
    description: 'Monitore temperatura, umidade, luz e CO2 em tempo real. Alertas automaticos para suas estufas.',
  },
]

const timeline = [
  { icon: <Sprout className="w-5 h-5" />, label: 'Semente', color: 'bg-emerald-500' },
  { icon: <Leaf className="w-5 h-5" />, label: 'Cultivo', color: 'bg-emerald-500' },
  { icon: <FlaskConical className="w-5 h-5" />, label: 'Extracao', color: 'bg-blue-500' },
  { icon: <UserCheck className="w-5 h-5" />, label: 'Paciente', color: 'bg-purple-500' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 border border-primary/20">
              <Leaf className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <span className="text-base md:text-xl font-bold text-foreground">CannTrace</span>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#compliance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Compliance
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contato
            </a>
          </nav>
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/cadastro">
                <span className="hidden sm:inline">Comecar</span>
                <span className="sm:hidden">Entrar</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 md:pt-32 pb-12 md:pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 md:space-y-6">
            <Badge variant="outline" className="gap-1.5 text-primary border-primary/30 bg-primary/10 text-xs md:text-sm">
              <Shield className="w-3 h-3" />
              Compliance ANVISA RDC 660/22
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance leading-tight px-2">
              A espinha dorsal tecnologica da{' '}
              <span className="text-primary">Cannabis Medicinal</span> no Brasil
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty px-2">
              O CannTrace Care resolve o maior gargalo do setor: a confianca. 
              Atraves de um sistema Seed-to-Patient, garantimos que o medico tenha 
              seguranca ao prescrever e o paciente tenha a certeza da pureza do que consome.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-2 md:pt-4">
              <Button size="lg" asChild className="gap-2">
                <Link href="/auth/cadastro">
                  Comecar Agora
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Ver Recursos</Link>
              </Button>
            </div>
          </div>

          {/* Timeline Visual */}
          <div className="mt-12 md:mt-20 relative px-4">
            <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-border -translate-y-1/2 hidden md:block" />
            <div className="flex flex-row items-center justify-between gap-2 md:gap-4 overflow-x-auto pb-2">
              {timeline.map((step, index) => (
                <div key={step.label} className="flex flex-col items-center relative flex-shrink-0">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${step.color} flex items-center justify-center text-white shadow-lg`}>
                    <span className="scale-75 md:scale-100">{step.icon}</span>
                  </div>
                  <span className="mt-2 md:mt-3 text-xs md:text-sm font-medium text-foreground whitespace-nowrap">{step.label}</span>
                  {index < timeline.length - 1 && (
                    <div className="hidden lg:block absolute top-6 md:top-8 left-full w-full">
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground ml-2 md:ml-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 md:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Recursos da Plataforma</h2>
            <p className="text-sm md:text-base text-muted-foreground mt-2">Tudo que voce precisa para gestao completa de Cannabis Medicinal</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section id="compliance" className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <Badge variant="outline" className="gap-1.5 text-primary border-primary/30 bg-primary/10 mb-4 text-xs md:text-sm">
                Compliance
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">
                Totalmente alinhado com a regulamentacao brasileira
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                Nossa plataforma foi desenvolvida seguindo rigorosamente as normativas 
                da ANVISA e as melhores praticas de protecao de dados.
              </p>
              <ul className="space-y-2 md:space-y-3">
                {[
                  'RDC 660/22 - Requisitos de rastreabilidade',
                  'RDC 327/19 - Registro de produtos',
                  'LGPD - Protecao de dados pessoais',
                  'CFM - Prontuario eletronico',
                  'ICP-Brasil - Assinatura digital',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <Card className="bg-card/50 border-border/50 p-4 md:p-6">
                <div className="text-2xl md:text-4xl font-bold text-primary">100%</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Compliance ANVISA</div>
              </Card>
              <Card className="bg-card/50 border-border/50 p-4 md:p-6">
                <div className="text-2xl md:text-4xl font-bold text-primary">AES-256</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Criptografia</div>
              </Card>
              <Card className="bg-card/50 border-border/50 p-4 md:p-6">
                <div className="text-2xl md:text-4xl font-bold text-primary">SHA-256</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Hash Integridade</div>
              </Card>
              <Card className="bg-card/50 border-border/50 p-4 md:p-6">
                <div className="text-2xl md:text-4xl font-bold text-primary">RLS</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Row Level Security</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">
            Pronto para transformar sua operacao?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
            Junte-se as associacoes e clinicas que ja confiam no CannTrace Care 
            para garantir transparencia e compliance em suas operacoes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Button size="lg" asChild className="gap-2">
              <Link href="/auth/cadastro">
                Criar Conta Gratuita
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="mailto:contato@canntrace.care">Falar com Vendas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold text-foreground">CannTrace Care</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2024 CannTrace Care. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
