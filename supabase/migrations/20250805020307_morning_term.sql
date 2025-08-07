/*
  # Corrigir política RLS para tabela app_settings

  1. Problema
    - A tabela app_settings não possui política INSERT para usuários autenticados
    - Isso impede que as configurações sejam salvas

  2. Solução
    - Adicionar política INSERT para usuários autenticados
    - Garantir que existe pelo menos um registro padrão na tabela
*/

-- Adicionar política INSERT para usuários autenticados
CREATE POLICY "Usuários autenticados podem inserir configurações"
  ON app_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Inserir registro padrão se não existir
INSERT INTO app_settings (
  court_name,
  contact_phone,
  address,
  operating_hours,
  default_monthly_fee
) VALUES (
  'TM Marinho Sports',
  '',
  '',
  '',
  150.00
) ON CONFLICT DO NOTHING;