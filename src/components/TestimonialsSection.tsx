import { Quote } from "lucide-react";
import { Container } from "@/components/ui/section-wrapper";

const testimonials = [
  {
    name: "Sarah M.",
    suburb: "Berwick",
    rating: 5,
    text: "Kaidyn restored our 20-year-old tile roof. Looks brand new! No sales pressure, just honest advice and quality work.",
    service: "Roof Restoration",
  },
  {
    name: "James L.",
    suburb: "Narre Warren",
    rating: 5,
    text: "Fixed our valley leak within 48 hours. Professional service, fair pricing. Highly recommend for emergency repairs.",
    service: "Emergency Repairs",
  },
  {
    name: "Michelle T.",
    suburb: "Cranbourne",
    rating: 5,
    text: "Best roofing experience. Direct contact with owner, detailed quote, clean worksite. The 15-year warranty sealed the deal.",
    service: "Roof Painting",
  },
];

export const TestimonialsSection = () => {
  return (
    <Container>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          What Customers Say
        </h2>
        <p className="text-white/70 text-lg">Real reviews from SE Melbourne homeowners</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6 hover:bg-white/10 hover:border-conversion-cyan/40 transition-all group relative"
          >
            {/* Quote icon */}
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-conversion-blue to-conversion-cyan rounded-full flex items-center justify-center shadow-lg">
              <Quote className="h-5 w-5 text-white" />
            </div>

            {/* Rating stars */}
            <div className="flex gap-1 mb-4 pt-2">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">★</span>
              ))}
            </div>

            {/* Testimonial text */}
            <p className="text-white/90 text-sm leading-relaxed mb-6 italic">
              "{testimonial.text}"
            </p>

            {/* Customer info */}
            <div className="border-t border-white/20 pt-4">
              <div className="font-bold text-white text-base mb-1">
                {testimonial.name}
              </div>
              <div className="text-white/60 text-xs mb-2">
                {testimonial.suburb} • {testimonial.service}
              </div>
            </div>

            {/* Verified badge */}
            <div className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 mt-2">
              <span className="text-green-400 text-xs font-semibold">✓ Verified Customer</span>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};
