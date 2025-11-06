import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Send, FileDown, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

interface Quote {
  id: string;
  created_at: string;
  quote_number: string;
  client_name: string;
  service_type?: string;
  total_inc_gst?: number;
  status: string;
}

interface QuotesDataTableProps {
  quotes: Quote[];
  onSendQuote: (id: string) => void;
  onExportPDF: (id: string) => void;
}

type SortField = 'created_at' | 'client_name' | 'status' | 'total_inc_gst';
type SortDirection = 'asc' | 'desc';

export const QuotesDataTable = ({
  quotes,
  onSendQuote,
  onExportPDF,
}: QuotesDataTableProps) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'created_at') {
      aValue = new Date(a.created_at).getTime();
      bValue = new Date(b.created_at).getTime();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'default';
      case 'sent':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 font-semibold"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Quote #</TableHead>
            <TableHead>
              <SortButton field="client_name">Client</SortButton>
            </TableHead>
            <TableHead>Service</TableHead>
            <TableHead className="w-[120px]">
              <SortButton field="total_inc_gst">Total (inc GST)</SortButton>
            </TableHead>
            <TableHead className="w-[120px]">
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead className="w-[120px]">
              <SortButton field="created_at">Date</SortButton>
            </TableHead>
            <TableHead className="text-right w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedQuotes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No quotes found
              </TableCell>
            </TableRow>
          ) : (
            sortedQuotes.map((quote) => (
              <TableRow key={quote.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{quote.quote_number}</TableCell>
                <TableCell className="font-medium">{quote.client_name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {quote.service_type || 'N/A'}
                </TableCell>
                <TableCell className="font-medium">
                  {quote.total_inc_gst ? `$${quote.total_inc_gst.toFixed(2)}` : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(quote.status)}>
                    {quote.status || 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(quote.created_at), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/internal/quotes/${quote.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/internal/quote-builder?id=${quote.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSendQuote(quote.id)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onExportPDF(quote.id)}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
