# Deploy Direto do v0 para Vercel

## 🚀 Opção 1: Publicar Direto do v0 (MAIS FÁCIL)

### Passo 1: Clique no Botão "Publish"

Na interface do v0, no canto superior direito há um botão **"Publish to Vercel"**.

Clique nele! O v0 fará automaticamente:
- ✅ Criar repositório GitHub (ou usar existente)
- ✅ Push do código
- ✅ Criar projeto no Vercel
- ✅ Deploy automático

### Passo 2: Configure Variáveis de Ambiente

Após o deploy inicial, você precisa configurar:

1. Acesse seu projeto no **Vercel Dashboard**
2. Vá em **Settings > Environment Variables**
3. Adicione:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = sua-chave-anonima
   ```
4. Salve

### Passo 3: Redeploy

Após adicionar as variáveis:
1. Vá em **Deployments**
2. Clique nos 3 pontos no deployment anterior
3. Selecione "Redeploy"

Pronto! Sua app está rodando em `https://seu-projeto.vercel.app`

---

## 🔄 Opção 2: GitHub + Vercel (Melhor Prática)

Se você quer mais controle e CI/CD contínuo:

### Passo 1: Push para GitHub

```bash
git init
git add .
git commit -m "Initial CannTrace Care commit"
git remote add origin https://github.com/seu-usuario/canntrace-care.git
git push -u origin main
```

### Passo 2: Conectar ao Vercel

1. Acesse [https://vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Selecione "Import Git Repository"
4. Escolha seu repositório `canntrace-care`
5. Configure:
   - **Project Name**: canntrace-care
   - **Framework Preset**: Next.js
6. Em **Environment Variables**, adicione:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
7. Clique em "Deploy"

### Passo 3: Ativar Deployments Automáticos

Agora, cada push para `main` fará deploy automático!

```bash
# Para fazer deploy futuro:
git commit -am "Nova funcionalidade"
git push
# Vercel detecta e faz deploy automaticamente
```

---

## ⚠️ Checklist Pré-Deploy

Antes de publicar, verifique:

- [ ] `.env.local` configurado com chaves Supabase
- [ ] `pnpm dev` rodando sem erros
- [ ] Login e cadastro funcionando
- [ ] Banco de dados criado (migration SQL executada)
- [ ] Nenhum arquivo `console.log` de debug
- [ ] `.env.local` **NÃO** está no git

## 🔑 Onde Encontrar as Chaves Supabase

### NEXT_PUBLIC_SUPABASE_URL
1. Supabase Dashboard
2. Projeto > Settings
3. API
4. Copie "Project URL"

### NEXT_PUBLIC_SUPABASE_ANON_KEY
1. Supabase Dashboard
2. Projeto > Settings
3. API
4. Copie "anon/public key"

## ✅ Verificar Deploy

Após publicar:

1. **Acesse a URL**: `https://seu-projeto.vercel.app`
2. **Veja se carrega**: Aguarde 30 segundos
3. **Teste login**: Cadastre-se em `/auth/cadastro`
4. **Verifique logs**: Vercel Dashboard > Deployments > Logs

## 🐛 Se Algo Deu Errado

### "Cannot find supabase client"
→ Faltam variáveis de ambiente. Adicione em Vercel > Settings > Environment Variables

### "CORS blocked"
→ Adicione seu domínio Vercel em Supabase > Settings > API > CORS Allowed Origins
Exemplo: `https://seu-projeto.vercel.app`

### "Database connection refused"
→ Verifique:
- Projeto Supabase está online
- Chaves estão corretas
- Seu IP tem acesso (se há whitelist)

### "Build failed"
→ Veja logs em Vercel > Deployments > Build Logs

## 🎉 Parabéns!

Sua aplicação CannTrace Care está no ar! 

**Próximos passos:**
1. Configure domínio customizado (canntrace.care)
2. Ative HTTPS (automático no Vercel)
3. Configure alertas de errors
4. Inicie seus testes de usuários

## 📚 Documentação

Para mais informações:
- [README.md](README.md) - Visão geral
- [SETUP.md](SETUP.md) - Setup local
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy detalhado
- [BUILD_SUMMARY.md](BUILD_SUMMARY.md) - O que foi criado

---

**Pronto? Clique em "Publish"! 🚀**
