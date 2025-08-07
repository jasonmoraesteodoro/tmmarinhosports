import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Check, X, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useData, Payment } from '../contexts/DataContext';
import PaymentForm from '../components/PaymentForm';
import ConfirmDialog from '../components/ConfirmDialog';
import GeneratePaymentsModal from '../components/GeneratePaymentsModal';
import { cleanRg } from '../utils/formatters';

const PaymentsPage: React.FC = () => {
  const { payments, students, deletePayment, updatePayment, generateMissingPaymentsForStudents } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [sortField, setSortField] = useState<'student' | 'monthYear' | 'amount' | 'status'>('monthYear');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Gerar lista de anos disponíveis baseado nos pagamentos
  const availableYears = React.useMemo(() => {
    const years = new Set<number>();
    payments.forEach(payment => {
      const year = parseInt(payment.monthYear.split('-')[0]);
      years.add(year);
    });
    const currentYear = new Date().getFullYear();
    years.add(currentYear);
    return Array.from(years).sort((a, b) => b - a);
  }, [payments]);

  const filteredPayments = payments.filter(payment => {
    const student = students.find(s => s.id === payment.studentId);
    
    // Busca por nome do aluno ou RG - mais robusta
    let matchesSearch = true;
    if (searchTerm && searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase().trim();
      const searchTermNumbers = cleanRg(searchTerm);
      
      matchesSearch = false;
      
      if (student) {
        // Busca por nome
        if (student.fullName && student.fullName.toLowerCase().includes(searchTermLower)) {
          matchesSearch = true;
        }
        
        // Busca por RG (apenas se o termo de busca contém números)
        if (!matchesSearch && searchTermNumbers && student.rg) {
          const studentRgNumbers = cleanRg(student.rg);
          if (studentRgNumbers.includes(searchTermNumbers)) {
            matchesSearch = true;
          }
        }
      }
    }
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    // Filtro por ano
    const [paymentYear] = payment.monthYear.split('-').map(Number);
    const matchesYear = selectedYear === 'all' || paymentYear === selectedYear;
    
    // Filtro por mês
    const [, paymentMonth] = payment.monthYear.split('-').map(Number);
    const matchesMonth = selectedMonth === 'all' || paymentMonth === selectedMonth;
    
    return matchesSearch && matchesStatus && matchesYear && matchesMonth;
  }).sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;
    
    switch (sortField) {
      case 'student':
        const aStudent = students.find(s => s.id === a.studentId);
        const bStudent = students.find(s => s.id === b.studentId);
        aValue = aStudent?.fullName.toLowerCase() || '';
        bValue = bStudent?.fullName.toLowerCase() || '';
        break;
      case 'monthYear':
        aValue = a.monthYear;
        bValue = b.monthYear;
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = a.monthYear;
        bValue = b.monthYear;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: 'student' | 'monthYear' | 'amount' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: 'student' | 'monthYear' | 'amount' | 'status') => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-orange-600" />
      : <ArrowDown className="w-4 h-4 text-orange-600" />;
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deletePayment(id);
    setDeleteConfirm(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleToggleStatus = (payment: Payment) => {
    if (payment.status === 'pending') {
      // Gerar data atual no formato YYYY-MM-DD para evitar problemas de fuso horário
      const today = new Date();
      const currentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      updatePayment(payment.id, {
        status: 'paid',
        paymentDate: currentDate,
        paymentMethod: 'Dinheiro'
      });
    } else {
      updatePayment(payment.id, {
        status: 'pending',
        paymentDate: undefined,
        paymentMethod: undefined
      });
    }
  };

  const handleGeneratePayments = async (studentIds: string[]) => {
    setIsGenerating(true);
    // Simular um pequeno delay para feedback visual
    await new Promise(resolve => setTimeout(resolve, 500));
    generateMissingPaymentsForStudents(studentIds);
    setIsGenerating(false);
    setShowGenerateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mensalidades</h1>
          <p className="text-gray-600">Controle de pagamentos dos alunos</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowGenerateModal(true)}
            disabled={isGenerating}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Gerar Mensalidades</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-700 text-white px-6 py-3 rounded-lg hover:bg-orange-800 transition-colors flex items-center space-x-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Mensalidade</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, RG ou mês/ano..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos os Anos</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos os meses</option>
              <option value={1}>Janeiro</option>
              <option value={2}>Fevereiro</option>
              <option value={3}>Março</option>
              <option value={4}>Abril</option>
              <option value={5}>Maio</option>
              <option value={6}>Junho</option>
              <option value={7}>Julho</option>
              <option value={8}>Agosto</option>
              <option value={9}>Setembro</option>
              <option value={10}>Outubro</option>
              <option value={11}>Novembro</option>
              <option value={12}>Dezembro</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'paid' | 'pending')}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos os Status</option>
              <option value="paid">Pagos</option>
              <option value="pending">Pendentes</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort('student')}
                    className="flex items-center space-x-1 hover:text-orange-600 transition-colors"
                  >
                    <span>Aluno</span>
                    {getSortIcon('student')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort('monthYear')}
                    className="flex items-center space-x-1 hover:text-orange-600 transition-colors"
                  >
                    <span>Mês/Ano</span>
                    {getSortIcon('monthYear')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center space-x-1 hover:text-orange-600 transition-colors"
                  >
                    <span>Valor</span>
                    {getSortIcon('amount')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 hover:text-orange-600 transition-colors"
                  >
                    <span>Status</span>
                    {getSortIcon('status')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Pagamento</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => {
                const student = students.find(s => s.id === payment.studentId);
                return (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{student?.fullName}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {new Date(payment.monthYear + '-01T12:00:00').toLocaleDateString('pt-BR', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-semibold">
                      R$ {payment.amount.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {payment.status === 'paid' ? (
                        <div>
                          <p className="text-sm">
                            {payment.paymentDate && new Date(payment.paymentDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-xs text-gray-500">{payment.paymentMethod}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleToggleStatus(payment)}
                          className={`p-2 rounded-lg transition-colors ${
                            payment.status === 'pending'
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-orange-600 hover:bg-orange-50'
                          }`}
                          title={payment.status === 'pending' ? 'Marcar como pago' : 'Marcar como pendente'}
                        >
                          {payment.status === 'pending' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(payment)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(payment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma mensalidade encontrada</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <PaymentForm
          payment={editingPayment}
          onClose={handleCloseForm}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="Excluir Mensalidade"
          message="Tem certeza que deseja excluir esta mensalidade? Esta ação não pode ser desfeita."
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {showGenerateModal && (
        <GeneratePaymentsModal
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGeneratePayments}
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
};

export default PaymentsPage;