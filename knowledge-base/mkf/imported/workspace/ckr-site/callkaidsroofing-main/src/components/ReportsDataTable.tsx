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
import { Eye, Edit, FileDown, FileText, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

interface InspectionReport {
  id: string;
  created_at: string;
  clientName: string;
  siteAddress: string;
  suburbPostcode: string;
  status: string;
  priority: string;
  date: string;
}

interface ReportsDataTableProps {
  reports: InspectionReport[];
  onExportPDF: (id: string) => void;
  onGenerateQuote: (id: string) => void;
}

type SortField = 'date' | 'clientName' | 'status' | 'priority';
type SortDirection = 'asc' | 'desc';

export const ReportsDataTable = ({
  reports,
  onExportPDF,
  onGenerateQuote,
}: ReportsDataTableProps) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedReports = [...reports].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'date') {
      aValue = new Date(a.date || a.created_at).getTime();
      bValue = new Date(b.date || b.created_at).getTime();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'submitted':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      default:
        return 'secondary';
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
            <TableHead className="w-[120px]">
              <SortButton field="date">Date</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="clientName">Client</SortButton>
            </TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="w-[120px]">
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead className="w-[100px]">
              <SortButton field="priority">Priority</SortButton>
            </TableHead>
            <TableHead className="text-right w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedReports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No reports found
              </TableCell>
            </TableRow>
          ) : (
            sortedReports.map((report) => (
              <TableRow key={report.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {report.date ? format(new Date(report.date), 'dd/MM/yyyy') : 'N/A'}
                </TableCell>
                <TableCell className="font-medium">{report.clientName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {report.siteAddress}, {report.suburbPostcode}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(report.status)}>
                    {report.status || 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {report.priority && (
                    <Badge variant={getPriorityBadgeVariant(report.priority)}>
                      {report.priority}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/internal/reports/${report.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/internal/inspection?id=${report.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onExportPDF(report.id)}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onGenerateQuote(report.id)}
                    >
                      <FileText className="h-4 w-4" />
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