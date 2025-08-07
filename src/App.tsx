import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import PaymentsPage from './pages/PaymentsPage';
import StudentDetailPage from './pages/StudentDetailPage';
import FinancePage from './pages/FinancePage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    // Verificar se a URL contém parâmetros de reset de senha
    const checkForResetPassword = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      // Verificar se há tokens de reset na URL
      const hasAccessToken = hashParams.get('access_token') || urlParams.get('access_token');
      const hasRefreshToken = hashParams.get('refresh_token') || urlParams.get('refresh_token');
      const type = hashParams.get('type') || urlParams.get('type');
      
      if (hasAccessToken && hasRefreshToken && type === 'recovery') {
        setShowResetPassword(true);
      }
    };

    checkForResetPassword();

    // Escutar mudanças na URL
    const handleHashChange = () => {
      checkForResetPassword();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  // Mostrar página de reset de senha se necessário
  if (showResetPassword) {
    return (
      <ResetPasswordPage 
        onBackToLogin={() => {
          setShowResetPassword(false);
          // Limpar a URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }} 
      />
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
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