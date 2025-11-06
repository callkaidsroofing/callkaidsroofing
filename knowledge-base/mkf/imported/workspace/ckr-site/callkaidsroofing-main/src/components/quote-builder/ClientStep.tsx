import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Plus, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClientData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  suburb: string;
  property_address?: string;
}

interface ClientStepProps {
  value: ClientData | null;
  onChange: (client: ClientData) => void;
}

export function ClientStep({ value, onChange }: ClientStepProps) {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState<ClientData>(
    value || { name: '', email: '', phone: '', suburb: '', property_address: '' }
  );
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setLeads(data);
    }
  };

  const selectLead = (lead: any) => {
    const client: ClientData = {
      id: lead.id,
      name: lead.name,
      email: lead.email || '',
      phone: lead.phone,
      suburb: lead.suburb,
      property_address: lead.suburb,
    };
    setFormData(client);
    onChange(client);
    setShowNewForm(false);
  };

  const handleFormChange = (field: keyof ClientData, val: string) => {
    const updated = { ...formData, [field]: val };
    setFormData(updated);
    onChange(updated);
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.suburb.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {!showNewForm && !value ? (
        <>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, phone, or suburb..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowNewForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Client
            </Button>
          </div>

          <div className="grid gap-2 max-h-[400px] overflow-y-auto">
            {filteredLeads.map((lead) => (
              <Card
                key={lead.id}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => selectLead(lead)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{lead.name}</h3>
                      <p className="text-sm text-muted-foreground">{lead.phone}</p>
                      <p className="text-xs text-muted-foreground">{lead.suburb}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{lead.service}</div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Client Details</h3>
              {!showNewForm && value && (
                <Button variant="ghost" size="sm" onClick={() => onChange(null as any)}>
                  Change Client
                </Button>
              )}
            </div>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    placeholder="0412 345 678"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="suburb">Suburb *</Label>
                <Input
                  id="suburb"
                  value={formData.suburb}
                  onChange={(e) => handleFormChange('suburb', e.target.value)}
                  placeholder="Clyde North"
                />
              </div>
              <div>
                <Label htmlFor="address">Property Address</Label>
                <Input
                  id="address"
                  value={formData.property_address}
                  onChange={(e) => handleFormChange('property_address', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
