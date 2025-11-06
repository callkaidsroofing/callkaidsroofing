import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status?: 'active' | 'pending' | 'disabled';
  metrics?: Array<{
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  children?: React.ReactNode;
  className?: string;
}

export function AIModuleCard({
  title,
  description,
  icon: Icon,
  status = 'active',
  metrics,
  children,
  className
}: AIModuleCardProps) {
  const statusColors = {
    active: 'bg-green-500/10 text-green-700 border-green-500/20',
    pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    disabled: 'bg-gray-500/10 text-gray-700 border-gray-500/20'
  };

  const statusLabels = {
    active: 'Active',
    pending: 'Pending Setup',
    disabled: 'Disabled'
  };

  return (
    <Card className={cn('border-l-4 border-l-[#007ACC] hover:shadow-lg transition-shadow', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#007ACC]/10">
              <Icon className="h-5 w-5 text-[#007ACC]" />
            </div>
            <div>
              <CardTitle className="text-lg text-[#0B3B69]">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        </div>
      </CardHeader>
      
      {(metrics || children) && (
        <CardContent>
          {metrics && metrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {metrics.map((metric, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold text-[#0B3B69]">{metric.value}</p>
                  {metric.trend && (
                    <p className={cn(
                      'text-xs',
                      metric.trend === 'up' && 'text-green-600',
                      metric.trend === 'down' && 'text-red-600',
                      metric.trend === 'neutral' && 'text-gray-600'
                    )}>
                      {metric.trend === 'up' && '↑'}
                      {metric.trend === 'down' && '↓'}
                      {metric.trend === 'neutral' && '→'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          {children}
        </CardContent>
      )}
    </Card>
  );
}