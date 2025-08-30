import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateUser: (userData: { name: string; email: string }) => void;
  user: { name: string; email: string } | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se é um acesso via link de recuperação de senha
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const type = urlParams.get('type');
    
    // Se for um link de recuperação, não autenticar automaticamente
    if (type === 'recovery') {
      setLoading(false);
      return;
    }

    // Verificar sessão atual para acessos normais
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setUser({
          name: session.user.user_metadata?.name || 'Administrador',
          email: session.user.email || ''
        });
      }
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session) {
          setIsAuthenticated(true);
          setUser({
            name: session.user.user_metadata?.name || 'Administrador',
            email: session.user.email || ''
          });
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('=== TENTATIVA DE LOGIN ===');
      console.log('Email:', email);
      console.log('Senha length:', password.length);
      console.log('Timestamp:', new Date().toISOString());
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('=== RESPOSTA DO SUPABASE ===');
      console.log('Data:', data);
      console.log('Error:', error);

      if (error) {
        console.error('=== ERRO DE LOGIN ===');
        console.error('Código do erro:', error.code);
        console.error('Mensagem:', error.message);
        console.error('Status:', error.status);
        console.error('Detalhes completos:', error);
        return false;
      }

      if (data.user) {
        console.log('=== LOGIN BEM-SUCEDIDO ===');
        console.log('User ID:', data.user.id);
        console.log('Email:', data.user.email);
        console.log('Email confirmado:', data.user.email_confirmed_at);
        console.log('Último login:', data.user.last_sign_in_at);
        setIsAuthenticated(true);
        setUser({
          name: data.user.user_metadata?.name || 'Administrador',
          email: data.user.email || ''
        });
        return true;
      }

      console.log('=== LOGIN FALHOU ===');
      console.log('Nenhum usuário retornado, mas sem erro específico');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const updateUser = async (userData: { name: string; email: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: userData.email,
        data: { name: userData.name }
      });

      if (error) {
        console.error('Update user error:', error);
        throw new Error('Erro ao atualizar dados do usuário');
      } else {
        setUser(userData);
        return true;
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Primeiro, verificar se a senha atual está correta
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser?.email) {
        throw new Error('Usuário não encontrado');
      }

      // Tentar fazer login com a senha atual para verificar se está correta
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Senha atual incorreta');
      }

      // Se chegou até aqui, a senha atual está correta, então atualizar para a nova
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error('Change password error:', updateError);
        throw new Error('Erro ao alterar senha');
      }

      return true;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      changePassword,
      updateUser, 
      user, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};