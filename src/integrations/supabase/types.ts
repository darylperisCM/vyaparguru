export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_messages: {
        Row: {
          context: string | null
          created_at: string
          generated_text: string
          id: string
          message: string
          model_used: string | null
          purpose: string | null
          tokens_used: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          generated_text: string
          id?: string
          message: string
          model_used?: string | null
          purpose?: string | null
          tokens_used?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: string | null
          created_at?: string
          generated_text?: string
          id?: string
          message?: string
          model_used?: string | null
          purpose?: string | null
          tokens_used?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversion_events: {
        Row: {
          conversion_action: string
          conversion_value: number
          created_at: string | null
          currency: string
          event_type: string
          fired_at: string | null
          id: string
          payment_id: string | null
          razorpay_event: string | null
          should_fire: boolean | null
          timestamp: string | null
          transaction_id: string | null
          user_email: string | null
          user_id: string
        }
        Insert: {
          conversion_action: string
          conversion_value: number
          created_at?: string | null
          currency?: string
          event_type: string
          fired_at?: string | null
          id?: string
          payment_id?: string | null
          razorpay_event?: string | null
          should_fire?: boolean | null
          timestamp?: string | null
          transaction_id?: string | null
          user_email?: string | null
          user_id: string
        }
        Update: {
          conversion_action?: string
          conversion_value?: number
          created_at?: string | null
          currency?: string
          event_type?: string
          fired_at?: string | null
          id?: string
          payment_id?: string | null
          razorpay_event?: string | null
          should_fire?: boolean | null
          timestamp?: string | null
          transaction_id?: string | null
          user_email?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversion_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      email_drafts: {
        Row: {
          content: string
          created_at: string
          id: string
          subject: string
          template_id: string | null
          tone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          subject: string
          template_id?: string | null
          tone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          subject?: string
          template_id?: string | null
          tone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favorite_translations: {
        Row: {
          confidence: number | null
          created_at: string
          english_text: string
          hindi_text: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          english_text: string
          hindi_text: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          english_text?: string
          hindi_text?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      industry_scenario_progress: {
        Row: {
          created_at: string
          id: string
          industry_id: string
          is_completed: boolean
          scenario_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          industry_id: string
          is_completed?: boolean
          scenario_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          industry_id?: string
          is_completed?: boolean
          scenario_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      industry_vocab_progress: {
        Row: {
          created_at: string
          id: string
          industry_id: string
          is_learned: boolean
          updated_at: string
          user_id: string
          vocab_item: string
        }
        Insert: {
          created_at?: string
          id?: string
          industry_id: string
          is_learned?: boolean
          updated_at?: string
          user_id: string
          vocab_item: string
        }
        Update: {
          created_at?: string
          id?: string
          industry_id?: string
          is_learned?: boolean
          updated_at?: string
          user_id?: string
          vocab_item?: string
        }
        Relationships: []
      }
      phone_auth: {
        Row: {
          created_at: string | null
          otp_expires_at: string | null
          otp_hash: string | null
          phone_number: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          otp_expires_at?: string | null
          otp_hash?: string | null
          phone_number: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          otp_expires_at?: string | null
          otp_hash?: string | null
          phone_number?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number
          created_at: string
          email: string | null
          id: string
          location: string | null
          mobile_number: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age: number
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          mobile_number: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          mobile_number?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      speech_events: {
        Row: {
          audio_duration: number | null
          created_at: string
          id: string
          input_text: string | null
          language: string
          operation_type: Database["public"]["Enums"]["speech_operation"]
          output_text: string | null
          success: boolean
          updated_at: string
          user_id: string
          voice_id: string | null
        }
        Insert: {
          audio_duration?: number | null
          created_at?: string
          id?: string
          input_text?: string | null
          language?: string
          operation_type: Database["public"]["Enums"]["speech_operation"]
          output_text?: string | null
          success?: boolean
          updated_at?: string
          user_id: string
          voice_id?: string | null
        }
        Update: {
          audio_duration?: number | null
          created_at?: string
          id?: string
          input_text?: string | null
          language?: string
          operation_type?: Database["public"]["Enums"]["speech_operation"]
          output_text?: string | null
          success?: boolean
          updated_at?: string
          user_id?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      subscription_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          razorpay_event_id: string | null
          subscription_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          razorpay_event_id?: string | null
          subscription_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          razorpay_event_id?: string | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string | null
          id: string
          next_billing_date: string | null
          plan_name: string | null
          razorpay_payment_id: string | null
          razorpay_plan_id: string | null
          rzp_subscription_id: string | null
          status: string | null
          trial_ends_at: string | null
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string | null
          id?: string
          next_billing_date?: string | null
          plan_name?: string | null
          razorpay_payment_id?: string | null
          razorpay_plan_id?: string | null
          rzp_subscription_id?: string | null
          status?: string | null
          trial_ends_at?: string | null
          user_id?: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string | null
          id?: string
          next_billing_date?: string | null
          plan_name?: string | null
          razorpay_payment_id?: string | null
          razorpay_plan_id?: string | null
          rzp_subscription_id?: string | null
          status?: string | null
          trial_ends_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      translation_events: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          source_language: string
          source_text: string
          target_language: string
          translated_text: string
          translation_source: Database["public"]["Enums"]["translation_source"]
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          source_language: string
          source_text: string
          target_language: string
          translated_text: string
          translation_source: Database["public"]["Enums"]["translation_source"]
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          source_language?: string
          source_text?: string
          target_language?: string
          translated_text?: string
          translation_source?: Database["public"]["Enums"]["translation_source"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          processed: boolean | null
          processed_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      speech_operation: "synthesis" | "transcription"
      translation_source: "google" | "bhashini" | "hybrid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      speech_operation: ["synthesis", "transcription"],
      translation_source: ["google", "bhashini", "hybrid"],
    },
  },
} as const
