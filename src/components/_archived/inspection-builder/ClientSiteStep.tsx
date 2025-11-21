import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Plus, User } from 'lucide-react';

interface ClientSiteData {
  leadId?: string;
  clientName: string;
  phone: string;
  email?: string;
  siteAddress: string;
  suburbPostcode: string;
  date: string;
  time: string;
  inspector: string;
}

interface ClientSiteStepProps {
  value: ClientSiteData;
  onChange: (data: ClientSiteData) => void;
}

export function ClientSiteStep({ value, onChange }: ClientSiteStepProps) {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showLeads, setShowLeads] = useState(!value.clientName);

  useEffect(() => {
    fetchLeads();
    // Set default date/time/inspector if empty
    if (!value.date || !value.time || !value.inspector) {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toTimeString().slice(0, 5);
      onChange({ 
        ...value, 
        date: value.date || today, 
        time: value.time || now,
        inspector: value.inspector || 'Kaidyn'
      });
    }
  }, []);

  const fetchLeads = async () => {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setLeads(data);
  };

  const selectLead = (lead: any) => {
    onChange({
      ...value,
      leadId: lead.id,
      clientName: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      siteAddress: lead.suburb,
      suburbPostcode: lead.suburb,
    });
    setShowLeads(false);
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.suburb.toLowerCase().includes(search.toLowerCase())
  );

  if (showLeads) {
    return (
      <div className="space-y-4">
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
          <Button variant="outline" onClick={() => setShowLeads(false)}>
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
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Client & Site Details</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowLeads(true)}>
            Select from Leads
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientName">Client Name *</Label>
            <Input
              id="clientName"
              value={value.clientName}
              onChange={(e) => onChange({ ...value, clientName: e.target.value })}
              placeholder="John Smith"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={value.phone}
              onChange={(e) => onChange({ ...value, phone: e.target.value })}
              placeholder="0412 345 678"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={value.email || ''}
              onChange={(e) => onChange({ ...value, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label htmlFor="inspector">Inspector *</Label>
            <Input
              id="inspector"
              value={value.inspector}
              onChange={(e) => onChange({ ...value, inspector: e.target.value })}
              placeholder="Kaidyn"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="siteAddress">Site Address *</Label>
          <Input
            id="siteAddress"
            value={value.siteAddress}
            onChange={(e) => onChange({ ...value, siteAddress: e.target.value })}
            placeholder="123 Main Street"
          />
        </div>

        <div>
          <Label htmlFor="suburbPostcode">Suburb/Postcode *</Label>
          <Input
            id="suburbPostcode"
            value={value.suburbPostcode}
            onChange={(e) => onChange({ ...value, suburbPostcode: e.target.value })}
            placeholder="Clyde North 3978"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Inspection Date *</Label>
            <Input
              id="date"
              type="date"
              value={value.date}
              onChange={(e) => onChange({ ...value, date: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="time">Inspection Time *</Label>
            <Input
              id="time"
              type="time"
              value={value.time}
              onChange={(e) => onChange({ ...value, time: e.target.value })}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
