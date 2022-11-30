export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
      }
      orders: {
        Row: {
          stripe_customer_id: string
          stripe_pi_id: string
          amount: number
          currency: string
          id: string
          created_at: string
        }
        Insert: {
          stripe_customer_id: string
          stripe_pi_id: string
          amount: number
          currency: string
          id?: string
          created_at?: string
        }
        Update: {
          stripe_customer_id?: string
          stripe_pi_id?: string
          amount?: number
          currency?: string
          id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          avatar_url: string | null
          website: string | null
          first_name: string | null
          last_name: string | null
          full_name: string | null
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          avatar_url?: string | null
          website?: string | null
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          avatar_url?: string | null
          website?: string | null
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          stripe_customer_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
