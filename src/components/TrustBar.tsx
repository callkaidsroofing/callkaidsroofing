import { Shield, Users, Award, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TrustStat {
  icon: typeof Shield;
  value: string;
  label: string;
}

export const TrustBar = () => {
  const trustStats: TrustStat[] = [
    {
      icon: Users,
      value: "200+",
      label: "Roofs Restored",
    },
    {
      icon: Star,
      value: "5/5",
      label: "Google Rating",
    },
    {
      icon: Shield,
      value: "15-Year",
      label: "Warranty",
    },
    {
      icon: Award,
      value: "Licensed",
      label: "& Insured",
    },
  ];

  return (
    <div className="backdrop-blur-md bg-white/10 border-y border-white/20 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center group hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 mb-3 bg-gradient-to-br from-conversion-blue to-conversion-cyan rounded-full flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] transition-shadow">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1">
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
