import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ConditionData {
  brokenTilesCaps?: string;
  brokenTilesNotes?: string;
  pointing?: string;
  pointingNotes?: string;
  valleyIrons?: string;
  valleyIronsNotes?: string;
  boxGutters?: string;
  boxGuttersNotes?: string;
  guttersDownpipes?: string;
  guttersDownpipesNotes?: string;
  penetrations?: string;
  penetrationsNotes?: string;
  internalLeaks?: string;
}

interface ConditionChecklistStepProps {
  value: ConditionData;
  onChange: (data: ConditionData) => void;
}

const ConditionItem = ({
  label,
  conditionKey,
  notesKey,
  value,
  onChange,
}: {
  label: string;
  conditionKey: string;
  notesKey: string;
  value: ConditionData;
  onChange: (data: ConditionData) => void;
}) => {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <Label className="text-base font-semibold">{label}</Label>
        <RadioGroup
          value={value[conditionKey as keyof ConditionData] as string || ''}
          onValueChange={(val) => onChange({ ...value, [conditionKey]: val })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Good" id={`${conditionKey}-good`} />
            <Label htmlFor={`${conditionKey}-good`} className="font-normal cursor-pointer">
              Good
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Fair" id={`${conditionKey}-fair`} />
            <Label htmlFor={`${conditionKey}-fair`} className="font-normal cursor-pointer">
              Fair
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Poor" id={`${conditionKey}-poor`} />
            <Label htmlFor={`${conditionKey}-poor`} className="font-normal cursor-pointer">
              Poor
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="N/A" id={`${conditionKey}-na`} />
            <Label htmlFor={`${conditionKey}-na`} className="font-normal cursor-pointer">
              N/A
            </Label>
          </div>
        </RadioGroup>
        <Textarea
          placeholder="Notes (defects, issues, observations)..."
          value={value[notesKey as keyof ConditionData] as string || ''}
          onChange={(e) => onChange({ ...value, [notesKey]: e.target.value })}
          rows={2}
        />
      </div>
    </Card>
  );
};

export function ConditionChecklistStep({ value, onChange }: ConditionChecklistStepProps) {
  const items = [
    { label: 'Broken Tiles/Caps', condition: 'brokenTilesCaps', notes: 'brokenTilesNotes' },
    { label: 'Pointing/Bedding', condition: 'pointing', notes: 'pointingNotes' },
    { label: 'Valley Irons', condition: 'valleyIrons', notes: 'valleyIronsNotes' },
    { label: 'Box Gutters', condition: 'boxGutters', notes: 'boxGuttersNotes' },
    { label: 'Gutters & Downpipes', condition: 'guttersDownpipes', notes: 'guttersDownpipesNotes' },
    { label: 'Penetrations (vents, pipes)', condition: 'penetrations', notes: 'penetrationsNotes' },
    { label: 'Internal Leaks Observed', condition: 'internalLeaks', notes: 'internalLeaksNotes' },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Roof Condition Checklist</h3>
        <p className="text-sm text-muted-foreground">
          Inspect each element and record condition + notes
        </p>
      </div>

      {items.map((item) => (
        <ConditionItem
          key={item.condition}
          label={item.label}
          conditionKey={item.condition}
          notesKey={item.notes}
          value={value}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
