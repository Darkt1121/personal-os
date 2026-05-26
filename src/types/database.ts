export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          timezone: string
          currency_code: string
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          timezone?: string
          currency_code?: string
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          timezone?: string
          currency_code?: string
          created_at?: string
        }
      }
      income_entries: {
        Row: {
          id: string
          user_id: string
          source: string
          channel_name: string | null
          amount_original: number
          currency_original: string | null
          amount_clp: number | null
          payment_date: string
          status: string
          method: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source: string
          channel_name?: string | null
          amount_original: number
          currency_original?: string | null
          amount_clp?: number | null
          payment_date: string
          status?: string
          method?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source?: string
          channel_name?: string | null
          amount_original?: number
          currency_original?: string | null
          amount_clp?: number | null
          payment_date?: string
          status?: string
          method?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      expense_entries: {
        Row: {
          id: string
          user_id: string
          category: string | null
          amount: number
          currency_code: string | null
          expense_date: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category?: string | null
          amount: number
          currency_code?: string | null
          expense_date: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string | null
          amount?: number
          currency_code?: string | null
          expense_date?: string
          description?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          module: string | null
          priority: string
          status: string
          due_date: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          module?: string | null
          priority?: string
          status?: string
          due_date?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          module?: string | null
          priority?: string
          status?: string
          due_date?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      study_items: {
        Row: {
          id: string
          user_id: string
          title: string
          course: string | null
          type: string | null
          status: string
          due_date: string | null
          next_step: string | null
          resource_link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          course?: string | null
          type?: string | null
          status?: string
          due_date?: string | null
          next_step?: string | null
          resource_link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          course?: string | null
          type?: string | null
          status?: string
          due_date?: string | null
          next_step?: string | null
          resource_link?: string | null
          created_at?: string
        }
      }
      activity_items: {
        Row: {
          id: string
          user_id: string
          module: string | null
          title: string | null
          subtitle: string | null
          status_text: string | null
          context_text: string | null
          primary_action_label: string | null
          secondary_action_label: string | null
          link_target: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          module?: string | null
          title?: string | null
          subtitle?: string | null
          status_text?: string | null
          context_text?: string | null
          primary_action_label?: string | null
          secondary_action_label?: string | null
          link_target?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          module?: string | null
          title?: string | null
          subtitle?: string | null
          status_text?: string | null
          context_text?: string | null
          primary_action_label?: string | null
          secondary_action_label?: string | null
          link_target?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
