import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon?: string | ReactNode;
  title: string;
  description: string;
  price?: string;
  link?: string;
  variant?: 'default' | 'compact' | 'horizontal';
  className?: string;
}

/**
 * Reusable Feature/Service Card
 * Design System: Consistent card styling with hover effects
 */
export const FeatureCard = ({
  icon,
  title,
  description,
  price,
  link,
  variant = 'default',
  className,
}: FeatureCardProps) => {
  const content = (
    <Card
      className={cn(
        'border-border/50 bg-card/50 backdrop-blur hover:shadow-lg hover:border-primary/40 hover:scale-[1.02] transition-all duration-300 h-full group',
        link && 'cursor-pointer',
        className
      )}
    >
      <CardContent
        className={cn(
          'p-5',
          variant === 'horizontal'
            ? 'flex items-start gap-4'
            : 'flex flex-col items-center text-center'
        )}
      >
        {icon && (
          <div
            className={cn(
              variant === 'horizontal'
                ? 'flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-lg'
                : 'w-14 h-14 mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'
            )}
          >
            {typeof icon === 'string' ? (
              <span className="text-2xl">{icon}</span>
            ) : (
              <div className="text-white">{icon}</div>
            )}
          </div>
        )}

        <div className={cn(variant === 'horizontal' && 'flex-1', 'flex flex-col')}>
          <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors">{title}</h3>
          
          {price && (
            <p className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              {price}
            </p>
          )}
          
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (link) {
    return (
      <Link to={link} className="block group">
        {content}
      </Link>
    );
  }

  return content;
};
