import React, { useState } from 'react';
import { Plus, Edit, Trash2, Clock, Users, Calendar } from 'lucide-react';
import { useData, Class } from '../contexts/DataContext';
import ClassForm from './ClassForm';
import ConfirmDialog from './ConfirmDialog';

const ClassesManagementTab: React.FC = () => {
  const { classes, deleteClass, students } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteClass(id);
    setDeleteConfirm(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClass(null);
  };

  const getStudentCount = (classId: string) => {
    return students.filter(student => 
      student.status === 'active' && student.classIds.includes(classId)
    ).length;
  };

  const formatDaysOfWeek = (days: string[]) => {
    return days.join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gerenciamento de Turmas</h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure os horários e turmas disponíveis para os alunos
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-700 text-white px-4 py-2 rounded-lg hover:bg-orange-800 transition-colors flex items-center space-x-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Turma</span>
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhuma turma cadastrada</h4>
          <p className="text-gray-600 mb-4">
            Comece criando sua primeira turma para organizar os horários dos alunos.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-700 text-white px-6 py-3 rounded-lg hover:bg-orange-800 transition-colors font-medium"
          >
            Criar Primeira Turma
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classItem) => {
            const studentCount = getStudentCount(classItem.id);
            const isNearCapacity = classItem.capacity && studentCount >= classItem.capacity * 0.8;
            const isFull = classItem.capacity && studentCount >= classItem.capacity;

            return (
              <div
                key={classItem.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{classItem.name}</h4>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDaysOfWeek(classItem.daysOfWeek)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{classItem.startTime} - {classItem.endTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-1 text-gray-500" />
                    <span className={`font-medium ${
                      isFull ? 'text-red-600' : 
                      isNearCapacity ? 'text-orange-600' : 
                      'text-gray-700'
                    }`}>
                      {studentCount}
                      {classItem.capacity && ` / ${classItem.capacity}`}
                    </span>
                    {classItem.capacity && (
                      <span className="text-gray-500 ml-1">alunos</span>
                    )}
                  </div>
                  
                  {isFull && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                      Lotada
                    </span>
                  )}
                  {isNearCapacity && !isFull && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                      Quase Cheia
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(classItem)}
                    className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(classItem.id)}
                    className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ClassForm
          classItem={editingClass}
          onClose={handleCloseForm}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="Excluir Turma"
          message="Tem certeza que deseja excluir esta turma? Os alunos associados a ela serão desvinculados automaticamente. Esta ação não pode ser desfeita."
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default ClassesManagementTab;