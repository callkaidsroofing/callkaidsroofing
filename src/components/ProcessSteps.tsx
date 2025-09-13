import { CheckCircle, Camera, Brush, Wrench, FileCheck } from 'lucide-react';

export const ProcessSteps = () => {
  const steps = [
    {
      icon: Camera,
      title: "Inspect",
      description: "25-point photo inspection with detailed condition report"
    },
    {
      icon: Wrench,
      title: "Clean/Repair", 
      description: "High-pressure clean and fix any damage or loose tiles"
    },
    {
      icon: Brush,
      title: "Repoint/Repaint",
      description: "Premium materials applied with 10-year warranty"
    },
    {
      icon: FileCheck,
      title: "Final Photos + Warranty",
      description: "Complete documentation and comprehensive warranty certificate"
    }
  ];

  return (
    <section className="section-padding bg-muted/20">
      <div className="container-max mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Our Proven 4-Step Process</h2>
          <p className="text-xl text-muted-foreground text-column mx-auto">
            Every roof restoration follows the same meticulous process for consistent, quality results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center space-y-4">
                <div className="relative">
                  <div className="mx-auto w-20 h-20 primary-gradient rounded-full flex items-center justify-center">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;