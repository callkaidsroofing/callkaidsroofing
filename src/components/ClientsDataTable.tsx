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
import { Eye, FileText, ClipboardCheck, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  suburb: string;
  created_at: string;
}

interface ClientsDataTableProps {
  clients: Client[];
  onNewQuote: (clientId: string) => void;
  onNewInspection: (clientId: string) => void;
}

type SortField = 'name' | 'suburb' | 'created_at';
type SortDirection = 'asc' | 'desc';

export const ClientsDataTable = ({
  clients,
  onNewQuote,
  onNewInspection,
}: ClientsDataTableProps) => {
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

  const sortedClients = [...clients].sort((a, b) => {
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
            <TableHead>
              <SortButton field="name">Name</SortButton>
            </TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>
              <SortButton field="suburb">Suburb</SortButton>
            </TableHead>
            <TableHead className="w-[120px]">
              <SortButton field="created_at">Added</SortButton>
            </TableHead>
            <TableHead className="text-right w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedClients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No clients found
              </TableCell>
            </TableRow>
          ) : (
            sortedClients.map((client) => (
              <TableRow key={client.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {client.email || 'N/A'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {client.suburb}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(client.created_at), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/internal/leads/${client.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNewQuote(client.id)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNewInspection(client.id)}
                    >
                      <ClipboardCheck className="h-4 w-4" />
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
