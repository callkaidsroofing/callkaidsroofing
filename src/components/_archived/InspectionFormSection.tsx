import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InspectionFormSectionProps {
  title: string;
  sectionNumber: number;
  children: ReactNode;
}

export const InspectionFormSection = ({ 
  title, 
  sectionNumber, 
  children 
}: InspectionFormSectionProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-lg flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {sectionNumber}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
};
