import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface QuotePreferences {
  gstDisplay: "inclusive" | "exclusive";
  clientType: "homeowner" | "builder" | "commercial";
  budgetLevel: "standard" | "value" | "premium";
  gutterCleaningPreference: "auto" | "include" | "exclude";
  washPaintPreference: "combined" | "separate";
  ridgeMeasurement: "caps" | "linear";
  specialRequirements: string;
}

interface QuotePreferencesFormProps {
  preferences: QuotePreferences;
  onChange: (prefs: QuotePreferences) => void;
}

export function QuotePreferencesForm({ preferences, onChange }: QuotePreferencesFormProps) {
  const updatePreference = <K extends keyof QuotePreferences>(key: K, value: QuotePreferences[K]) => {
    onChange({ ...preferences, [key]: value });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="gstDisplay">GST Display</Label>
          <Select
            value={preferences.gstDisplay}
            onValueChange={value => updatePreference("gstDisplay", value as QuotePreferences["gstDisplay"])}
          >
            <SelectTrigger id="gstDisplay">
              <SelectValue placeholder="Select GST display" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inclusive">GST Inclusive</SelectItem>
              <SelectItem value="exclusive">GST Exclusive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientType">Client Type</Label>
          <Select
            value={preferences.clientType}
            onValueChange={value => updatePreference("clientType", value as QuotePreferences["clientType"])}
          >
            <SelectTrigger id="clientType">
              <SelectValue placeholder="Select client type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="homeowner">Homeowner</SelectItem>
              <SelectItem value="builder">Builder</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetLevel">Budget Level</Label>
          <Select
            value={preferences.budgetLevel}
            onValueChange={value => updatePreference("budgetLevel", value as QuotePreferences["budgetLevel"])}
          >
            <SelectTrigger id="budgetLevel">
              <SelectValue placeholder="Select budget level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value">Value</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gutterCleaning">Gutter Cleaning Preference</Label>
          <Select
            value={preferences.gutterCleaningPreference}
            onValueChange={value =>
              updatePreference("gutterCleaningPreference", value as QuotePreferences["gutterCleaningPreference"])
            }
          >
            <SelectTrigger id="gutterCleaning">
              <SelectValue placeholder="Select gutter cleaning preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto decide</SelectItem>
              <SelectItem value="include">Include by default</SelectItem>
              <SelectItem value="exclude">Exclude unless requested</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="washPaint">Wash/Paint Preference</Label>
          <Select
            value={preferences.washPaintPreference}
            onValueChange={value => updatePreference("washPaintPreference", value as QuotePreferences["washPaintPreference"])}
          >
            <SelectTrigger id="washPaint">
              <SelectValue placeholder="Select wash/paint preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="combined">Combine washing and painting</SelectItem>
              <SelectItem value="separate">Keep washing and painting separate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ridgeMeasurement">Ridge Measurement</Label>
          <Select
            value={preferences.ridgeMeasurement}
            onValueChange={value => updatePreference("ridgeMeasurement", value as QuotePreferences["ridgeMeasurement"])}
          >
            <SelectTrigger id="ridgeMeasurement">
              <SelectValue placeholder="Select ridge measurement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="caps">Ridge caps</SelectItem>
              <SelectItem value="linear">Linear metres</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequirements">Special Requirements</Label>
        <Textarea
          id="specialRequirements"
          value={preferences.specialRequirements}
          onChange={(event) => updatePreference("specialRequirements", event.target.value)}
          placeholder="Include any specific customer requests"
        />
      </div>
    </Card>
  );
}
