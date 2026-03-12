# Guia de Deployment - CannTrace Care

## Deployment para Vercel (Recomendado)

O CannTrace Care foi otimizado para deployment em Vercel com integração automática ao Supabase.

### Pré-requisitos

1. **Conta Vercel** - [https://vercel.com/signup](https://vercel.com/signup)
2. **Supabase Configurado** - Banco de dados e variáveis de ambiente prontas
3. **Repositório GitHub** - Código versionado no GitHub

### Opção 1: Deploy via Vercel Dashboard (Recomendado)

1. Acesse [https://vercel.com/new](https://vercel.com/new)
2. Selecione "Import Git Repository"
3. Conecte sua conta GitHub
4. Selecione o repositório `canntrace-care`
5. Configure as variáveis de ambiente:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
   ```
6. Clique em "Deploy"
7. Aguarde a conclusão (normalmente 2-3 minutos)

### Opção 2: Deploy via Vercel CLI

```bash
# 1. Instale o Vercel CLI
npm i -g vercel

# 2. Configure as variáveis de ambiente localmente
cp .env.example .env.local
# Edite .env.local com suas chaves Supabase

# 3. Deploy
vercel

# 4. Configure as variáveis de ambiente na Vercel (recomendado)
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 5. Deploy em produção
vercel --prod
```

## Configuração Pós-Deploy

### 1. Health Check
```bash
# Teste se a aplicação está rodando
curl https://seu-dominio.vercel.app/health
```

### 2. Verificar Logs
```
Acesse: Vercel Dashboard > Project > Deployments > Logs
```

### 3. Configurar CORS no Supabase

Se receber erros de CORS, configure em Supabase:

```
Supabase Dashboard > Project Settings > API > CORS Allowed Origins

Adicione:
- https://seu-dominio.vercel.app
- https://seu-dominio-staging.vercel.app (opcional)
```

### 4. Testar Autenticação

1. Acesse `https://seu-dominio.vercel.app`
2. Clique em "Cadastro"
3. Use um email de teste para criar uma conta
4. Verifique o email de confirmação
5. Faça login na plataforma

## Monitoramento em Produção

### Vercel Analytics
- Acesso automático em: Vercel Dashboard > Project > Analytics
- Monitora performance, uptime e erros

### Supabase Monitoring
- Logs: Supabase Dashboard > Logs Explorer
- Métricas: Supabase Dashboard > Database Stats
- RLS Policies: Verify in Auth Policies tab

## Rollback

Se algo der errado:

```bash
# Vercel CLI
vercel rollback

# OU pelo Dashboard:
# Vercel Dashboard > Deployments > Selecione versão anterior > Promote to Production
```

## Performance

### Otimizações Implementadas

- **Edge Functions**: Supabase functions rodando em edge
- **Caching**: Next.js static generation onde possível
- **Image Optimization**: Imagens otimizadas automaticamente
- **Bundle Size**: Dependências mínimas (42KB gzip)

### Monitorar Performance

```
Vercel Dashboard > Project > Analytics > Web Vitals
```

Métricas a acompanhar:
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1

## Segurança

### Headers de Segurança

O Next.js foi configurado com headers de segurança automáticos:
- `X-Frame-Options: SAMEORIGIN` - Protege contra clickjacking
- `X-Content-Type-Options: nosniff` - Protege contra MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Proteção contra XSS

### HTTPS Automático

Vercel fornece HTTPS automaticamente para todos os deployments.

### Variáveis de Ambiente Secretas

Nunca committe variáveis sensíveis. Use apenas:

```bash
# .env.local (local)
# Vercel UI > Settings > Environment Variables (produção)
```

## Troubleshooting

### Erro: "Cannot find supabase client"

**Solução**: Verifique se `NEXT_PUBLIC_SUPABASE_URL` está configurada em variáveis de ambiente.

### Erro: "CORS blocked"

**Solução**: Adicione seu domínio Vercel à lista de CORS permitidos no Supabase.

### Erro: "Database connection refused"

**Solução**: Verifique:
1. Supabase status em [https://status.supabase.com](https://status.supabase.com)
2. IP whitelist do banco (se configurado)
3. Credenciais de autenticação corretas

### Aplicação lenta

**Solução**:
1. Verifique Web Vitals no Vercel Analytics
2. Analise query performance no Supabase
3. Use `next/image` para images otimizadas

## Próximos Passos

1. Configure domínio customizado (ex: app.canntrace.care)
2. Ative 2FA no Vercel e GitHub
3. Configure Slack notifications para deployments
4. Implemente CI/CD com GitHub Actions
5. Configure backups automáticos do Supabase

## Suporte

Para questões de deployment:
- Vercel Support: [https://vercel.com/support](https://vercel.com/support)
- Supabase Support: [https://supabase.com/support](https://supabase.com/support)
- Issues do projeto: [GitHub Issues](issues)

---

**Última atualização**: 12 de março de 2026
