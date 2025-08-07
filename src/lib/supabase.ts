import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export interface Database {
  public: {
    Tables: {
      classes: {
        Row: {
          id: string;
          name: string;
          days_of_week: string[];
          start_time: string;
          end_time: string;
          capacity: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          days_of_week: string[];
          start_time: string;
          end_time: string;
          capacity?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          days_of_week?: string[];
          start_time?: string;
          end_time?: string;
          capacity?: number | null;
          created_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          rg: string;
          birth_date: string;
          start_date: string;
          status: 'active' | 'inactive';
          monthly_fee: number;
          notes: string;
          address: string;
          responsible_name: string;
          responsible_phone: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          rg: string;
          birth_date: string;
          start_date: string;
          status?: 'active' | 'inactive';
          monthly_fee?: number;
          notes?: string;
          address?: string;
          responsible_name?: string;
          responsible_phone?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          rg?: string;
          birth_date?: string;
          start_date?: string;
          status?: 'active' | 'inactive';
          monthly_fee?: number;
          notes?: string;
          address?: string;
          responsible_name?: string;
          responsible_phone?: string;
          created_at?: string;
        };
      };
      student_classes: {
        Row: {
          id: string;
          student_id: string;
          class_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          class_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          class_id?: string;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          student_id: string;
          month_year: string;
          amount: number;
          status: 'paid' | 'pending';
          payment_date: string | null;
          payment_method: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          month_year: string;
          amount: number;
          status?: 'paid' | 'pending';
          payment_date?: string | null;
          payment_method?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          month_year?: string;
          amount?: number;
          status?: 'paid' | 'pending';
          payment_date?: string | null;
          payment_method?: string | null;
          created_at?: string;
        };
      };
      app_settings: {
        Row: {
          id: string;
          court_name: string;
          contact_phone: string;
          address: string;
          operating_hours: string;
          default_monthly_fee: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          court_name?: string;
          contact_phone?: string;
          address?: string;
          operating_hours?: string;
          default_monthly_fee?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          court_name?: string;
          contact_phone?: string;
          address?: string;
          operating_hours?: string;
          default_monthly_fee?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}