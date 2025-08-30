import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import PaymentsPage from './pages/PaymentsPage';
import StudentDetailPage from './pages/StudentDetailPage';
import FinancePage from './pages/FinancePage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

type ViewType = 'landing' | 'register' | 'login' | 'reset-password' | 'app';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('landing');

  useEffect(() => {
    // Verificar se a URL contém parâmetros de autenticação
    const checkAuthParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      // Verificar se há tokens de reset de senha na URL
      const hasAccessToken = hashParams.get('access_token') || urlParams.get('access_token');
      const hasRefreshToken = hashParams.get('refresh_token') || urlParams.get('refresh_token');
      const type = hashParams.get('type') || urlParams.get('type');
      
      if (hasAccessToken && hasRefreshToken && type === 'recovery') {
        setCurrentView('reset-password');
      } else if (type === 'signup') {
        // Usuário confirmou email após cadastro, direcionar para login
        setCurrentView('login');
        // Limpar a URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    checkAuthParams();

    // Escutar mudanças na URL (hashchange)
    const handleHashChange = () => {
      checkAuthParams();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Se o usuário já está autenticado, ir direto para o app
    if (isAuthenticated) {
      setCurrentView('app');
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Renderizar baseado na view atual
  if (!isAuthenticated || currentView !== 'app') {
    switch (currentView) {
      case 'landing':
        return <LandingPage onGetStarted={() => setCurrentView('register')} />;
      
      case 'register':
        return (
          <RegisterPage 
            onBackToLanding={() => setCurrentView('landing')}
            onGoToLogin={() => setCurrentView('login')}
          />
        );
      
      case 'login':
        return (
          <LoginPage 
            onGoToRegister={() => setCurrentView('register')}
            onBackToLanding={() => setCurrentView('landing')}
          />
        );
      
      case 'reset-password':
        return (
          <ResetPasswordPage 
            onBackToLogin={() => {
              setCurrentView('login');
              // Limpar a URL
              window.history.replaceState({}, document.title, window.location.pathname);
            }} 
          />
        );
      
      default:
        return <LandingPage onGetStarted={() => setCurrentView('register')} />;
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentsPage onSelectStudent={(id) => {
          setSelectedStudentId(id);
          setCurrentPage('student-detail');
        }} />;
      case 'payments':
        return <PaymentsPage />;
      case 'finance':
        return <FinancePage />;
      case 'settings':
        return <SettingsPage />;
      case 'student-detail':
        return (
          <StudentDetailPage 
            studentId={selectedStudentId}
            onBack={() => setCurrentPage('students')}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;