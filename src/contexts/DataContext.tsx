import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Class {
  id: string;
  name: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  capacity?: number;
  createdAt: string;
}

export interface Student {
  id: string;
  fullName: string;
  phone: string;
  rg: string;
  birthDate: string;
  startDate: string;
  status: 'active' | 'inactive';
  monthlyFee: number;
  notes: string;
  address: string;
  responsibleName: string;
  responsiblePhone: string;
  classIds: string[];
  createdAt: string;
}

export interface Payment {
  id: string;
  studentId: string;
  monthYear: string;
  amount: number;
  status: 'paid' | 'pending';
  paymentDate?: string;
  paymentMethod?: string;
  createdAt: string;
}

export interface AppSettings {
  courtName: string;
  contactPhone: string;
  address: string;
  operatingHours: string;
  defaultMonthlyFee: number;
}

interface DataContextType {
  students: Student[];
  payments: Payment[];
  classes: Class[];
  appSettings: AppSettings;
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  addClass: (classData: Omit<Class, 'id' | 'createdAt'>) => void;
  updateClass: (id: string, classData: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  getStudentPayments: (studentId: string) => Payment[];
  getStudentClasses: (studentId: string) => Class[];
  generateMissingPayments: () => void;
  generateMissingPaymentsForStudents: (studentIds: string[]) => void;
  updateAppSettings: (settings: AppSettings) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    courtName: 'TM Marinho Sports',
    contactPhone: '',
    address: '',
    operatingHours: '',
    defaultMonthlyFee: 150
  });

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      setLoading(false);
      return;
    }

    loadData();
  }, [isAuthenticated, authLoading]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar turmas
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: true });

      if (classesError) throw classesError;

      const formattedClasses: Class[] = (classesData || []).map(cls => ({
        id: cls.id,
        name: cls.name,
        daysOfWeek: cls.days_of_week,
        startTime: cls.start_time,
        endTime: cls.end_time,
        capacity: cls.capacity || 12,
        createdAt: cls.created_at
      }));
      setClasses(formattedClasses);

      // Carregar alunos com suas turmas
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          *,
          student_classes (
            class_id
          )
        `)
        .order('created_at', { ascending: true });

      if (studentsError) throw studentsError;

      const formattedStudents: Student[] = (studentsData || []).map(student => ({
        id: student.id,
        fullName: student.full_name,
        phone: student.phone,
        rg: student.rg,
        birthDate: student.birth_date,
        startDate: student.start_date,
        status: student.status,
        monthlyFee: parseFloat(student.monthly_fee),
        notes: student.notes || '',
        address: student.address || '',
        responsibleName: student.responsible_name || '',
        responsiblePhone: student.responsible_phone || '',
        classIds: (student.student_classes || []).map((sc: any) => sc.class_id),
        createdAt: student.created_at
      }));
      setStudents(formattedStudents);

      // Carregar pagamentos
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      const formattedPayments: Payment[] = (paymentsData || []).map(payment => ({
        id: payment.id,
        studentId: payment.student_id,
        monthYear: payment.month_year,
        amount: parseFloat(payment.amount),
        status: payment.status,
        paymentDate: payment.payment_date,
        paymentMethod: payment.payment_method,
        createdAt: payment.created_at
      }));
      setPayments(formattedPayments);

      // Carregar configurações
      // Carregar configurações do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: settingsData, error: settingsError } = await supabase
          .from('app_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
          // Se não for erro de "não encontrado", lançar o erro
          if (settingsError.code !== 'PGRST116') {
            throw settingsError;
          }
        }

        if (settingsData) {
          setAppSettings({
            courtName: settingsData.court_name,
            contactPhone: settingsData.contact_phone || '',
            address: settingsData.address || '',
            operatingHours: settingsData.operating_hours || '',
            defaultMonthlyFee: parseFloat(settingsData.default_monthly_fee)
          });
        } else {
          // Se não existem configurações para este usuário, criar configurações padrão
          const defaultSettings = {
            courtName: 'TM Marinho Sports',
            contactPhone: '',
            address: '',
            operatingHours: '',
            defaultMonthlyFee: 150
          };
          
          try {
            await updateAppSettings(defaultSettings);
          } catch (error) {
            console.error('Error creating default settings:', error);
            // Mesmo se falhar ao criar, usar as configurações padrão localmente
            setAppSettings(defaultSettings);
          }
        }
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (student: Omit<Student, 'id' | 'createdAt'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('students')
        .insert({
          full_name: student.fullName,
          phone: student.phone,
          rg: student.rg,
          birth_date: student.birthDate,
          start_date: student.startDate,
          status: student.status,
          monthly_fee: student.monthlyFee,
          notes: student.notes,
          address: student.address,
          responsible_name: student.responsibleName,
          responsible_phone: student.responsiblePhone,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newStudent: Student = {
        id: data.id,
        fullName: data.full_name,
        phone: data.phone,
        rg: data.rg,
        birthDate: data.birth_date,
        startDate: data.start_date,
        status: data.status,
        monthlyFee: parseFloat(data.monthly_fee),
        notes: data.notes || '',
        address: data.address || '',
        responsibleName: data.responsible_name || '',
        responsiblePhone: data.responsible_phone || '',
        classIds: student.classIds,
        createdAt: data.created_at
      };

      // Adicionar relacionamentos com turmas
      if (student.classIds.length > 0) {
        const classRelations = student.classIds.map(classId => ({
          student_id: data.id,
          class_id: classId,
          user_id: user.id
        }));

        await supabase
          .from('student_classes')
          .insert(classRelations);
      }

      setStudents(prev => [...prev, newStudent]);
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  };

  const updateStudent = async (id: string, updatedStudent: Partial<Student>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('students')
        .update({
          full_name: updatedStudent.fullName,
          phone: updatedStudent.phone,
          rg: updatedStudent.rg,
          birth_date: updatedStudent.birthDate,
          start_date: updatedStudent.startDate,
          status: updatedStudent.status,
          monthly_fee: updatedStudent.monthlyFee,
          notes: updatedStudent.notes,
          address: updatedStudent.address,
          responsible_name: updatedStudent.responsibleName,
          responsible_phone: updatedStudent.responsiblePhone,
          user_id: user.id
        })
        .eq('id', id);

      if (error) throw error;

      // Atualizar relacionamentos com turmas se fornecido
      if (updatedStudent.classIds !== undefined) {
        // Remover relacionamentos existentes
        await supabase
          .from('student_classes')
          .delete()
          .eq('student_id', id);

        // Adicionar novos relacionamentos
        if (updatedStudent.classIds.length > 0) {
          const classRelations = updatedStudent.classIds.map(classId => ({
            student_id: id,
            class_id: classId,
            user_id: user.id
          }));

          await supabase
            .from('student_classes')
            .insert(classRelations);
        }
      }

      setStudents(prev => prev.map(student => 
        student.id === id ? { ...student, ...updatedStudent } : student
      ));
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(student => student.id !== id));
      setPayments(prev => prev.filter(payment => payment.studentId !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  };

  const addPayment = async (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('payments')
        .insert({
          student_id: payment.studentId,
          month_year: payment.monthYear,
          amount: payment.amount,
          status: payment.status,
          payment_date: payment.paymentDate,
          payment_method: payment.paymentMethod,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newPayment: Payment = {
        id: data.id,
        studentId: data.student_id,
        monthYear: data.month_year,
        amount: parseFloat(data.amount),
        status: data.status,
        paymentDate: data.payment_date,
        paymentMethod: data.payment_method,
        createdAt: data.created_at
      };

      setPayments(prev => [...prev, newPayment]);
    } catch (error) {
      console.error('Error adding payment:', error);
      throw error;
    }
  };

  const updatePayment = async (id: string, updatedPayment: Partial<Payment>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('payments')
        .update({
          student_id: updatedPayment.studentId,
          month_year: updatedPayment.monthYear,
          amount: updatedPayment.amount,
          status: updatedPayment.status,
          payment_date: updatedPayment.paymentDate,
          payment_method: updatedPayment.paymentMethod,
          user_id: user.id
        })
        .eq('id', id);

      if (error) throw error;

      setPayments(prev => prev.map(payment => 
        payment.id === id ? { ...payment, ...updatedPayment } : payment
      ));
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPayments(prev => prev.filter(payment => payment.id !== id));
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  };

  const addClass = async (classData: Omit<Class, 'id' | 'createdAt'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('classes')
        .insert({
          name: classData.name,
          days_of_week: classData.daysOfWeek,
          start_time: classData.startTime,
          end_time: classData.endTime,
          capacity: classData.capacity,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newClass: Class = {
        id: data.id,
        name: data.name,
        daysOfWeek: data.days_of_week,
        startTime: data.start_time,
        endTime: data.end_time,
        capacity: data.capacity || 12,
        createdAt: data.created_at
      };

      setClasses(prev => [...prev, newClass]);
    } catch (error) {
      console.error('Error adding class:', error);
      throw error;
    }
  };

  const updateClass = async (id: string, updatedClass: Partial<Class>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('classes')
        .update({
          name: updatedClass.name,
          days_of_week: updatedClass.daysOfWeek,
          start_time: updatedClass.startTime,
          end_time: updatedClass.endTime,
          capacity: updatedClass.capacity,
          user_id: user.id
        })
        .eq('id', id);

      if (error) throw error;

      setClasses(prev => prev.map(classItem => 
        classItem.id === id ? { ...classItem, ...updatedClass } : classItem
      ));
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  };

  const deleteClass = async (id: string) => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClasses(prev => prev.filter(classItem => classItem.id !== id));
      // Os relacionamentos student_classes são removidos automaticamente por CASCADE
      // Atualizar o estado local dos alunos
      setStudents(prev => prev.map(student => ({
        ...student,
        classIds: student.classIds.filter(classId => classId !== id)
      })));
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  };

  const updateAppSettings = async (settings: AppSettings) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('app_settings')
        .upsert({
          user_id: user.id,
          court_name: settings.courtName,
          contact_phone: settings.contactPhone,
          address: settings.address,
          operating_hours: settings.operatingHours,
          default_monthly_fee: settings.defaultMonthlyFee,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating settings:', error);
        throw new Error('Erro ao atualizar configurações');
      }

      setAppSettings(settings);
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const generateMissingPaymentsForStudents = async (studentIds: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

    const selectedStudents = students.filter(student => 
      studentIds.includes(student.id) && student.status === 'active'
    );
    
    const newPayments: Omit<Payment, 'id' | 'createdAt'>[] = [];
    const currentDate = new Date();

    for (const student of selectedStudents) {
      const [startYear, startMonth] = student.startDate.split('-').map(Number);
      let currentYear = startYear;
      let currentMonth = startMonth;
      
      const nowYear = currentDate.getFullYear();
      const nowMonth = currentDate.getMonth() + 1;
      
      while (currentYear < nowYear || (currentYear === nowYear && currentMonth <= nowMonth)) {
        const monthYear = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
        
        const existingPayment = payments.find(
          payment => payment.studentId === student.id && payment.monthYear === monthYear
        );

        if (!existingPayment) {
          newPayments.push({
            studentId: student.id,
            monthYear,
            amount: student.monthlyFee || 150,
            status: 'pending'
          });
        }
        
        currentMonth++;
        if (currentMonth > 12) {
          currentMonth = 1;
          currentYear++;
        }
      }
    }

    // Inserir todos os pagamentos de uma vez
    if (newPayments.length > 0) {
        const { data, error } = await supabase
          .from('payments')
          .insert(
            newPayments.map(payment => ({
              student_id: payment.studentId,
              month_year: payment.monthYear,
              amount: payment.amount,
              status: payment.status,
              user_id: user.id
            }))
          )
          .select();

        if (error) throw error;

        const formattedNewPayments: Payment[] = (data || []).map(payment => ({
          id: payment.id,
          studentId: payment.student_id,
          monthYear: payment.month_year,
          amount: parseFloat(payment.amount),
          status: payment.status,
          paymentDate: payment.payment_date,
          paymentMethod: payment.payment_method,
          createdAt: payment.created_at
        }));

        setPayments(prev => [...prev, ...formattedNewPayments]);
    }
    } catch (error) {
      console.error('Error generating payments:', error);
      throw error;
    }
  };

  const generateMissingPayments = () => {
    const activeStudents = students.filter(student => student.status === 'active');
    return generateMissingPaymentsForStudents(activeStudents.map(s => s.id));
  };

  const getStudentPayments = (studentId: string) => {
    return payments.filter(payment => payment.studentId === studentId);
  };

  const getStudentClasses = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return [];
    return classes.filter(classItem => student.classIds.includes(classItem.id));
  };

  // Mostrar loading enquanto carrega dados
  if (loading && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{
      students,
      payments,
      classes,
      appSettings,
      addStudent,
      updateStudent,
      deleteStudent,
      addPayment,
      updatePayment,
      deletePayment,
      addClass,
      updateClass,
      deleteClass,
      getStudentPayments,
      getStudentClasses,
      generateMissingPayments,
      generateMissingPaymentsForStudents,
      updateAppSettings
    }}>
      {children}
    </DataContext.Provider>
  );
};