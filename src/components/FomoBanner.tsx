import { AlertTriangle, Clock } from "lucide-react";

interface FomoBannerProps {
  timeLeft: number;
  spotsLeft: number;
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function FomoBanner({
  timeLeft,
  spotsLeft,
}: FomoBannerProps) {
  return (
    <div className="bg-gradient-to-r from-roofing-emergency to-destructive text-white py-3 text-center font-bold flex flex-col sm:flex-row items-center justify-center gap-2">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span className="text-sm md:text-base">Next Available: 2-3 Weeks Out</span>
      </div>
      <span className="hidden sm:inline">•</span>
      <span className="text-sm md:text-base">Book now — Quality spreads by word of mouth</span>
    </div>
  );
}
