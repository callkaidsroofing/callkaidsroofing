import { Shield, Users, Award, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CLAIMS } from "@/config/business";

interface TrustStat {
  icon: typeof Shield;
  value: string;
  label: string;
}

export const TrustBar = () => {
  const trustStats: TrustStat[] = [
    {
      icon: Users,
      value: `${CLAIMS.reviews.count}`,
      label: "Google Reviews",
    },
    {
      icon: Star,
      value: `${CLAIMS.reviews.rating}/5`,
      label: "Google Rating",
    },
    {
      icon: Shield,
      value: "10-Year",
      label: "Workmanship",
    },
    {
      icon: Award,
      value: "Licensed",
      label: "& Insured",
    },
  ];

  return (
    <div className="backdrop-blur-md bg-white/10 border-y border-white/20 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 mb-4 bg-gradient-to-br from-conversion-blue to-conversion-cyan rounded-full flex items-center justify-center transition-shadow">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-white/70 font-semibold">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
