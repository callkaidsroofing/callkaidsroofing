import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuoteTierCardProps {
  tier: "essential" | "premium" | "complete";
  title: string;
  description: string;
  features: string[];
  onGenerate: () => void;
  loading?: boolean;
  recommended?: boolean;
}

export function QuoteTierCard({
  tier,
  title,
  description,
  features,
  onGenerate,
  loading,
  recommended,
}: QuoteTierCardProps) {
  return (
    <Card className={cn("p-4 h-full flex flex-col gap-4", recommended && "ring-2 ring-primary")}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide">{tier}</p>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {recommended && <Badge variant="secondary">Recommended</Badge>}
      </div>

      <p className="text-sm text-muted-foreground">{description}</p>

      <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside flex-1">
        {features.map(feature => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <Button onClick={onGenerate} disabled={loading} aria-label={`Generate ${title} quote`}>
        {loading ? "Generating..." : "Generate with AI"}
      </Button>
    </Card>
  );
}
