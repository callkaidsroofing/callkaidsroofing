import { Badge } from '@/components/ui/badge';
import { Shield, Award, Phone, Users } from 'lucide-react';

const ProofStrip = () => {
  const proofPoints = [
    {
      icon: <Shield className="h-5 w-5" />,
      text: "Fully Insured",
      subtext: "Public liability & workers comp"
    },
    {
      icon: <Award className="h-5 w-5" />,
      text: "10-Year Warranty",
      subtext: "On all workmanship"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      text: "Direct Owner Contact",
      subtext: "No call centers"
    },
    {
      icon: <Users className="h-5 w-5" />,
      text: "200+ Happy Customers",
      subtext: "Southeast Melbourne"
    }
  ];

  return (
    <section className="py-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-y border-primary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {proofPoints.map((point, index) => (
            <div key={index} className="text-center">
              <Badge variant="outline" className="inline-flex items-center gap-2 p-3 bg-white/80 backdrop-blur-sm border-primary/30">
                <div className="text-primary">
                  {point.icon}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">{point.text}</div>
                  <div className="text-xs text-muted-foreground">{point.subtext}</div>
                </div>
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProofStrip;