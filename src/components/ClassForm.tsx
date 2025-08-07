import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useData, Class } from '../contexts/DataContext';

interface ClassFormProps {
  classItem?: Class | null;
  onClose: () => void;
}

const ClassForm: React.FC<ClassFormProps> = ({ classItem, onClose }) => {
  const { addClass, updateClass } = useData();
  const [formData, setFormData] = useState({
    name: '',
    daysOfWeek: [] as string[],
    startTime: '',
    endTime: '',
    capacity: 12
  });

  const daysOptions = [
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
    'Domingo'
  ];

  useEffect(() => {
    if (classItem) {
      setFormData({
        name: classItem.name,
        daysOfWeek: classItem.daysOfWeek,
        startTime: classItem.startTime,
        endTime: classItem.endTime,
        capacity: classItem.capacity || 12
      });
    }
  }, [classItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (classItem) {
      updateClass(classItem.id, formData);
    } else {
      addClass(formData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const generateName = () => {
    if (formData.daysOfWeek.length > 0 && formData.startTime && formData.endTime) {
      const daysText = formData.daysOfWeek.join(' e ');
      const timeText = `${formData.startTime}-${formData.endTime}`;
      
      // Determinar período do dia
      const startHour = parseInt(formData.startTime.split(':')[0]);
      let period = '';
      if (startHour >= 6 && startHour < 12) {
        period = 'Manhã';
      } else if (startHour >= 12 && startHour < 18) {
        period = 'Tarde';
      } else {
        period = 'Noite';
      }
      
      const generatedName = `${daysText} - ${period} (${timeText})`;
      setFormData(prev => ({ ...prev, name: generatedName }));
    }
  };

  useEffect(() => {
    if (!classItem) { // Só gera automaticamente para novas turmas
      generateName();
    }
  }, [formData.daysOfWeek, formData.startTime, formData.endTime, classItem]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {classItem ? 'Editar Turma' : 'Nova Turma'}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Turma *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: Segunda e Quarta - Manhã (06:00-07:00)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              O nome será gerado automaticamente baseado nos dias e horários selecionados
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dias da Semana *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {daysOptions.map((day) => (
                <label
                  key={day}
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.daysOfWeek.includes(day)
                      ? 'bg-orange-50 border-orange-500 text-orange-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.daysOfWeek.includes(day)}
                    onChange={() => handleDayToggle(day)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{day}</span>
                </label>
              ))}
            </div>
            {formData.daysOfWeek.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Selecione pelo menos um dia</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Horário de Início *
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                Horário de Término *
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
              Capacidade Máxima
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              max="50"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="12"
            />
            <p className="text-xs text-gray-500 mt-1">
              Número máximo de alunos que podem participar desta turma
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
              disabled={formData.daysOfWeek.length === 0}
              className="flex-1 px-4 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {classItem ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;