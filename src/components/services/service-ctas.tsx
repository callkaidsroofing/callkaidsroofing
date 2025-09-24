import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export type ServiceCtaVariant = 'primary' | 'secondary' | 'tertiary';

export interface ServiceCta {
  label: string;
  href: string;
  variant: ServiceCtaVariant;
}

interface ServiceCtasProps {
  ctas: ServiceCta[];
  align?: 'left' | 'center' | 'stretch';
  className?: string;
}

const mapVariantToButton = (variant: ServiceCtaVariant): {
  variant: ButtonProps['variant'];
  className?: string;
} => {
  switch (variant) {
    case 'primary':
      return { variant: 'default' };
    case 'secondary':
      return { variant: 'outline', className: 'border-primary/40 text-primary hover:text-primary' };
    case 'tertiary':
      return { variant: 'link', className: 'text-primary font-semibold' };
    default:
      return { variant: 'default' };
  }
};

const ServiceCtas = ({ ctas, align = 'left', className }: ServiceCtasProps) => {
  const isCenter = align === 'center';
  const isStretch = align === 'stretch';
  const containerClasses = cn(
    'flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center',
    isCenter && 'sm:justify-center',
    !isCenter && !isStretch && 'sm:justify-start',
    isStretch && 'sm:justify-start sm:[&>*]:flex-1',
    className
  );

  return (
    <div className={containerClasses}>
      {ctas.map((cta) => {
        const { variant, className: variantClassName } = mapVariantToButton(cta.variant);
        const isTel = cta.href.startsWith('tel:');
        const buttonClassName = cn(variantClassName, 'min-w-[200px] text-center');

        if (isTel) {
          return (
            <Button key={cta.label} variant={variant} size="lg" asChild className={buttonClassName}>
              <a href={cta.href}>{cta.label}</a>
            </Button>
          );
        }

        if (cta.href.startsWith('http')) {
          return (
            <Button key={cta.label} variant={variant} size="lg" asChild className={buttonClassName}>
              <a href={cta.href}>{cta.label}</a>
            </Button>
          );
        }

        return (
          <Button key={cta.label} variant={variant} size="lg" asChild className={buttonClassName}>
            <Link to={cta.href}>{cta.label}</Link>
          </Button>
        );
      })}
    </div>
  );
};

export { ServiceCtas };
