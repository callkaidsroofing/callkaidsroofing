import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Sparkles } from 'lucide-react';

interface WorkItem {
  service: string;
  qty?: number;
  notes?: string;
}

interface RecommendedWorksData {
  workItems: WorkItem[];
}

interface RecommendedWorksStepProps {
  value: RecommendedWorksData;
  onChange: (data: RecommendedWorksData) => void;
}

export function RecommendedWorksStep({ value, onChange }: RecommendedWorksStepProps) {
  const addWorkItem = () => {
    onChange({
      workItems: [...value.workItems, { service: '', qty: undefined, notes: '' }],
    });
  };

  const updateWorkItem = (index: number, field: keyof WorkItem, val: any) => {
    const updated = [...value.workItems];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ workItems: updated });
  };

  const removeWorkItem = (index: number) => {
    onChange({
      workItems: value.workItems.filter((_, i) => i !== index),
    });
  };

  const templates = [
    'Replace broken tiles',
    'Rebed ridge caps',
    'Flexible repointing',
    'Install valley clips',
    'Replace valley irons',
    'Clean gutters',
    'Pressure wash roof',
    'Seal penetrations',
    'Full coating system',
  ];

  const addTemplate = (template: string) => {
    onChange({
      workItems: [...value.workItems, { service: template, qty: undefined, notes: '' }],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Recommended Works</h3>
          <p className="text-sm text-muted-foreground">
            Add repair/restoration items based on inspection findings
          </p>
        </div>
        <Button onClick={addWorkItem} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Card className="p-4 bg-primary/5 border-primary/20">
        <Label className="text-sm font-semibold mb-2 block">Quick Templates</Label>
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <Button
              key={t}
              variant="outline"
              size="sm"
              onClick={() => addTemplate(t)}
              className="text-xs"
            >
              + {t}
            </Button>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        {value.workItems.map((item, idx) => (
          <Card key={idx} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Item {idx + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWorkItem(idx)}
                  className="h-8 w-8 p-0 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <Label htmlFor={`service-${idx}`}>Service/Work Item</Label>
                  <Input
                    id={`service-${idx}`}
                    value={item.service}
                    onChange={(e) => updateWorkItem(idx, 'service', e.target.value)}
                    placeholder="e.g., Replace broken tiles"
                  />
                </div>
                <div>
                  <Label htmlFor={`qty-${idx}`}>Quantity</Label>
                  <Input
                    id={`qty-${idx}`}
                    type="number"
                    value={item.qty || ''}
                    onChange={(e) =>
                      updateWorkItem(idx, 'qty', parseInt(e.target.value) || undefined)
                    }
                    placeholder="12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`notes-${idx}`}>Notes</Label>
                <Textarea
                  id={`notes-${idx}`}
                  value={item.notes || ''}
                  onChange={(e) => updateWorkItem(idx, 'notes', e.target.value)}
                  placeholder="Additional details..."
                  rows={2}
                />
              </div>
            </div>
          </Card>
        ))}

        {value.workItems.length === 0 && (
          <Card className="p-8 text-center border-dashed">
            <p className="text-muted-foreground mb-4">
              No work items yet. Add items from templates or create custom ones.
            </p>
            <Button onClick={addWorkItem} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Item
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
