# Como Criar o Usuário Administrador

⚠️ **IMPORTANTE**: Se você está vendo erro "Invalid login credentials", significa que o usuário administrador ainda não foi criado no Supabase.

## Passo 1: Acesse o Painel do Supabase

1. Vá para: https://percujcvtcenugrtqxjb.supabase.co
2. Faça login na sua conta Supabase

## Passo 2: Criar Usuário Administrador

1. No menu lateral, clique em **"Authentication"**
2. Clique na aba **"Users"**
3. Clique no botão **"Add user"** (ou "Invite user")
4. Preencha os dados:
   - **Email:** `jason.moraes@hotmail.com`
   - **Password:** `admin123`
   - **Confirm password:** `admin123`
5. Clique em **"Send invitation"** ou **"Create user"**

## Passo 3: Confirmar Email (se necessário)

**MUITO IMPORTANTE**: O usuário precisa ter o email confirmado para fazer login:

1. Vá para **Authentication > Users**
2. Encontre o usuário criado
3. Se na coluna "Email Confirmed" aparecer "❌" ou estiver vazio:
   - Clique nos três pontos (...) ao lado do usuário
   - Selecione **"Confirm email"**
4. Aguarde até que apareça "✅" na coluna "Email Confirmed"

## Passo 4: Testar Login

Agora você pode fazer login no sistema com:
- **Email:** admin@tmmarinho.com
- **Senha:** admin123

## Alternativa: Usar SQL Editor

Se preferir, você pode executar este SQL no **SQL Editor**:

```sql
-- Inserir usuário administrador
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'jason.moraes@hotmail.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Administrador"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

## Credenciais de Acesso

- **Email:** jason.moraes@hotmail.com
- **Senha:** admin123

Após criar o usuário, você poderá fazer login normalmente no sistema.