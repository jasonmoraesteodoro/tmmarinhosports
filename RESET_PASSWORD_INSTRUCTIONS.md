# 🔧 Como Resetar a Senha do Usuário

## Problema Identificado
O usuário `jason.moraes@hotmail.com` existe e está confirmado no Supabase, mas as senhas não estão funcionando.

## ✅ Solução: Reset via Supabase Dashboard

### Passo 1: Resetar a Senha
1. **No painel do Supabase** que você já tem aberto
2. **Clique nos 3 pontos (⋯)** ao lado do usuário `jason.moraes@hotmail.com`
3. **Selecione "Send password reset"** ou "Reset password"
4. **Confirme a ação**

### Passo 2: Definir Nova Senha Manualmente
**OU** você pode definir uma nova senha diretamente:

1. **Clique nos 3 pontos (⋯)** ao lado do usuário
2. **Selecione "Edit user"** 
3. **Na seção "Password"**, digite uma nova senha
4. **Salve as alterações**

## 🎯 Senha Sugerida para Teste
```
Admin123!
```

## 🔍 Verificação
Após resetar, teste o login com:
- **Email:** `jason.moraes@hotmail.com`
- **Senha:** `Admin123!` (ou a que você definiu)

## 📋 Se ainda não funcionar
1. Verifique se o usuário não foi desabilitado
2. Confirme se o email está realmente confirmado
3. Tente criar um novo usuário de teste

---
**Nota:** O problema não é no código, mas sim na configuração da senha no Supabase.