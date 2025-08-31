/*
  # Add user_id column to app_settings table

  1. Schema Changes
    - Add `user_id` column to `app_settings` table (uuid, not null)
    - Add foreign key constraint to reference auth.users(id)
    - Add unique constraint to ensure one settings record per user

  2. Data Migration
    - Update existing records to use the current authenticated user's ID
    - If no authenticated user, use a default UUID

  3. Security
    - Update RLS policies to use user_id for access control
*/

-- Add user_id column to app_settings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'app_settings' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.app_settings 
    ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Update existing records with a default user_id if they don't have one
UPDATE public.app_settings 
SET user_id = gen_random_uuid() 
WHERE user_id IS NULL;

-- Make user_id NOT NULL after updating existing records
ALTER TABLE public.app_settings 
ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'app_settings_user_id_fkey'
  ) THEN
    ALTER TABLE public.app_settings
    ADD CONSTRAINT app_settings_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add unique constraint to ensure one settings record per user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'app_settings_user_id_unique'
  ) THEN
    ALTER TABLE public.app_settings
    ADD CONSTRAINT app_settings_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- Update RLS policies to use user_id
DROP POLICY IF EXISTS "Usuários autenticados podem ver configurações" ON public.app_settings;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir configurações" ON public.app_settings;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar configurações" ON public.app_settings;

CREATE POLICY "Users can read own settings"
  ON public.app_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON public.app_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.app_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);