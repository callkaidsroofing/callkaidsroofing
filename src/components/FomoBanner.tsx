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
    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-2 text-center font-bold flex items-center justify-center gap-2">
      <AlertTriangle className="h-5 w-5" />
      <span>
        {spotsLeft} emergency spots left today — offer ends in {formatTime(timeLeft)}
      </span>
      <Clock className="h-5 w-5" />
    </div>
  );
}
