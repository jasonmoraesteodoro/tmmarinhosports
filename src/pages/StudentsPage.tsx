import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, MessageCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useData, Student } from '../contexts/DataContext';
import StudentForm from '../components/StudentForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatPhone, generateWhatsAppLink, cleanRg } from '../utils/formatters';

interface StudentsPageProps {
  onSelectStudent: (id: string) => void;
}

const StudentsPage: React.FC<StudentsPageProps> = ({ onSelectStudent }) => {
  const { students, deleteStudent, classes } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'fullName' | 'phone' | 'rg' | 'class' | 'startDate' | 'status'>('fullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredStudents = students.filter(student => {
    // Busca mais robusta
    let matchesSearch = true;
    if (searchTerm && searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase().trim();
      const searchTermNumbers = cleanRg(searchTerm);
      
      matchesSearch = false;
      
      // Busca por nome
      if (student.fullName && student.fullName.toLowerCase().includes(searchTermLower)) {
        matchesSearch = true;
      }
      
      // Busca por telefone
      if (!matchesSearch && student.phone && student.phone.includes(searchTerm.trim())) {
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
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesClass = classFilter === 'all' || 
                        (student.classIds && student.classIds.includes(classFilter));
    return matchesSearch && matchesStatus && matchesClass;
  }).sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;
    
    switch (sortField) {
      case 'fullName':
        aValue = a.fullName.toLowerCase();
        bValue = b.fullName.toLowerCase();
        break;
      case 'phone':
        aValue = a.phone;
        bValue = b.phone;
        break;
      case 'rg':
        aValue = cleanRg(a.rg);
        bValue = cleanRg(b.rg);
        break;
      case 'class':
        // Ordenar pela primeira turma do aluno, ou string vazia se não tiver turma
        const aFirstClass = a.classIds && a.classIds.length > 0 
          ? classes.find(c => c.id === a.classIds[0])?.name || ''
          : '';
        const bFirstClass = b.classIds && b.classIds.length > 0 
          ? classes.find(c => c.id === b.classIds[0])?.name || ''
          : '';
        aValue = aFirstClass.toLowerCase();
        bValue = bFirstClass.toLowerCase();
        break;
      case 'startDate':
        aValue = new Date(a.startDate);
        bValue = new Date(b.startDate);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = a.fullName.toLowerCase();
        bValue = b.fullName.toLowerCase();
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: 'fullName' | 'phone' | 'rg' | 'class' | 'startDate' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: 'fullName' | 'phone' | 'rg' | 'class' | 'startDate' | 'status') => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-orange-600" />
      : <ArrowDown className="w-4 h-4 text-orange-600" />;
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteStudent(id);
    setDeleteConfirm(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleWhatsApp = (student: Student) => {
    const message = `Olá ${student.fullName.split(' ')[0]}! Aqui é da TM Marinho Sports. Como você está?`;
    const whatsappLink = generateWhatsAppLink(student.phone, message);
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
          <p className="text-gray-600">Gerencie os alunos da academia</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-700 text-white px-6 py-3 rounded-lg hover:bg-orange-800 transition-colors flex items-center space-x-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Aluno</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou RG..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white min-w-[200px]"
            >
              <option value="all">Todas as Turmas</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort('fullName')}
                    className="flex items-center space-x-1 hover:text-orange-600 transition-colors"
                  >
                    <span>Nome</span>
                    {getSortIcon('fullName')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort('phone')}
                    className="flex items-center space-x-1 hover:text-orange-600 transition-colors"
                  >
                    <span>Telefone</span>
                    {getSortIcon('phone')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort('rg')}
                    className="flex items-center space-x-1 hover:text-orange-600 transition-colors"
                  >
                    <span>RG</span>
                    {getSortIcon('rg')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort('class')}
                    className="flex items-center space-x-1 hover:text-orange-600 transition-colors"
                  >
                    <span>Turmas</span>
                    {getSortIcon('class')}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mensalidade</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort('startDate')}
                    className="flex items-center space-x-1 hover:text-orange-600 transition-colors"
                  >
                    <span>Início</span>
                    {getSortIcon('startDate')}
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
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{student.fullName}</p>
                      <p className="text-sm text-gray-600">
                        {(() => {
                          const today = new Date();
                          const birthDate = new Date(student.birthDate + 'T12:00:00');
                          let age = today.getFullYear() - birthDate.getFullYear();
                          const monthDiff = today.getMonth() - birthDate.getMonth();
                          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                          }
                          return age;
                        })()} anos
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{formatPhone(student.phone)}</td>
                  <td className="py-3 px-4 text-gray-700">{cleanRg(student.rg)}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {student.classIds && student.classIds.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {student.classIds.map((classId) => {
                          const classItem = classes.find(c => c.id === classId);
                          return classItem ? (
                            <span
                              key={classId}
                              className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full whitespace-nowrap"
                            >
                              {classItem.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Sem turma</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-700 font-semibold">
                    R$ {student.monthlyFee.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(student.startDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {student.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleWhatsApp(student)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Enviar WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSelectStudent(student.id)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(student.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum aluno encontrado</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <StudentForm
          student={editingStudent}
          onClose={handleCloseForm}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="Excluir Aluno"
          message="Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita e todos os dados de mensalidades serão perdidos."
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default StudentsPage;