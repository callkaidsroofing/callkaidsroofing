import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PricingItem {
  id: string;
  item_id: string;
  item_name: string;
  item_category: string;
  unit_of_measure: string;
  base_cost: number;
  preferred_supplier: string | null;
  supplier_code: string | null;
  usage_notes: string | null;
  quality_tier: string | null;
  version_history: any;
  metadata: any;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingConstants {
  id: string;
  constant_id: string;
  material_markup: number;
  contingency: number;
  profit_margin: number;
  gst: number;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function usePricingItems(category?: string) {
  return useQuery({
    queryKey: ['pricing-items', category],
    queryFn: async () => {
      let query = supabase
        .from('pricing_items')
        .select('*')
        .eq('active', true)
        .order('item_name');

      if (category) {
        query = query.eq('item_category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PricingItem[];
    },
  });
}

export function usePricingConstants() {
  return useQuery({
    queryKey: ['pricing-constants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_constants')
        .select('*')
        .eq('constant_id', 'FIN_CONST_V1')
        .eq('active', true)
        .single();

      if (error) throw error;
      return data as PricingConstants;
    },
  });
}

export function useRefreshPricing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Fetch the JSON file
      const response = await fetch('/pricing/KF_02_PRICING_MODEL.json');
      const pricingData = await response.json();

      // Call sync function
      const { data, error } = await supabase.functions.invoke('sync-pricing-data', {
        body: { action: 'sync_from_json', data: pricingData }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pricing-items'] });
      queryClient.invalidateQueries({ queryKey: ['pricing-constants'] });
      toast({
        title: 'Pricing data refreshed',
        description: data.message || 'Successfully synchronized pricing data',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to refresh pricing',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useCalculateFinalPrice() {
  const { data: constants } = usePricingConstants();

  return (baseCost: number) => {
    if (!constants) return baseCost;

    const withMarkup = baseCost * (1 + constants.material_markup);
    const withContingency = withMarkup * (1 + constants.contingency);
    const withProfit = withContingency * (1 + constants.profit_margin);
    const withGST = withProfit * (1 + constants.gst);

    return Number(withGST.toFixed(2));
  };
}

export function useSearchPricing() {
  return useMutation({
    mutationFn: async ({ query, category }: { query: string; category?: string }) => {
      // For now, use text search - can be enhanced with vector search
      let dbQuery = supabase
        .from('pricing_items')
        .select('*')
        .eq('active', true)
        .or(`item_name.ilike.%${query}%,usage_notes.ilike.%${query}%`)
        .limit(20);

      if (category) {
        dbQuery = dbQuery.eq('item_category', category);
      }

      const { data, error } = await dbQuery;
      if (error) throw error;
      return data as PricingItem[];
    },
  });
}
