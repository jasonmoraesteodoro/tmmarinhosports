import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useData, Student, Class } from '../contexts/DataContext';
import { applyPhoneMask, cleanPhone, cleanRg } from '../utils/formatters';

interface StudentFormProps {
  student?: Student | null;
  onClose: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onClose }) => {
  const { addStudent, updateStudent, classes } = useData();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    rg: '',
    birthDate: '',
    startDate: '',
    status: 'active' as 'active' | 'inactive',
    monthlyFee: 150,
    notes: '',
    address: '',
    responsibleName: '',
    responsiblePhone: '',
    classIds: [] as string[]
  });

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName,
        phone: student.phone,
        rg: student.rg,
        birthDate: student.birthDate,
        startDate: student.startDate,
        status: student.status,
        monthlyFee: student.monthlyFee,
        notes: student.notes,
        address: student.address,
        responsibleName: student.responsibleName,
        responsiblePhone: student.responsiblePhone,
        classIds: student.classIds || []
      });
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (student) {
      updateStudent(student.id, formData);
    } else {
      addStudent(formData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone' || name === 'responsiblePhone') {
      // Aplicar máscara de telefone
      const maskedValue = applyPhoneMask(value);
      setFormData(prev => ({
        ...prev,
        [name]: maskedValue
      }));
    } else if (name === 'rg') {
      // Manter apenas números no RG
      const maskedValue = cleanRg(value);
      setFormData(prev => ({
        ...prev,
        [name]: maskedValue
      }));
    } else if (name === 'monthlyFee') {
      // Converter para número
      const numericValue = parseFloat(value) || 0;
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleClassToggle = (classId: string) => {
    setFormData(prev => ({
      ...prev,
      classIds: prev.classIds.includes(classId)
        ? prev.classIds.filter(id => id !== classId)
        : [...prev.classIds, classId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {student ? 'Editar Aluno' : 'Novo Aluno'}
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
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="rg" className="block text-sm font-medium text-gray-700 mb-2">
              RG *
            </label>
            <input
              type="text"
              id="rg"
              name="rg"
              value={formData.rg}
              onChange={handleChange}
              placeholder="Apenas números"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Nascimento *
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Início nas Aulas *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
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
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>

          <div>
            <label htmlFor="monthlyFee" className="block text-sm font-medium text-gray-700 mb-2">
              Valor da Mensalidade (R$) *
            </label>
            <input
              type="number"
              id="monthlyFee"
              name="monthlyFee"
              value={formData.monthlyFee}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="150.00"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Valor personalizado da mensalidade para este aluno
            </p>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Observações adicionais sobre o aluno..."
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Rua, número, bairro"
            />
          </div>

          <div>
            <label htmlFor="responsibleName" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Responsável
            </label>
            <input
              type="text"
              id="responsibleName"
              name="responsibleName"
              value={formData.responsibleName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Nome completo do responsável"
            />
          </div>

          <div>
            <label htmlFor="responsiblePhone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefone do Responsável
            </label>
            <input
              type="tel"
              id="responsiblePhone"
              name="responsiblePhone"
              value={formData.responsiblePhone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Turmas
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {classes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">
                  Nenhuma turma cadastrada
                </p>
              ) : (
                classes.map((classItem) => (
                  <label
                    key={classItem.id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.classIds.includes(classItem.id)}
                      onChange={() => handleClassToggle(classItem.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{classItem.name}</span>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Selecione as turmas que o aluno irá participar
            </p>
          </div>

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
              {student ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;