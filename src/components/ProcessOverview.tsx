import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Search, Wrench, Paintbrush, Shield } from 'lucide-react';

const ProcessOverview = () => {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Free Inspection",
      description: "Thorough roof assessment with photo documentation of all issues found"
    },
    {
      icon: <Wrench className="h-8 w-8 text-primary" />,
      title: "Clean & Repair",
      description: "High-pressure cleaning, tile replacement, and structural repairs as needed"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Rebed & Repoint",
      description: "Ridge caps rebedded with premium SupaPoint flexible pointing compound"
    },
    {
      icon: <Paintbrush className="h-8 w-8 text-primary" />,
      title: "Paint & Seal",
      description: "Premium Premcoat roof paint application with protective sealing"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Quality Check",
      description: "Final inspection with photo documentation and 15-year warranty certificate"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-secondary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our 5-Step Process</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every job follows the same proven process that's kept roofs leak-free for 10+ years
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 text-4xl font-bold text-primary/10">
                  {index + 1}
                </div>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors duration-300">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessOverview;