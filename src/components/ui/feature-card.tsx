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
        'hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:scale-[1.02] transition-all duration-300 h-full border-2',
        link && 'cursor-pointer',
        className
      )}
    >
      <CardContent
        className={cn(
          'p-4 md:p-6',
          variant === 'horizontal'
            ? 'flex items-start gap-4'
            : 'text-center'
        )}
      >
        {icon && (
          <div
            className={cn(
              variant === 'horizontal'
                ? 'flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary to-accent rounded-lg'
                : 'text-4xl mb-3'
            )}
          >
            {typeof icon === 'string' ? icon : icon}
          </div>
        )}

        <div className={cn(variant === 'horizontal' && 'flex-1')}>
          <h3 className="text-lg md:text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          {price && (
            <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {price}
            </div>
          )}
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
