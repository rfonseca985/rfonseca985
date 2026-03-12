# CannTrace Care - Quick Start Guide

Comece em 5 minutos com a plataforma de rastreabilidade de Cannabis Medicinal.

---

## ⚡ Setup Ultra-Rápido (5 minutos)

### 1. Clonar e Instalar
```bash
git clone https://github.com/seu-usuario/canntrace-care.git
cd canntrace-care
npm install
```

### 2. Configurar Supabase
```bash
# Ir para https://supabase.com/dashboard
# Criar novo projeto
# Copiar URL e ANON_KEY

# Criar arquivo .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima" >> .env.local
```

### 3. Executar Scripts SQL
```bash
# 1. Abrir Supabase Dashboard > SQL Editor
# 2. Copiar conteúdo de scripts/001_create_schema.sql
# 3. Colar e executar
# 4. Repetir com 002_rls_policies.sql
# 5. Repetir com 003_triggers.sql
```

### 4. Iniciar Servidor
```bash
npm run dev
# Acesse http://localhost:3000
```

### 5. Criar Conta de Teste
```
URL: http://localhost:3000/auth/sign-up
Email: teste@example.com
Senha: Test123456!
Role: PACIENTE (ou escolha outro)
```

---

## 🧪 Testar Funcionalidades

### Teste 1: Login & Dashboard
```
1. Ir para http://localhost:3000/auth/login
2. Usar credenciais de teste
3. Ver dashboard customizado por role
```

### Teste 2: Rastreabilidade
```
1. (Como CULTIVADOR) Ir para /dashboard/lotes
2. Ver painel com lotes e status
3. Ver hash SHA-256 de integridade (estrutura pronta)
```

### Teste 3: Telemedicina
```
1. (Como MÉDICO) Ir para /dashboard/consultas
2. Ver consultas agendadas
3. (Como PACIENTE) Receber notificação de nova prescrição
```

### Teste 4: IoT Dashboard
```
1. (Como CULTIVADOR) Ir para /dashboard/iot
2. Ver sensores em tempo real
3. Ver alertas se parâmetro fora do range
```

---

## 📁 Estrutura de Pastas

```
canntrace-care/
├── app/                    # Páginas Next.js
├── components/             # Componentes React
├── lib/                    # Utilitários
├── scripts/                # SQL para banco
├── public/                 # Assets estáticos
├── .env.local             # COPIE O .env.example
├── README.md              # Documentação completa
├── QUICK_START.md         # Este arquivo
└── SUPABASE_SETUP.md      # Setup Supabase detalhado
```

---

## 🔐 4 Roles Diferentes

### Paciente
```
Email: paciente@example.com
Senha: Senha123!

Funcionalidades:
- Ver minhas receitas
- Diário de sintomas
- Agendar consultas
- Ver lotes que uso
```

### Médico
```
Email: medico@example.com
Senha: Senha123!

Funcionalidades:
- Emitir receitas
- Telemedicina
- Ver pacientes
- Relatório RWE
```

### Cultivador
```
Email: cultivador@example.com
Senha: Senha123!

Funcionalidades:
- Registrar lotes
- Monitor IoT
- Ver rastreabilidade
- Relatórios de cultivo
```

### Suporte
```
Email: suporte@example.com
Senha: Senha123!

Funcionalidades:
- Gerenciar usuários
- Ver auditoria
- Status do sistema
- Alertas críticos
```

---

## 🚀 Deploy para Vercel (5 minutos)

### 1. Conectar GitHub
```bash
# Fazer push do código
git add .
git commit -m "CannTrace Care inicial"
git push origin main
```

### 2. Importar em Vercel
```
1. Ir para https://vercel.com/dashboard
2. Clique em "New Project"
3. Selecione seu repositório GitHub
4. Clique "Import"
```

### 3. Adicionar Variáveis de Ambiente
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 4. Deploy
```
Clique "Deploy"
Aguarde 60 segundos
Seu site está ao vivo em https://seu-projeto.vercel.app
```

---

## 🆘 Troubleshooting Rápido

### "Environment variables not found"
```bash
# Certifique-se que .env.local existe
cat .env.local
# Deve ter NEXT_PUBLIC_SUPABASE_URL e ANON_KEY
```

### "RLS policy violation"
```bash
# Verifique se os scripts foram executados
# No Supabase SQL Editor:
SELECT * FROM public.profiles LIMIT 1;
# Deve retornar dados, não erro
```

### "Supabase connection failed"
```bash
# Confirme que a URL é válida
curl https://seu-projeto.supabase.co/rest/v1/profiles?limit=1
# Deve retornar JSON, não HTML
```

### "Import page not found"
```bash
# Verifique a estrutura de pastas
ls -la app/
# Deve ter: layout.tsx, page.tsx, auth/, dashboard/
```

---

## 📖 Documentação Completa

```
README.md                 → Visão geral e conceitos
QUICK_START.md           → Este guia (começo rápido)
SUPABASE_SETUP.md        → Setup Supabase detalhado
DEPLOYMENT.md            → Deploy e produção
ARCHITECTURE.md          → Arquitetura técnica
IMPLEMENTATION_SUMMARY.md → O que foi implementado
```

---

## 💡 Dicas de Desenvolvimento

### Adicionar Nova Página
```bash
# 1. Criar arquivo em app/dashboard/novo/page.tsx
# 2. Importar componentes shadcn/ui
# 3. Usar createClient() para dados Supabase
# 4. Guardar em RLS protected
```

### Criar Nova Tabela
```bash
# 1. Adicionar SQL em scripts/004_nova_tabela.sql
# 2. Executar no Supabase SQL Editor
# 3. Adicionar RLS policies em scripts/002_rls_policies.sql
# 4. Usar no componente React
```

### Testar RLS Policies
```bash
# No Supabase SQL Editor:
SELECT * FROM profiles WHERE id = auth.uid();
-- Deve retornar seu perfil
```

---

## 🎯 Próximas Tarefas

Depois de setup bem-sucedido:

1. ✅ **Explore o Código**
   - Veja como RLS funciona em 2_rls_policies.sql
   - Veja como hash de integridade funciona em lib/batch-integrity.ts
   - Veja como dashboard routing funciona em dashboard-content.tsx

2. ✅ **Personalize**
   - Mude cores do tema em app/globals.css
   - Adicione seu logo em componentes
   - Customize copy dos textos

3. ✅ **Integre Funcionalidades**
   - WebRTC para telemedicina (Twilio/Vonage)
   - PDF generation para receitas
   - QR code generation para lotes
   - Email templates customizados

4. ✅ **Deploy**
   - Siga DEPLOYMENT.md
   - Configure custom domain
   - Ative monitoring
   - Faça backups

---

## 📊 Números da Plataforma

- **4 Roles**: Médico, Paciente, Cultivador, Suporte
- **10 Tabelas**: Estrutura completa do banco
- **40+ RLS Policies**: Segurança em database level
- **3 Fluxos Principais**: Auth, Prescrição, Rastreabilidade
- **100% LGPD**: Criptografia e auditoria
- **0% Alteração**: Hash SHA-256 detecta adulteração

---

## 🤝 Suporte

### Documentação
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Next.js: https://nextjs.org/docs

### Comunidades
- Vercel Discord: https://discord.gg/vercel
- Supabase Discord: https://discord.gg/supabase

### Issues & Bugs
```bash
# Se algo não funcionar:
1. Verifique .env.local
2. Verifique SQL scripts foram executados
3. Limpe cache: rm -rf .next node_modules
4. Reinstale: npm install && npm run dev
```

---

## ✨ Bom Desenvolvimento!

Qualquer dúvida, consulte a documentação completa (README.md, ARCHITECTURE.md).

**CannTrace Care - Transformando Confiança em Tecnologia** 🌿
