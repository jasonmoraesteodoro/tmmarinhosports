-- Execute este SQL no SQL Editor do Supabase para resetar a senha

-- Atualizar a senha do usuário jason.moraes@hotmail.com
UPDATE auth.users 
SET encrypted_password = crypt('Admin123!', gen_salt('bf'))
WHERE email = 'jason.moraes@hotmail.com';

-- Verificar se o usuário foi atualizado
SELECT email, email_confirmed_at, last_sign_in_at 
FROM auth.users 
WHERE email = 'jason.moraes@hotmail.com';