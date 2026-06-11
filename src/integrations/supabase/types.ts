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
      aforge_memories_v2: {
        Row: {
          agent_id: string
          chunk_index: number
          content: string
          created_at: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          namespace: string
          source_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id?: string
          chunk_index?: number
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          namespace?: string
          source_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          agent_id?: string
          chunk_index?: number
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          namespace?: string
          source_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      aforge_skills: {
        Row: {
          agent_id: string | null
          content: string | null
          created_at: string | null
          description: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          name: string
          source: string
          source_path: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          name: string
          source?: string
          source_path: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          name?: string
          source?: string
          source_path?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_activities: {
        Row: {
          agent_name: string
          completed_at: string | null
          created_at: string
          duration: number | null
          id: number
          phase_key: string
          result: string | null
          run_id: number
          skills: string | null
          started_at: string | null
          status: string | null
          task: string | null
          updated_at: string
        }
        Insert: {
          agent_name: string
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          id?: number
          phase_key: string
          result?: string | null
          run_id: number
          skills?: string | null
          started_at?: string | null
          status?: string | null
          task?: string | null
          updated_at?: string
        }
        Update: {
          agent_name?: string
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          id?: number
          phase_key?: string
          result?: string | null
          run_id?: number
          skills?: string | null
          started_at?: string | null
          status?: string | null
          task?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_activities_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "swarm_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      brain_instructions: {
        Row: {
          created_at: string
          id: string
          instruction: string
          is_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          instruction: string
          is_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          instruction?: string
          is_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      brain_memory: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brain_memory_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "brain_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      brain_runs: {
        Row: {
          assistant_message: string | null
          context: Json
          conversation_id: string | null
          created_at: string
          decision: Json
          enqueued_call_ids: string[]
          error: Json | null
          id: string
          limits: Json
          message: string
          mode: string
          next_actions: Json
          planned_tool_calls: Json
          receipts: Json
          status: string
          updated_at: string
        }
        Insert: {
          assistant_message?: string | null
          context?: Json
          conversation_id?: string | null
          created_at?: string
          decision?: Json
          enqueued_call_ids?: string[]
          error?: Json | null
          id?: string
          limits?: Json
          message: string
          mode: string
          next_actions?: Json
          planned_tool_calls?: Json
          receipts?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          assistant_message?: string | null
          context?: Json
          conversation_id?: string | null
          created_at?: string
          decision?: Json
          enqueued_call_ids?: string[]
          error?: Json | null
          id?: string
          limits?: Json
          message?: string
          mode?: string
          next_actions?: Json
          planned_tool_calls?: Json
          receipts?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      brain_sessions: {
        Row: {
          config: Json
          context: Json
          created_at: string
          entry_count: number
          id: string
          instruction: string | null
          status: string
          updated_at: string
        }
        Insert: {
          config?: Json
          context?: Json
          created_at?: string
          entry_count?: number
          id?: string
          instruction?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          config?: Json
          context?: Json
          created_at?: string
          entry_count?: number
          id?: string
          instruction?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          all_day: boolean | null
          attendees: Json | null
          created_at: string
          created_by: string
          description: string | null
          duration_minutes: number | null
          end_at: string | null
          event_type: string | null
          id: string
          inspection_id: string | null
          job_id: string | null
          latitude: number | null
          lead_id: string | null
          location: string | null
          longitude: number | null
          metadata: Json | null
          notes: string | null
          start_at: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          all_day?: boolean | null
          attendees?: Json | null
          created_at?: string
          created_by?: string
          description?: string | null
          duration_minutes?: number | null
          end_at?: string | null
          event_type?: string | null
          id?: string
          inspection_id?: string | null
          job_id?: string | null
          latitude?: number | null
          lead_id?: string | null
          location?: string | null
          longitude?: number | null
          metadata?: Json | null
          notes?: string | null
          start_at: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          all_day?: boolean | null
          attendees?: Json | null
          created_at?: string
          created_by?: string
          description?: string | null
          duration_minutes?: number | null
          end_at?: string | null
          event_type?: string | null
          id?: string
          inspection_id?: string | null
          job_id?: string | null
          latitude?: number | null
          lead_id?: string | null
          location?: string | null
          longitude?: number | null
          metadata?: Json | null
          notes?: string | null
          start_at?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          ad_creatives: Json | null
          ad_sets: Json | null
          audience_size_estimate: string | null
          budget_type: string | null
          campaign_name: string
          created_at: string
          created_by: string | null
          daily_budget: number | null
          end_date: string | null
          id: string
          last_synced_at: string | null
          lifetime_budget: number | null
          metrics: Json | null
          notes: string | null
          objective: string
          platform: string
          platform_campaign_id: string | null
          spend_to_date: number | null
          start_date: string | null
          status: string | null
          targeting: Json | null
          updated_at: string
        }
        Insert: {
          ad_creatives?: Json | null
          ad_sets?: Json | null
          audience_size_estimate?: string | null
          budget_type?: string | null
          campaign_name: string
          created_at?: string
          created_by?: string | null
          daily_budget?: number | null
          end_date?: string | null
          id?: string
          last_synced_at?: string | null
          lifetime_budget?: number | null
          metrics?: Json | null
          notes?: string | null
          objective: string
          platform: string
          platform_campaign_id?: string | null
          spend_to_date?: number | null
          start_date?: string | null
          status?: string | null
          targeting?: Json | null
          updated_at?: string
        }
        Update: {
          ad_creatives?: Json | null
          ad_sets?: Json | null
          audience_size_estimate?: string | null
          budget_type?: string | null
          campaign_name?: string
          created_at?: string
          created_by?: string | null
          daily_budget?: number | null
          end_date?: string | null
          id?: string
          last_synced_at?: string | null
          lifetime_budget?: number | null
          metrics?: Json | null
          notes?: string | null
          objective?: string
          platform?: string
          platform_campaign_id?: string | null
          spend_to_date?: number | null
          start_date?: string | null
          status?: string | null
          targeting?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          after_photo_url: string | null
          before_photo_url: string | null
          id: string
          is_published: boolean | null
          job_id: string | null
          outcome_text: string | null
          problem_text: string | null
          solution_text: string | null
          title: string | null
        }
        Insert: {
          after_photo_url?: string | null
          before_photo_url?: string | null
          id?: string
          is_published?: boolean | null
          job_id?: string | null
          outcome_text?: string | null
          problem_text?: string | null
          solution_text?: string | null
          title?: string | null
        }
        Update: {
          after_photo_url?: string | null
          before_photo_url?: string | null
          id?: string
          is_published?: boolean | null
          job_id?: string | null
          outcome_text?: string | null
          problem_text?: string | null
          solution_text?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_studies_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
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
      chat_threads: {
        Row: {
          active_agent_id: string | null
          created_at: string
          execution_phase: Database["public"]["Enums"]["execution_phase"] | null
          id: string
          preferred_system: string | null
          requested_by: string
          spec_draft: Json | null
          status: Database["public"]["Enums"]["thread_status"]
          swarm_agents: string[] | null
          target_agents: string[] | null
          title: string
          updated_at: string
          workspace_path: string | null
        }
        Insert: {
          active_agent_id?: string | null
          created_at?: string
          execution_phase?:
            | Database["public"]["Enums"]["execution_phase"]
            | null
          id?: string
          preferred_system?: string | null
          requested_by: string
          spec_draft?: Json | null
          status?: Database["public"]["Enums"]["thread_status"]
          swarm_agents?: string[] | null
          target_agents?: string[] | null
          title?: string
          updated_at?: string
          workspace_path?: string | null
        }
        Update: {
          active_agent_id?: string | null
          created_at?: string
          execution_phase?:
            | Database["public"]["Enums"]["execution_phase"]
            | null
          id?: string
          preferred_system?: string | null
          requested_by?: string
          spec_draft?: Json | null
          status?: Database["public"]["Enums"]["thread_status"]
          swarm_agents?: string[] | null
          target_agents?: string[] | null
          title?: string
          updated_at?: string
          workspace_path?: string | null
        }
        Relationships: []
      }
      comms_log: {
        Row: {
          approved_at: string | null
          body: string
          channel: string
          created_at: string | null
          direction: string | null
          id: string
          job_id: string | null
          lead_id: string | null
          message: string | null
          org_id: string | null
          recipient: string
          related_entity: Json | null
          sent_at: string | null
          status: string | null
        }
        Insert: {
          approved_at?: string | null
          body: string
          channel: string
          created_at?: string | null
          direction?: string | null
          id?: string
          job_id?: string | null
          lead_id?: string | null
          message?: string | null
          org_id?: string | null
          recipient: string
          related_entity?: Json | null
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          approved_at?: string | null
          body?: string
          channel?: string
          created_at?: string | null
          direction?: string | null
          id?: string
          job_id?: string | null
          lead_id?: string | null
          message?: string | null
          org_id?: string | null
          recipient?: string
          related_entity?: Json | null
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comms_log_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comms_log_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
      core_tool_calls: {
        Row: {
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          error: Json | null
          id: string
          idempotency_key: string | null
          input: Json
          status: string
          tool_name: string
          updated_at: string
          worker_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          error?: Json | null
          id?: string
          idempotency_key?: string | null
          input?: Json
          status?: string
          tool_name: string
          updated_at?: string
          worker_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          error?: Json | null
          id?: string
          idempotency_key?: string | null
          input?: Json
          status?: string
          tool_name?: string
          updated_at?: string
          worker_id?: string | null
        }
        Relationships: []
      }
      core_tool_receipts: {
        Row: {
          call_id: string
          change_plan_id: string | null
          created_at: string
          effects: Json
          id: string
          result: Json
          status: string
          tool_name: string
        }
        Insert: {
          call_id: string
          change_plan_id?: string | null
          created_at?: string
          effects?: Json
          id?: string
          result?: Json
          status: string
          tool_name: string
        }
        Update: {
          call_id?: string
          change_plan_id?: string | null
          created_at?: string
          effects?: Json
          id?: string
          result?: Json
          status?: string
          tool_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "core_tool_receipts_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "core_tool_calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_tool_receipts_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "gem_recent_failures"
            referencedColumns: ["call_id"]
          },
        ]
      }
      core_tool_registry_enabled: {
        Row: {
          enabled: boolean
          environment: string
          notes: string | null
          requires_confirmation: boolean
          risk_level: string
          rollout_stage: number
          tool_name: string
          updated_at: string
        }
        Insert: {
          enabled?: boolean
          environment?: string
          notes?: string | null
          requires_confirmation?: boolean
          risk_level?: string
          rollout_stage?: number
          tool_name: string
          updated_at?: string
        }
        Update: {
          enabled?: boolean
          environment?: string
          notes?: string | null
          requires_confirmation?: boolean
          risk_level?: string
          rollout_stage?: number
          tool_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      critical_fix_report: {
        Row: {
          action: string
          details: string | null
          fix_tag: string
          id: number
          object_name: string
          object_type: string
          ran_at: string
        }
        Insert: {
          action: string
          details?: string | null
          fix_tag: string
          id?: number
          object_name: string
          object_type: string
          ran_at?: string
        }
        Update: {
          action?: string
          details?: string | null
          fix_tag?: string
          id?: number
          object_name?: string
          object_type?: string
          ran_at?: string
        }
        Relationships: []
      }
      device_notifications: {
        Row: {
          body: string
          channel: string
          created_at: string
          data: Json | null
          delivered_at: string
          id: string
          org_id: string | null
          route: string | null
          tapped_at: string | null
          title: string
        }
        Insert: {
          body: string
          channel?: string
          created_at?: string
          data?: Json | null
          delivered_at?: string
          id: string
          org_id?: string | null
          route?: string | null
          tapped_at?: string | null
          title: string
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string
          data?: Json | null
          delivered_at?: string
          id?: string
          org_id?: string | null
          route?: string | null
          tapped_at?: string | null
          title?: string
        }
        Relationships: []
      }
      device_tokens: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          org_id: string
          platform: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          org_id: string
          platform: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          org_id?: string
          platform?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      document_versions: {
        Row: {
          created_at: string
          created_by: string | null
          document_type: string
          entity_id: string
          file_hash: string
          file_path: string
          id: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_type: string
          entity_id: string
          file_hash: string
          file_path: string
          id?: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_type?: string
          entity_id?: string
          file_hash?: string
          file_path?: string
          id?: string
          version?: number
        }
        Relationships: []
      }
      entities: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      execution_logs: {
        Row: {
          agent_name: string | null
          created_at: string
          id: number
          level: string | null
          logged_at: string
          message: string
          metadata: string | null
          phase_key: string | null
          run_id: number
        }
        Insert: {
          agent_name?: string | null
          created_at?: string
          id?: number
          level?: string | null
          logged_at?: string
          message: string
          metadata?: string | null
          phase_key?: string | null
          run_id: number
        }
        Update: {
          agent_name?: string | null
          created_at?: string
          id?: number
          level?: string | null
          logged_at?: string
          message?: string
          metadata?: string | null
          phase_key?: string | null
          run_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "execution_logs_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "swarm_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          date_incurred: string | null
          description: string
          id: string
          job_id: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          date_incurred?: string | null
          description: string
          id?: string
          job_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          date_incurred?: string | null
          description?: string
          id?: string
          job_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      form_definitions: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_published: boolean
          name: string
          outputs: string[]
          roles: string[]
          schema: Json
          ui_schema: Json
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_published?: boolean
          name: string
          outputs?: string[]
          roles?: string[]
          schema: Json
          ui_schema?: Json
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_published?: boolean
          name?: string
          outputs?: string[]
          roles?: string[]
          schema?: Json
          ui_schema?: Json
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          created_at: string
          form_id: string
          id: string
          submitted_by: string | null
          submitted_data: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          form_id: string
          id?: string
          submitted_by?: string | null
          submitted_data: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          form_id?: string
          id?: string
          submitted_by?: string | null
          submitted_data?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_definitions"
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
      highlevel_calendar_sync: {
        Row: {
          ckr_event_id: string | null
          created_at: string
          highlevel_event_id: string
          id: string
          last_synced_at: string | null
          location_id: string
          sync_status: string
          updated_at: string
        }
        Insert: {
          ckr_event_id?: string | null
          created_at?: string
          highlevel_event_id: string
          id?: string
          last_synced_at?: string | null
          location_id: string
          sync_status?: string
          updated_at?: string
        }
        Update: {
          ckr_event_id?: string | null
          created_at?: string
          highlevel_event_id?: string
          id?: string
          last_synced_at?: string | null
          location_id?: string
          sync_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      highlevel_contact_sync: {
        Row: {
          ckr_lead_id: string | null
          ckr_payload_hash: string | null
          ckr_updated_at: string | null
          company_name: string | null
          conflict_resolved_at: string | null
          conflict_resolved_by: string | null
          created_at: string
          custom_fields: Json | null
          date_of_birth: string | null
          dnd: boolean | null
          error_message: string | null
          highlevel_contact_id: string
          highlevel_location_id: string
          highlevel_payload_hash: string | null
          highlevel_updated_at: string | null
          id: string
          last_sync_at: string | null
          last_sync_direction: string | null
          next_retry_at: string | null
          retry_count: number | null
          sync_direction: string
          sync_status: string
          tags: Json | null
          updated_at: string
          website: string | null
        }
        Insert: {
          ckr_lead_id?: string | null
          ckr_payload_hash?: string | null
          ckr_updated_at?: string | null
          company_name?: string | null
          conflict_resolved_at?: string | null
          conflict_resolved_by?: string | null
          created_at?: string
          custom_fields?: Json | null
          date_of_birth?: string | null
          dnd?: boolean | null
          error_message?: string | null
          highlevel_contact_id: string
          highlevel_location_id?: string
          highlevel_payload_hash?: string | null
          highlevel_updated_at?: string | null
          id?: string
          last_sync_at?: string | null
          last_sync_direction?: string | null
          next_retry_at?: string | null
          retry_count?: number | null
          sync_direction: string
          sync_status?: string
          tags?: Json | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          ckr_lead_id?: string | null
          ckr_payload_hash?: string | null
          ckr_updated_at?: string | null
          company_name?: string | null
          conflict_resolved_at?: string | null
          conflict_resolved_by?: string | null
          created_at?: string
          custom_fields?: Json | null
          date_of_birth?: string | null
          dnd?: boolean | null
          error_message?: string | null
          highlevel_contact_id?: string
          highlevel_location_id?: string
          highlevel_payload_hash?: string | null
          highlevel_updated_at?: string | null
          id?: string
          last_sync_at?: string | null
          last_sync_direction?: string | null
          next_retry_at?: string | null
          retry_count?: number | null
          sync_direction?: string
          sync_status?: string
          tags?: Json | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      highlevel_custom_fields: {
        Row: {
          created_at: string
          data_type: string
          field_key: string
          field_name: string
          id: string
          is_active: boolean | null
          location_id: string
          picklist_options: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_type: string
          field_key: string
          field_name: string
          id?: string
          is_active?: boolean | null
          location_id: string
          picklist_options?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_type?: string
          field_key?: string
          field_name?: string
          id?: string
          is_active?: boolean | null
          location_id?: string
          picklist_options?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      highlevel_document_mapping: {
        Row: {
          ckr_document_url: string | null
          ckr_entity_id: string
          ckr_entity_type: string
          created_at: string
          error_message: string | null
          highlevel_contact_id: string
          highlevel_document_id: string | null
          highlevel_location_id: string
          highlevel_note_id: string | null
          id: string
          sync_status: string
          updated_at: string
          uploaded_at: string | null
        }
        Insert: {
          ckr_document_url?: string | null
          ckr_entity_id: string
          ckr_entity_type: string
          created_at?: string
          error_message?: string | null
          highlevel_contact_id: string
          highlevel_document_id?: string | null
          highlevel_location_id?: string
          highlevel_note_id?: string | null
          id?: string
          sync_status?: string
          updated_at?: string
          uploaded_at?: string | null
        }
        Update: {
          ckr_document_url?: string | null
          ckr_entity_id?: string
          ckr_entity_type?: string
          created_at?: string
          error_message?: string | null
          highlevel_contact_id?: string
          highlevel_document_id?: string | null
          highlevel_location_id?: string
          highlevel_note_id?: string | null
          id?: string
          sync_status?: string
          updated_at?: string
          uploaded_at?: string | null
        }
        Relationships: []
      }
      highlevel_inbound_events: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string
          highlevel_id: string | null
          highlevel_location_id: string | null
          id: string
          max_retries: number | null
          next_retry_at: string | null
          payload: Json
          payload_hash: string | null
          processed_at: string | null
          retry_count: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: string
          highlevel_id?: string | null
          highlevel_location_id?: string | null
          id?: string
          max_retries?: number | null
          next_retry_at?: string | null
          payload?: Json
          payload_hash?: string | null
          processed_at?: string | null
          retry_count?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string
          highlevel_id?: string | null
          highlevel_location_id?: string | null
          id?: string
          max_retries?: number | null
          next_retry_at?: string | null
          payload?: Json
          payload_hash?: string | null
          processed_at?: string | null
          retry_count?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      highlevel_invoice_sync: {
        Row: {
          ckr_invoice_id: string | null
          created_at: string
          highlevel_invoice_id: string
          id: string
          last_synced_at: string | null
          location_id: string
          sync_status: string
          updated_at: string
        }
        Insert: {
          ckr_invoice_id?: string | null
          created_at?: string
          highlevel_invoice_id: string
          id?: string
          last_synced_at?: string | null
          location_id: string
          sync_status?: string
          updated_at?: string
        }
        Update: {
          ckr_invoice_id?: string | null
          created_at?: string
          highlevel_invoice_id?: string
          id?: string
          last_synced_at?: string | null
          location_id?: string
          sync_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      highlevel_opportunities: {
        Row: {
          created_at: string
          highlevel_contact_id: string | null
          highlevel_location_id: string | null
          highlevel_opportunity_id: string
          highlevel_pipeline_id: string | null
          highlevel_stage_id: string | null
          id: string
          inspection_id: string | null
          job_id: string | null
          last_stage_change_at: string | null
          last_status_change_at: string | null
          last_sync_at: string | null
          lead_id: string | null
          monetary_value: number | null
          name: string | null
          payload: Json | null
          payload_hash: string | null
          quote_id: string | null
          source: string | null
          status: string | null
          sync_status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          highlevel_contact_id?: string | null
          highlevel_location_id?: string | null
          highlevel_opportunity_id: string
          highlevel_pipeline_id?: string | null
          highlevel_stage_id?: string | null
          id?: string
          inspection_id?: string | null
          job_id?: string | null
          last_stage_change_at?: string | null
          last_status_change_at?: string | null
          last_sync_at?: string | null
          lead_id?: string | null
          monetary_value?: number | null
          name?: string | null
          payload?: Json | null
          payload_hash?: string | null
          quote_id?: string | null
          source?: string | null
          status?: string | null
          sync_status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          highlevel_contact_id?: string | null
          highlevel_location_id?: string | null
          highlevel_opportunity_id?: string
          highlevel_pipeline_id?: string | null
          highlevel_stage_id?: string | null
          id?: string
          inspection_id?: string | null
          job_id?: string | null
          last_stage_change_at?: string | null
          last_status_change_at?: string | null
          last_sync_at?: string | null
          lead_id?: string | null
          monetary_value?: number | null
          name?: string | null
          payload?: Json | null
          payload_hash?: string | null
          quote_id?: string | null
          source?: string | null
          status?: string | null
          sync_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "highlevel_opportunities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      highlevel_opportunity_sync: {
        Row: {
          assigned_to: string | null
          calendar_events_count: number | null
          ckr_lead_id: string | null
          ckr_lead_status: string | null
          created_at: string
          followers: Json | null
          highlevel_contact_id: string
          highlevel_monetary_value: number | null
          highlevel_opportunity_id: string
          highlevel_pipeline_id: string
          highlevel_stage_id: string | null
          highlevel_stage_name: string | null
          id: string
          last_action_date: string | null
          last_stage_change_at: string | null
          last_status_change_at: string | null
          last_sync_at: string | null
          notes_count: number | null
          opportunity_name: string | null
          opportunity_source: string | null
          sync_status: string
          tasks_count: number | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          calendar_events_count?: number | null
          ckr_lead_id?: string | null
          ckr_lead_status?: string | null
          created_at?: string
          followers?: Json | null
          highlevel_contact_id: string
          highlevel_monetary_value?: number | null
          highlevel_opportunity_id: string
          highlevel_pipeline_id?: string
          highlevel_stage_id?: string | null
          highlevel_stage_name?: string | null
          id?: string
          last_action_date?: string | null
          last_stage_change_at?: string | null
          last_status_change_at?: string | null
          last_sync_at?: string | null
          notes_count?: number | null
          opportunity_name?: string | null
          opportunity_source?: string | null
          sync_status?: string
          tasks_count?: number | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          calendar_events_count?: number | null
          ckr_lead_id?: string | null
          ckr_lead_status?: string | null
          created_at?: string
          followers?: Json | null
          highlevel_contact_id?: string
          highlevel_monetary_value?: number | null
          highlevel_opportunity_id?: string
          highlevel_pipeline_id?: string
          highlevel_stage_id?: string | null
          highlevel_stage_name?: string | null
          id?: string
          last_action_date?: string | null
          last_stage_change_at?: string | null
          last_status_change_at?: string | null
          last_sync_at?: string | null
          notes_count?: number | null
          opportunity_name?: string | null
          opportunity_source?: string | null
          sync_status?: string
          tasks_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      highlevel_stage_mapping: {
        Row: {
          auto_sync_inbound: boolean | null
          auto_sync_outbound: boolean | null
          ckr_lead_status: string
          created_at: string
          highlevel_pipeline_id: string
          highlevel_pipeline_name: string
          highlevel_stage_id: string
          highlevel_stage_name: string
          highlevel_stage_position: number | null
          id: string
          updated_at: string
        }
        Insert: {
          auto_sync_inbound?: boolean | null
          auto_sync_outbound?: boolean | null
          ckr_lead_status: string
          created_at?: string
          highlevel_pipeline_id: string
          highlevel_pipeline_name: string
          highlevel_stage_id: string
          highlevel_stage_name: string
          highlevel_stage_position?: number | null
          id?: string
          updated_at?: string
        }
        Update: {
          auto_sync_inbound?: boolean | null
          auto_sync_outbound?: boolean | null
          ckr_lead_status?: string
          created_at?: string
          highlevel_pipeline_id?: string
          highlevel_pipeline_name?: string
          highlevel_stage_id?: string
          highlevel_stage_name?: string
          highlevel_stage_position?: number | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      highlevel_sync_queue: {
        Row: {
          attempts: number | null
          ckr_payload_hash: string | null
          completed_at: string | null
          created_at: string
          entity_id: string
          entity_type: string
          error_message: string | null
          highlevel_contact_id: string | null
          id: string
          last_attempt_at: string | null
          max_attempts: number | null
          max_retries: number | null
          next_attempt_at: string | null
          next_retry_at: string | null
          operation: string
          payload: Json
          priority: number | null
          status: string
        }
        Insert: {
          attempts?: number | null
          ckr_payload_hash?: string | null
          completed_at?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          error_message?: string | null
          highlevel_contact_id?: string | null
          id?: string
          last_attempt_at?: string | null
          max_attempts?: number | null
          max_retries?: number | null
          next_attempt_at?: string | null
          next_retry_at?: string | null
          operation: string
          payload: Json
          priority?: number | null
          status?: string
        }
        Update: {
          attempts?: number | null
          ckr_payload_hash?: string | null
          completed_at?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          error_message?: string | null
          highlevel_contact_id?: string | null
          id?: string
          last_attempt_at?: string | null
          max_attempts?: number | null
          max_retries?: number | null
          next_attempt_at?: string | null
          next_retry_at?: string | null
          operation?: string
          payload?: Json
          priority?: number | null
          status?: string
        }
        Relationships: []
      }
      highlevel_webhook_log: {
        Row: {
          created_at: string
          event_type: string
          id: string
          location_id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          location_id: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          location_id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
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
      inspection_checklist_items: {
        Row: {
          category: string
          checked: boolean | null
          created_at: string
          id: string
          inspection_id: string
          item_name: string
          notes: string | null
          photo_refs: Json | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category: string
          checked?: boolean | null
          created_at?: string
          id?: string
          inspection_id: string
          item_name: string
          notes?: string | null
          photo_refs?: Json | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          checked?: boolean | null
          created_at?: string
          id?: string
          inspection_id?: string
          item_name?: string
          notes?: string | null
          photo_refs?: Json | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_checklist_items_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_defects: {
        Row: {
          created_at: string
          defect_type: string
          description: string
          estimated_cost_cents: number | null
          id: string
          inspection_id: string
          location: string | null
          photo_refs: Json | null
          recommended_action: string | null
          severity: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          defect_type: string
          description: string
          estimated_cost_cents?: number | null
          id?: string
          inspection_id: string
          location?: string | null
          photo_refs?: Json | null
          recommended_action?: string | null
          severity?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          defect_type?: string
          description?: string
          estimated_cost_cents?: number | null
          id?: string
          inspection_id?: string
          location?: string | null
          photo_refs?: Json | null
          recommended_action?: string | null
          severity?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_defects_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_finding_catalogue: {
        Row: {
          area: string | null
          category: string | null
          created_at: string
          default_description: string | null
          default_recommendation: string | null
          default_severity: string | null
          id: string
          is_active: boolean
          metadata: Json
          org_id: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          area?: string | null
          category?: string | null
          created_at?: string
          default_description?: string | null
          default_recommendation?: string | null
          default_severity?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          org_id?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          area?: string | null
          category?: string | null
          created_at?: string
          default_description?: string | null
          default_recommendation?: string | null
          default_severity?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          org_id?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      inspection_measurements: {
        Row: {
          area_name: string | null
          created_at: string
          id: string
          inspection_id: string
          measurement_type: string
          notes: string | null
          unit: string
          updated_at: string
          value: number
        }
        Insert: {
          area_name?: string | null
          created_at?: string
          id?: string
          inspection_id: string
          measurement_type: string
          notes?: string | null
          unit?: string
          updated_at?: string
          value: number
        }
        Update: {
          area_name?: string | null
          created_at?: string
          id?: string
          inspection_id?: string
          measurement_type?: string
          notes?: string | null
          unit?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "inspection_measurements_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_packets: {
        Row: {
          created_at: string
          created_by: string | null
          created_by_label: string
          id: string
          inspection_id: string
          packet: Json
          processed_at: string | null
          processing_error: string | null
          processing_status: string
          schema_version: string
          source: string
          source_metadata: Json
          updated_at: string
          validation_errors: Json
          validation_status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          created_by_label?: string
          id?: string
          inspection_id: string
          packet: Json
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string
          schema_version?: string
          source?: string
          source_metadata?: Json
          updated_at?: string
          validation_errors?: Json
          validation_status?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          created_by_label?: string
          id?: string
          inspection_id?: string
          packet?: Json
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string
          schema_version?: string
          source?: string
          source_metadata?: Json
          updated_at?: string
          validation_errors?: Json
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_packets_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
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
          notion_sync_id: string | null
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
          notion_sync_id?: string | null
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
          notion_sync_id?: string | null
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
      inspections: {
        Row: {
          assigned_to: string | null
          broken_tiles_qty: number | null
          cap_effective_length_m: number | null
          capping_cut_caps_qty: number | null
          capping_measure_mode: string | null
          capping_total_caps_qty: number | null
          capping_total_lm: number | null
          capping_total_lm_est: number | null
          coating_failure_signs: boolean | null
          completed_at: string | null
          condition_assessment: Json | null
          created_at: string
          created_by: string
          customer_email: string | null
          customer_mobile: string | null
          customer_name: string | null
          customer_visible_notes: string | null
          estimated_repair_cost_high: number | null
          estimated_repair_cost_low: number | null
          estimated_roof_age_years: number | null
          exported_at: string | null
          follow_up_actions: Json | null
          gutter_length_lm: number | null
          hazards_present: Json | null
          highlevel_contact_id: string | null
          highlevel_opportunity_id: string | null
          id: string
          inspection_datetime: string | null
          inspector_name: string | null
          interior_damage_notes: string | null
          interior_damage_seen: boolean | null
          internal_notes: string | null
          lead_id: string | null
          leadconnector_contact_id: string | null
          leak_location_notes: string | null
          leak_status: string | null
          notes: string | null
          org_id: string | null
          overall_condition: string | null
          payload: Json
          previous_restoration_present: string | null
          property_address: string | null
          rebedding_notes: string | null
          rebedding_required_caps_qty: number | null
          repoint_notes: string | null
          repoint_required_caps_qty: number | null
          restoration_suitability: string | null
          ridge_cap_type_profile: string | null
          roof_identity_notes: string | null
          roof_pitch_category: string | null
          roof_type: string | null
          sarking_visible: string | null
          scheduled_at: string | null
          site_address: string | null
          site_suburb: string | null
          slipped_tiles_qty: number | null
          special_requirements_notes: string | null
          status: string
          storeys_front: number | null
          storeys_rear: number | null
          suburb_postcode: string | null
          tags: string[] | null
          tile_colour: string | null
          tile_profile: string | null
          top_risks: Json | null
          unsafe_reason: string | null
          unsafe_to_access: boolean | null
          updated_at: string
          urgency_level: string | null
          urgency_override_reason: string | null
          valley_length_lm: number | null
        }
        Insert: {
          assigned_to?: string | null
          broken_tiles_qty?: number | null
          cap_effective_length_m?: number | null
          capping_cut_caps_qty?: number | null
          capping_measure_mode?: string | null
          capping_total_caps_qty?: number | null
          capping_total_lm?: number | null
          capping_total_lm_est?: number | null
          coating_failure_signs?: boolean | null
          completed_at?: string | null
          condition_assessment?: Json | null
          created_at?: string
          created_by?: string
          customer_email?: string | null
          customer_mobile?: string | null
          customer_name?: string | null
          customer_visible_notes?: string | null
          estimated_repair_cost_high?: number | null
          estimated_repair_cost_low?: number | null
          estimated_roof_age_years?: number | null
          exported_at?: string | null
          follow_up_actions?: Json | null
          gutter_length_lm?: number | null
          hazards_present?: Json | null
          highlevel_contact_id?: string | null
          highlevel_opportunity_id?: string | null
          id?: string
          inspection_datetime?: string | null
          inspector_name?: string | null
          interior_damage_notes?: string | null
          interior_damage_seen?: boolean | null
          internal_notes?: string | null
          lead_id?: string | null
          leadconnector_contact_id?: string | null
          leak_location_notes?: string | null
          leak_status?: string | null
          notes?: string | null
          org_id?: string | null
          overall_condition?: string | null
          payload?: Json
          previous_restoration_present?: string | null
          property_address?: string | null
          rebedding_notes?: string | null
          rebedding_required_caps_qty?: number | null
          repoint_notes?: string | null
          repoint_required_caps_qty?: number | null
          restoration_suitability?: string | null
          ridge_cap_type_profile?: string | null
          roof_identity_notes?: string | null
          roof_pitch_category?: string | null
          roof_type?: string | null
          sarking_visible?: string | null
          scheduled_at?: string | null
          site_address?: string | null
          site_suburb?: string | null
          slipped_tiles_qty?: number | null
          special_requirements_notes?: string | null
          status?: string
          storeys_front?: number | null
          storeys_rear?: number | null
          suburb_postcode?: string | null
          tags?: string[] | null
          tile_colour?: string | null
          tile_profile?: string | null
          top_risks?: Json | null
          unsafe_reason?: string | null
          unsafe_to_access?: boolean | null
          updated_at?: string
          urgency_level?: string | null
          urgency_override_reason?: string | null
          valley_length_lm?: number | null
        }
        Update: {
          assigned_to?: string | null
          broken_tiles_qty?: number | null
          cap_effective_length_m?: number | null
          capping_cut_caps_qty?: number | null
          capping_measure_mode?: string | null
          capping_total_caps_qty?: number | null
          capping_total_lm?: number | null
          capping_total_lm_est?: number | null
          coating_failure_signs?: boolean | null
          completed_at?: string | null
          condition_assessment?: Json | null
          created_at?: string
          created_by?: string
          customer_email?: string | null
          customer_mobile?: string | null
          customer_name?: string | null
          customer_visible_notes?: string | null
          estimated_repair_cost_high?: number | null
          estimated_repair_cost_low?: number | null
          estimated_roof_age_years?: number | null
          exported_at?: string | null
          follow_up_actions?: Json | null
          gutter_length_lm?: number | null
          hazards_present?: Json | null
          highlevel_contact_id?: string | null
          highlevel_opportunity_id?: string | null
          id?: string
          inspection_datetime?: string | null
          inspector_name?: string | null
          interior_damage_notes?: string | null
          interior_damage_seen?: boolean | null
          internal_notes?: string | null
          lead_id?: string | null
          leadconnector_contact_id?: string | null
          leak_location_notes?: string | null
          leak_status?: string | null
          notes?: string | null
          org_id?: string | null
          overall_condition?: string | null
          payload?: Json
          previous_restoration_present?: string | null
          property_address?: string | null
          rebedding_notes?: string | null
          rebedding_required_caps_qty?: number | null
          repoint_notes?: string | null
          repoint_required_caps_qty?: number | null
          restoration_suitability?: string | null
          ridge_cap_type_profile?: string | null
          roof_identity_notes?: string | null
          roof_pitch_category?: string | null
          roof_type?: string | null
          sarking_visible?: string | null
          scheduled_at?: string | null
          site_address?: string | null
          site_suburb?: string | null
          slipped_tiles_qty?: number | null
          special_requirements_notes?: string | null
          status?: string
          storeys_front?: number | null
          storeys_rear?: number | null
          suburb_postcode?: string | null
          tags?: string[] | null
          tile_colour?: string | null
          tile_profile?: string | null
          top_risks?: Json | null
          unsafe_reason?: string | null
          unsafe_to_access?: boolean | null
          updated_at?: string
          urgency_level?: string | null
          urgency_override_reason?: string | null
          valley_length_lm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inspections_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations_highlevel_connections: {
        Row: {
          access_token: string | null
          created_at: string
          enabled: boolean
          error_message: string | null
          id: string | null
          is_active: boolean | null
          last_cursor: Json | null
          last_sync_at: string | null
          location_id: string
          location_name: string | null
          metadata: Json | null
          refresh_token: string | null
          sync_status: string | null
          token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          enabled?: boolean
          error_message?: string | null
          id?: string | null
          is_active?: boolean | null
          last_cursor?: Json | null
          last_sync_at?: string | null
          location_id: string
          location_name?: string | null
          metadata?: Json | null
          refresh_token?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          enabled?: boolean
          error_message?: string | null
          id?: string | null
          is_active?: boolean | null
          last_cursor?: Json | null
          last_sync_at?: string | null
          location_id?: string
          location_name?: string | null
          metadata?: Json | null
          refresh_token?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      integrations_highlevel_contacts: {
        Row: {
          ckr_lead_id: string | null
          created_at: string
          first_synced_at: string
          highlevel_contact_id: string
          id: string
          last_synced_at: string | null
          location_id: string
          mapped_entity_id: string | null
          payload: Json
          payload_hash: string | null
          sync_status: string | null
          updated_at: string
        }
        Insert: {
          ckr_lead_id?: string | null
          created_at?: string
          first_synced_at?: string
          highlevel_contact_id: string
          id?: string
          last_synced_at?: string | null
          location_id: string
          mapped_entity_id?: string | null
          payload: Json
          payload_hash?: string | null
          sync_status?: string | null
          updated_at?: string
        }
        Update: {
          ckr_lead_id?: string | null
          created_at?: string
          first_synced_at?: string
          highlevel_contact_id?: string
          id?: string
          last_synced_at?: string | null
          location_id?: string
          mapped_entity_id?: string | null
          payload?: Json
          payload_hash?: string | null
          sync_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_highlevel_contacts_ckr_lead_id_fkey"
            columns: ["ckr_lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations_highlevel_sync_runs: {
        Row: {
          completed_at: string | null
          created_at: string
          errors: Json | null
          id: string
          location_id: string
          records_processed: number | null
          started_at: string
          status: string
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          errors?: Json | null
          id?: string
          location_id: string
          records_processed?: number | null
          started_at?: string
          status: string
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          errors?: Json | null
          id?: string
          location_id?: string
          records_processed?: number | null
          started_at?: string
          status?: string
          sync_type?: string
        }
        Relationships: []
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
          lead_id: string | null
          notes: string | null
          notion_sync_id: string | null
          payment_terms: string | null
          quote_id: string | null
          status: string | null
          subtotal: number
          total: number
          total_cents: number
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
          lead_id?: string | null
          notes?: string | null
          notion_sync_id?: string | null
          payment_terms?: string | null
          quote_id?: string | null
          status?: string | null
          subtotal: number
          total: number
          total_cents?: number
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
          lead_id?: string | null
          notes?: string | null
          notion_sync_id?: string | null
          payment_terms?: string | null
          quote_id?: string | null
          status?: string | null
          subtotal?: number
          total?: number
          total_cents?: number
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
            foreignKeyName: "invoices_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          completed_at: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: string
          inspection_id: string | null
          lead_id: string | null
          notes: string | null
          planning_notes: string | null
          quote_amount: number
          quote_id: string | null
          quote_sent_at: string | null
          quoted_total: number | null
          scheduled_at: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          scope: string
          scope_summary: string | null
          service_type: string | null
          site_address: string
          status: string
          updated_at: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          inspection_id?: string | null
          lead_id?: string | null
          notes?: string | null
          planning_notes?: string | null
          quote_amount: number
          quote_id?: string | null
          quote_sent_at?: string | null
          quoted_total?: number | null
          scheduled_at?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          scope: string
          scope_summary?: string | null
          service_type?: string | null
          site_address: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          inspection_id?: string | null
          lead_id?: string | null
          notes?: string | null
          planning_notes?: string | null
          quote_amount?: number
          quote_id?: string | null
          quote_sent_at?: string | null
          quoted_total?: number | null
          scheduled_at?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          scope?: string
          scope_summary?: string | null
          service_type?: string | null
          site_address?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      known_issues: {
        Row: {
          created_at: string
          description: string
          detected_at: string
          id: number
          issue_id: string
          resolution_notes: string | null
          resolved: boolean | null
          resolved_at: string | null
          run_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          detected_at?: string
          id?: number
          issue_id: string
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          run_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          detected_at?: string
          id?: number
          issue_id?: string
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          run_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "known_issues_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "swarm_runs"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
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
        Relationships: []
      }
      leads: {
        Row: {
          address: string | null
          archived_at: string | null
          ckr_payload_hash: string | null
          created_at: string
          email: string | null
          ghl_contact_id: string | null
          ghl_opportunity_id: string | null
          ghl_synced_at: string | null
          highlevel_contact_id: string | null
          highlevel_last_inbound_at: string | null
          highlevel_opportunity_id: string | null
          highlevel_origin: boolean | null
          highlevel_payload_hash: string | null
          highlevel_synced_at: string | null
          id: string
          lead_shadow_status: Database["public"]["Enums"]["lead_shadow_status"]
          leadconnector_contact_id: string | null
          lost_reason: string | null
          metadata: Json | null
          name: string
          notes: string | null
          org_id: string | null
          phone: string
          phone_secondary_type: string
          phone_type: string
          photo_links: Json | null
          source: string | null
          stage: string
          stage_cache: string | null
          status: string
          suburb: string
          sync_conflict_at: string | null
          sync_conflict_resolution: string | null
          updated_at: string
          version: number
        }
        Insert: {
          address?: string | null
          archived_at?: string | null
          ckr_payload_hash?: string | null
          created_at?: string
          email?: string | null
          ghl_contact_id?: string | null
          ghl_opportunity_id?: string | null
          ghl_synced_at?: string | null
          highlevel_contact_id?: string | null
          highlevel_last_inbound_at?: string | null
          highlevel_opportunity_id?: string | null
          highlevel_origin?: boolean | null
          highlevel_payload_hash?: string | null
          highlevel_synced_at?: string | null
          id?: string
          lead_shadow_status?: Database["public"]["Enums"]["lead_shadow_status"]
          leadconnector_contact_id?: string | null
          lost_reason?: string | null
          metadata?: Json | null
          name: string
          notes?: string | null
          org_id?: string | null
          phone: string
          phone_secondary_type?: string
          phone_type?: string
          photo_links?: Json | null
          source?: string | null
          stage?: string
          stage_cache?: string | null
          status?: string
          suburb?: string
          sync_conflict_at?: string | null
          sync_conflict_resolution?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          address?: string | null
          archived_at?: string | null
          ckr_payload_hash?: string | null
          created_at?: string
          email?: string | null
          ghl_contact_id?: string | null
          ghl_opportunity_id?: string | null
          ghl_synced_at?: string | null
          highlevel_contact_id?: string | null
          highlevel_last_inbound_at?: string | null
          highlevel_opportunity_id?: string | null
          highlevel_origin?: boolean | null
          highlevel_payload_hash?: string | null
          highlevel_synced_at?: string | null
          id?: string
          lead_shadow_status?: Database["public"]["Enums"]["lead_shadow_status"]
          leadconnector_contact_id?: string | null
          lost_reason?: string | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          org_id?: string | null
          phone?: string
          phone_secondary_type?: string
          phone_type?: string
          photo_links?: Json | null
          source?: string | null
          stage?: string
          stage_cache?: string | null
          status?: string
          suburb?: string
          sync_conflict_at?: string | null
          sync_conflict_resolution?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      lf_episodes: {
        Row: {
          contract_first_pass_rate: number | null
          corrections: Json | null
          created_at: string | null
          cycle_count: number | null
          ep_id: string
          framer_accuracy: number | null
          id: string
          resolution: string | null
          source_metrics: string | null
          task_summary: string
          task_type: string | null
          user_id: string
          went_well: Json | null
          went_wrong: Json | null
          worker_deviations: Json | null
        }
        Insert: {
          contract_first_pass_rate?: number | null
          corrections?: Json | null
          created_at?: string | null
          cycle_count?: number | null
          ep_id: string
          framer_accuracy?: number | null
          id?: string
          resolution?: string | null
          source_metrics?: string | null
          task_summary: string
          task_type?: string | null
          user_id: string
          went_well?: Json | null
          went_wrong?: Json | null
          worker_deviations?: Json | null
        }
        Update: {
          contract_first_pass_rate?: number | null
          corrections?: Json | null
          created_at?: string | null
          cycle_count?: number | null
          ep_id?: string
          framer_accuracy?: number | null
          id?: string
          resolution?: string | null
          source_metrics?: string | null
          task_summary?: string
          task_type?: string | null
          user_id?: string
          went_well?: Json | null
          went_wrong?: Json | null
          worker_deviations?: Json | null
        }
        Relationships: []
      }
      lf_patterns: {
        Row: {
          applications: number | null
          category: string | null
          confidence: number | null
          created_at: string | null
          id: string
          last_applied: string | null
          loom_id: string
          name: string
          pattern: string | null
          problem: string | null
          solution: Json | null
          source: string | null
          target_skills: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applications?: number | null
          category?: string | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          last_applied?: string | null
          loom_id: string
          name: string
          pattern?: string | null
          problem?: string | null
          solution?: Json | null
          source?: string | null
          target_skills?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applications?: number | null
          category?: string | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          last_applied?: string | null
          loom_id?: string
          name?: string
          pattern?: string | null
          problem?: string | null
          solution?: Json | null
          source?: string | null
          target_skills?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lf_sessions: {
        Row: {
          ended_at: string | null
          episodes_recorded: number | null
          id: string
          patterns_applied: number | null
          session_id: string
          started_at: string | null
          total_dispatches: number | null
          user_id: string
        }
        Insert: {
          ended_at?: string | null
          episodes_recorded?: number | null
          id?: string
          patterns_applied?: number | null
          session_id: string
          started_at?: string | null
          total_dispatches?: number | null
          user_id: string
        }
        Update: {
          ended_at?: string | null
          episodes_recorded?: number | null
          id?: string
          patterns_applied?: number | null
          session_id?: string
          started_at?: string | null
          total_dispatches?: number | null
          user_id?: string
        }
        Relationships: []
      }
      material_price_catalogue: {
        Row: {
          category: string | null
          code: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          metadata: Json
          name: string
          org_id: string | null
          sku: string | null
          sort_order: number
          supplier: string | null
          unit: string | null
          unit_cost_cents: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          name: string
          org_id?: string | null
          sku?: string | null
          sort_order?: number
          supplier?: string | null
          unit?: string | null
          unit_cost_cents?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          name?: string
          org_id?: string | null
          sku?: string | null
          sort_order?: number
          supplier?: string | null
          unit?: string | null
          unit_cost_cents?: number
          updated_at?: string
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
      measurement_boundaries: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          label: string | null
          project_id: string
          type: string
          updated_at: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          label?: string | null
          project_id: string
          type: string
          updated_at?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          label?: string | null
          project_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "measurement_boundaries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "measurement_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      measurement_detections: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          owner_id: string | null
          payload: Json
          project_id: string
          provider: string | null
          status: string
          updated_at: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          owner_id?: string | null
          payload?: Json
          project_id: string
          provider?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          owner_id?: string | null
          payload?: Json
          project_id?: string
          provider?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "measurement_detections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "measurement_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      measurement_points: {
        Row: {
          boundary_id: string
          created_at: string
          id: string
          lat: number | null
          lng: number | null
          point_order: number
          x: number
          y: number
        }
        Insert: {
          boundary_id: string
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          point_order?: number
          x: number
          y: number
        }
        Update: {
          boundary_id?: string
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          point_order?: number
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "measurement_points_boundary_id_fkey"
            columns: ["boundary_id"]
            isOneToOne: false
            referencedRelation: "measurement_boundaries"
            referencedColumns: ["id"]
          },
        ]
      }
      measurement_projects: {
        Row: {
          address: string
          centre_lat: number
          centre_lng: number
          confidence_level: string
          created_at: string
          id: string
          lead_id: string | null
          measurement_basis: string
          name: string
          owner_id: string | null
          updated_at: string
          zoom_level: number
        }
        Insert: {
          address?: string
          centre_lat: number
          centre_lng: number
          confidence_level?: string
          created_at?: string
          id?: string
          lead_id?: string | null
          measurement_basis?: string
          name?: string
          owner_id?: string | null
          updated_at?: string
          zoom_level?: number
        }
        Update: {
          address?: string
          centre_lat?: number
          centre_lng?: number
          confidence_level?: string
          created_at?: string
          id?: string
          lead_id?: string | null
          measurement_basis?: string
          name?: string
          owner_id?: string | null
          updated_at?: string
          zoom_level?: number
        }
        Relationships: []
      }
      measurement_results: {
        Row: {
          barge_lm: number
          confidence_level: string
          created_at: string
          gutter_lm: number
          hip_lm: number
          id: string
          lead_id: string | null
          measurement_source: string
          owner_id: string | null
          project_id: string
          ridge_lm: number
          roof_area_m2: number
          updated_at: string
          valley_lm: number
        }
        Insert: {
          barge_lm?: number
          confidence_level?: string
          created_at?: string
          gutter_lm?: number
          hip_lm?: number
          id?: string
          lead_id?: string | null
          measurement_source?: string
          owner_id?: string | null
          project_id: string
          ridge_lm?: number
          roof_area_m2?: number
          updated_at?: string
          valley_lm?: number
        }
        Update: {
          barge_lm?: number
          confidence_level?: string
          created_at?: string
          gutter_lm?: number
          hip_lm?: number
          id?: string
          lead_id?: string | null
          measurement_source?: string
          owner_id?: string | null
          project_id?: string
          ridge_lm?: number
          roof_area_m2?: number
          updated_at?: string
          valley_lm?: number
        }
        Relationships: [
          {
            foreignKeyName: "measurement_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "measurement_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      measurement_snapshots: {
        Row: {
          created_at: string
          id: string
          owner_id: string | null
          project_id: string
          snapshot: Json
        }
        Insert: {
          created_at?: string
          id?: string
          owner_id?: string | null
          project_id: string
          snapshot?: Json
        }
        Update: {
          created_at?: string
          id?: string
          owner_id?: string | null
          project_id?: string
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "measurement_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "measurement_projects"
            referencedColumns: ["id"]
          },
        ]
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
      media_assets: {
        Row: {
          alt_text: string | null
          asset_type: string
          caption: string | null
          category: string | null
          created_at: string
          created_by: string | null
          created_by_label: string
          entity_type: string | null
          file_ref: string
          file_size_bytes: number | null
          finding_id: string | null
          height_px: number | null
          id: string
          inspection_id: string | null
          job_id: string | null
          lead_id: string | null
          location_on_property: string | null
          metadata: Json
          mime_type: string | null
          processing_error: string | null
          processing_status: string
          quote_id: string | null
          section_tag: string | null
          sort_order: number | null
          storage_bucket: string
          storage_path: string | null
          suburb: string | null
          tags: string[]
          taken_at: string | null
          updated_at: string
          width_px: number | null
        }
        Insert: {
          alt_text?: string | null
          asset_type: string
          caption?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          created_by_label?: string
          entity_type?: string | null
          file_ref: string
          file_size_bytes?: number | null
          finding_id?: string | null
          height_px?: number | null
          id?: string
          inspection_id?: string | null
          job_id?: string | null
          lead_id?: string | null
          location_on_property?: string | null
          metadata?: Json
          mime_type?: string | null
          processing_error?: string | null
          processing_status?: string
          quote_id?: string | null
          section_tag?: string | null
          sort_order?: number | null
          storage_bucket?: string
          storage_path?: string | null
          suburb?: string | null
          tags?: string[]
          taken_at?: string | null
          updated_at?: string
          width_px?: number | null
        }
        Update: {
          alt_text?: string | null
          asset_type?: string
          caption?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          created_by_label?: string
          entity_type?: string | null
          file_ref?: string
          file_size_bytes?: number | null
          finding_id?: string | null
          height_px?: number | null
          id?: string
          inspection_id?: string | null
          job_id?: string | null
          lead_id?: string | null
          location_on_property?: string | null
          metadata?: Json
          mime_type?: string | null
          processing_error?: string | null
          processing_status?: string
          quote_id?: string | null
          section_tag?: string | null
          sort_order?: number | null
          storage_bucket?: string
          storage_path?: string | null
          suburb?: string | null
          tags?: string[]
          taken_at?: string | null
          updated_at?: string
          width_px?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      media_gallery: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          show_on_about: boolean | null
          show_on_homepage: boolean | null
          show_on_portfolio: boolean | null
          show_on_services: boolean | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          show_on_about?: boolean | null
          show_on_homepage?: boolean | null
          show_on_portfolio?: boolean | null
          show_on_services?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          show_on_about?: boolean | null
          show_on_homepage?: boolean | null
          show_on_portfolio?: boolean | null
          show_on_services?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
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
      notes: {
        Row: {
          content: string
          created_at: string
          domain: string
          entity_refs: Json | null
          id: string
          metadata: Json | null
          note_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          domain: string
          entity_refs?: Json | null
          id?: string
          metadata?: Json | null
          note_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          domain?: string
          entity_refs?: Json | null
          id?: string
          metadata?: Json | null
          note_type?: string | null
          title?: string
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
      phase_results: {
        Row: {
          agents_involved: string
          backlog_additions: string | null
          completed_at: string | null
          created_at: string
          duration: number | null
          findings: string | null
          id: number
          metrics: string | null
          output_data: string | null
          phase_key: string
          phase_name: string
          run_id: number
          started_at: string | null
          status: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          agents_involved: string
          backlog_additions?: string | null
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          findings?: string | null
          id?: number
          metrics?: string | null
          output_data?: string | null
          phase_key: string
          phase_name: string
          run_id: number
          started_at?: string | null
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          agents_involved?: string
          backlog_additions?: string | null
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          findings?: string | null
          id?: number
          metrics?: string | null
          output_data?: string | null
          phase_key?: string
          phase_name?: string
          run_id?: number
          started_at?: string | null
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "phase_results_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "swarm_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      price_book: {
        Row: {
          base_rate: number
          category: string
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          labour_hours: number | null
          material_cost: number | null
          service_code: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          base_rate: number
          category: string
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          labour_hours?: number | null
          material_cost?: number | null
          service_code: string
          unit: string
          updated_at?: string | null
        }
        Update: {
          base_rate?: number
          category?: string
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          labour_hours?: number | null
          material_cost?: number | null
          service_code?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pricing_constants: {
        Row: {
          active: boolean | null
          constant_id: string
          contingency: number
          created_at: string | null
          description: string | null
          gst: number
          id: string
          material_markup: number
          profit_margin: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          constant_id: string
          contingency?: number
          created_at?: string | null
          description?: string | null
          gst?: number
          id?: string
          material_markup?: number
          profit_margin?: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          constant_id?: string
          contingency?: number
          created_at?: string | null
          description?: string | null
          gst?: number
          id?: string
          material_markup?: number
          profit_margin?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      pricing_items: {
        Row: {
          active: boolean | null
          base_cost: number
          created_at: string | null
          embedding: string | null
          id: string
          item_category: string
          item_id: string
          item_name: string
          metadata: Json | null
          preferred_supplier: string | null
          quality_tier: string | null
          supplier_code: string | null
          unit_of_measure: string
          updated_at: string | null
          usage_notes: string | null
          version_history: Json | null
        }
        Insert: {
          active?: boolean | null
          base_cost: number
          created_at?: string | null
          embedding?: string | null
          id?: string
          item_category: string
          item_id: string
          item_name: string
          metadata?: Json | null
          preferred_supplier?: string | null
          quality_tier?: string | null
          supplier_code?: string | null
          unit_of_measure: string
          updated_at?: string | null
          usage_notes?: string | null
          version_history?: Json | null
        }
        Update: {
          active?: boolean | null
          base_cost?: number
          created_at?: string | null
          embedding?: string | null
          id?: string
          item_category?: string
          item_id?: string
          item_name?: string
          metadata?: Json | null
          preferred_supplier?: string | null
          quality_tier?: string | null
          supplier_code?: string | null
          unit_of_measure?: string
          updated_at?: string | null
          usage_notes?: string | null
          version_history?: Json | null
        }
        Relationships: []
      }
      pricing_models: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          hash: string
          id: string
          is_active: boolean | null
          json: Json
          updated_at: string
          version: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          hash: string
          id?: string
          is_active?: boolean | null
          json: Json
          updated_at?: string
          version: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          hash?: string
          id?: string
          is_active?: boolean | null
          json?: Json
          updated_at?: string
          version?: string
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
      prompt_versions: {
        Row: {
          content: string
          created_at: string
          id: number
          is_default: boolean | null
          phase_key: string
          phase_name: string
          updated_at: string
          user_id: string | null
          version: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          is_default?: boolean | null
          phase_key: string
          phase_name: string
          updated_at?: string
          user_id?: string | null
          version?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          is_default?: boolean | null
          phase_key?: string
          phase_name?: string
          updated_at?: string
          user_id?: string | null
          version?: number | null
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
        Relationships: []
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
        Relationships: []
      }
      quote_item_catalogue: {
        Row: {
          category: string | null
          code: string | null
          created_at: string
          description: string | null
          gst_applicable: boolean
          id: string
          is_active: boolean
          metadata: Json
          name: string
          org_id: string | null
          sort_order: number
          unit: string | null
          unit_price_cents: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          gst_applicable?: boolean
          id?: string
          is_active?: boolean
          metadata?: Json
          name: string
          org_id?: string | null
          sort_order?: number
          unit?: string | null
          unit_price_cents?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          gst_applicable?: boolean
          id?: string
          is_active?: boolean
          metadata?: Json
          name?: string
          org_id?: string | null
          sort_order?: number
          unit?: string | null
          unit_price_cents?: number
          updated_at?: string
        }
        Relationships: []
      }
      quote_line_items: {
        Row: {
          created_at: string
          description: string
          id: string
          item_type: string | null
          line_total_cents: number
          quantity: number
          quote_id: string
          sort_order: number
          unit_price_cents: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          item_type?: string | null
          line_total_cents: number
          quantity?: number
          quote_id: string
          sort_order?: number
          unit_price_cents: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          item_type?: string | null
          line_total_cents?: number
          quantity?: number
          quote_id?: string
          sort_order?: number
          unit_price_cents?: number
          updated_at?: string
        }
        Relationships: [
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
          accepted_at: string | null
          created_at: string
          declined_at: string | null
          declined_reason: string | null
          finalized_at: string | null
          id: string
          inspection_id: string | null
          labour_cents: number
          lead_id: string | null
          materials_cents: number
          metadata: Json | null
          notes: string | null
          status: string
          subtotal_cents: number
          tax_cents: number
          title: string | null
          total_cents: number
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          declined_at?: string | null
          declined_reason?: string | null
          finalized_at?: string | null
          id?: string
          inspection_id?: string | null
          labour_cents?: number
          lead_id?: string | null
          materials_cents?: number
          metadata?: Json | null
          notes?: string | null
          status?: string
          subtotal_cents?: number
          tax_cents?: number
          title?: string | null
          total_cents?: number
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          declined_at?: string | null
          declined_reason?: string | null
          finalized_at?: string | null
          id?: string
          inspection_id?: string | null
          labour_cents?: number
          lead_id?: string | null
          materials_cents?: number
          metadata?: Json | null
          notes?: string | null
          status?: string
          subtotal_cents?: number
          tax_cents?: number
          title?: string | null
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
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
      reminders: {
        Row: {
          body: string | null
          channel: string | null
          created_at: string
          created_by: string
          id: string
          job_id: string | null
          lead_id: string | null
          recipient: string | null
          remind_at: string
          snooze_until: string | null
          status: string | null
          task_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          channel?: string | null
          created_at?: string
          created_by?: string
          id?: string
          job_id?: string | null
          lead_id?: string | null
          recipient?: string | null
          remind_at: string
          snooze_until?: string | null
          status?: string | null
          task_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          channel?: string | null
          created_at?: string
          created_by?: string
          id?: string
          job_id?: string | null
          lead_id?: string | null
          recipient?: string | null
          remind_at?: string
          snooze_until?: string | null
          status?: string | null
          task_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
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
      sms_sequences: {
        Row: {
          appointment_at: string | null
          created_at: string
          id: string
          lead_id: string
          messages_sent: Json
          next_message_at: string | null
          next_message_index: number
          sequence_type: string
          status: string
          updated_at: string
          variables: Json
        }
        Insert: {
          appointment_at?: string | null
          created_at?: string
          id?: string
          lead_id: string
          messages_sent?: Json
          next_message_at?: string | null
          next_message_index?: number
          sequence_type: string
          status?: string
          updated_at?: string
          variables?: Json
        }
        Update: {
          appointment_at?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          messages_sent?: Json
          next_message_at?: string | null
          next_message_index?: number
          sequence_type?: string
          status?: string
          updated_at?: string
          variables?: Json
        }
        Relationships: [
          {
            foreignKeyName: "sms_sequences_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      spans: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          input: Json | null
          output: Json | null
          score_delta: number | null
          span_type: string
          task_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          input?: Json | null
          output?: Json | null
          score_delta?: number | null
          span_type: string
          task_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          input?: Json | null
          output?: Json | null
          score_delta?: number | null
          span_type?: string
          task_id?: string
        }
        Relationships: []
      }
      swarm_runs: {
        Row: {
          completed_at: string | null
          created_at: string
          custom_context: string | null
          duration: number | null
          id: number
          phases_executed: number | null
          phases_failed: number | null
          phases_successful: number | null
          run_id: string
          started_at: string | null
          status: string
          target_phases: string
          task_template: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          custom_context?: string | null
          duration?: number | null
          id?: number
          phases_executed?: number | null
          phases_failed?: number | null
          phases_successful?: number | null
          run_id: string
          started_at?: string | null
          status?: string
          target_phases: string
          task_template: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          custom_context?: string | null
          duration?: number | null
          id?: number
          phases_executed?: number | null
          phases_failed?: number | null
          phases_successful?: number | null
          run_id?: string
          started_at?: string | null
          status?: string
          target_phases?: string
          task_template?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      swarm_state: {
        Row: {
          confirmed_root_cause: string | null
          coverage_score: number | null
          created_at: string
          current_phase: string | null
          deadcode_score: number | null
          id: number
          known_issues: string | null
          last_updated: string | null
          phase_results_json: string | null
          run_count: number | null
          session_key: string
          skill_efficiency_score: number | null
          task_backlog: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          confirmed_root_cause?: string | null
          coverage_score?: number | null
          created_at?: string
          current_phase?: string | null
          deadcode_score?: number | null
          id?: number
          known_issues?: string | null
          last_updated?: string | null
          phase_results_json?: string | null
          run_count?: number | null
          session_key?: string
          skill_efficiency_score?: number | null
          task_backlog?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          confirmed_root_cause?: string | null
          coverage_score?: number | null
          created_at?: string
          current_phase?: string | null
          deadcode_score?: number | null
          id?: number
          known_issues?: string | null
          last_updated?: string | null
          phase_results_json?: string | null
          run_count?: number | null
          session_key?: string
          skill_efficiency_score?: number | null
          task_backlog?: string | null
          updated_at?: string
          user_id?: string | null
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
      task_backlog: {
        Row: {
          created_at: string
          description: string
          id: number
          priority: string | null
          run_id: number | null
          source: string | null
          status: string
          task_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          priority?: string | null
          run_id?: number | null
          source?: string | null
          status?: string
          task_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          priority?: string | null
          run_id?: number | null
          source?: string | null
          status?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_backlog_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "swarm_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          completion_note: string | null
          context_ref: Json | null
          created_at: string
          description: string | null
          domain: string
          due_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          priority: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          completion_note?: string | null
          context_ref?: Json | null
          created_at?: string
          description?: string | null
          domain: string
          due_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          completion_note?: string | null
          context_ref?: Json | null
          created_at?: string
          description?: string | null
          domain?: string
          due_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      thread_checkpoints: {
        Row: {
          checkpoint_id: string
          created_at: string
          description: string
          hash: string | null
          id: string
          size_bytes: number | null
          thread_id: string
        }
        Insert: {
          checkpoint_id: string
          created_at?: string
          description: string
          hash?: string | null
          id?: string
          size_bytes?: number | null
          thread_id: string
        }
        Update: {
          checkpoint_id?: string
          created_at?: string
          description?: string
          hash?: string | null
          id?: string
          size_bytes?: number | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_checkpoints_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_execution_events: {
        Row: {
          agent_id: string | null
          created_at: string
          event_type: string
          id: string
          payload: Json | null
          task_id: string | null
          thread_id: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          payload?: Json | null
          task_id?: string | null
          thread_id: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json | null
          task_id?: string | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_execution_events_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_messages: {
        Row: {
          agent_id: string | null
          content: string
          content_type: Database["public"]["Enums"]["message_content_type"]
          created_at: string
          id: string
          metadata: Json | null
          role: Database["public"]["Enums"]["message_role"]
          sequence_num: number
          thread_id: string
        }
        Insert: {
          agent_id?: string | null
          content: string
          content_type?: Database["public"]["Enums"]["message_content_type"]
          created_at?: string
          id?: string
          metadata?: Json | null
          role: Database["public"]["Enums"]["message_role"]
          sequence_num: number
          thread_id: string
        }
        Update: {
          agent_id?: string | null
          content?: string
          content_type?: Database["public"]["Enums"]["message_content_type"]
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: Database["public"]["Enums"]["message_role"]
          sequence_num?: number
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_task_links: {
        Row: {
          assigned_agent: string | null
          created_at: string
          id: string
          result_summary: string | null
          task_id: string
          task_state: string | null
          task_title: string | null
          thread_id: string
        }
        Insert: {
          assigned_agent?: string | null
          created_at?: string
          id?: string
          result_summary?: string | null
          task_id: string
          task_state?: string | null
          task_title?: string | null
          thread_id: string
        }
        Update: {
          assigned_agent?: string | null
          created_at?: string
          id?: string
          result_summary?: string | null
          task_id?: string
          task_state?: string | null
          task_title?: string | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_task_links_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
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
      users: {
        Row: {
          createdAt: string
          email: string | null
          id: number
          lastSignedIn: string
          loginMethod: string | null
          name: string | null
          openId: string
          role: Database["public"]["Enums"]["role"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email?: string | null
          id?: number
          lastSignedIn?: string
          loginMethod?: string | null
          name?: string | null
          openId: string
          role?: Database["public"]["Enums"]["role"]
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          email?: string | null
          id?: number
          lastSignedIn?: string
          loginMethod?: string | null
          name?: string | null
          openId?: string
          role?: Database["public"]["Enums"]["role"]
          updatedAt?: string
        }
        Relationships: []
      }
      vault_edges: {
        Row: {
          created_at: string | null
          edge_type: string
          from_path: string
          id: string
          to_path: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          edge_type: string
          from_path: string
          id?: string
          to_path: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          edge_type?: string
          from_path?: string
          id?: string
          to_path?: string
          weight?: number | null
        }
        Relationships: []
      }
      vault_embeddings: {
        Row: {
          chunk_index: number | null
          content_hash: string
          created_at: string | null
          domain: string | null
          embedding: string
          id: string
          project: string | null
          quality_score: string | null
          raw_text: string
          source_id: string
          source_type: string
          source_url: string | null
          status: string | null
          tags: string[] | null
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          chunk_index?: number | null
          content_hash: string
          created_at?: string | null
          domain?: string | null
          embedding: string
          id?: string
          project?: string | null
          quality_score?: string | null
          raw_text: string
          source_id: string
          source_type: string
          source_url?: string | null
          status?: string | null
          tags?: string[] | null
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          chunk_index?: number | null
          content_hash?: string
          created_at?: string | null
          domain?: string | null
          embedding?: string
          id?: string
          project?: string | null
          quality_score?: string | null
          raw_text?: string
          source_id?: string
          source_type?: string
          source_url?: string | null
          status?: string | null
          tags?: string[] | null
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vault_nodes: {
        Row: {
          checksum: string | null
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          node_type: string
          path: string
          project: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          checksum?: string | null
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          node_type: string
          path: string
          project?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          checksum?: string | null
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          node_type?: string
          path?: string
          project?: string | null
          title?: string | null
          updated_at?: string | null
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
      vpa_memories: {
        Row: {
          agent_id: string
          content: string
          created_at: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          user_id: string
        }
        Insert: {
          agent_id?: string
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string
        }
        Update: {
          agent_id?: string
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
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
      workflow_automations: {
        Row: {
          created_at: string | null
          dependencies: Json | null
          gwa_id: string
          id: string
          name: string
          objective: string | null
          status: string | null
          success_metrics: Json | null
          trigger_criteria: Json | null
          trigger_type: string | null
          updated_at: string | null
          version: string | null
          workflow_steps: Json | null
        }
        Insert: {
          created_at?: string | null
          dependencies?: Json | null
          gwa_id: string
          id?: string
          name: string
          objective?: string | null
          status?: string | null
          success_metrics?: Json | null
          trigger_criteria?: Json | null
          trigger_type?: string | null
          updated_at?: string | null
          version?: string | null
          workflow_steps?: Json | null
        }
        Update: {
          created_at?: string | null
          dependencies?: Json | null
          gwa_id?: string
          id?: string
          name?: string
          objective?: string | null
          status?: string | null
          success_metrics?: Json | null
          trigger_criteria?: Json | null
          trigger_type?: string | null
          updated_at?: string | null
          version?: string | null
          workflow_steps?: Json | null
        }
        Relationships: []
      }
      workflow_handover_events: {
        Row: {
          artifact_refs: Json
          comms_refs: Json
          created_at: string
          created_by: string | null
          error_code: string | null
          error_message: string | null
          id: string
          inspection_id: string | null
          invoice_id: string | null
          job_id: string | null
          lead_id: string | null
          org_id: string | null
          quote_id: string | null
          snapshot: Json
          source_entity_id: string
          source_entity_type: string
          status: string
          summary: string | null
          target_entity_id: string | null
          target_entity_type: string | null
          transition_type: string
        }
        Insert: {
          artifact_refs?: Json
          comms_refs?: Json
          created_at?: string
          created_by?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          inspection_id?: string | null
          invoice_id?: string | null
          job_id?: string | null
          lead_id?: string | null
          org_id?: string | null
          quote_id?: string | null
          snapshot?: Json
          source_entity_id: string
          source_entity_type: string
          status?: string
          summary?: string | null
          target_entity_id?: string | null
          target_entity_type?: string | null
          transition_type: string
        }
        Update: {
          artifact_refs?: Json
          comms_refs?: Json
          created_at?: string
          created_by?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          inspection_id?: string | null
          invoice_id?: string | null
          job_id?: string | null
          lead_id?: string | null
          org_id?: string | null
          quote_id?: string | null
          snapshot?: Json
          source_entity_id?: string
          source_entity_type?: string
          status?: string
          summary?: string | null
          target_entity_id?: string | null
          target_entity_type?: string | null
          transition_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      gem_idempotency_hits: {
        Row: {
          hit_rate_percent: number | null
          idempotency_hits: number | null
          tool_name: string | null
          total_receipts: number | null
        }
        Relationships: []
      }
      gem_queue_depth: {
        Row: {
          newest_queued: string | null
          oldest_age_seconds: number | null
          oldest_queued: string | null
          queued_count: number | null
          tool_name: string | null
        }
        Relationships: []
      }
      gem_recent_failures: {
        Row: {
          call_id: string | null
          claimed_at: string | null
          created_at: string | null
          error_code: string | null
          error_message: string | null
          input: Json | null
          status: string | null
          tool_name: string | null
          worker_id: string | null
        }
        Relationships: []
      }
      gem_tool_contracts_runtime: {
        Row: {
          domain: string | null
          execution_count: number | null
          has_db_writes: boolean | null
          has_external_calls: boolean | null
          has_messages: boolean | null
          last_execution: string | null
          observed_idempotency_modes: string[] | null
          tool_name: string | null
        }
        Relationships: []
      }
      gem_tool_execution_stats: {
        Row: {
          avg_execution_seconds: number | null
          failed: number | null
          first_call: string | null
          last_execution: string | null
          not_configured: number | null
          queued: number | null
          running: number | null
          succeeded: number | null
          tool_name: string | null
          total_calls: number | null
        }
        Relationships: []
      }
      gem_worker_activity: {
        Row: {
          avg_processing_seconds: number | null
          currently_running: number | null
          last_claim: string | null
          total_claimed: number | null
          worker_id: string | null
        }
        Relationships: []
      }
      latest_document_versions: {
        Row: {
          created_at: string | null
          created_by: string | null
          document_type: string | null
          entity_id: string | null
          file_hash: string | null
          file_path: string | null
          id: string | null
          version: number | null
        }
        Relationships: []
      }
      v_pricing_latest: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          hash: string | null
          id: string | null
          json: Json | null
          version: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      ai_upsert_document:
        | {
            Args: {
              p_content: string
              p_metadata: Json
              p_source_id: string
              p_source_table: string
              p_title: string
            }
            Returns: string
          }
        | {
            Args: {
              p_content: string
              p_embedding: string
              p_metadata: Json
              p_source_id: string
              p_source_table: string
              p_title: string
            }
            Returns: string
          }
      bulk_upsert_embeddings: { Args: { p_items: Json[] }; Returns: number }
      calculate_final_price: {
        Args: { base_cost: number; constant_id?: string }
        Returns: number
      }
      ckr_schema_snapshot: { Args: never; Returns: Json }
      claim_next_core_tool_call: {
        Args: { p_worker_id: string }
        Returns: {
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          error: Json | null
          id: string
          idempotency_key: string | null
          input: Json
          status: string
          tool_name: string
          updated_at: string
          worker_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "core_tool_calls"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      claim_next_tool_call: {
        Args: { p_worker_id: string }
        Returns: {
          id: string
          idempotency_key: string
          input: Json
          tool_name: string
        }[]
      }
      cleanup_rate_limits: { Args: never; Returns: undefined }
      create_document_version: {
        Args: {
          p_created_by?: string
          p_document_type: string
          p_entity_id: string
          p_file_hash: string
          p_file_path: string
        }
        Returns: string
      }
      document_search: {
        Args: {
          filter_source?: string
          match_count?: number
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
          source_id: string
          source_table: string
          title: string
        }[]
      }
      gem_check_tool_health: {
        Args: { p_tool_name: string }
        Returns: {
          avg_execution_ms: number
          is_healthy: boolean
          last_failure: string
          last_success: string
          recent_failures: number
          success_rate: number
          tool_name: string
        }[]
      }
      gem_get_pipeline_progress: {
        Args: { p_inspection_id: string }
        Returns: {
          call_id: string
          completed_at: string
          status: string
          step_name: string
        }[]
      }
      generate_invoice_number: { Args: never; Returns: string }
      generate_quote_number: { Args: never; Returns: string }
      get_embedding_stats: {
        Args: never
        Returns: {
          embedded: number
          percentage: number
          source_table: string
          total: number
        }[]
      }
      get_highlevel_stage_id: { Args: { ckr_status: string }; Returns: string }
      get_inspection_packet_stats: {
        Args: { p_inspection_id: string }
        Returns: {
          checklist_count: number
          defect_count: number
          high_severity_defects: number
          measurement_count: number
          photo_count: number
        }[]
      }
      get_knowledge_docs: {
        Args: never
        Returns: {
          created_at: string
          embedding: string
          id: string
          metadata: Json
          source_id: string
          source_table: string
          title: string
          updated_at: string
        }[]
      }
      get_latest_document_version: {
        Args: { p_document_type: string; p_entity_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      insert_embedding: {
        Args: {
          p_content: string
          p_embedding: string
          p_source_type?: string
          p_title?: string
        }
        Returns: string
      }
      is_admin_user: { Args: { user_id?: string }; Returns: boolean }
      is_inspector: { Args: { _user_id?: string }; Returns: boolean }
      knowledge_insert: {
        Args: {
          p_content: string
          p_embedding: string
          p_metadata?: Json
          p_source_type?: string
          p_title?: string
        }
        Returns: string
      }
      knowledge_search: {
        Args: { p_embedding: string; p_min_similar?: number; p_top_k?: number }
        Returns: {
          content: string
          created_at: string
          id: string
          metadata: Json
          similarity: number
          source_type: string
          title: string
        }[]
      }
      match_agents: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          agent_id: string
          capability_summary: string
          similarity: number
        }[]
      }
      match_ckr_knowledge: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
      md_search: {
        Args: { emb_text: string; min_sim?: number; top_k?: number }
        Returns: {
          content: string
          id: string
          similarity: number
          title: string
        }[]
      }
      queue_outbound_sync: {
        Args: {
          p_entity_id: string
          p_entity_type: string
          p_highlevel_contact_id?: string
          p_operation: string
          p_payload?: Json
        }
        Returns: string
      }
      search_ckr_sections: {
        Args: {
          filter_domain?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          doc_id: string
          doc_title: string
          heading: string
          keywords: string[]
          related_sections: string[]
          section_path: string
          similarity: number
        }[]
      }
      search_embeddings: {
        Args: { min_similar?: number; query_vec: string; top_k?: number }
        Returns: {
          content: string
          id: string
          similarity: number
        }[]
      }
      search_embeddings_jsonb: {
        Args: { min_similar?: number; query_vec: Json; top_k?: number }
        Returns: {
          content: string
          id: string
          similarity: number
        }[]
      }
      search_embeddings_text: {
        Args: { min_similar?: number; query_text: string; top_k?: number }
        Returns: {
          content: string
          id: string
          similarity: number
        }[]
      }
      search_knowledge_chunks: {
        Args: {
          filter_category?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          category: string
          content: string
          doc_id: string
          id: string
          metadata: Json
          section: string
          similarity: number
          title: string
        }[]
      }
      search_master_knowledge: {
        Args: {
          filter_category?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          category: string
          content: string
          doc_id: string
          metadata: Json
          similarity: number
          title: string
        }[]
      }
      search_pricing_items: {
        Args: {
          filter_category?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          base_cost: number
          id: string
          item_category: string
          item_id: string
          item_name: string
          similarity: number
          unit_of_measure: string
          usage_notes: string
        }[]
      }
      send_embedding: {
        Args: {
          p_content: string
          p_embedding: string
          p_id: string
          p_metadata: Json
          p_source_type?: string
          p_title: string
        }
        Returns: string
      }
      update_embedding: {
        Args: { p_content: string; p_embedding: string; p_id: string }
        Returns: undefined
      }
      upsert_embedding: {
        Args: {
          p_agent_id: string
          p_capability_summary: string
          p_embedding: string
        }
        Returns: undefined
      }
      vault_search: {
        Args: {
          filter_domain?: string
          filter_project?: string
          filter_type?: string
          match_count?: number
          query_embedding: string
        }
        Returns: {
          domain: string
          id: string
          project: string
          raw_text: string
          similarity: number
          source_id: string
          source_type: string
          tags: string[]
          tier: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "inspector" | "viewer"
      execution_phase:
        | "idle"
        | "planning"
        | "executing"
        | "delegating"
        | "awaiting_approval"
        | "paused"
        | "complete"
        | "failed"
      lead_shadow_status:
        | "linked"
        | "missing_contact"
        | "missing_opportunity"
        | "invalid_opportunity"
        | "quarantined"
      message_content_type:
        | "text"
        | "task_draft"
        | "task_spec"
        | "task_result"
        | "clarification"
        | "agent_action"
        | "agent_thought"
        | "delegation"
        | "checkpoint"
      message_role: "user" | "assistant" | "system"
      role: "user" | "admin"
      thread_status: "active" | "archived"
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
      execution_phase: [
        "idle",
        "planning",
        "executing",
        "delegating",
        "awaiting_approval",
        "paused",
        "complete",
        "failed",
      ],
      lead_shadow_status: [
        "linked",
        "missing_contact",
        "missing_opportunity",
        "invalid_opportunity",
        "quarantined",
      ],
      message_content_type: [
        "text",
        "task_draft",
        "task_spec",
        "task_result",
        "clarification",
        "agent_action",
        "agent_thought",
        "delegation",
        "checkpoint",
      ],
      message_role: ["user", "assistant", "system"],
      role: ["user", "admin"],
      thread_status: ["active", "archived"],
    },
  },
} as const
