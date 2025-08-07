import React from 'react';
import { Users, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import DashboardCard from '../components/DashboardCard';

const Dashboard: React.FC = () => {
  const { students, payments } = useData();

  const activeStudents = students.filter(s => s.status === 'active').length;
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const currentMonthPayments = payments.filter(p => p.monthYear === currentMonth);
  const paidThisMonth = currentMonthPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const currentYear = new Date().getFullYear().toString();
  const paidThisYear = payments
    .filter(p => p.status === 'paid' && p.monthYear.startsWith(currentYear))
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pendingThisMonth = currentMonthPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const defaultersCount = payments
    .filter(p => p.status === 'pending')
    .map(p => p.studentId)
    .filter((id, index, arr) => arr.indexOf(id) === index)
    .length;

  const dashboardData = [
    {
      title: 'Alunos Ativos',
      value: activeStudents.toString(),
      icon: Users,
      color: 'orange',
      description: `${students.length} total de alunos`
    },
    {
      title: 'Inadimplentes',
      value: defaultersCount.toString(),
      icon: AlertTriangle,
      color: 'orange',
      description: 'Alunos com pendências'
    },
    {
      title: 'Recebido no Mês',
      value: `R$ ${paidThisMonth.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      color: 'green',
      description: 'Valores já recebidos'
    },
    {
      title: 'Recebido no Ano',
      value: `R$ ${paidThisYear.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      color: 'green',
      description: `Total recebido em ${currentYear}`
    },
    {
      title: 'A Receber',
      value: `R$ ${pendingThisMonth.toLocaleString('pt-BR')}`,
      icon: TrendingUp,
      color: 'purple',
      description: 'Mensalidades pendentes'
    }
  ];

  const recentPayments = payments
    .filter(p => p.status === 'paid')
    .sort((a, b) => new Date((b.paymentDate || '') + 'T12:00:00').getTime() - new Date((a.paymentDate || '') + 'T12:00:00').getTime())
    .slice(0, 5);

  const pendingPayments = payments
    .filter(p => p.status === 'pending')
    .sort((a, b) => a.monthYear.localeCompare(b.monthYear))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral da TM Marinho Sports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.map((data, index) => (
          <DashboardCard key={index} {...data} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pagamentos Recentes</h3>
          <div className="space-y-3">
            {recentPayments.map((payment) => {
              const student = students.find(s => s.id === payment.studentId);
              return (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{student?.fullName}</p>
                    <p className="text-sm text-gray-600">{payment.monthYear} • {payment.paymentMethod}</p>
                  </div>
                  <span className="text-green-600 font-semibold">
                    R$ {payment.amount.toLocaleString('pt-BR')}
                  </span>
                </div>
              );
            })}
            {recentPayments.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum pagamento recente</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mensalidades Pendentes</h3>
          <div className="space-y-3">
            {pendingPayments.map((payment) => {
              const student = students.find(s => s.id === payment.studentId);
              return (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{student?.fullName}</p>
                    <p className="text-sm text-gray-600">{payment.monthYear}</p>
                  </div>
                  <span className="text-orange-600 font-semibold">
                    R$ {payment.amount.toLocaleString('pt-BR')}
                  </span>
                </div>
              );
            })}
            {pendingPayments.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhuma pendência</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;