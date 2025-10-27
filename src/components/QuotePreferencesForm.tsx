import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface QuotePreferences {
  gstDisplay: "inclusive" | "exclusive";
  clientType: "homeowner" | "contractor" | "insurance" | "property_manager";
  budgetLevel: "budget" | "standard" | "premium";
  gutterCleaningPreference: "free" | "priced" | "auto";
  washPaintPreference: "combined" | "separate";
  ridgeMeasurement: "caps" | "lm" | "both";
  specialRequirements: string;
  region?: "Metro" | "Outer-SE" | "Rural";
}

interface QuotePreferencesFormProps {
  preferences: QuotePreferences;
  onChange: (preferences: QuotePreferences) => void;
}

export function QuotePreferencesForm({ preferences, onChange }: QuotePreferencesFormProps) {
  const updatePreference = <K extends keyof QuotePreferences>(
    key: K,
    value: QuotePreferences[K]
  ) => {
    onChange({ ...preferences, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* GST Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            GST Display
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Inclusive shows total with GST included. Exclusive shows subtotal + GST breakdown.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>How should GST be displayed in the quote?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={preferences.gstDisplay}
            onValueChange={(value) => updatePreference("gstDisplay", value as "inclusive" | "exclusive")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inclusive" id="gst-inclusive" />
              <Label htmlFor="gst-inclusive" className="cursor-pointer">
                GST Inclusive (total price shown)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="exclusive" id="gst-exclusive" />
              <Label htmlFor="gst-exclusive" className="cursor-pointer">
                GST Exclusive (subtotal + GST breakdown)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Client Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client Type</CardTitle>
          <CardDescription>This helps adjust pricing strategy and scope</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={preferences.clientType}
            onValueChange={(value) => updatePreference("clientType", value as QuotePreferences["clientType"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="homeowner">Homeowner (Direct)</SelectItem>
              <SelectItem value="contractor">Contractor / Subcontractor</SelectItem>
              <SelectItem value="insurance">Insurance Work</SelectItem>
              <SelectItem value="property_manager">Property Manager</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Budget Level */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Budget Positioning</CardTitle>
          <CardDescription>Guide the quote pricing within min/max ranges</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={preferences.budgetLevel}
            onValueChange={(value) => updatePreference("budgetLevel", value as QuotePreferences["budgetLevel"])}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="budget" id="budget-low" />
              <Label htmlFor="budget-low" className="cursor-pointer">
                Budget - Competitive pricing (use rate_min)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="budget-mid" />
              <Label htmlFor="budget-mid" className="cursor-pointer">
                Standard - Mid-range pricing (average of min/max)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="premium" id="budget-high" />
              <Label htmlFor="budget-high" className="cursor-pointer">
                Premium - Maximum value pricing (use rate_max)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Gutter Cleaning */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Gutter Cleaning Pricing
            <Badge variant="secondary" className="text-xs">Buffer Tool</Badge>
          </CardTitle>
          <CardDescription>Usually free, but can be priced for budget jobs or disproportionate work</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={preferences.gutterCleaningPreference}
            onValueChange={(value) => updatePreference("gutterCleaningPreference", value as QuotePreferences["gutterCleaningPreference"])}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="free" id="gutter-free" />
              <Label htmlFor="gutter-free" className="cursor-pointer">
                Always Free (include as complimentary service)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="priced" id="gutter-priced" />
              <Label htmlFor="gutter-priced" className="cursor-pointer">
                Always Priced (use as pricing buffer)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="auto" id="gutter-auto" />
              <Label htmlFor="gutter-auto" className="cursor-pointer">
                Auto (free for premium jobs, priced for budget/disproportionate)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Wash + Paint */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pressure Wash + Paint Pricing</CardTitle>
          <CardDescription>$5/m² wash + $15/m² paint = $20/m² combined</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={preferences.washPaintPreference}
            onValueChange={(value) => updatePreference("washPaintPreference", value as "combined" | "separate")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="combined" id="wash-combined" />
              <Label htmlFor="wash-combined" className="cursor-pointer">
                Combined ($18-22/m² single line item)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="separate" id="wash-separate" />
              <Label htmlFor="wash-separate" className="cursor-pointer">
                Separate (Wash $4-6/m², Paint $14-16/m²)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Ridge Measurement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ridge Measurement Display</CardTitle>
          <CardDescription>Quote shows per ridge cap, but can calculate from LM</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={preferences.ridgeMeasurement}
            onValueChange={(value) => updatePreference("ridgeMeasurement", value as QuotePreferences["ridgeMeasurement"])}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="caps" id="ridge-caps" />
              <Label htmlFor="ridge-caps" className="cursor-pointer">
                Per Ridge Cap ($23-28/cap) - Preferred
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lm" id="ridge-lm" />
              <Label htmlFor="ridge-lm" className="cursor-pointer">
                Per Linear Meter ($75-85/LM)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="ridge-both" />
              <Label htmlFor="ridge-both" className="cursor-pointer">
                Show Both (caps primary, LM in description)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Regional Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Regional Pricing Modifier
            <Badge variant="secondary" className="text-xs">KF_02 v7.1</Badge>
          </CardTitle>
          <CardDescription>
            Applies regional uplift: Metro (1.0x), Outer-SE (1.05x), Rural (1.10x)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={preferences.region || "Metro"}
            onValueChange={(value) => updatePreference("region", value as QuotePreferences["region"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Metro">Metro (1.0x) - Default</SelectItem>
              <SelectItem value="Outer-SE">Outer South-East (1.05x)</SelectItem>
              <SelectItem value="Rural">Rural (1.10x)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            Based on {preferences.region || "Metro"}, rates will be adjusted by{" "}
            {preferences.region === "Outer-SE" ? "5%" : preferences.region === "Rural" ? "10%" : "0%"}.
          </p>
        </CardContent>
      </Card>

      {/* Special Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Special Requirements</CardTitle>
          <CardDescription>Any custom notes or adjustments for this quote?</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={preferences.specialRequirements}
            onChange={(e) => updatePreference("specialRequirements", e.target.value)}
            placeholder="e.g., Customer wants specific tile colour match, urgent timeline, matching existing work, etc."
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
}
