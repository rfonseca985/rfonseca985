# Guia de Deployment - CannTrace Care

## Deployment para Vercel (Recomendado)

### Pré-requisitos
- Conta no Supabase (https://supabase.com)
- Conta no Vercel (https://vercel.com)
- GitHub com repositório da aplicação

### 1. Preparar Supabase

```bash
# 1. Acesse supabase.com e crie um novo projeto
# Anotação as credenciais:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY

# 2. Acesse o SQL Editor no Supabase Dashboard
# 3. Execute os scripts na ordem:
#    - scripts/001_create_schema.sql
#    - scripts/002_rls_policies.sql
#    - scripts/003_triggers.sql

# 4. Verifique se todas as tabelas foram criadas
SELECT * FROM information_schema.tables WHERE table_schema = 'public';
```

### 2. Preparar Vercel

```bash
# 1. Faça push do código para GitHub
git add .
git commit -m "Initial CannTrace Care deployment"
git push origin main

# 2. Acesse vercel.com e importe seu repositório
# 3. Configure as Environment Variables:

# Variables (adicione no painel de Vercel):
NEXT_PUBLIC_SUPABASE_URL=seu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key

# 4. Clique em "Deploy"
```

### 3. Configuração Pós-Deployment

```bash
# 1. Teste o login em https://seu-projeto.vercel.app
# 2. Crie primeiro usuário de teste

# 3. Configure email (opcional para produção):
#    - Supabase > Auth > Email Templates
#    - Personalize templates de confirmação

# 4. Ative custom domain (opcional):
#    - Vercel Dashboard > Settings > Domain
#    - Adicione seu domínio customizado
```

---

## Deployment com Docker (Para Servidor Próprio)

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar dependências
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copiar código
COPY . .

# Build
RUN pnpm run build

# Expor porta
EXPOSE 3000

# Start
CMD ["pnpm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}
    networks:
      - canntrace

networks:
  canntrace:
    driver: bridge
```

### Deploy com Docker
```bash
docker-compose up -d
```

---

## Configuração de Produção

### 1. Variáveis de Ambiente

```env
# Production (.env.production.local)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-longa
NODE_ENV=production
```

### 2. Segurança

```bash
# 1. Ativar HTTPS (automático no Vercel/Docker com Nginx)
# 2. Configurar CORS no Supabase:
#    - Project Settings > API
#    - Add seu domínio em Authorized URLs

# 3. Ativar Email Confirmation no Supabase:
#    - Auth > Providers > Email
#    - Enable email confirmation

# 4. Configurar Rate Limiting (optional):
#    - Via Supabase Edge Functions
#    - Ou via Vercel Middleware
```

### 3. Monitoramento

```bash
# 1. Vercel Analytics
#    - Dashboard automático
#    - Web Vitals
#    - Deployment logs

# 2. Supabase Monitoring
#    - Admin > Reports
#    - Query performance
#    - Database size

# 3. Email Alertas
#    - Vercel > Settings > Notifications
#    - Supabase > Project Settings > Email
```

---

## CI/CD Pipeline (GitHub Actions)

### .github/workflows/deploy.yml
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Checklist de Deployment

### Antes de Go-Live
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Scripts SQL executados no Supabase
- [ ] Email confirmation ativado
- [ ] HTTPS/SSL habilitado
- [ ] CORS configurado
- [ ] Rate limiting ativado
- [ ] Backups automáticos do Supabase
- [ ] Monitoramento ativado
- [ ] Documentação de suporte preparada

### Primeiro Login
- [ ] Criar usuário médico teste
- [ ] Criar usuário paciente teste
- [ ] Criar usuário cultivador teste
- [ ] Testar fluxo de login
- [ ] Testar fluxo de prescrição
- [ ] Testar telemedicina (mock)
- [ ] Testar lotes e rastreabilidade
- [ ] Testar IoT dashboard

### Pós-Deployment
- [ ] Monitorar erro logs por 24h
- [ ] Verificar performance (Core Web Vitals)
- [ ] Backup de dados completo
- [ ] Documentar qualquer issue
- [ ] Preparar runbook de escalação

---

## Troubleshooting Deployment

### "Environment variables not found"
```bash
# 1. Verifique Vercel Dashboard > Settings > Environment Variables
# 2. Confirme que as variáveis estão em "Production"
# 3. Redeploy a aplicação (Vercel > Deployments > Redeploy)
```

### "Supabase connection failed"
```bash
# 1. Confirme a URL está correta
# 2. Verifique que a chave Anon é válida
# 3. Teste conexão no Supabase SQL Editor
SELECT NOW(); -- deve retornar timestamp
```

### "RLS policy violation in production"
```bash
# 1. Verifique que os triggers foram executados
# 2. Confirme que auth.uid() está sendo usado nas policies
# 3. Teste em modo incógnito (sem cache)
```

### "Slow performance"
```bash
# 1. Verifique Vercel Analytics > Performance
# 2. Adicione índices no Supabase (já inclusos nos scripts)
# 3. Use Supabase Query Performance dashboard
```

---

## Escala para Produção

### Database
- Aumentar storage Supabase conforme necessário
- Ativar backup automático diário
- Configurar read replicas se necessário

### API
- Vercel serverless functions já escalam automaticamente
- Configurar Supabase connection pooling se muitos acessos simultâneos

### Storage
- Usar Supabase Storage para documentos ANVISA
- Ou integrar com S3 da AWS

### Monitoramento
- Configurar alertas no Supabase para queries lentas
- Configurar alertas no Vercel para deployment failures
- Integrar com Sentry para rastreamento de erros (opcional)

---

## Support & Help

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **CannTrace Support**: support@canntrace-care.com

---

## Roadmap de Melhorias Futuras

- [ ] Integração com APIs de laboratoriais
- [ ] WebRTC nativo para telemedicina (via Twilio/Vonage)
- [ ] Notificações push em mobile app
- [ ] Dashboard IoT mais avançado (gráficos em tempo real)
- [ ] Integração ANVISA para autorizações automáticas
- [ ] Mobile app (React Native)
- [ ] Analytics avançado de RWE
- [ ] Integração com sistema de seguradoras
