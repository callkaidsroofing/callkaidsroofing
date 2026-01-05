import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { handleAPIError } from '@/lib/api-error-handler';
import { 
  Search, 
  Plus, 
  FileText, 
  ClipboardCheck, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Eye,
  Edit,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InspectionReport {
  id: string;
  clientName: string;
  phone: string;
  email: string | null;
  siteAddress: string;
  suburbPostcode: string;
  claddingType: string;
  status: string;
  priority: string | null;
  created_at: string;
  date: string;
}

// Interface matching actual quotes schema
interface Quote {
  id: string;
  lead_id: string | null;
  inspection_id: string | null;
  status: string;
  total_cents: number;
  labour_cents: number;
  materials_cents: number;
  notes: string | null;
  valid_until: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  declined_reason: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function QuotesPage() {
  const [inspections, setInspections] = useState<InspectionReport[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch inspections
      const { data: inspectionsData, error: inspError } = await supabase
        .from('inspection_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (inspError) throw inspError;
      setInspections(inspectionsData || []);

      // Fetch quotes
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;
      setQuotes((quotesData || []) as unknown as Quote[]);

    } catch (error) {
      handleAPIError(error, 'Failed to load inspections and quotes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500/10 text-gray-500',
      completed: 'bg-green-500/10 text-green-500',
      sent: 'bg-blue-500/10 text-blue-500',
      approved: 'bg-emerald-500/10 text-emerald-500',
      rejected: 'bg-red-500/10 text-red-500',
    };
    return colors[status] || 'bg-muted';
  };

  const getPriorityBadge = (priority: string | null) => {
    if (!priority) return null;
    const colors: Record<string, string> = {
      high: 'bg-red-500/10 text-red-500',
      medium: 'bg-yellow-500/10 text-yellow-500',
      low: 'bg-green-500/10 text-green-500',
    };
    return colors[priority.toLowerCase()] || 'bg-muted';
  };

  const filteredInspections = inspections.filter(inspection => 
    inspection.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.siteAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.suburbPostcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.phone.includes(searchTerm)
  );

  const filteredQuotes = quotes.filter(quote => 
    quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
            <ClipboardCheck className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Inspections & Quotes
            </h1>
            <p className="text-muted-foreground">
              {inspections.length} inspections · {quotes.length} quotes
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/admin/tools/inspection-quote')}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Inspection & Quote
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription>Total Inspections</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {inspections.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass-card border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription>Total Quotes</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {quotes.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass-card border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription>Quotes Sent</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {quotes.filter(q => q.sent_at).length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass-card border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {formatCurrency(quotes.reduce((sum, q) => sum + (q.total_cents / 100), 0))}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, address, phone, or quote number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="inspections" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="inspections">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Inspections ({filteredInspections.length})
          </TabsTrigger>
          <TabsTrigger value="quotes">
            <FileText className="h-4 w-4 mr-2" />
            Quotes ({filteredQuotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inspections" className="space-y-4">
          <Card className="glass-card border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Inspection Reports</CardTitle>
              <CardDescription>All property inspections</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredInspections.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No inspections found</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first inspection to get started
                  </p>
                  <Button onClick={() => navigate('/admin/tools/inspection-quote')}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Inspection
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInspections.map((inspection) => (
                      <TableRow key={inspection.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{inspection.clientName}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Phone className="h-3 w-3" />
                              {inspection.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{inspection.siteAddress}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              {inspection.suburbPostcode}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{inspection.claddingType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(inspection.status)}>
                            {inspection.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {inspection.priority && (
                            <Badge className={getPriorityBadge(inspection.priority) || ''}>
                              {inspection.priority}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(inspection.created_at), { addSuffix: true })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/tools/inspection-quote/${inspection.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4">
          <Card className="glass-card border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Quotes</CardTitle>
              <CardDescription>All generated quotes</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredQuotes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No quotes found</h3>
                  <p className="text-muted-foreground mb-6">
                    Complete an inspection to generate a quote
                  </p>
                  <Button onClick={() => navigate('/admin/tools/inspection-quote')}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Inspection & Quote
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quote ID</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell>
                          <p className="font-mono font-medium">{quote.id.slice(0, 8)}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-semibold">{formatCurrency(quote.total_cents / 100)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(quote.status)}>
                            {quote.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(quote.created_at), { addSuffix: true })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/tools/inspection-quote/${quote.inspection_id || quote.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
