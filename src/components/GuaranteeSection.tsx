import { Shield, CheckCircle, FileText, Clock } from "lucide-react";
import { Container } from "@/components/ui/section-wrapper";

const guarantees = [
  {
    icon: Shield,
    title: "15-Year Workmanship Warranty",
    description: "All restoration and painting work covered for 15 years",
  },
  {
    icon: CheckCircle,
    title: "Materials Guaranteed",
    description: "Dulux AcraTex membrane with manufacturer warranty",
  },
  {
    icon: FileText,
    title: "Written Documentation",
    description: "Detailed warranty certificate provided after completion",
  },
  {
    icon: Clock,
    title: "Lifetime Support",
    description: "Free advice and inspections for warranty period",
  },
];

export const GuaranteeSection = () => {
  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 border border-white/20 rounded-3xl p-8 md:p-12">
      <Container>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-conversion-blue to-conversion-cyan rounded-2xl mb-4 shadow-[0_0_30px_rgba(0,212,255,0.4)]">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Our Guarantee
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            We stand behind our work with industry-leading warranties and ongoing support
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-6 hover:bg-white/10 hover:border-conversion-cyan/40 transition-all group text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="h-7 w-7 text-conversion-cyan" />
                </div>

                <h3 className="font-bold text-white text-base mb-2 group-hover:text-conversion-cyan transition-colors">
                  {item.title}
                </h3>

                <p className="text-white/70 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-10 text-center">
          <div className="inline-flex flex-col items-center gap-3 backdrop-blur-md bg-white/10 border border-conversion-cyan/30 rounded-2xl p-6">
            <p className="text-white font-semibold text-lg">
              Questions about our warranty?
            </p>
            <a
              href="tel:0435900709"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-conversion-blue to-conversion-cyan text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Call 0435 900 709
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};
