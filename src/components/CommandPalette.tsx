import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { 
  Users, FileText, Calendar, DollarSign, Image, 
  Settings, Plus, Search, Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  id: string;
  type: 'lead' | 'quote' | 'job' | 'invoice' | 'action';
  title: string;
  subtitle?: string;
  path: string;
  icon: any;
}

const quickActions = [
  { id: 'new-lead', title: 'New Lead', path: '/internal/v2/leads/new', icon: Plus },
  { id: 'new-quote', title: 'New Quote', path: '/internal/v2/quotes/new', icon: Plus },
  { id: 'new-inspection', title: 'New Inspection', path: '/internal/inspection', icon: Plus },
  { id: 'settings', title: 'Settings', path: '/internal/v2/settings', icon: Settings },
  { id: 'price-book', title: 'Price Book', path: '/internal/v2/settings/pricebook', icon: FileText },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentItems, setRecentItems] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Load recent items from localStorage
  useEffect(() => {
    const recent = localStorage.getItem('recentItems');
    if (recent) {
      setRecentItems(JSON.parse(recent).slice(0, 5));
    }
  }, [open]);

  // Search across entities
  useEffect(() => {
    if (!search || search.length < 2) {
      setResults([]);
      return;
    }

    const searchEntities = async () => {
      setLoading(true);
      try {
        const searchTerm = `%${search}%`;
        
        // Search leads
        const { data: leads } = await supabase
          .from('leads')
          .select('id, name, suburb, service')
          .or(`name.ilike.${searchTerm},suburb.ilike.${searchTerm},phone.ilike.${searchTerm}`)
          .limit(5);

        // Search quotes
        const { data: quotes } = await supabase
          .from('quotes')
          .select('id, quote_number, client_name, site_address')
          .or(`quote_number.ilike.${searchTerm},client_name.ilike.${searchTerm},site_address.ilike.${searchTerm}`)
          .limit(5);

        // Search jobs
        const { data: jobs } = await supabase
          .from('jobs')
          .select('id, job_number, client_name, site_address')
          .or(`job_number.ilike.${searchTerm},client_name.ilike.${searchTerm},site_address.ilike.${searchTerm}`)
          .limit(5);

        const combined: SearchResult[] = [
          ...(leads || []).map(l => ({
            id: l.id,
            type: 'lead' as const,
            title: l.name,
            subtitle: `${l.service} • ${l.suburb}`,
            path: `/internal/v2/leads/${l.id}`,
            icon: Users,
          })),
          ...(quotes || []).map(q => ({
            id: q.id,
            type: 'quote' as const,
            title: q.quote_number,
            subtitle: `${q.client_name} • ${q.site_address}`,
            path: `/internal/v2/quotes/${q.id}`,
            icon: FileText,
          })),
          ...(jobs || []).map(j => ({
            id: j.id,
            type: 'job' as const,
            title: j.job_number,
            subtitle: `${j.client_name} • ${j.site_address}`,
            path: `/internal/v2/jobs/${j.id}`,
            icon: Calendar,
          })),
        ];

        setResults(combined);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchEntities, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleSelect = (result: SearchResult) => {
    // Save to recent items
    const recent = [result, ...recentItems.filter(r => r.id !== result.id)].slice(0, 5);
    localStorage.setItem('recentItems', JSON.stringify(recent));
    
    navigate(result.path);
    onOpenChange(false);
    setSearch('');
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search leads, quotes, jobs..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? 'Searching...' : 'No results found.'}
        </CommandEmpty>

        {!search && recentItems.length > 0 && (
          <CommandGroup heading="Recent">
            {recentItems.map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => handleSelect(item)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  {item.subtitle && (
                    <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!search && (
          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => (
              <CommandItem
                key={action.id}
                value={action.title}
                onSelect={() => {
                  navigate(action.path);
                  onOpenChange(false);
                }}
              >
                <action.icon className="mr-2 h-4 w-4" />
                {action.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.length > 0 && (
          <>
            {results.filter(r => r.type === 'lead').length > 0 && (
              <CommandGroup heading="Leads">
                {results
                  .filter(r => r.type === 'lead')
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => handleSelect(result)}
                    >
                      <result.icon className="mr-2 h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{result.title}</div>
                        {result.subtitle && (
                          <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}

            {results.filter(r => r.type === 'quote').length > 0 && (
              <CommandGroup heading="Quotes">
                {results
                  .filter(r => r.type === 'quote')
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => handleSelect(result)}
                    >
                      <result.icon className="mr-2 h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{result.title}</div>
                        {result.subtitle && (
                          <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}

            {results.filter(r => r.type === 'job').length > 0 && (
              <CommandGroup heading="Jobs">
                {results
                  .filter(r => r.type === 'job')
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => handleSelect(result)}
                    >
                      <result.icon className="mr-2 h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{result.title}</div>
                        {result.subtitle && (
                          <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
