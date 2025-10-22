import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

async function fetchRoofData(address: string) {
  const { data, error } = await supabase.functions.invoke('get-roof-data', {
    body: { address, saveToDatabase: true },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function useRoofData() {
  return useMutation({
    mutationFn: (address: string) => fetchRoofData(address),
  });
}
