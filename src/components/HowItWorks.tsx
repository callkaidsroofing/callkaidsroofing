import { Phone, Calendar, CheckCircle } from "lucide-react";
import { Container } from "@/components/ui/section-wrapper";

const steps = [
  {
    icon: Phone,
    step: "1",
    title: "Call or Submit Quote",
    description: "Speak directly with owner Kaidyn. No sales teams, no pressure.",
  },
  {
    icon: Calendar,
    step: "2",
    title: "Free Roof Inspection",
    description: "We assess your roof and provide a detailed quote with photos.",
  },
  {
    icon: CheckCircle,
    step: "3",
    title: "Professional Work",
    description: "Licensed team completes the job. 15-year warranty included.",
  },
];

export const HowItWorks = () => {
  return (
    <Container>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Simple Process
        </h2>
        <p className="text-white/70 text-lg">From call to completion in 3 steps</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connection lines (desktop only) */}
        <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-conversion-cyan/30 to-transparent -z-10" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="relative backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6 hover:bg-white/10 hover:border-conversion-cyan/40 transition-all group"
            >
              {/* Step number badge */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-conversion-blue to-conversion-cyan rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                {step.step}
              </div>

              <div className="flex flex-col items-center text-center pt-2">
                <div className="w-16 h-16 mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="h-8 w-8 text-conversion-cyan" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-conversion-cyan transition-colors">
                  {step.title}
                </h3>

                <p className="text-white/70 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
};
