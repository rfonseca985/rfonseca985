# Setup Manual do CannTrace Care no Supabase

Este guia orienta como configurar manualmente o banco de dados do CannTrace Care no Supabase.

## ⚠️ IMPORTANTE

Os scripts SQL estão em:
- `/scripts/001_create_schema.sql` - Criação de tabelas
- `/scripts/002_rls_policies.sql` - Políticas de Row Level Security
- `/scripts/003_triggers.sql` - Triggers automáticos

Execute-os na ordem acima no SQL Editor do Supabase Dashboard.

---

## 📋 Estrutura de Tabelas

### 1. `profiles` - Usuários com RBAC
```sql
-- Armazena informações de perfil de usuários
-- Referencia auth.users(id) para autenticação
-- Roles: MEDICO, PACIENTE, CULTIVADOR, SUPORTE
```

### 2. `lotes` - Lotes de Cannabis
```sql
-- Cada lote tem um hash_integridade SHA-256
-- DNA Digital: qualquer alteração quebra o hash
-- Status: SEMENTE → CULTIVO → COLHEITA → EXTRACAO → LABORATORIO → DISPENSADO
```

### 3. `lote_timeline` - Timeline Imutável
```sql
-- Rastreia cada mudança de status do lote
-- Armazena hash_anterior e hash_atual para validação
-- Impossível alterar histórico sem quebrar a cadeia
```

### 4. `prescricoes` - Receitas Médicas
```sql
-- Vínculo entre Médico, Paciente e Lote
-- Validade de 6 meses
-- Assinatura digital ICP-Brasil
-- Status: ATIVA, EXPIRADA, CANCELADA, DISPENSADA
```

### 5. `diario_sintomas` - Real World Evidence
```sql
-- Paciente registra sintomas antes/depois da dose
-- Cotação numérica de sintomas para análise
-- Base para gráficos de eficácia
```

### 6. `documentos_anvisa` - Compliance
```sql
-- Repositório de documentos obrigatórios
-- Tipos: AUTORIZACAO_IMPORTACAO, TERMO_RESPONSABILIDADE, etc
-- Data de validade para alertas
```

### 7. `sensores_iot` - Sensores da Estufa
```sql
-- Tipos: TEMPERATURA, UMIDADE, CO2, LUZ, PH, EC
-- Localização da estufa
-- Status de funcionamento
```

### 8. `leituras_sensores` - Dados em Tempo Real
```sql
-- Valores numéricos dos sensores
-- Timestamp para análise histórica
-- Flag de alerta para valores fora do ideal
```

### 9. `consultas` - Telemedicina
```sql
-- Agendamento de consultas
-- Link da sala WebRTC
-- Status: AGENDADA, EM_ANDAMENTO, CONCLUIDA, CANCELADA
```

### 10. `audit_logs` - Auditoria Completa
```sql
-- Rastra todas as ações: CREATE, UPDATE, DELETE
-- IP address e User Agent para segurança
-- Dados anteriores e novos para rastreabilidade
```

---

## 🔐 Row Level Security (RLS)

Cada tabela tem políticas RLS para garantir que:

### Pacientes
- ✅ Veem APENAS suas próprias receitas, consultas e diário
- ❌ Não veem dados de outros pacientes
- ✅ Veem lotes que foram prescritos para eles

### Médicos
- ✅ Veem pacientes que supervisionam
- ✅ Emitem e assinam receitas
- ✅ Iniciam consultas com pacientes
- ❌ Não veem dados clínicos de outro médico

### Cultivadores
- ✅ Veem APENAS seus lotes e sensores
- ✅ Registram novos lotes
- ✅ Atualizam status e leituras de IoT
- ❌ Não veem prescrições ou dados de pacientes

### Suporte
- ✅ Veem auditoria completa
- ✅ Gerenciam usuários (aprovação/rejeição)
- ✅ Acessam logs de erro
- ❌ Não acessam dados clínicos

---

## ⚙️ Triggers Automáticos

### `handle_new_user()`
Quando um novo usuário se registra:
1. Cria automaticamente uma entrada em `profiles`
2. Atribui o role correto (MEDICO, PACIENTE, etc)
3. Salva metadados do user

### `update_lote_timestamp()`
Quando um lote é alterado:
1. Atualiza `updated_at` automaticamente
2. Calcula novo `hash_integridade`

### `create_audit_log()`
Rastreia mudanças em tabelas sensíveis:
- Registra ação, dados anteriores e novos
- IP address do usuário
- Timestamp preciso

---

## 🔧 Variáveis de Ambiente

Após criar o Supabase project, obtenha estas variáveis no Settings > API:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://seu-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-super-longa
```

---

## ✅ Checklist de Configuração

- [ ] Criar projeto no Supabase
- [ ] Copiar URL e ANON_KEY para .env.local
- [ ] Executar script 001_create_schema.sql
- [ ] Executar script 002_rls_policies.sql
- [ ] Executar script 003_triggers.sql
- [ ] Testar login com `npm run dev`
- [ ] Criar primeiro usuário teste

---

## 🧪 Teste Rápido

```bash
# 1. Inicie o servidor
npm run dev

# 2. Acesse http://localhost:3000/auth/sign-up

# 3. Crie conta de teste:
#    Email: teste@example.com
#    Senha: teste123456
#    Role: PACIENTE

# 4. Verifique email (pode ser test, vai para console em dev)

# 5. Faça login e acesse /dashboard

# 6. Verifique no Supabase SQL Editor:
SELECT * FROM profiles WHERE email = 'teste@example.com';
```

---

## 🆘 Troubleshooting

### "RLS policy violation"
- Certifique-se que o usuário está autenticado
- Verifique se as políticas estão habilitadas (Enable RLS nas tabelas)
- Confirme que auth.uid() está correto

### "Foreign key constraint violated"
- Verifique a ordem de execução dos scripts
- Tabelas dependentes devem existir primeiro

### "Email confirmation required"
- Em desenvolvimento, confirme email no Supabase Dashboard
- Em produção, usuário recebe email de confirmação

---

## 📞 Suporte

Para mais informações sobre Supabase:
- Docs: https://supabase.com/docs
- Discord: https://discord.gg/supabase
- Status: https://status.supabase.com
