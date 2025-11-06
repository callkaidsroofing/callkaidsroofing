import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, FileDown, FileText } from 'lucide-react';
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

interface ReportCardProps {
  report: InspectionReport;
  onView: () => void;
  onEdit: () => void;
  onExportPDF: () => void;
  onGenerateQuote: () => void;
}

export const ReportCard = ({
  report,
  onView,
  onEdit,
  onExportPDF,
  onGenerateQuote,
}: ReportCardProps) => {
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

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header Row - Date and Badges */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">
            📅 {report.date ? format(new Date(report.date), 'dd/MM/yyyy') : 'N/A'}
          </p>
          <div className="flex gap-2">
            <Badge variant={getStatusBadgeVariant(report.status)}>
              {report.status || 'Draft'}
            </Badge>
            {report.priority && (
              <Badge variant={getPriorityBadgeVariant(report.priority)}>
                {report.priority}
              </Badge>
            )}
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-1">{report.clientName}</h3>
          <p className="text-sm text-muted-foreground">{report.siteAddress}</p>
          <p className="text-sm text-muted-foreground">{report.suburbPostcode}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={onView} className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit} className="w-full">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onExportPDF} className="w-full">
            <FileDown className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={onGenerateQuote} className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
