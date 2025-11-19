import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ImageUploadField } from '@/components/ImageUploadField';

interface PhotoData {
  brokentilesphoto?: string[];
  pointingphoto?: string[];
  valleyironsphoto?: string[];
  boxguttersphoto?: string[];
  guttersphoto?: string[];
  penetrationsphoto?: string[];
  leaksphoto?: string[];
  beforedefects?: string[];
  duringafter?: string[];
}

interface PhotoEvidenceStepProps {
  value: PhotoData;
  onChange: (data: PhotoData) => void;
}

export function PhotoEvidenceStep({ value, onChange }: PhotoEvidenceStepProps) {
  const photoCategories = [
    { label: 'Before/Defects Overview', key: 'beforedefects' },
    { label: 'Broken Tiles/Caps', key: 'brokentilesphoto' },
    { label: 'Pointing/Bedding', key: 'pointingphoto' },
    { label: 'Valley Irons', key: 'valleyironsphoto' },
    { label: 'Box Gutters', key: 'boxguttersphoto' },
    { label: 'Gutters & Downpipes', key: 'guttersphoto' },
    { label: 'Penetrations', key: 'penetrationsphoto' },
    { label: 'Internal Leaks', key: 'leaksphoto' },
    { label: 'During/After Work', key: 'duringafter' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Photo Evidence</h3>
        <p className="text-sm text-muted-foreground">
          Upload photos organized by defect type (optional but recommended)
        </p>
      </div>

      {photoCategories.map((cat) => (
        <Card key={cat.key} className="p-4">
          <ImageUploadField
            label={cat.label}
            name={cat.key}
            value={value[cat.key as keyof PhotoData] || []}
            onChange={(name, urls) => onChange({ ...value, [name]: urls })}
          />
        </Card>
      ))}
    </div>
  );
}
