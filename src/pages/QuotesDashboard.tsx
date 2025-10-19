import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Download, Edit, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteEditor } from '@/components/QuoteEditor';

interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  site_address: string;
  suburb_postcode: string;
  tier_level: string;
  total: number;
  status: string;
  created_at: string;
  valid_until: string;
}

export default function QuotesDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    filterQuotes();
  }, [quotes, searchTerm, statusFilter, tierFilter]);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quotes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterQuotes = () => {
    let filtered = [...quotes];

    if (searchTerm) {
      filtered = filtered.filter(quote =>
        quote.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.site_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.quote_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter);
    }

    if (tierFilter !== 'all') {
      filtered = filtered.filter(quote => quote.tier_level === tierFilter);
    }

    setFilteredQuotes(filtered);
  };

  const handleExportPDF = async (quoteId: string) => {
    try {
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .select('*, quote_line_items(*)')
        .eq('id', quoteId)
        .single();

      if (quoteError) throw quoteError;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: 'Error',
          description: 'Please allow popups to export PDF',
          variant: 'destructive',
        });
        return;
      }

      const lineItems = quote.quote_line_items || [];

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Quote ${quote.quote_number}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #1f2937; }
            .header { border-bottom: 3px solid #007ACC; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; color: #007ACC; margin-bottom: 5px; }
            .abn { color: #6b7280; font-size: 14px; }
            .quote-title { font-size: 20px; font-weight: bold; margin: 30px 0 10px; }
            .quote-number { color: #6b7280; font-size: 14px; }
            .section { margin: 20px 0; }
            .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #0B3B69; }
            .info-grid { display: grid; grid-template-columns: 150px 1fr; gap: 10px; }
            .info-label { font-weight: bold; color: #6b7280; }
            .line-items { margin: 30px 0; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #d1d5db; }
            td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            .item-description { color: #6b7280; font-size: 13px; margin-top: 4px; }
            .totals { margin-top: 30px; float: right; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .totals-row.grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #007ACC; padding-top: 12px; margin-top: 8px; }
            .notes { margin-top: 40px; padding: 20px; background: #f9fafb; border-left: 4px solid #007ACC; }
            .notes-title { font-weight: bold; margin-bottom: 10px; }
            .footer { margin-top: 60px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            .tier-badge { display: inline-block; padding: 4px 12px; background: #007ACC; color: white; border-radius: 4px; font-size: 12px; font-weight: bold; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Call Kaids Roofing</div>
            <div class="abn">ABN 39475055075</div>
            <div style="margin-top: 10px; color: #6b7280;">Kaidyn Brownlie | 0435 900 709 | callkaidsroofing@outlook.com</div>
          </div>

          <div class="quote-title">Quote</div>
          <div class="quote-number">${quote.quote_number}</div>

          <div class="section">
            <div class="section-title">Client Information</div>
            <div class="info-grid">
              <div class="info-label">Client Name:</div>
              <div>${quote.client_name}</div>
              <div class="info-label">Site Address:</div>
              <div>${quote.site_address}, ${quote.suburb_postcode}</div>
              ${quote.email ? `<div class="info-label">Email:</div><div>${quote.email}</div>` : ''}
              ${quote.phone ? `<div class="info-label">Phone:</div><div>${quote.phone}</div>` : ''}
              <div class="info-label">Quote Date:</div>
              <div>${new Date(String(quote.created_at)).toLocaleDateString('en-AU')}</div>
              <div class="info-label">Valid Until:</div>
              <div>${new Date(String(quote.valid_until)).toLocaleDateString('en-AU')}</div>
              <div class="info-label">Package:</div>
              <div><span class="tier-badge">${quote.tier_level.toUpperCase()}</span></div>
            </div>
          </div>

          <div class="line-items">
            <div class="section-title">Quote Details</div>
            <table>
              <thead>
                <tr>
                  <th>Service Item</th>
                  <th style="text-align: right;">Qty</th>
                  <th style="text-align: right;">Unit Rate</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${lineItems.map((item: any) => `
                  <tr>
                    <td>
                      <div style="font-weight: 500;">${item.service_item}</div>
                      ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                    </td>
                    <td style="text-align: right;">${item.quantity} ${item.unit}</td>
                    <td style="text-align: right;">$${parseFloat(item.unit_rate).toFixed(2)}</td>
                    <td style="text-align: right;">$${parseFloat(item.line_total).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>$${parseFloat(String(quote.subtotal)).toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span>GST (10%):</span>
              <span>$${parseFloat(String(quote.gst)).toFixed(2)}</span>
            </div>
            <div class="totals-row grand-total">
              <span>Total:</span>
              <span>$${parseFloat(String(quote.total)).toFixed(2)}</span>
            </div>
          </div>

          <div style="clear: both;"></div>

          ${quote.notes ? `
            <div class="notes">
              <div class="notes-title">Notes</div>
              <div>${quote.notes}</div>
            </div>
          ` : ''}

          <div class="footer">
            <div style="margin-bottom: 10px; font-weight: bold; color: #007ACC;">No Leaks. No Lifting. Just Quality.</div>
            <div>Professional Roofing, Melbourne Style</div>
            <div style="margin-top: 10px;">7-10 Year Workmanship Warranty | Fully Insured | Weather-dependent scheduling</div>
          </div>
        </body>
        </html>
      `);

      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);

    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to export quote',
        variant: 'destructive',
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['Quote #', 'Client', 'Address', 'Tier', 'Total', 'Status', 'Created'];
    const rows = filteredQuotes.map(quote => [
      quote.quote_number,
      quote.client_name,
      `${quote.site_address} ${quote.suburb_postcode}`,
      quote.tier_level,
      parseFloat(String(quote.total)).toFixed(2),
      quote.status,
      new Date(String(quote.created_at)).toLocaleDateString('en-AU'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Success',
      description: 'Quotes exported to CSV',
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'sent':
        return 'default';
      case 'accepted':
        return 'default';
      case 'draft':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'complete':
        return 'default';
      case 'premium':
        return 'secondary';
      case 'essential':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <AuthGuard requireInspector>
      <div className="p-8 space-y-6">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Quotes Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage and export quotes
              </p>
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </header>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col md:flex-row gap-3">
            <Input
              placeholder="Search by quote #, client, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:max-w-sm"
            />
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="essential">Essential</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Quotes Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || tierFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Generate quotes from inspection reports to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredQuotes.map((quote) => (
              <Card key={quote.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {quote.quote_number} - {quote.client_name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {quote.site_address}, {quote.suburb_postcode}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getStatusBadgeVariant(quote.status)}>
                        {quote.status}
                      </Badge>
                      <Badge variant={getTierBadgeVariant(quote.tier_level)}>
                        {quote.tier_level}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-primary">
                        ${parseFloat(String(quote.total)).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(String(quote.created_at)).toLocaleDateString('en-AU')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Valid until: {new Date(String(quote.valid_until)).toLocaleDateString('en-AU')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedQuoteId(quote.id);
                          setEditorOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportPDF(quote.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quote Editor */}
        {selectedQuoteId && (
          <QuoteEditor
            open={editorOpen}
            onOpenChange={setEditorOpen}
            quoteId={selectedQuoteId}
            onSaved={fetchQuotes}
          />
        )}
      </div>
    </AuthGuard>
  );
}
