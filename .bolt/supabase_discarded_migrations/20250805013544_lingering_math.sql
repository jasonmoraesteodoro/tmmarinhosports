-- ATENÇÃO: Este script irá APAGAR TODOS OS DADOS E ESTRUTURAS EXISTENTES
-- nas tabelas app_settings, classes, students, student_classes e payments,
-- e recriá-los do zero. Use com extrema cautela!

-- =============================================
-- 0. REMOÇÃO DE POLÍTICAS E TABELAS EXISTENTES
-- =============================================

-- Remover políticas RLS (se existirem)
DROP POLICY IF EXISTS "Usuários autenticados podem ver configurações" ON app_settings;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar configurações" ON app_settings;
DROP POLICY IF EXISTS "Usuários autenticados podem ver turmas" ON classes;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir turmas" ON classes;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar turmas" ON classes;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar turmas" ON classes;
DROP POLICY IF EXISTS "Usuários autenticados podem ver alunos" ON students;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir alunos" ON students;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar alunos" ON students;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar alunos" ON students;
DROP POLICY IF EXISTS "Usuários autenticados podem ver relacionamentos" ON student_classes;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir relacionamentos" ON student_classes;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar relacionamentos" ON student_classes;
DROP POLICY IF EXISTS "Usuários autenticados podem ver pagamentos" ON payments;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir pagamentos" ON payments;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar pagamentos" ON payments;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar pagamentos" ON payments;

-- Desabilitar RLS antes de dropar tabelas para evitar erros de dependência
ALTER TABLE IF EXISTS app_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS students DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS student_classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payments DISABLE ROW LEVEL SECURITY;

-- Remover tabelas (em ordem de dependência reversa para evitar erros)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS student_classes CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS app_settings CASCADE;

-- =============================================
-- 1. CRIAÇÃO DAS TABELAS PRINCIPAIS
-- =============================================

-- Tabela de configurações da aplicação
CREATE TABLE app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  court_name text NOT NULL DEFAULT 'TM Marinho Sports',
  contact_phone text DEFAULT '',
  address text DEFAULT '',
  operating_hours text DEFAULT '',
  default_monthly_fee numeric(10,2) NOT NULL DEFAULT 150.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de turmas/horários
CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  days_of_week text[] NOT NULL DEFAULT '{}',
  start_time time NOT NULL,
  end_time time NOT NULL,
  capacity integer DEFAULT 12,
  created_at timestamptz DEFAULT now()
);

-- Tabela de alunos
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  rg text NOT NULL,
  birth_date date NOT NULL,
  start_date date NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  monthly_fee numeric(10,2) NOT NULL DEFAULT 150.00,
  notes text DEFAULT '',
  address text DEFAULT '',
  responsible_name text DEFAULT '',
  responsible_phone text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Tabela de relacionamento aluno-turma (muitos para muitos)
CREATE TABLE student_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, class_id)
);

-- Tabela de pagamentos/mensalidades
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  month_year text NOT NULL,
  amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending')),
  payment_date date,
  payment_method text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, month_year)
);

-- =============================================
-- 2. ÍNDICES PARA PERFORMANCE
-- =============================================

CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_student_classes_student_id ON student_classes(student_id);
CREATE INDEX idx_student_classes_class_id ON student_classes(class_id);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_month_year ON payments(month_year);

-- =============================================
-- 3. HABILITAÇÃO DO RLS (ROW LEVEL SECURITY)
-- =============================================

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. POLÍTICAS RLS
-- =============================================

-- Políticas para app_settings
CREATE POLICY "Usuários autenticados podem ver configurações"
  ON app_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem atualizar configurações"
  ON app_settings FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas para classes
CREATE POLICY "Usuários autenticados podem ver turmas"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir turmas"
  ON classes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar turmas"
  ON classes FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar turmas"
  ON classes FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para students
CREATE POLICY "Usuários autenticados podem ver alunos"
  ON students FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir alunos"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar alunos"
  ON students FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar alunos"
  ON students FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para student_classes
CREATE POLICY "Usuários autenticados podem ver relacionamentos"
  ON student_classes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir relacionamentos"
  ON student_classes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar relacionamentos"
  ON student_classes FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para payments
CREATE POLICY "Usuários autenticados podem ver pagamentos"
  ON payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir pagamentos"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar pagamentos"
  ON payments FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar pagamentos"
  ON payments FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- 5. DADOS INICIAIS (SEED DATA)
-- =============================================

-- Inserir configurações padrão
INSERT INTO app_settings (
  court_name,
  contact_phone,
  address,
  operating_hours,
  default_monthly_fee
) VALUES (
  'TM Marinho Sports',
  '(11) 99999-9999',
  'Rua das Quadras, 123 - Vila Esportiva, São Paulo - SP',
  'Segunda a Domingo - 6h às 22h',
  150.00
) ON CONFLICT DO NOTHING;

-- Inserir turmas de exemplo
INSERT INTO classes (name, days_of_week, start_time, end_time, capacity) VALUES
('Segunda e Quarta - Manhã (06:00-07:00)', ARRAY['Segunda', 'Quarta'], '06:00', '07:00', 12),
('Terça e Quinta - Manhã (06:00-07:00)', ARRAY['Terça', 'Quinta'], '06:00', '07:00', 12),
('Segunda e Quarta - Tarde (18:00-19:00)', ARRAY['Segunda', 'Quarta'], '18:00', '19:00', 15),
('Terça e Quinta - Tarde (18:00-19:00)', ARRAY['Terça', 'Quinta'], '18:00', '19:00', 15),
('Sábado - Manhã (08:00-10:00)', ARRAY['Sábado'], '08:00', '10:00', 20),
('Domingo - Manhã (08:00-10:00)', ARRAY['Domingo'], '08:00', '10:00', 20)
ON CONFLICT DO NOTHING;

-- Inserir alunos de exemplo
INSERT INTO students (
  full_name, phone, rg, birth_date, start_date, status, monthly_fee, 
  notes, address, responsible_name, responsible_phone
) VALUES
('João Silva Santos', '11987654321', '123456789', '1990-05-15', '2024-01-15', 'active', 150.00, 
 'Aluno dedicado, sempre pontual', 'Rua A, 123 - Centro', '', ''),
('Maria Oliveira Costa', '11976543210', '987654321', '1985-08-22', '2024-01-20', 'active', 150.00,
 'Boa técnica, precisa melhorar condicionamento', 'Av. B, 456 - Jardim', '', ''),
('Pedro Henrique Lima', '11965432109', '456789123', '2005-03-10', '2024-02-01', 'active', 120.00,
 'Aluno jovem, muito talentoso', 'Rua C, 789 - Vila Nova', 'Ana Lima', '11954321098'),
('Ana Carolina Souza', '11954321098', '789123456', '1992-11-30', '2024-02-10', 'active', 150.00,
 '', 'Rua D, 321 - Bairro Alto', '', ''),
('Carlos Eduardo Ferreira', '11943210987', '321654987', '1988-07-18', '2024-01-25', 'inactive', 150.00,
 'Parou de frequentar em março', 'Av. E, 654 - Centro', '', '')
ON CONFLICT DO NOTHING;

-- Relacionar alunos com turmas
INSERT INTO student_classes (student_id, class_id)
SELECT s.id, c.id
FROM students s, classes c
WHERE 
  (s.full_name = 'João Silva Santos' AND c.name = 'Segunda e Quarta - Manhã (06:00-07:00)') OR
  (s.full_name = 'Maria Oliveira Costa' AND c.name = 'Terça e Quinta - Manhã (06:00-07:00)') OR
  (s.full_name = 'Pedro Henrique Lima' AND c.name = 'Sábado - Manhã (08:00-10:00)') OR
  (s.full_name = 'Ana Carolina Souza' AND c.name = 'Segunda e Quarta - Tarde (18:00-19:00)') OR
  (s.full_name = 'Ana Carolina Souza' AND c.name = 'Domingo - Manhã (08:00-10:00)')
ON CONFLICT DO NOTHING;

-- Inserir alguns pagamentos de exemplo
INSERT INTO payments (student_id, month_year, amount, status, payment_date, payment_method)
SELECT 
  s.id,
  '2024-01',
  s.monthly_fee,
  'paid',
  '2024-01-15',
  'PIX'
FROM students s
WHERE s.status = 'active'
ON CONFLICT DO NOTHING;

INSERT INTO payments (student_id, month_year, amount, status, payment_date, payment_method)
SELECT 
  s.id,
  '2024-02',
  s.monthly_fee,
  'paid',
  '2024-02-15',
  'Dinheiro'
FROM students s
WHERE s.status = 'active'
ON CONFLICT DO NOTHING;

INSERT INTO payments (student_id, month_year, amount, status)
SELECT 
  s.id,
  '2024-03',
  s.monthly_fee,
  'pending'
FROM students s
WHERE s.status = 'active'
ON CONFLICT DO NOTHING;

-- =============================================
-- 6. FUNÇÃO PARA CRIAR USUÁRIO ADMINISTRADOR
-- =============================================

-- Esta função deve ser executada APÓS a criação das tabelas
-- Ela cria o usuário admin@tmmarinho.com com senha admin123

DO $$
DECLARE
  user_id uuid;
BEGIN
  -- Verificar se o usuário já existe
  SELECT id INTO user_id FROM auth.users WHERE email = 'admin@tmmarinho.com';
  
  IF user_id IS NULL THEN
    -- Gerar um novo UUID para o usuário
    user_id := gen_random_uuid();
    
    -- Inserir o usuário na tabela auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
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
      user_id,
      'authenticated',
      'authenticated',
      'admin@tmmarinho.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Administrador"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
    
    -- Inserir a identidade correspondente
    INSERT INTO auth.identities (
      provider_id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at,
      email
    ) VALUES (
      'admin@tmmarinho.com',
      user_id,
      format('{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}', user_id, 'admin@tmmarinho.com')::jsonb,
      'email',
      now(),
      now(),
      now(),
      'admin@tmmarinho.com'
    );
    
    RAISE NOTICE 'Usuário administrador criado com sucesso: admin@tmmarinho.com';
  ELSE
    RAISE NOTICE 'Usuário administrador já existe: admin@tmmarinho.com';
  END IF;
END $$;