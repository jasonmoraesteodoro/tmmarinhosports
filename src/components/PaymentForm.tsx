import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useData, Payment } from '../contexts/DataContext';

interface PaymentFormProps {
  payment?: Payment | null;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ payment, onClose }) => {
  const { addPayment, updatePayment, students } = useData();
  const [formData, setFormData] = useState({
    studentId: '',
    monthYear: '',
    amount: 0,
    status: 'pending' as 'paid' | 'pending',
    paymentDate: '',
    paymentMethod: ''
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        studentId: payment.studentId,
        monthYear: payment.monthYear,
        amount: payment.amount,
        status: payment.status,
        paymentDate: payment.paymentDate || '',
        paymentMethod: payment.paymentMethod || ''
      });
    } else {
      // Set default month/year to current
      const now = new Date();
      const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      setFormData(prev => ({ 
        ...prev, 
        monthYear: currentMonthYear,
        paymentDate: '',
        paymentMethod: ''
      }));
    }
  }, [payment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentData = {
      ...formData,
      paymentDate: formData.status === 'paid' && formData.paymentDate ? formData.paymentDate : undefined,
      paymentMethod: formData.status === 'paid' && formData.paymentMethod ? formData.paymentMethod : undefined
    };
    
    if (payment) {
      updatePayment(payment.id, paymentData);
    } else {
      addPayment(paymentData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'studentId') {
      // Quando o aluno é selecionado, buscar o valor da mensalidade dele
      const selectedStudent = students.find(s => s.id === value);
      const studentMonthlyFee = selectedStudent?.monthlyFee || 150;
      
      setFormData(prev => ({
        ...prev,
        studentId: value,
        amount: studentMonthlyFee
      }));
    } else if (name === 'amount') {
      // Converter para número para evitar concatenação de strings
      const numericValue = parseFloat(value) || 0;
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else if (name === 'status') {
      // Quando o status é alterado para 'paid', preencher automaticamente a data atual
      if (value === 'paid') {
        const today = new Date();
        const currentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        setFormData(prev => ({
          ...prev,
          status: 'paid',
          paymentDate: currentDate,
          paymentMethod: prev.paymentMethod || 'Dinheiro'
        }));
      } else {
        // Se status for 'pending', limpar campos de pagamento
        setFormData(prev => ({
          ...prev,
          status: 'pending',
          paymentDate: '',
          paymentMethod: ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const activeStudents = students.filter(s => s.status === 'active');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {payment ? 'Editar Mensalidade' : 'Nova Mensalidade'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
              Aluno *
            </label>
            <select
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Selecione um aluno</option>
              {activeStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="monthYear" className="block text-sm font-medium text-gray-700 mb-2">
              Mês/Ano *
            </label>
            <input
              type="month"
              id="monthYear"
              name="monthYear"
              value={formData.monthYear}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Valor (R$) *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
            </select>
          </div>

          {formData.status === 'paid' && (
            <>
              <div>
                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Data do Pagamento *
                </label>
                <input
                  type="date"
                  id="paymentDate"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                  Forma de Pagamento *
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="PIX">PIX</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Transferência">Transferência</option>
                </select>
              </div>
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-colors font-medium"
            >
              {payment ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;