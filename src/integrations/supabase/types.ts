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
      ai_action_log: {
        Row: {
          action_details: Json | null
          action_type: string
          approved_at: string | null
          cost_usd: number | null
          error_message: string | null
          executed_at: string | null
          execution_plan: Json | null
          execution_time_ms: number | null
          id: string
          intent: string | null
          results: Json | null
          success: boolean | null
          tools_used: string[] | null
          user_id: string | null
          user_message: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          approved_at?: string | null
          cost_usd?: number | null
          error_message?: string | null
          executed_at?: string | null
          execution_plan?: Json | null
          execution_time_ms?: number | null
          id?: string
          intent?: string | null
          results?: Json | null
          success?: boolean | null
          tools_used?: string[] | null
          user_id?: string | null
          user_message?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          approved_at?: string | null
          cost_usd?: number | null
          error_message?: string | null
          executed_at?: string | null
          execution_plan?: Json | null
          execution_time_ms?: number | null
          id?: string
          intent?: string | null
          results?: Json | null
          success?: boolean | null
          tools_used?: string[] | null
          user_id?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      ai_analysis_cache: {
        Row: {
          analysis_type: string
          branch: string | null
          cache_key: string | null
          created_at: string
          id: string
          path: string | null
          repo_name: string
          repo_owner: string
          result: Json
          updated_at: string
        }
        Insert: {
          analysis_type: string
          branch?: string | null
          cache_key?: string | null
          created_at?: string
          id?: string
          path?: string | null
          repo_name: string
          repo_owner: string
          result: Json
          updated_at?: string
        }
        Update: {
          analysis_type?: string
          branch?: string | null
          cache_key?: string | null
          created_at?: string
          id?: string
          path?: string | null
          repo_name?: string
          repo_owner?: string
          result?: Json
          updated_at?: string
        }
        Relationships: []
      }
      ai_optimization_history: {
        Row: {
          after_metrics: Json | null
          agent_name: string
          applied_at: string | null
          before_metrics: Json | null
          id: string
          optimization_type: string
          performance_delta: number | null
          prompt_changes: Json | null
          version: string
        }
        Insert: {
          after_metrics?: Json | null
          agent_name: string
          applied_at?: string | null
          before_metrics?: Json | null
          id?: string
          optimization_type: string
          performance_delta?: number | null
          prompt_changes?: Json | null
          version: string
        }
        Update: {
          after_metrics?: Json | null
          agent_name?: string
          applied_at?: string | null
          before_metrics?: Json | null
          id?: string
          optimization_type?: string
          performance_delta?: number | null
          prompt_changes?: Json | null
          version?: string
        }
        Relationships: []
      }
      chat_analytics: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_analytics_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_commands: {
        Row: {
          command: string
          created_at: string | null
          description: string
          handler_type: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          command: string
          created_at?: string | null
          description: string
          handler_type: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          command?: string
          created_at?: string | null
          description?: string
          handler_type?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          analysis_results: Json | null
          context_data: Json | null
          conversation_type: string
          created_at: string | null
          id: string
          lead_captured: boolean | null
          lead_id: string | null
          session_id: string | null
          updated_at: string | null
          uploaded_files: Json | null
          user_id: string | null
        }
        Insert: {
          analysis_results?: Json | null
          context_data?: Json | null
          conversation_type: string
          created_at?: string | null
          id?: string
          lead_captured?: boolean | null
          lead_id?: string | null
          session_id?: string | null
          updated_at?: string | null
          uploaded_files?: Json | null
          user_id?: string | null
        }
        Update: {
          analysis_results?: Json | null
          context_data?: Json | null
          conversation_type?: string
          created_at?: string | null
          id?: string
          lead_captured?: boolean | null
          lead_id?: string | null
          session_id?: string | null
          updated_at?: string | null
          uploaded_files?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
      content_blog_posts: {
        Row: {
          author: string | null
          category: string
          content: string
          created_at: string | null
          excerpt: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          last_synced_at: string | null
          meta_description: string | null
          notion_id: string | null
          publish_date: string | null
          read_time: number | null
          related_posts: string[] | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          meta_description?: string | null
          notion_id?: string | null
          publish_date?: string | null
          read_time?: number | null
          related_posts?: string[] | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          meta_description?: string | null
          notion_id?: string | null
          publish_date?: string | null
          read_time?: number | null
          related_posts?: string[] | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_case_studies: {
        Row: {
          after_image: string | null
          before_image: string | null
          client_problem: string
          created_at: string | null
          featured: boolean | null
          id: string
          job_type: string
          key_outcome: string
          last_synced_at: string | null
          meta_description: string | null
          notion_id: string | null
          project_date: string | null
          slug: string | null
          solution_provided: string
          study_id: string
          suburb: string
          testimonial: string | null
          updated_at: string | null
        }
        Insert: {
          after_image?: string | null
          before_image?: string | null
          client_problem: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          job_type: string
          key_outcome: string
          last_synced_at?: string | null
          meta_description?: string | null
          notion_id?: string | null
          project_date?: string | null
          slug?: string | null
          solution_provided: string
          study_id: string
          suburb: string
          testimonial?: string | null
          updated_at?: string | null
        }
        Update: {
          after_image?: string | null
          before_image?: string | null
          client_problem?: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          job_type?: string
          key_outcome?: string
          last_synced_at?: string | null
          meta_description?: string | null
          notion_id?: string | null
          project_date?: string | null
          slug?: string | null
          solution_provided?: string
          study_id?: string
          suburb?: string
          testimonial?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_knowledge_base: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          display_order: number | null
          featured: boolean | null
          id: string
          last_synced_at: string | null
          notion_id: string | null
          question: string
          related_services: string[] | null
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          featured?: boolean | null
          id?: string
          last_synced_at?: string | null
          notion_id?: string | null
          question: string
          related_services?: string[] | null
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          featured?: boolean | null
          id?: string
          last_synced_at?: string | null
          notion_id?: string | null
          question?: string
          related_services?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_queue: {
        Row: {
          ai_confidence_score: number | null
          content_type: string
          created_at: string | null
          generated_content: Json
          id: string
          published_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ai_confidence_score?: number | null
          content_type: string
          created_at?: string | null
          generated_content: Json
          id?: string
          published_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_confidence_score?: number | null
          content_type?: string
          created_at?: string | null
          generated_content?: Json
          id?: string
          published_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_services: {
        Row: {
          created_at: string | null
          display_order: number | null
          featured: boolean | null
          features: string[] | null
          full_description: string | null
          icon: string | null
          id: string
          image_url: string | null
          last_synced_at: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          notion_id: string | null
          pricing_info: Json | null
          process_steps: Json | null
          service_category: string | null
          service_tags: string[] | null
          short_description: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          featured?: boolean | null
          features?: string[] | null
          full_description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          notion_id?: string | null
          pricing_info?: Json | null
          process_steps?: Json | null
          service_category?: string | null
          service_tags?: string[] | null
          short_description?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          featured?: boolean | null
          features?: string[] | null
          full_description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          notion_id?: string | null
          pricing_info?: Json | null
          process_steps?: Json | null
          service_category?: string | null
          service_tags?: string[] | null
          short_description?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_suburbs: {
        Row: {
          created_at: string | null
          description: string | null
          distance_from_base: number | null
          featured_projects: string[] | null
          id: string
          last_synced_at: string | null
          local_seo_content: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          notion_id: string | null
          postcode: string | null
          projects_completed: number | null
          region: string | null
          services_available: string[] | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          distance_from_base?: number | null
          featured_projects?: string[] | null
          id?: string
          last_synced_at?: string | null
          local_seo_content?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          notion_id?: string | null
          postcode?: string | null
          projects_completed?: number | null
          region?: string | null
          services_available?: string[] | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          distance_from_base?: number | null
          featured_projects?: string[] | null
          id?: string
          last_synced_at?: string | null
          local_seo_content?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          notion_id?: string | null
          postcode?: string | null
          projects_completed?: number | null
          region?: string | null
          services_available?: string[] | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_sync_log: {
        Row: {
          completed_at: string | null
          duration_seconds: number | null
          errors: Json | null
          id: string
          records_created: number | null
          records_deleted: number | null
          records_synced: number | null
          records_updated: number | null
          started_at: string | null
          sync_status: string | null
          sync_type: string
          table_name: string
        }
        Insert: {
          completed_at?: string | null
          duration_seconds?: number | null
          errors?: Json | null
          id?: string
          records_created?: number | null
          records_deleted?: number | null
          records_synced?: number | null
          records_updated?: number | null
          started_at?: string | null
          sync_status?: string | null
          sync_type: string
          table_name: string
        }
        Update: {
          completed_at?: string | null
          duration_seconds?: number | null
          errors?: Json | null
          id?: string
          records_created?: number | null
          records_deleted?: number | null
          records_synced?: number | null
          records_updated?: number | null
          started_at?: string | null
          sync_status?: string | null
          sync_type?: string
          table_name?: string
        }
        Relationships: []
      }
      content_testimonials: {
        Row: {
          case_study_id: string | null
          client_name: string
          created_at: string | null
          featured: boolean | null
          id: string
          job_date: string | null
          last_synced_at: string | null
          notion_id: string | null
          rating: number | null
          service_type: string | null
          suburb: string | null
          testimonial_text: string
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          case_study_id?: string | null
          client_name: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          job_date?: string | null
          last_synced_at?: string | null
          notion_id?: string | null
          rating?: number | null
          service_type?: string | null
          suburb?: string | null
          testimonial_text: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          case_study_id?: string | null
          client_name?: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          job_date?: string | null
          last_synced_at?: string | null
          notion_id?: string | null
          rating?: number | null
          service_type?: string | null
          suburb?: string | null
          testimonial_text?: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "content_testimonials_case_study_id_fkey"
            columns: ["case_study_id"]
            isOneToOne: false
            referencedRelation: "content_case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_reports: {
        Row: {
          created_at: string | null
          file_path: string
          generated_by: string | null
          id: string
          related_id: string | null
          report_type: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          generated_by?: string | null
          id?: string
          related_id?: string | null
          report_type: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          generated_by?: string | null
          id?: string
          related_id?: string | null
          report_type?: string
        }
        Relationships: []
      }
      github_deployment_log: {
        Row: {
          action: string
          branch: string | null
          commit_sha: string | null
          created_at: string
          details: Json | null
          error_message: string | null
          id: string
          initiated_by: string | null
          repo_name: string
          repo_owner: string
          status: string
        }
        Insert: {
          action: string
          branch?: string | null
          commit_sha?: string | null
          created_at?: string
          details?: Json | null
          error_message?: string | null
          id?: string
          initiated_by?: string | null
          repo_name: string
          repo_owner: string
          status?: string
        }
        Update: {
          action?: string
          branch?: string | null
          commit_sha?: string | null
          created_at?: string
          details?: Json | null
          error_message?: string | null
          id?: string
          initiated_by?: string | null
          repo_name?: string
          repo_owner?: string
          status?: string
        }
        Relationships: []
      }
      image_analyses: {
        Row: {
          analysis_result: Json
          analysis_type: string
          confidence_score: number | null
          conversation_id: string | null
          created_at: string | null
          id: string
          image_url: string
        }
        Insert: {
          analysis_result: Json
          analysis_type: string
          confidence_score?: number | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          image_url: string
        }
        Update: {
          analysis_result?: Json
          analysis_type?: string
          confidence_score?: number | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_analyses_conversation_id_fkey"
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
          assigned_crew: string[] | null
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
          estimated_duration_hours: number | null
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
          job_checklist: Json | null
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
          roof_measurement_id: string | null
          roofArea: number | null
          roofPitch: string | null
          safetyRailNeeded: boolean | null
          scheduled_date: string | null
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
          assigned_crew?: string[] | null
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
          estimated_duration_hours?: number | null
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
          job_checklist?: Json | null
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
          roof_measurement_id?: string | null
          roofArea?: number | null
          roofPitch?: string | null
          safetyRailNeeded?: boolean | null
          scheduled_date?: string | null
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
          assigned_crew?: string[] | null
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
          estimated_duration_hours?: number | null
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
          job_checklist?: Json | null
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
          roof_measurement_id?: string | null
          roofArea?: number | null
          roofPitch?: string | null
          safetyRailNeeded?: boolean | null
          scheduled_date?: string | null
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
        Relationships: [
          {
            foreignKeyName: "inspection_reports_roof_measurement_id_fkey"
            columns: ["roof_measurement_id"]
            isOneToOne: false
            referencedRelation: "roof_measurements"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_line_items: {
        Row: {
          description: string
          id: string
          invoice_id: string
          line_total: number
          quantity: number
          sort_order: number | null
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          invoice_id: string
          line_total: number
          quantity: number
          sort_order?: number | null
          unit_price: number
        }
        Update: {
          description?: string
          id?: string
          invoice_id?: string
          line_total?: number
          quantity?: number
          sort_order?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number | null
          balance_due: number
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string | null
          due_date: string
          gst: number
          id: string
          invoice_number: string
          issue_date: string
          job_id: string | null
          notes: string | null
          payment_terms: string | null
          quote_id: string | null
          status: string | null
          subtotal: number
          total: number
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          balance_due: number
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string | null
          due_date: string
          gst: number
          id?: string
          invoice_number: string
          issue_date?: string
          job_id?: string | null
          notes?: string | null
          payment_terms?: string | null
          quote_id?: string | null
          status?: string | null
          subtotal: number
          total: number
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          balance_due?: number
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string | null
          due_date?: string
          gst?: number
          id?: string
          invoice_number?: string
          issue_date?: string
          job_id?: string | null
          notes?: string | null
          payment_terms?: string | null
          quote_id?: string | null
          status?: string | null
          subtotal?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "inspection_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_files: {
        Row: {
          active: boolean | null
          category: string
          content: string
          created_at: string | null
          file_key: string
          id: string
          last_synced_at: string | null
          metadata: Json | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          active?: boolean | null
          category: string
          content: string
          created_at?: string | null
          file_key: string
          id?: string
          last_synced_at?: string | null
          metadata?: Json | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          active?: boolean | null
          category?: string
          content?: string
          created_at?: string | null
          file_key?: string
          id?: string
          last_synced_at?: string | null
          metadata?: Json | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      lead_notes: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          lead_id: string
          note_type: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          lead_id: string
          note_type?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          lead_id?: string
          note_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          lead_id: string
          priority: string
          status: string
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          lead_id: string
          priority?: string
          status?: string
          task_type: string
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          lead_id?: string
          priority?: string
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          ai_score: number | null
          ai_tags: Json | null
          auto_enriched_at: string | null
          created_at: string
          email: string | null
          id: string
          merge_history: Json | null
          merge_status: string | null
          merged_into_lead_id: string | null
          message: string | null
          name: string
          phone: string
          service: string
          service_area_match: boolean | null
          source: string | null
          status: string | null
          suburb: string
          updated_at: string
          urgency: string | null
        }
        Insert: {
          ai_score?: number | null
          ai_tags?: Json | null
          auto_enriched_at?: string | null
          created_at?: string
          email?: string | null
          id?: string
          merge_history?: Json | null
          merge_status?: string | null
          merged_into_lead_id?: string | null
          message?: string | null
          name: string
          phone: string
          service: string
          service_area_match?: boolean | null
          source?: string | null
          status?: string | null
          suburb: string
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          ai_score?: number | null
          ai_tags?: Json | null
          auto_enriched_at?: string | null
          created_at?: string
          email?: string | null
          id?: string
          merge_history?: Json | null
          merge_status?: string | null
          merged_into_lead_id?: string | null
          message?: string | null
          name?: string
          phone?: string
          service?: string
          service_area_match?: boolean | null
          source?: string | null
          status?: string | null
          suburb?: string
          updated_at?: string
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_merged_into_lead_id_fkey"
            columns: ["merged_into_lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
      metrics_learning_log: {
        Row: {
          approved_for_training: boolean | null
          category: string | null
          id: string
          qa_score: number | null
          self_correction_note: string | null
          task_description: string | null
          timestamp: string | null
          user_feedback: string | null
        }
        Insert: {
          approved_for_training?: boolean | null
          category?: string | null
          id?: string
          qa_score?: number | null
          self_correction_note?: string | null
          task_description?: string | null
          timestamp?: string | null
          user_feedback?: string | null
        }
        Update: {
          approved_for_training?: boolean | null
          category?: string | null
          id?: string
          qa_score?: number | null
          self_correction_note?: string | null
          task_description?: string | null
          timestamp?: string | null
          user_feedback?: string | null
        }
        Relationships: []
      }
      monitoring_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          log_type: string
          message: string
          severity: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          log_type: string
          message: string
          severity: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          log_type?: string
          message?: string
          severity?: string
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
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          recorded_by: string | null
          reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date: string
          payment_method: string
          recorded_by?: string | null
          reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          recorded_by?: string | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      post_engagement: {
        Row: {
          clicks: number | null
          comments: number | null
          created_at: string | null
          engagement_rate: number | null
          fetched_at: string | null
          id: string
          likes: number | null
          platform: string
          post_id: string | null
          reach: number | null
          shares: number | null
        }
        Insert: {
          clicks?: number | null
          comments?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          fetched_at?: string | null
          id?: string
          likes?: number | null
          platform: string
          post_id?: string | null
          reach?: number | null
          shares?: number | null
        }
        Update: {
          clicks?: number | null
          comments?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          fetched_at?: string | null
          id?: string
          likes?: number | null
          platform?: string
          post_id?: string | null
          reach?: number | null
          shares?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_engagement_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
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
      quote_emails: {
        Row: {
          click_count: number | null
          clicks_data: Json | null
          engagement_score: number | null
          id: string
          quote_id: string
          recipient_email: string
          reminder_sent_at: string | null
          sent_at: string
          status: string
          viewed_at: string | null
        }
        Insert: {
          click_count?: number | null
          clicks_data?: Json | null
          engagement_score?: number | null
          id?: string
          quote_id: string
          recipient_email: string
          reminder_sent_at?: string | null
          sent_at?: string
          status?: string
          viewed_at?: string | null
        }
        Update: {
          click_count?: number | null
          clicks_data?: Json | null
          engagement_score?: number | null
          id?: string
          quote_id?: string
          recipient_email?: string
          reminder_sent_at?: string | null
          sent_at?: string
          status?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_emails_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_history: {
        Row: {
          changed_by: string | null
          changes: Json
          created_at: string
          id: string
          quote_id: string
          version_number: number
        }
        Insert: {
          changed_by?: string | null
          changes: Json
          created_at?: string
          id?: string
          quote_id: string
          version_number: number
        }
        Update: {
          changed_by?: string | null
          changes?: Json
          created_at?: string
          id?: string
          quote_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_history_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
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
      roof_measurements: {
        Row: {
          address: string
          created_at: string | null
          created_by: string | null
          hips: Json | null
          id: string
          imagery_date: string | null
          imagery_quality: string | null
          imagery_url: string | null
          latitude: number
          linked_inspection_id: string | null
          linked_lead_id: string | null
          linked_quote_id: string | null
          longitude: number
          perimeter_features: Json | null
          predominant_pitch: number | null
          ridges: Json | null
          roof_segments: Json | null
          solar_panel_capacity_watts: number | null
          total_area_m2: number
          valleys: Json | null
        }
        Insert: {
          address: string
          created_at?: string | null
          created_by?: string | null
          hips?: Json | null
          id?: string
          imagery_date?: string | null
          imagery_quality?: string | null
          imagery_url?: string | null
          latitude: number
          linked_inspection_id?: string | null
          linked_lead_id?: string | null
          linked_quote_id?: string | null
          longitude: number
          perimeter_features?: Json | null
          predominant_pitch?: number | null
          ridges?: Json | null
          roof_segments?: Json | null
          solar_panel_capacity_watts?: number | null
          total_area_m2: number
          valleys?: Json | null
        }
        Update: {
          address?: string
          created_at?: string | null
          created_by?: string | null
          hips?: Json | null
          id?: string
          imagery_date?: string | null
          imagery_quality?: string | null
          imagery_url?: string | null
          latitude?: number
          linked_inspection_id?: string | null
          linked_lead_id?: string | null
          linked_quote_id?: string | null
          longitude?: number
          perimeter_features?: Json | null
          predominant_pitch?: number | null
          ridges?: Json | null
          roof_segments?: Json | null
          solar_panel_capacity_watts?: number | null
          total_area_m2?: number
          valleys?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "roof_measurements_linked_inspection_id_fkey"
            columns: ["linked_inspection_id"]
            isOneToOne: false
            referencedRelation: "inspection_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roof_measurements_linked_lead_id_fkey"
            columns: ["linked_lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roof_measurements_linked_quote_id_fkey"
            columns: ["linked_quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      security_events: {
        Row: {
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          severity: string | null
          timestamp: string | null
          user_agent: string | null
        }
        Insert: {
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          severity?: string | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Update: {
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          severity?: string | null
          timestamp?: string | null
          user_agent?: string | null
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
      security_scan_results: {
        Row: {
          branch: string | null
          created_at: string
          findings: Json
          id: string
          initiated_by: string | null
          passed: boolean | null
          repo_name: string
          repo_owner: string
          scan_type: string
          score: number | null
        }
        Insert: {
          branch?: string | null
          created_at?: string
          findings: Json
          id?: string
          initiated_by?: string | null
          passed?: boolean | null
          repo_name: string
          repo_owner: string
          scan_type: string
          score?: number | null
        }
        Update: {
          branch?: string | null
          created_at?: string
          findings?: Json
          id?: string
          initiated_by?: string | null
          passed?: boolean | null
          repo_name?: string
          repo_owner?: string
          scan_type?: string
          score?: number | null
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
      suburb_analytics: {
        Row: {
          calculated_at: string | null
          id: string
          metrics: Json | null
          suburb: string
        }
        Insert: {
          calculated_at?: string | null
          id?: string
          metrics?: Json | null
          suburb: string
        }
        Update: {
          calculated_at?: string | null
          id?: string
          metrics?: Json | null
          suburb?: string
        }
        Relationships: []
      }
      system_audit: {
        Row: {
          action: string
          error_message: string | null
          execution_time_ms: number | null
          id: string
          initiator: string | null
          ip_address: string | null
          mode: string | null
          params: Json | null
          result: Json | null
          status: string | null
          timestamp: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          initiator?: string | null
          ip_address?: string | null
          mode?: string | null
          params?: Json | null
          result?: Json | null
          status?: string | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          initiator?: string | null
          ip_address?: string | null
          mode?: string | null
          params?: Json | null
          result?: Json | null
          status?: string | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          preference_type: string
          settings: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preference_type: string
          settings?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preference_type?: string
          settings?: Json | null
          updated_at?: string | null
          user_id?: string
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
      voice_transcriptions: {
        Row: {
          audio_url: string
          conversation_id: string | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          transcript: string
        }
        Insert: {
          audio_url: string
          conversation_id?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          transcript: string
        }
        Update: {
          audio_url?: string
          conversation_id?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          transcript?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_transcriptions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string
          id: number
          payload: Json
          processed: boolean | null
          received_at: string
          source: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: number
          payload: Json
          processed?: boolean | null
          received_at?: string
          source: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: number
          payload?: Json
          processed?: boolean | null
          received_at?: string
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_rate_limits: { Args: never; Returns: undefined }
      create_admin_for_authenticated_user: { Args: never; Returns: Json }
      generate_invoice_number: { Args: never; Returns: string }
      generate_quote_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: { Args: { user_id?: string }; Returns: boolean }
      is_inspector: { Args: { _user_id?: string }; Returns: boolean }
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
