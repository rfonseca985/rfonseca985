# Arquitetura CannTrace Care

## Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Frontend)                      │
│  Next.js 16 + React 19 + Tailwind CSS + shadcn/ui              │
│  Dark Mode Profissional (#0F172A com destaques #10B981)        │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                   API LAYER (Next.js API Routes)                │
│  Supabase Client (Auth + Database)                             │
│  Row Level Security para segurança por usuário                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│              DATABASE LAYER (Supabase PostgreSQL)               │
│  10 Tabelas principais com RLS e Triggers                      │
│  Criptografia AES-256 para dados sensíveis                     │
│  Row Level Security para LGPD compliance                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fluxos Principais

### 1. Fluxo de Autenticação (RBAC)

```
Usuario
   ↓
[Sign Up] (/auth/sign-up)
   ├─ Email + Password
   ├─ Nome Completo
   └─ Tipo de Usuário (MEDICO/PACIENTE/CULTIVADOR/SUPORTE)
   ↓
Supabase Auth + Trigger handle_new_user()
   ├─ Cria auth.users
   ├─ Cria profiles com role
   └─ Envia email de confirmação
   ↓
[Email Confirmation]
   ├─ Usuário clica link
   └─ Email marcado como confirmed
   ↓
[Login] (/auth/login)
   ├─ Email + Password
   └─ JWT Token criado
   ↓
[Dashboard] (/dashboard)
   ├─ Fetch profile do usuário
   ├─ Renderiza UI baseada em role
   └─ RLS policies protegem dados
```

### 2. Fluxo de Prescrição (Médico → Paciente)

```
Médico
   ↓
[Nova Prescrição] (/dashboard/prescricoes/new)
   ├─ Seleciona paciente
   ├─ Seleciona lote disponível
   ├─ Define dosagem e forma de uso
   └─ Preenche diagnóstico
   ↓
[Gera Receita PDF]
   ├─ SHA-256 de integridade
   ├─ Assinatura digital ICP-Brasil
   └─ QR Code com hash
   ↓
INSERT INTO prescricoes
   ├─ paciente_id
   ├─ medico_id
   ├─ lote_id
   ├─ codigo_receita (UNIQUE)
   ├─ validade (6 meses)
   └─ hash_integridade
   ↓
Paciente recebe notificação
   ↓
Paciente visualiza em /dashboard/prescricoes
   └─ Status: ATIVA, EXPIRADA, CANCELADA, DISPENSADA
```

### 3. Fluxo de Rastreabilidade (Seed-to-Patient)

```
Cultivador registra lote
   ↓
[Novo Lote] (/dashboard/lotes/new)
   ├─ Código QR único
   ├─ Strain (ex: CBD 15%, THC 0.2%)
   ├─ Data de plantio
   └─ Quantidade estimada
   ↓
INSERT INTO lotes
   ├─ gera hash_integridade SHA-256
   └─ status = 'SEMENTE'
   ↓
Ciclo de vida
   ├─ CULTIVO (35 dias) → INSERT lote_timeline
   ├─ COLHEITA (5 dias) → UPDATE status + hash
   ├─ EXTRACAO (7 dias) → UPDATE com rendimento
   ├─ LABORATORIO → Laudo laboratorial anexado
   └─ DISPENSADO → Relacionado a prescricao
   ↓
Cada transição
   ├─ Trigger UPDATE hash_integridade
   ├─ Cria entrada em lote_timeline
   ├─ Armazena hash_anterior e hash_atual
   └─ Se laudo alterado → hash quebra (detecta fraude)
   ↓
Paciente escaneia QR
   └─ Vê timeline completa de onde veio seu produto
```

### 4. Fluxo de Real World Evidence (RWE)

```
Paciente após usar produto
   ↓
[Diário de Sintomas] (/dashboard/diario-sintomas)
   ├─ Data de registro
   ├─ Sintomas antes (dor: 8, ansiedade: 7)
   ├─ Dose utilizada
   └─ Sintomas depois (dor: 3, ansiedade: 4)
   ↓
INSERT INTO diario_sintomas
   ├─ paciente_id
   ├─ prescricao_id
   ├─ sintomas_antes (JSON)
   ├─ sintomas_depois (JSON)
   └─ created_at
   ↓
Médico visualiza RWE
   ↓
[Relatório] (/dashboard/rwe)
   ├─ Gráfico: Cepa vs. Redução de Sintomas
   ├─ Aderência do paciente
   ├─ Eficácia por tipo de cepa
   └─ Dados agregados para pesquisa
```

### 5. Fluxo de IoT (Monitoramento de Estufa)

```
Cultivador configura sensores
   ↓
[Novo Sensor] (/dashboard/iot/novo-sensor)
   ├─ Tipo (TEMPERATURA, UMIDADE, CO2, etc)
   ├─ Localização na estufa
   └─ Limites ideal (ex: temp 22-26°C)
   ↓
INSERT INTO sensores_iot
   ├─ cultivador_id
   ├─ lote_id (qual lote está monitorando)
   ├─ tipo_sensor
   └─ ativo = true
   ↓
Sensor envia leituras
   ↓
INSERT INTO leituras_sensores (a cada 15 min)
   ├─ sensor_id
   ├─ valor (ex: 24.5)
   ├─ unidade (°C)
   ├─ alerta = false (ou true se fora do range)
   └─ created_at
   ↓
Dashboard IoT atualiza em tempo real
   ├─ Gráficos de temperatura/umidade
   ├─ Indicadores de alerta se valor crítico
   └─ Histórico de 30 dias
```

---

## Estrutura de Pastas

```
canntrace-care/
├── app/
│   ├── layout.tsx                    # Root layout + metadados
│   ├── page.tsx                      # Homepage pública
│   ├── globals.css                   # Tema dark mode customizado
│   ├── auth/
│   │   ├── login/page.tsx            # Formulário de login
│   │   ├── sign-up/page.tsx          # Formulário de registro
│   │   ├── sign-up-success/page.tsx  # Confirmação após signup
│   │   ├── error/page.tsx            # Página de erro
│   │   └── logout/route.ts           # POST endpoint para logout
│   └── dashboard/
│       └── page.tsx                  # Dashboard principal (protegido)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Cliente Supabase (browser)
│   │   ├── server.ts                 # Cliente Supabase (servidor)
│   │   └── middleware.ts             # Middleware de sessão
│   ├── batch-integrity.ts            # Funções de hash SHA-256
│   └── utils.ts                      # Utilitários gerais
├── components/
│   ├── ui/                           # shadcn/ui components
│   └── dashboard/
│       ├── dashboard-nav.tsx         # Sidebar com menu por role
│       ├── dashboard-header.tsx      # Top bar com user info
│       ├── dashboard-content.tsx     # Router de conteúdo por role
│       └── views/
│           ├── dashboard-paciente.tsx
│           ├── dashboard-medico.tsx
│           ├── dashboard-cultivador.tsx
│           └── dashboard-suporte.tsx
├── scripts/
│   ├── 001_create_schema.sql         # Criação de tabelas
│   ├── 002_rls_policies.sql          # Row Level Security
│   └── 003_triggers.sql              # Triggers automáticos
├── middleware.ts                     # Auth middleware para rotear
├── package.json
├── tsconfig.json
├── next.config.mjs
├── README.md                         # Documentação principal
├── SUPABASE_SETUP.md                 # Guia de setup Supabase
├── DEPLOYMENT.md                     # Guia de deployment
└── ARCHITECTURE.md                   # Este arquivo
```

---

## Modelo de Dados (ER Diagram)

```
┌─────────────────────────┐
│      auth.users         │ (Supabase Auth)
├─────────────────────────┤
│ id (UUID)              │
│ email (UNIQUE)         │
│ raw_user_meta_data     │
└──────────┬──────────────┘
           │
           ├────── references ────┐
           │                      │
           v                      v
┌──────────────────────┐  ┌───────────────────────┐
│     profiles         │  │   documentos_anvisa   │
├──────────────────────┤  ├───────────────────────┤
│ id (FK)             │  │ id (UUID)            │
│ email               │  │ usuario_id (FK)      │
│ nome_completo       │  │ tipo_documento       │
│ role (ENUM)         │  │ url_arquivo          │
│ cpf/crm/cnpj        │  │ data_validade        │
│ documento_verificado│  │ verificado           │
└──────────┬──────────┘  └───────────────────────┘
           │
    ┌──────┴──────────────────┐
    │                         │
    v                         v
┌─────────────────┐   ┌──────────────────┐
│     lotes       │   │   prescricoes    │
├─────────────────┤   ├──────────────────┤
│ id (UUID)       │   │ id (UUID)        │
│ codigo_qr       │   │ paciente_id (FK) │
│ cultivador_id   │   │ medico_id (FK)   │
│ strain          │   │ lote_id (FK)     │
│ cbd/thc %       │   │ diagnostico      │
│ status (ENUM)   │   │ dosagem          │
│ hash_integridade│   │ pdf_url          │
│ created_at      │   │ validade         │
│ updated_at      │   │ status           │
└────────┬────────┘   └──────────────────┘
         │                    │
         │                    v
         │            ┌──────────────────┐
         │            │ diario_sintomas  │
         │            ├──────────────────┤
         │            │ paciente_id (FK) │
         │            │ sintomas_antes   │
         │            │ sintomas_depois  │
         │            │ dose_utilizada   │
         │            │ created_at       │
         │            └──────────────────┘
         │
         v
┌──────────────────────┐
│   lote_timeline      │
├──────────────────────┤
│ id (UUID)           │
│ lote_id (FK)        │
│ status              │
│ hash_anterior       │
│ hash_atual          │
│ responsavel_id (FK) │
│ created_at          │
└──────────────────────┘

┌──────────────────────┐      ┌──────────────────────┐
│   sensores_iot       │      │  leituras_sensores   │
├──────────────────────┤      ├──────────────────────┤
│ id (UUID)           │ ──→ │ id (UUID)            │
│ cultivador_id (FK)  │      │ sensor_id (FK)       │
│ lote_id (FK)        │      │ valor                │
│ tipo_sensor (ENUM)  │      │ alerta               │
│ localizacao         │      │ created_at           │
│ ativo               │      └──────────────────────┘
└──────────────────────┘

┌──────────────────────┐
│    consultas         │
├──────────────────────┤
│ id (UUID)           │
│ paciente_id (FK)    │
│ medico_id (FK)      │
│ data_hora           │
│ duracao_minutos     │
│ status (ENUM)       │
│ link_sala (WebRTC)  │
│ notas_medico        │
│ prescricao_id (FK)  │
└──────────────────────┘

┌──────────────────────┐
│    audit_logs        │
├──────────────────────┤
│ id (UUID)           │
│ usuario_id (FK)     │
│ acao                │
│ tabela_afetada      │
│ registro_id         │
│ dados_anteriores    │
│ dados_novos         │
│ ip_address          │
│ user_agent          │
│ created_at          │
└──────────────────────┘
```

---

## Segurança & Compliance

### Criptografia
- **AES-256**: Dados sensíveis em repouso
- **SHA-256**: Hash de integridade de lotes
- **TLS 1.3**: Dados em trânsito (via HTTPS)

### Autenticação & Autorização
- **Supabase Auth**: JWT tokens com refresh automático
- **RBAC**: 4 roles com permissões específicas
- **RLS**: Policies SQL para acesso a dados por usuário

### Conformidade
- **LGPD**: Criptografia de dados pessoais + direito ao esquecimento
- **HIPAA**: Telemedicina segura com encryption
- **RDC 660/327**: Validação de receitas e autorização ANVISA
- **ICP-Brasil**: Assinatura digital de receitas

### Auditoria
- **Audit Logs**: Todas as ações registradas
- **Imutabilidade**: Hash de lotes detecta adulteração
- **Rastreabilidade**: Timeline completa seed-to-patient

---

## Performance & Escalabilidade

### Banco de Dados
- **Índices**: Criados em campos de busca frequentes
- **Connection Pooling**: Supabase gerencia conexões
- **Read Replicas**: Disponível em Supabase Pro

### Frontend
- **Next.js Optimization**: Image optimization, code splitting
- **SWR**: Cache inteligente para dados do cliente
- **Tailwind CSS**: Minimal CSS com purge automático

### Backend
- **Vercel Serverless**: Auto-scaling automático
- **Edge Functions**: Processamento perto do usuário
- **CDN**: Static assets distribuídos globalmente

### Monitoramento
- **Vercel Analytics**: Web Vitals em tempo real
- **Supabase Metrics**: Database performance
- **Sentry** (optional): Error tracking

---

## Fluxo de CI/CD

```
Developer pushes to main
    ↓
GitHub Actions workflow triggered
    ↓
npm run build (Next.js compilation)
    ↓
npm run lint (ESLint checks)
    ↓
Vercel automatic deployment
    ↓
Production URL: https://canntrace-care.vercel.app
    ↓
Vercel Analytics starts tracking
```

---

## Melhorias Futuras

### Curto Prazo (1-2 meses)
- [ ] Telemedicina com WebRTC real (Twilio/Vonage)
- [ ] Geração de PDF de receita com template customizado
- [ ] Mobile app (React Native)
- [ ] Notificações push

### Médio Prazo (3-6 meses)
- [ ] Integração com APIs de laboratoriais
- [ ] Dashboard IoT com gráficos mais avançados
- [ ] Integração ANVISA para autorizações automáticas
- [ ] Analytics avançado de RWE

### Longo Prazo (6+ meses)
- [ ] Integração com seguradoras
- [ ] Blockchain para auditoria descentralizada
- [ ] ML para predição de eficácia por cepa
- [ ] Exportação de dados anonimizados para pesquisa

---

## Diagrama de Deployment

```
GitHub Repository
    ↓
Vercel (Frontend + API Routes)
├─ Next.js Server
├─ API Routes (/api/*)
└─ Static Assets
    ↓
Supabase (Backend)
├─ PostgreSQL Database
├─ Auth (Email/Password)
├─ Storage (Documents)
└─ Realtime (Optional)
    ↓
Usuários
├─ Médicos
├─ Pacientes
├─ Cultivadores
└─ Suporte
```

---

**CannTrace Care - Transformando Confiança em Tecnologia** 🌿
