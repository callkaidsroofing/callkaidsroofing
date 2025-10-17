import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Sparkles } from "lucide-react";

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
    <Card className={`relative ${recommended ? "border-primary shadow-lg" : ""}`}>
      {recommended && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
          <Sparkles className="h-3 w-3 mr-1" />
          Recommended
        </Badge>
      )}
      
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          onClick={onGenerate}
          disabled={loading}
          className="w-full"
          variant={recommended ? "default" : "outline"}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate {tier}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
