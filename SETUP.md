# Quick Start - CannTrace Care

## 🚀 Começar em 5 minutos

### 1. Clonar e Instalar

```bash
git clone https://github.com/canntrace/care.git
cd canntrace-care
pnpm install
```

### 2. Configurar Supabase

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite com suas credenciais Supabase
nano .env.local
```

Você pode encontrar suas chaves em:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase Dashboard > Settings > API > Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Dashboard > Settings > API > anon key

### 3. Rodar Localmente

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000)

### 4. Criar Primeira Conta

1. Clique em "Cadastro"
2. Use um email de teste (ex: test@example.com)
3. Escolha uma senha forte
4. Selecione seu tipo de usuário (médico, paciente, cultivador ou suporte)
5. Confirme o email (será enviado para seu inbox)

## 📋 Checklist de Configuração

- [ ] Supabase projeto criado
- [ ] Variáveis de ambiente configuradas
- [ ] `pnpm install` executado
- [ ] `pnpm dev` rodando sem erros
- [ ] Login funcionando

## 🔑 Tipos de Usuário Padrão

Ao fazer cadastro, escolha seu tipo:

### MÉDICO
- Emitir receitas
- Acessar prontuários de pacientes
- Telemedicina

### PACIENTE
- Ver minhas receitas
- Diário de sintomas
- Rastreamento de medicamento

### CULTIVADOR
- Criar lotes
- Monitorar sensores
- Gerar QR codes

### SUPORTE
- Auditoria
- Gestão de usuários
- Logs do sistema

## 📂 Estrutura de Pastas

```
canntrace-care/
├── app/
│   ├── auth/                 # Páginas de autenticação
│   ├── dashboard/            # Área protegida
│   │   ├── lotes/           # Gestão de lotes
│   │   ├── prescricoes/     # Receitas
│   │   ├── diario/          # Diário de sintomas
│   │   ├── analytics/       # RWE Analytics
│   │   ├── sensores/        # IoT sensors
│   │   └── documentos/      # ANVISA docs
│   ├── layout.tsx
│   ├── page.tsx             # Landing page
│   └── globals.css
├── components/
│   ├── dashboard/           # Componentes do dashboard
│   ├── ui/                  # Shadcn components
│   └── theme-provider.tsx
├── lib/
│   ├── supabase/           # Cliente Supabase
│   ├── types.ts            # TypeScript types
│   └── crypto.ts           # Funções de segurança
├── scripts/
│   └── 001_create_tables.sql # Migration SQL
├── middleware.ts
├── next.config.mjs
├── package.json
└── README.md
```

## 🔐 Segurança

### Variáveis Sensíveis

Nunca adicione ao git:
- `.env.local` - Nunca committe
- Senhas, chaves de API
- Dados pessoais

Use variáveis de ambiente do Vercel para produção.

## 🐛 Troubleshooting

### Erro: "Supabase client not found"
```
Solução: Verifique se .env.local existe e tem as chaves corretas
```

### Erro: "Cannot POST /auth/login"
```
Solução: Supabase não está rodando ou variáveis de ambiente erradas
```

### Erro: "CORS blocked"
```
Solução: Seu URL de origem não está autorizado no Supabase
Supabase Dashboard > Settings > API > CORS Allowed Origins
Adicione: http://localhost:3000
```

### Login não envia email
```
Solução: Configure SMTP ou use provedor de email
Supabase Dashboard > Auth > Email Templates
```

## 📚 Documentação Completa

- [README.md](README.md) - Visão geral do projeto
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy em Vercel
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

## 💬 Próximos Passos

1. Customize o tema em `app/globals.css`
2. Crie sua primeira receita em `/dashboard/prescricoes`
3. Registre sensores em `/dashboard/sensores`
4. Analise dados em `/dashboard/analytics`

## 🚀 Deploy

Para fazer deploy em Vercel:

```bash
git add .
git commit -m "Initial CannTrace Care setup"
git push origin main

# Puis visita Vercel Dashboard > New Project > Import Git Repo
# Selecione seu repositório e configure variáveis de ambiente
```

Veja [DEPLOYMENT.md](DEPLOYMENT.md) para instruções detalhadas.

## 📞 Suporte

- Issues: GitHub Issues
- Discussões: GitHub Discussions
- Email: hello@canntrace.care

---

**CannTrace Care** - Transparência Total na Cannabis Medicinal 🌿
