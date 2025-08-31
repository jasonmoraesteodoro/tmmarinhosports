import React, { useState } from 'react';
import { CircleDot, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RegisterPageProps {
  onBackToLanding: () => void;
  onGoToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onBackToLanding, onGoToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfoMessage('');

    // Validações
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (!formData.fullName.trim()) {
      setError('Nome completo é obrigatório');
      setLoading(false);
      return;
    }

    try {
      // Primeiro, verificar se o email já existe e está confirmado
      // Tentamos fazer login com uma senha aleatória para verificar se o usuário existe
      const { error: checkError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: 'senha_temporaria_para_verificacao_123456789'
      });

      // Se o erro for "Invalid login credentials", significa que o email existe e está confirmado
      if (checkError && checkError.message === 'Invalid login credentials') {
        setError('Este email já possui uma conta ativa. Faça login ou use "Esqueceu sua senha?" para recuperar o acesso.');
        setLoading(false);
        return;
      }

      const baseUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5173' 
        : window.location.origin;

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.fullName
          },
          emailRedirectTo: `${baseUrl}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      // Verificar se é um novo usuário ou reenvio de confirmação
      if (data.user) {
        // Novo usuário criado com sucesso - mostrar tela de confirmação
        setConfirmationEmailSent(true);
      } else {
        // Email já existe mas não está confirmado - reenviou confirmação
        setInfoMessage('Email de confirmação reenviado! Se você já tem uma conta com este email, verifique sua caixa de entrada e spam para o link de ativação.');
      }

    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Tratamento específico para diferentes tipos de erro
      if (error.message?.includes('Invalid email')) {
        setError('Email inválido. Verifique o formato do email digitado.');
      } else if (error.message?.includes('Password')) {
        setError('Senha muito fraca. Use pelo menos 6 caracteres com letras e números.');
      } else {
        setError(error.message || 'Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (confirmationEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifique seu Email</h1>
            <p className="text-gray-600 mb-6">
              Se uma conta com o email <strong>{formData.email}</strong> existir, 
              você receberá um link de confirmação. Verifique sua caixa de entrada 
              e spam para ativar sua conta.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-medium text-blue-900 mb-1">Não recebeu o email?</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Verifique a pasta de spam/lixo eletrônico</li>
                    <li>• Aguarde alguns minutos (pode demorar)</li>
                    <li>• Se já tem conta, faça login diretamente</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={onGoToLogin}
                className="w-full bg-orange-700 text-white py-3 rounded-lg font-medium hover:bg-orange-800 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all"
              >
                Ir para Login
              </button>
              <button
                onClick={onBackToLanding}
                className="w-full text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Início</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-orange-700 rounded-full flex items-center justify-center mb-4">
            <CircleDot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar Conta</h1>
          <p className="text-gray-600 mt-2">Cadastre-se no TM Marinho Sports</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Digite seu nome completo"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Digite seu email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-14 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Digite sua senha"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-12 pr-14 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Confirme sua senha"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-900 mb-2">Requisitos da senha:</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li className={`flex items-center space-x-2 ${formData.password.length >= 6 ? 'text-green-700' : ''}`}>
                <span>{formData.password.length >= 6 ? '✓' : '•'}</span>
                <span>Pelo menos 6 caracteres</span>
              </li>
              <li className={`flex items-center space-x-2 ${formData.password === formData.confirmPassword && formData.password.length > 0 ? 'text-green-700' : ''}`}>
                <span>{formData.password === formData.confirmPassword && formData.password.length > 0 ? '✓' : '•'}</span>
                <span>Senhas devem coincidir</span>
              </li>
            </ul>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium">{infoMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-700 text-white py-3 rounded-lg font-medium hover:bg-orange-800 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <button
            type="button"
            onClick={onGoToLogin}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Já tem uma conta? Faça login
          </button>
          <button
            type="button"
            onClick={onBackToLanding}
            className="block w-full text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Início</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;