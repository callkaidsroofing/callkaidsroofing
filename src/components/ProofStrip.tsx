import { Badge } from '@/components/ui/badge';
import { Shield, Award, Phone, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const ProofStrip = () => {
  const proofPoints = [
    {
      icon: <Shield className="h-5 w-5" />,
      text: "Fully Insured",
      subtext: "Public liability & workers comp"
    },
    {
      icon: <Award className="h-5 w-5" />,
      text: "15-Year Warranty",
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
    <section className="py-8 bg-gradient-to-r from-electric-bright/10 via-steel-light/10 to-chrome/10 border-y border-electric-bright/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {proofPoints.map((point, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Badge 
                variant="outline" 
                className="inline-flex items-center gap-2 p-3 bg-white/90 backdrop-blur-md border-electric-bright/40 shadow-electric hover:shadow-steel transition-all"
              >
                <div className="text-electric-bright">
                  {point.icon}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm text-charcoal">{point.text}</div>
                  <div className="text-xs text-steel-dark">{point.subtext}</div>
                </div>
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProofStrip;