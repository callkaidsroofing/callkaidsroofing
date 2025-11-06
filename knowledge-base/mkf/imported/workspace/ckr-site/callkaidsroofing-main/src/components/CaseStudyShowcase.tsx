import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Quote } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { caseStudies } from '@/data/caseStudies';

interface CaseStudyShowcaseProps {
  limit?: number;
  suburb?: string;
}

export const CaseStudyShowcase = ({ limit = 3, suburb }: CaseStudyShowcaseProps) => {
  let displayStudies = suburb 
    ? caseStudies.filter(cs => cs.suburb.toLowerCase().includes(suburb.toLowerCase()))
    : caseStudies;

  if (limit) {
    displayStudies = displayStudies.slice(0, limit);
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">*Proof In Every Roof*</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Real Projects, Real Results
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every project backed by photo evidence, detailed SOPs, and verified outcomes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStudies.map((study) => (
            <Card key={study.id} className="hover:shadow-lg transition-shadow">
              {study.afterImage && (
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <OptimizedImage
                    src={study.afterImage}
                    alt={`${study.jobType} in ${study.suburb}`}
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                  />
                  <Badge className="absolute top-3 right-3 bg-primary">
                    After
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{study.suburb}</span>
                </div>
                <CardTitle className="text-xl">{study.jobType}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Problem:</h4>
                  <p className="text-sm">{study.clientProblem}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Solution:</h4>
                  <p className="text-sm line-clamp-2">{study.solutionProvided}</p>
                </div>

                <div className="bg-primary/5 border-l-4 border-primary p-3 rounded">
                  <h4 className="font-semibold text-sm mb-1">Outcome:</h4>
                  <p className="text-sm">{study.keyOutcome}</p>
                </div>

                {study.testimonial && !study.testimonial.includes("No testimonial") && (
                  <div className="bg-muted p-3 rounded">
                    <Quote className="h-4 w-4 text-primary mb-2" />
                    <p className="text-sm italic text-muted-foreground">"{study.testimonial}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
