# CannTrace Care 🌿

A espinha dorsal tecnológica da Cannabis Medicinal no Brasil.

## Visão Geral

O **CannTrace Care** resolve o maior gargalo do setor: a confiança. Através de um sistema **Seed-to-Patient**, garantimos que o médico tenha segurança ao prescrever e o paciente tenha a certeza da pureza do que consome.

### Funcionalidades Principais

- **Rastreabilidade Completa**: Cada lote gera um hash SHA-256 de integridade. Se o laudo laboratorial for alterado, o hash quebra, garantindo imutabilidade.
- **Telemedicina Integrada**: Sala de consulta com prontuário eletrônico e gerador automático de receita PDF
- **Compliance ANVISA**: Validação de receitas (6 meses), gerenciamento de documentação (RDC 660/327)
- **Real World Evidence (RWE)**: Análise de eficácia por strain (ex: 10% CBD) com melhora de sintomas relatada pelo paciente
- **IoT Monitoramento**: Sensores de temperatura, umidade, luz e CO2 para cultivo controlado
- **LGPD Compliant**: Criptografia AES-256 e Row Level Security em todas as tabelas

## Stack Tecnológico

```
Frontend:     Next.js 16 (App Router) + TypeScript + Tailwind CSS
Backend:      Supabase (PostgreSQL) + Edge Functions
Autenticação: Supabase Auth com RBAC (4 níveis)
Segurança:    SHA-256 (integridade), AES-256 (dados sensíveis), Row Level Security
Deploy:       Vercel
```

## Arquitetura RBAC (4 Níveis)

### 1. MÉDICO
- Emissão de receitas com validação de cepa disponível
- Acesso a prontuários eletrônicos do paciente
- Histórico de prescrições e acompanhamento
- Telemedicina com salas de vídeo integradas

### 2. PACIENTE
- Carteira de autorizações ANVISA
- Histórico de receitas e medicamentos consumidos
- Diário de sintomas com escala de intensidade
- Rastreamento de lotes consumidos (Seed-to-Patient)

### 3. CULTIVADOR
- Registro e monitoramento de lotes
- Geração automática de QR Code por lote
- Sensores IoT (temperatura, umidade, luz, CO2)
- Timeline de cultivo (semente → colheita → extração)

### 4. SUPORTE
- Logs de auditoria com rastreamento completo
- Gestão de usuários e permissões
- Validação de documentos ANVISA
- **Sem acesso a dados clínicos** (isolamento de dados sensíveis)

## Estrutura do Banco de Dados

```sql
-- Tabelas Principais
profiles              -- Usuários com roles (médico, paciente, cultivador, suporte)
lotes                 -- Lotes com hash_integridade SHA-256
lote_historico        -- Timeline de cada lote (cultivo → colheita → extração → dispensado)
prescricoes           -- Vínculo médico-paciente com lote e PDF
documentos_anvisa     -- RDC 660/327, Termo de Responsabilidade, etc.
diario_sintomas       -- Registro paciente com intensidade e melhora
sensores_iot          -- Dados de temperatura, umidade, luz, CO2
consultas             -- Histórico de telemedicina
audit_logs            -- Rastreamento completo de ações (compliance)
```

## Conformidade Regulatória

✅ **RDC 660/2022** - Regulamentação de Cannabis Medicinal
✅ **RDC 327/2019** - Procedimentos para importação
✅ **LGPD** - Lei Geral de Proteção de Dados (AES-256 + RLS)
✅ **ICP-Brasil** - Receitas digitais com validação de assinatura

## Como Rodar Localmente

```bash
# 1. Clone o repositório
git clone <repo-url>
cd canntrace-care

# 2. Instale as dependências
pnpm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env.local com:
NEXT_PUBLIC_SUPABASE_URL=seu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon

# 4. Rode o servidor de desenvolvimento
pnpm dev

# 5. Acesse http://localhost:3000
```

## Deploy para Vercel

```bash
# 1. Push para GitHub
git add .
git commit -m "Initial CannTrace Care deployment"
git push origin main

# 2. Conecte no Vercel Dashboard
# - Importe o repositório
# - Configure as variáveis de ambiente Supabase
# - Deploy automático em push

# OU use Vercel CLI:
npm install -g vercel
vercel
```

## Rotas Principais

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/` | Landing Page | Público |
| `/auth/login` | Login | Público |
| `/auth/cadastro` | Registro | Público |
| `/dashboard` | Dashboard Principal | Autenticado |
| `/dashboard/lotes` | Gestão de Lotes | Cultivador |
| `/dashboard/lotes/novo` | Criar novo lote | Cultivador |
| `/dashboard/lotes/[id]` | Detalhes do lote | Cultivador |
| `/dashboard/prescricoes` | Minhas receitas | Paciente/Médico |
| `/dashboard/prescricoes/nova` | Emitir receita | Médico |
| `/dashboard/diario` | Diário de sintomas | Paciente |
| `/dashboard/diario/novo` | Novo registro | Paciente |
| `/dashboard/analytics` | Real World Evidence | Todos |
| `/dashboard/sensores` | Monitoramento IoT | Cultivador |
| `/dashboard/documentos` | Documentos ANVISA | Todos |

## Segurança

### Proteção de Dados
- **AES-256**: Criptografia de dados sensíveis (prontuários, dosagens)
- **SHA-256**: Hash de integridade para cada lote (imutável)
- **Row Level Security**: Cada usuário só acessa seus próprios dados

### Auditoria
- Log completo de todas as operações críticas
- Rastreamento de alterações em lotes e receitas
- Verificação de integridade com triggers automáticos

## Roadmap Futuro

- [ ] Integração com APIs de laboratórios (análise de canabinoides)
- [ ] Blockchain para registro imutável de lotes
- [ ] Mobile App (React Native)
- [ ] Integração com sistema de farmácias (dispensação)
- [ ] Machine Learning para previsão de eficácia por perfil genético
- [ ] Dashboard Público de Estatísticas (RWE agregado)

## Suporte

Para questões técnicas ou bugs, abra uma issue no repositório.

Para suporte comercial: hello@canntrace.care

---

**CannTrace Care** - Transparência Total na Cannabis Medicinal 🌿
