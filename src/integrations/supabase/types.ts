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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          context_data: Json | null
          conversation_type: string
          created_at: string | null
          id: string
          session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          context_data?: Json | null
          conversation_type: string
          created_at?: string | null
          id?: string
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          context_data?: Json | null
          conversation_type?: string
          created_at?: string | null
          id?: string
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_reports: {
        Row: {
          accessnotes: string | null
          accessNotes: string | null
          ageApprox: string | null
          beddingCementSand: string | null
          beforedefects: string[] | null
          beforeDefects: Json | null
          boxGutters: string | null
          boxGuttersNotes: string | null
          boxguttersphoto: string[] | null
          brokenTiles: number | null
          brokenTilesCaps: string | null
          brokenTilesNotes: string | null
          brokentilesphoto: string[] | null
          claddingType: string
          cleanguttersnotes: string | null
          cleanguttersqty: number | null
          clientName: string
          coatingsystemnotes: string | null
          coatingsystemqty: number | null
          completed_at: string | null
          created_at: string | null
          date: string
          duringafter: string[] | null
          duringAfter: Json | null
          email: string | null
          flashings: string | null
          flexiblerepointingnotes: string | null
          flexiblerepointingqty: number | null
          gableLengthLM: number | null
          gableLengthTiles: number | null
          gutterPerimeter: number | null
          guttersDownpipes: string | null
          guttersDownpipesNotes: string | null
          guttersphoto: string[] | null
          heightStoreys: string | null
          id: string
          inspector: string
          installvalleyclipsnotes: string | null
          installvalleyclipsqty: number | null
          internal_leaks_observed: boolean | null
          internalLeaks: string | null
          leaksphoto: string[] | null
          otherMaterials: string | null
          overallCondition: string | null
          overallConditionNotes: string | null
          paintColour: string | null
          paintSystem: string | null
          penetrations: string | null
          penetrationsNotes: string | null
          penetrationsphoto: string[] | null
          phone: string
          pointing: string | null
          pointingColour: string | null
          pointingNotes: string | null
          pointingphoto: string[] | null
          pressurewashnotes: string | null
          pressurewashqty: number | null
          priority: string | null
          rebedridgenotes: string | null
          rebedridgeqty: number | null
          recommendedWorks: Json | null
          replacebrokentilesnotes: string | null
          replacebrokentilesqty: number | null
          replacevalleyironsnotes: string | null
          replacevalleyironsqty: number | null
          ridgeCaps: number | null
          roofArea: number | null
          roofPitch: string | null
          safetyRailNeeded: boolean | null
          sealpenetrationsnotes: string | null
          sealpenetrationsqty: number | null
          siteAddress: string
          specTileColour: string | null
          specTileProfile: string | null
          status: string | null
          suburbPostcode: string
          tileColour: string | null
          tileProfile: string | null
          time: string
          updated_at: string | null
          valleyIrons: string | null
          valleyIronsNotes: string | null
          valleyironsphoto: string[] | null
          valleyLength: number | null
        }
        Insert: {
          accessnotes?: string | null
          accessNotes?: string | null
          ageApprox?: string | null
          beddingCementSand?: string | null
          beforedefects?: string[] | null
          beforeDefects?: Json | null
          boxGutters?: string | null
          boxGuttersNotes?: string | null
          boxguttersphoto?: string[] | null
          brokenTiles?: number | null
          brokenTilesCaps?: string | null
          brokenTilesNotes?: string | null
          brokentilesphoto?: string[] | null
          claddingType: string
          cleanguttersnotes?: string | null
          cleanguttersqty?: number | null
          clientName: string
          coatingsystemnotes?: string | null
          coatingsystemqty?: number | null
          completed_at?: string | null
          created_at?: string | null
          date: string
          duringafter?: string[] | null
          duringAfter?: Json | null
          email?: string | null
          flashings?: string | null
          flexiblerepointingnotes?: string | null
          flexiblerepointingqty?: number | null
          gableLengthLM?: number | null
          gableLengthTiles?: number | null
          gutterPerimeter?: number | null
          guttersDownpipes?: string | null
          guttersDownpipesNotes?: string | null
          guttersphoto?: string[] | null
          heightStoreys?: string | null
          id?: string
          inspector: string
          installvalleyclipsnotes?: string | null
          installvalleyclipsqty?: number | null
          internal_leaks_observed?: boolean | null
          internalLeaks?: string | null
          leaksphoto?: string[] | null
          otherMaterials?: string | null
          overallCondition?: string | null
          overallConditionNotes?: string | null
          paintColour?: string | null
          paintSystem?: string | null
          penetrations?: string | null
          penetrationsNotes?: string | null
          penetrationsphoto?: string[] | null
          phone: string
          pointing?: string | null
          pointingColour?: string | null
          pointingNotes?: string | null
          pointingphoto?: string[] | null
          pressurewashnotes?: string | null
          pressurewashqty?: number | null
          priority?: string | null
          rebedridgenotes?: string | null
          rebedridgeqty?: number | null
          recommendedWorks?: Json | null
          replacebrokentilesnotes?: string | null
          replacebrokentilesqty?: number | null
          replacevalleyironsnotes?: string | null
          replacevalleyironsqty?: number | null
          ridgeCaps?: number | null
          roofArea?: number | null
          roofPitch?: string | null
          safetyRailNeeded?: boolean | null
          sealpenetrationsnotes?: string | null
          sealpenetrationsqty?: number | null
          siteAddress: string
          specTileColour?: string | null
          specTileProfile?: string | null
          status?: string | null
          suburbPostcode: string
          tileColour?: string | null
          tileProfile?: string | null
          time: string
          updated_at?: string | null
          valleyIrons?: string | null
          valleyIronsNotes?: string | null
          valleyironsphoto?: string[] | null
          valleyLength?: number | null
        }
        Update: {
          accessnotes?: string | null
          accessNotes?: string | null
          ageApprox?: string | null
          beddingCementSand?: string | null
          beforedefects?: string[] | null
          beforeDefects?: Json | null
          boxGutters?: string | null
          boxGuttersNotes?: string | null
          boxguttersphoto?: string[] | null
          brokenTiles?: number | null
          brokenTilesCaps?: string | null
          brokenTilesNotes?: string | null
          brokentilesphoto?: string[] | null
          claddingType?: string
          cleanguttersnotes?: string | null
          cleanguttersqty?: number | null
          clientName?: string
          coatingsystemnotes?: string | null
          coatingsystemqty?: number | null
          completed_at?: string | null
          created_at?: string | null
          date?: string
          duringafter?: string[] | null
          duringAfter?: Json | null
          email?: string | null
          flashings?: string | null
          flexiblerepointingnotes?: string | null
          flexiblerepointingqty?: number | null
          gableLengthLM?: number | null
          gableLengthTiles?: number | null
          gutterPerimeter?: number | null
          guttersDownpipes?: string | null
          guttersDownpipesNotes?: string | null
          guttersphoto?: string[] | null
          heightStoreys?: string | null
          id?: string
          inspector?: string
          installvalleyclipsnotes?: string | null
          installvalleyclipsqty?: number | null
          internal_leaks_observed?: boolean | null
          internalLeaks?: string | null
          leaksphoto?: string[] | null
          otherMaterials?: string | null
          overallCondition?: string | null
          overallConditionNotes?: string | null
          paintColour?: string | null
          paintSystem?: string | null
          penetrations?: string | null
          penetrationsNotes?: string | null
          penetrationsphoto?: string[] | null
          phone?: string
          pointing?: string | null
          pointingColour?: string | null
          pointingNotes?: string | null
          pointingphoto?: string[] | null
          pressurewashnotes?: string | null
          pressurewashqty?: number | null
          priority?: string | null
          rebedridgenotes?: string | null
          rebedridgeqty?: number | null
          recommendedWorks?: Json | null
          replacebrokentilesnotes?: string | null
          replacebrokentilesqty?: number | null
          replacevalleyironsnotes?: string | null
          replacevalleyironsqty?: number | null
          ridgeCaps?: number | null
          roofArea?: number | null
          roofPitch?: string | null
          safetyRailNeeded?: boolean | null
          sealpenetrationsnotes?: string | null
          sealpenetrationsqty?: number | null
          siteAddress?: string
          specTileColour?: string | null
          specTileProfile?: string | null
          status?: string | null
          suburbPostcode?: string
          tileColour?: string | null
          tileProfile?: string | null
          time?: string
          updated_at?: string | null
          valleyIrons?: string | null
          valleyIronsNotes?: string | null
          valleyironsphoto?: string[] | null
          valleyLength?: number | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string | null
          name: string
          phone: string
          service: string
          source: string | null
          status: string | null
          suburb: string
          updated_at: string
          urgency: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name: string
          phone: string
          service: string
          source?: string | null
          status?: string | null
          suburb: string
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string
          service?: string
          source?: string | null
          status?: string | null
          suburb?: string
          updated_at?: string
          urgency?: string | null
        }
        Relationships: []
      }
      material_specs: {
        Row: {
          brand: string
          created_at: string | null
          id: string
          is_active: boolean | null
          material_name: string
          product_code: string | null
          specifications: Json | null
          supplier: string | null
          unit_cost: number
          updated_at: string | null
          warranty_years: number | null
        }
        Insert: {
          brand: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          material_name: string
          product_code?: string | null
          specifications?: Json | null
          supplier?: string | null
          unit_cost: number
          updated_at?: string | null
          warranty_years?: number | null
        }
        Update: {
          brand?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          material_name?: string
          product_code?: string | null
          specifications?: Json | null
          supplier?: string | null
          unit_cost?: number
          updated_at?: string | null
          warranty_years?: number | null
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          bucket_name: string
          caption: string | null
          created_at: string
          file_path: string
          file_size: number | null
          filename: string
          id: string
          is_active: boolean
          mime_type: string | null
          original_filename: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          bucket_name?: string
          caption?: string | null
          created_at?: string
          file_path: string
          file_size?: number | null
          filename: string
          id?: string
          is_active?: boolean
          mime_type?: string | null
          original_filename: string
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          bucket_name?: string
          caption?: string | null
          created_at?: string
          file_path?: string
          file_size?: number | null
          filename?: string
          id?: string
          is_active?: boolean
          mime_type?: string | null
          original_filename?: string
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_published: boolean
          meta_description: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pricing_rules: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          labour_hours_per_unit: number | null
          markup_percentage: number | null
          material_specs: Json | null
          rate_max: number
          rate_min: number
          service_item: string
          unit: string
          updated_at: string | null
          warranty_tier: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          labour_hours_per_unit?: number | null
          markup_percentage?: number | null
          material_specs?: Json | null
          rate_max: number
          rate_min: number
          service_item: string
          unit: string
          updated_at?: string | null
          warranty_tier?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          labour_hours_per_unit?: number | null
          markup_percentage?: number | null
          material_specs?: Json | null
          rate_max?: number
          rate_min?: number
          service_item?: string
          unit?: string
          updated_at?: string | null
          warranty_tier?: string | null
        }
        Relationships: []
      }
      quote_line_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          line_total: number
          material_spec_id: string | null
          quantity: number
          quote_id: string
          service_item: string
          sort_order: number | null
          unit: string
          unit_rate: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          line_total: number
          material_spec_id?: string | null
          quantity: number
          quote_id: string
          service_item: string
          sort_order?: number | null
          unit: string
          unit_rate: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          line_total?: number
          material_spec_id?: string | null
          quantity?: number
          quote_id?: string
          service_item?: string
          sort_order?: number | null
          unit?: string
          unit_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_line_items_material_spec_id_fkey"
            columns: ["material_spec_id"]
            isOneToOne: false
            referencedRelation: "material_specs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_line_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_name: string
          created_at: string | null
          created_by: string | null
          email: string | null
          gst: number
          id: string
          inspection_report_id: string | null
          notes: string | null
          phone: string
          quote_number: string
          site_address: string
          status: string | null
          subtotal: number
          suburb_postcode: string
          tier_level: string
          total: number
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          client_name: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          gst: number
          id?: string
          inspection_report_id?: string | null
          notes?: string | null
          phone: string
          quote_number: string
          site_address: string
          status?: string | null
          subtotal: number
          suburb_postcode: string
          tier_level: string
          total: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          client_name?: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          gst?: number
          id?: string
          inspection_report_id?: string | null
          notes?: string | null
          phone?: string
          quote_number?: string
          site_address?: string
          status?: string | null
          subtotal?: number
          suburb_postcode?: string
          tier_level?: string
          total?: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_inspection_report_id_fkey"
            columns: ["inspection_report_id"]
            isOneToOne: false
            referencedRelation: "inspection_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          created_at: string
          id: string
          identifier: string
          request_count: number
          window_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          identifier: string
          request_count?: number
          window_start?: string
        }
        Update: {
          created_at?: string
          id?: string
          identifier?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      security_logs: {
        Row: {
          created_at: string
          event_details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          content: string
          created_at: string
          error_message: string | null
          id: string
          media_ids: string[] | null
          platform: string
          post_id: string | null
          published_at: string | null
          scheduled_for: string | null
          status: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          error_message?: string | null
          id?: string
          media_ids?: string[] | null
          platform: string
          post_id?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          error_message?: string | null
          id?: string
          media_ids?: string[] | null
          platform?: string
          post_id?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_admin_for_authenticated_user: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      generate_quote_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_id?: string }
        Returns: boolean
      }
      is_inspector: {
        Args: { _user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "inspector" | "viewer"
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
      app_role: ["admin", "inspector", "viewer"],
    },
  },
} as const
