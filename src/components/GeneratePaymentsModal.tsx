import React, { useState } from 'react';
import { X, Search, RefreshCw, Users } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface GeneratePaymentsModalProps {
  onClose: () => void;
  onGenerate: (studentIds: string[]) => void;
  isGenerating: boolean;
}

const GeneratePaymentsModal: React.FC<GeneratePaymentsModalProps> = ({ 
  onClose, 
  onGenerate, 
  isGenerating 
}) => {
  const { students } = useData();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const activeStudents = students.filter(s => s.status === 'active');
  
  const filteredStudents = activeStudents.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleGenerate = () => {
    if (selectedStudents.length > 0) {
      onGenerate(selectedStudents);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 text-orange-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Gerar Mensalidades</h2>
              <p className="text-sm text-gray-600">Selecione os alunos para gerar as mensalidades</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isGenerating}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {selectedStudents.length} de {filteredStudents.length} alunos selecionados
                </span>
              </div>
              <button
                onClick={handleSelectAll}
                disabled={isGenerating || filteredStudents.length === 0}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedStudents.length === filteredStudents.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno ativo cadastrado'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredStudents.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleToggleStudent(student.id)}
                      disabled={isGenerating}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{student.fullName}</p>
                      <p className="text-sm text-gray-600">
                        Início: {new Date(student.startDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedStudents.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">O que será gerado:</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Serão criadas todas as mensalidades pendentes para os {selectedStudents.length} alunos 
                    selecionados, desde a data de início das aulas até o mês atual.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerate}
            disabled={selectedStudents.length === 0 || isGenerating}
            className="px-6 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>
              {isGenerating 
                ? 'Gerando...' 
                : `Gerar Mensalidades (${selectedStudents.length})`
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratePaymentsModal;