/*
  # Tornar app_settings específico por usuário

  1. Modificações na Tabela
    - Adicionar coluna `user_id` à tabela `app_settings`
    - Atualizar registro existente com o user_id do administrador
    - Definir `user_id` como NOT NULL e UNIQUE
    - Remover a chave primária atual baseada em `id`
    - Definir `user_id` como nova chave primária

  2. Segurança
    - Habilitar RLS na tabela `app_settings`
    - Adicionar políticas para SELECT, INSERT, UPDATE, DELETE baseadas em user_id

  3. Observações
    - Cada usuário terá suas próprias configurações
    - O registro existente será associado ao usuário administrador
    - Novos usuários receberão configurações padrão automaticamente
*/

-- Passo 1: Adicionar coluna user_id à tabela app_settings
ALTER TABLE public.app_settings
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Passo 2: Atualizar o registro existente com o user_id do administrador
-- IMPORTANTE: Substitua pelo UUID do seu usuário administrador
UPDATE public.app_settings
SET user_id = '0613c143-fe50-4d67-a501-b0346b9e9e8a'
WHERE user_id IS NULL;

-- Passo 3: Definir user_id como NOT NULL
ALTER TABLE public.app_settings
ALTER COLUMN user_id SET NOT NULL;

-- Passo 4: Remover a chave primária atual e criar nova baseada em user_id
ALTER TABLE public.app_settings DROP CONSTRAINT app_settings_pkey;
ALTER TABLE public.app_settings ADD PRIMARY KEY (user_id);

-- Passo 5: Remover a coluna id que não é mais necessária
ALTER TABLE public.app_settings DROP COLUMN id;

-- Passo 6: Habilitar RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Passo 7: Criar políticas de RLS
CREATE POLICY "Enable read access for users based on user_id"
  ON public.app_settings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Enable insert for users based on user_id"
  ON public.app_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable update for users based on user_id"
  ON public.app_settings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Enable delete for users based on user_id"
  ON public.app_settings
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());