import React, { useState } from 'react';
import { User, Lock, Building, Bell, Calendar, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import ClassesManagementTab from '../components/ClassesManagementTab';

const SettingsPage: React.FC = () => {
  const { user, updateUser, changePassword } = useAuth();
  const { appSettings, updateAppSettings } = useData();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    // Dados do usuário
    adminName: user?.name || '',
    adminEmail: user?.email || '',
    // Dados da quadra
    courtName: appSettings.courtName,
    contactPhone: appSettings.contactPhone,
    address: appSettings.address,
    operatingHours: appSettings.operatingHours,
    defaultMonthlyFee: appSettings.defaultMonthlyFee
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const tabs = [
    { id: 'general', label: 'Geral', icon: Building },
    { id: 'classes', label: 'Turmas e Horários', icon: Calendar },
    { id: 'security', label: 'Segurança', icon: Lock },
    { id: 'notifications', label: 'Notificações', icon: Bell },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'defaultMonthlyFee' ? parseFloat(value) || 0 : value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Simular delay para feedback visual
      await new Promise(resolve => setTimeout(resolve, 500));

      // Atualizar dados do usuário
      await updateUser({
        name: formData.adminName,
        email: formData.adminEmail
      });

      // Atualizar configurações da quadra
      await updateAppSettings({
        courtName: formData.courtName,
        contactPhone: formData.contactPhone,
        address: formData.address,
        operatingHours: formData.operatingHours,
        defaultMonthlyFee: formData.defaultMonthlyFee
      });

      setSuccessMessage('Configurações salvas com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error saving settings:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao salvar configurações');
      
      // Limpar mensagem de erro após 5 segundos
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordSuccessMessage('');
    setPasswordErrorMessage('');

    // Validações
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrorMessage('As senhas não coincidem');
      setIsChangingPassword(false);
      setTimeout(() => setPasswordErrorMessage(''), 5000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordErrorMessage('A nova senha deve ter pelo menos 6 caracteres');
      setIsChangingPassword(false);
      setTimeout(() => setPasswordErrorMessage(''), 5000);
      return;
    }

    try {
      // Simular delay para feedback visual
      await new Promise(resolve => setTimeout(resolve, 500));

      await changePassword(passwordData.currentPassword, passwordData.newPassword);

      setPasswordSuccessMessage('Senha alterada com sucesso!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setPasswordSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordErrorMessage(error instanceof Error ? error.message : 'Erro ao alterar senha');
      
      // Limpar mensagem de erro após 5 segundos
      setTimeout(() => {
        setPasswordErrorMessage('');
      }, 5000);
    } finally {
      setIsChangingPassword(false);
    }
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <form onSubmit={handleSaveGeneral} className="space-y-8">
            {/* Seção do Administrador */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5 text-orange-600" />
                <span>Informações do Administrador</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Administrador *
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Divisor */}
            <div className="border-t border-gray-200"></div>

            {/* Seção da Quadra */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Building className="w-5 h-5 text-orange-600" />
                <span>Informações da Quadra</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Quadra *
                  </label>
                  <input
                    type="text"
                    name="courtName"
                    value={formData.courtName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone de Contato
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Rua, número, bairro, cidade - CEP"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário de Funcionamento
                  </label>
                  <input
                    type="text"
                    name="operatingHours"
                    value={formData.operatingHours}
                    onChange={handleInputChange}
                    placeholder="Ex: Segunda a Domingo - 6h às 22h"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor da Mensalidade Padrão (R$) *
                  </label>
                  <input
                    type="number"
                    name="defaultMonthlyFee"
                    value={formData.defaultMonthlyFee}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Mensagens de Feedback */}
            {successMessage && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Botão de Salvar */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-orange-700 text-white px-6 py-3 rounded-lg hover:bg-orange-800 transition-colors flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </form>
        );

      case 'classes':
        return <ClassesManagementTab />;

      case 'security':
        return (
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha Atual *
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nova Senha *
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nova Senha *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">Dicas de Segurança:</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Use pelo menos 6 caracteres</li>
                    <li>• Inclua letras maiúsculas e minúsculas</li>
                    <li>• Adicione números e símbolos</li>
                    <li>• Evite informações pessoais óbvias</li>
                  </ul>
                </div>

                {/* Mensagens de Feedback para Senha */}
                {passwordSuccessMessage && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{passwordSuccessMessage}</span>
                  </div>
                )}

                {passwordErrorMessage && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{passwordErrorMessage}</span>
                  </div>
                )}

                {/* Botão de Alterar Senha */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="bg-orange-700 text-white px-6 py-3 rounded-lg hover:bg-orange-800 transition-colors flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="w-5 h-5" />
                    <span>{isChangingPassword ? 'Alterando...' : 'Alterar Senha'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        );


      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Notificação</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Mensalidades em Atraso</h4>
                    <p className="text-sm text-gray-600">Receber alertas sobre pagamentos pendentes</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Novos Alunos</h4>
                    <p className="text-sm text-gray-600">Notificar quando um novo aluno for cadastrado</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Pagamentos Recebidos</h4>
                    <p className="text-sm text-gray-600">Confirmar quando um pagamento for registrado</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );


      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações da sua quadra e conta</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;