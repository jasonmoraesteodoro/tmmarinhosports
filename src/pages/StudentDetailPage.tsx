import React from 'react';
import { ArrowLeft, Phone, Calendar, User, FileText, CreditCard, Check, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { formatPhone, cleanRg } from '../utils/formatters';

interface StudentDetailPageProps {
  studentId: string | null;
  onBack: () => void;
}

const StudentDetailPage: React.FC<StudentDetailPageProps> = ({ studentId, onBack }) => {
  const { students, getStudentPayments } = useData();
  
  if (!studentId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aluno não encontrado</p>
        <button onClick={onBack} className="mt-4 text-sky-600 hover:text-sky-700">
          Voltar para lista
        </button>
      </div>
    );
  }

  const student = students.find(s => s.id === studentId);
  const payments = getStudentPayments(studentId).sort((a, b) => b.monthYear.localeCompare(a.monthYear));

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aluno não encontrado</p>
        <button onClick={onBack} className="mt-4 text-sky-600 hover:text-sky-700">
          Voltar para lista
        </button>
      </div>
    );
  }

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Detalhes do Aluno</h1>
          <p className="text-gray-600">Informações completas e histórico de pagamentos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-orange-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{student.fullName}</h2>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                student.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {student.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium text-gray-900">{formatPhone(student.phone)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">RG</p>
                  <p className="font-medium text-gray-900">{cleanRg(student.rg)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Data de Nascimento</p>
                  <p className="font-medium text-gray-900">
                    {new Date(student.birthDate + 'T12:00:00').toLocaleDateString('pt-BR')} 
                    <span className="text-gray-500 ml-2">
                      ({(() => {
                        const today = new Date();
                        const birthDate = new Date(student.birthDate + 'T12:00:00');
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const monthDiff = today.getMonth() - birthDate.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                          age--;
                        }
                        return age;
                      })()} anos)
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Início nas Aulas</p>
                  <p className="font-medium text-gray-900">
                    {new Date(student.startDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {student.notes && (
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Observações</p>
                    <p className="font-medium text-gray-900">{student.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Endereço</p>
                  <p className="font-medium text-gray-900">{student.address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Responsável</p>
                  <p className="font-medium text-gray-900">{student.responsibleName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Telefone do Responsável</p>
                  <p className="font-medium text-gray-900">{formatPhone(student.responsiblePhone)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Valor da Mensalidade</p>
                  <p className="font-medium text-gray-900">R$ {student.monthlyFee.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-700 font-medium">Total Pago</span>
                <span className="text-green-800 font-bold">R$ {totalPaid.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-700 font-medium">Total Pendente</span>
                <span className="text-orange-800 font-bold">R$ {totalPending.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="w-6 h-6 text-orange-700" />
              <h3 className="text-lg font-semibold text-gray-900">Histórico de Mensalidades</h3>
            </div>

            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    payment.status === 'paid'
                      ? 'bg-green-50 border-green-500'
                      : 'bg-orange-50 border-orange-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        payment.status === 'paid' ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        {payment.status === 'paid' ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(payment.monthYear + '-01T12:00:00').toLocaleDateString('pt-BR', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                        {payment.status === 'paid' && payment.paymentDate && (
                          <p className="text-sm text-gray-600">
                            Pago em {new Date(payment.paymentDate + 'T12:00:00').toLocaleDateString('pt-BR')} • {payment.paymentMethod}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        payment.status === 'paid' ? 'text-green-700' : 'text-orange-700'
                      }`}>
                        R$ {payment.amount.toLocaleString('pt-BR')}
                      </p>
                      <p className={`text-xs ${
                        payment.status === 'paid' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {payments.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma mensalidade cadastrada</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;