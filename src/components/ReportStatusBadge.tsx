import { Badge } from '@/components/ui/badge';

interface ReportStatusBadgeProps {
  status: string;
}

export const ReportStatusBadge = ({ status }: ReportStatusBadgeProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'submitted':
        return 'default';
      case 'under_review':
        return 'outline';
      case 'completed':
        return 'default';
      case 'archived':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-muted text-muted-foreground';
      case 'submitted':
        return 'bg-blue-500 text-white';
      case 'under_review':
        return 'bg-yellow-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      case 'archived':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'submitted':
        return 'Submitted';
      case 'under_review':
        return 'Under Review';
      case 'completed':
        return 'Completed';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  };

  return (
    <Badge variant={getStatusVariant(status)} className={getStatusColor(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
};
