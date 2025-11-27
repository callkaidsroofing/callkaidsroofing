import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseDocumentAIOptions {
  functionName: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface GenerationHistory {
  id: string;
  generatorType: string;
  inputPrompt: string;
  outputData: any;
  applied: boolean;
  createdAt: string;
}

export function useDocumentAI({
  functionName,
  onSuccess,
  onError,
}: UseDocumentAIOptions) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastGeneration, setLastGeneration] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationHistory[]>([]);

  const generate = async (
    message: string,
    context?: Record<string, any>
  ): Promise<any> => {
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          conversationId,
          message,
          context,
        },
      });

      if (error) throw error;

      setConversationId(data.conversationId);
      setLastGeneration(data.generatedData);

      if (data.generatedData) {
        onSuccess?.(data.generatedData);
      }

      return data;
    } catch (error: any) {
      console.error(`${functionName} error:`, error);
      const errorMessage = error.message || "Failed to generate content";
      toast.error(errorMessage);
      onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const regenerate = async (context?: Record<string, any>) => {
    if (!lastGeneration) {
      toast.error("No previous generation to regenerate");
      return;
    }

    return generate("Please regenerate with improvements", context);
  };

  const loadHistory = async (generatorType: string) => {
    try {
      const { data, error } = await supabase
        .from("ai_generation_history")
        .select("*")
        .eq("generator_type", generatorType)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      setHistory(
        data.map((item) => ({
          id: item.id,
          generatorType: item.generator_type,
          inputPrompt: item.input_prompt,
          outputData: item.output_data,
          applied: item.applied,
          createdAt: item.created_at,
        }))
      );
    } catch (error: any) {
      console.error("Failed to load history:", error);
      toast.error("Failed to load generation history");
    }
  };

  const markAsApplied = async (historyId: string) => {
    try {
      const { error } = await supabase
        .from("ai_generation_history")
        .update({ applied: true, applied_at: new Date().toISOString() })
        .eq("id", historyId);

      if (error) throw error;

      setHistory((prev) =>
        prev.map((item) =>
          item.id === historyId ? { ...item, applied: true } : item
        )
      );
    } catch (error: any) {
      console.error("Failed to mark as applied:", error);
    }
  };

  const resetConversation = () => {
    setConversationId(null);
    setLastGeneration(null);
  };

  return {
    generate,
    regenerate,
    loadHistory,
    markAsApplied,
    resetConversation,
    isProcessing,
    lastGeneration,
    conversationId,
    history,
  };
}
