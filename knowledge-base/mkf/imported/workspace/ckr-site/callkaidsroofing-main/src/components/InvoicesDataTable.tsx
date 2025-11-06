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
import { Eye, Edit, Send, FileDown, CheckCircle, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  created_at: string;
  invoice_number: string;
  client_name: string;
  total: number;
  balance_due: number;
  status: string;
  due_date: string;
}

interface InvoicesDataTableProps {
  invoices: Invoice[];
  onSendInvoice: (id: string) => void;
  onMarkPaid: (id: string) => void;
  onExportPDF: (id: string) => void;
}

type SortField = 'due_date' | 'client_name' | 'status' | 'total';
type SortDirection = 'asc' | 'desc';

export const InvoicesDataTable = ({
  invoices,
  onSendInvoice,
  onMarkPaid,
  onExportPDF,
}: InvoicesDataTableProps) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('due_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'due_date') {
      aValue = new Date(a.due_date).getTime();
      bValue = new Date(b.due_date).getTime();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'default';
      case 'sent':
        return 'secondary';
      case 'overdue':
        return 'destructive';
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
            <TableHead className="w-[120px]">Invoice #</TableHead>
            <TableHead>
              <SortButton field="client_name">Client</SortButton>
            </TableHead>
            <TableHead className="w-[120px]">
              <SortButton field="total">Total</SortButton>
            </TableHead>
            <TableHead className="w-[120px]">Balance Due</TableHead>
            <TableHead className="w-[120px]">
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead className="w-[120px]">
              <SortButton field="due_date">Due Date</SortButton>
            </TableHead>
            <TableHead className="text-right w-[220px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInvoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No invoices found
              </TableCell>
            </TableRow>
          ) : (
            sortedInvoices.map((invoice) => (
              <TableRow key={invoice.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                <TableCell className="font-medium">{invoice.client_name}</TableCell>
                <TableCell className="font-medium">${invoice.total.toFixed(2)}</TableCell>
                <TableCell className="font-medium">${invoice.balance_due.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(invoice.status)}>
                    {invoice.status || 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(invoice.due_date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/internal/invoices/${invoice.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/internal/invoices/edit/${invoice.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSendInvoice(invoice.id)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkPaid(invoice.id)}
                      disabled={invoice.status === 'paid'}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onExportPDF(invoice.id)}
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
