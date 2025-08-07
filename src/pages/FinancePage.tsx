import React, { useState, useMemo } from 'react';
import { TrendingUp, Calendar, DollarSign, Users, AlertTriangle, Filter, BarChart3 } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const FinancePage: React.FC = () => {
  const { students, payments } = useData();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

  // Gerar lista de anos disponíveis baseado nos pagamentos
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    payments.forEach(payment => {
      const year = parseInt(payment.monthYear.split('-')[0]);
      years.add(year);
    });
    const currentYear = new Date().getFullYear();
    years.add(currentYear);
    return Array.from(years).sort((a, b) => b - a);
  }, [payments]);

  // Filtrar pagamentos baseado no ano e mês selecionados
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const [paymentYear, paymentMonth] = payment.monthYear.split('-').map(Number);
      const yearMatch = paymentYear === selectedYear;
      const monthMatch = selectedMonth === 'all' || paymentMonth === selectedMonth;
      return yearMatch && monthMatch;
    });
  }, [payments, selectedYear, selectedMonth]);

  // Calcular métricas financeiras
  const financialMetrics = useMemo(() => {
    const totalReceived = filteredPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = filteredPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const defaultersCount = filteredPayments
      .filter(p => p.status === 'pending')
      .map(p => p.studentId)
      .filter((id, index, arr) => arr.indexOf(id) === index)
      .length;

    const activeStudents = students.filter(s => s.status === 'active').length;

    const totalExpected = totalReceived + totalPending;
    const receivedPercentage = totalExpected > 0 ? (totalReceived / totalExpected) * 100 : 0;

    return {
      totalReceived,
      totalPending,
      defaultersCount,
      activeStudents,
      totalExpected,
      receivedPercentage
    };
  }, [filteredPayments, students]);

  // Dados mensais para o ano selecionado
  const monthlyData = useMemo(() => {
    const months = [];
    for (let month = 1; month <= 12; month++) {
      const monthStr = month.toString().padStart(2, '0');
      const monthYear = `${selectedYear}-${monthStr}`;
      
      const monthPayments = payments.filter(p => p.monthYear === monthYear);
      const received = monthPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
      const pending = monthPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);

      months.push({
        month,
        monthName: new Date(selectedYear, month - 1).toLocaleDateString('pt-BR', { month: 'long' }),
        received,
        pending,
        total: received + pending
      });
    }
    return months;
  }, [payments, selectedYear]);

  const monthOptions = [
    { value: 'all', label: 'Todos os meses' },
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
        <p className="text-gray-600">Relatórios e análises financeiras detalhadas</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Ano
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
              Mês
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Recebido</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                R$ {financialMetrics.totalReceived.toLocaleString('pt-BR')}
              </p>
              <p className="text-green-500 text-xs mt-1">
                {financialMetrics.receivedPercentage.toFixed(1)}% do esperado
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">A Receber</p>
              <p className="text-2xl font-bold text-orange-700 mt-1">
                R$ {financialMetrics.totalPending.toLocaleString('pt-BR')}
              </p>
              <p className="text-orange-500 text-xs mt-1">Pendente</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Alunos Ativos</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {financialMetrics.activeStudents}
              </p>
              <p className="text-blue-500 text-xs mt-1">Base atual</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-6 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Inadimplentes</p>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {financialMetrics.defaultersCount}
              </p>
              <p className="text-red-500 text-xs mt-1">Alunos em atraso</p>
            </div>
            <div className="bg-red-500 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela Mensal */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Resultado Mensal - {selectedYear}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mês</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Recebido</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">A Receber</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((month) => {
                const percentage = month.total > 0 ? (month.received / month.total) * 100 : 0;
                return (
                  <tr key={month.month} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900 capitalize">{month.monthName}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-green-600 font-semibold">
                        R$ {month.received.toLocaleString('pt-BR')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-orange-600 font-semibold">
                        R$ {month.pending.toLocaleString('pt-BR')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-gray-900 font-bold">
                        R$ {month.total.toLocaleString('pt-BR')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-20">
                          <div
                            className={`h-2 rounded-full ${
                              percentage >= 80 ? 'bg-green-500' :
                              percentage >= 50 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-600 min-w-12">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td className="py-4 px-4 font-bold text-gray-900">TOTAL</td>
                <td className="py-4 px-4 text-right">
                  <span className="text-green-600 font-bold text-lg">
                    R$ {monthlyData.reduce((sum, m) => sum + m.received, 0).toLocaleString('pt-BR')}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-orange-600 font-bold text-lg">
                    R$ {monthlyData.reduce((sum, m) => sum + m.pending, 0).toLocaleString('pt-BR')}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-gray-900 font-bold text-lg">
                    R$ {monthlyData.reduce((sum, m) => sum + m.total, 0).toLocaleString('pt-BR')}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium">
                    {selectedYear}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {monthlyData.every(m => m.total === 0) && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum dado financeiro encontrado para o período selecionado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancePage;