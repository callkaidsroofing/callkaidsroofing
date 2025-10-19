import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataType: 'reports' | 'quotes' | 'leads';
  data: any[];
  onExport: (config: ExportConfig) => void;
}

export interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf';
  fields: string[];
  dateFrom?: string;
  dateTo?: string;
  includeHeaders: boolean;
}

const FIELD_OPTIONS = {
  reports: [
    { value: 'clientName', label: 'Client Name' },
    { value: 'siteAddress', label: 'Site Address' },
    { value: 'suburbPostcode', label: 'Suburb/Postcode' },
    { value: 'status', label: 'Status' },
    { value: 'priority', label: 'Priority' },
    { value: 'date', label: 'Inspection Date' },
    { value: 'created_at', label: 'Created Date' },
  ],
  quotes: [
    { value: 'quote_number', label: 'Quote Number' },
    { value: 'client_name', label: 'Client Name' },
    { value: 'site_address', label: 'Site Address' },
    { value: 'suburb_postcode', label: 'Suburb/Postcode' },
    { value: 'tier_level', label: 'Tier' },
    { value: 'total', label: 'Total Amount' },
    { value: 'status', label: 'Status' },
    { value: 'created_at', label: 'Created Date' },
    { value: 'valid_until', label: 'Valid Until' },
  ],
  leads: [
    { value: 'name', label: 'Name' },
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'suburb', label: 'Suburb' },
    { value: 'service', label: 'Service' },
    { value: 'status', label: 'Status' },
    { value: 'urgency', label: 'Urgency' },
    { value: 'source', label: 'Source' },
    { value: 'created_at', label: 'Created Date' },
  ],
};

export const ExportDialog = ({
  open,
  onOpenChange,
  dataType,
  data,
  onExport,
}: ExportDialogProps) => {
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>(
    FIELD_OPTIONS[dataType].map(f => f.value)
  );
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleSelectAll = () => {
    setSelectedFields(FIELD_OPTIONS[dataType].map(f => f.value));
  };

  const handleDeselectAll = () => {
    setSelectedFields([]);
  };

  const handleExport = () => {
    onExport({
      format,
      fields: selectedFields,
      dateFrom,
      dateTo,
      includeHeaders,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export {dataType.charAt(0).toUpperCase() + dataType.slice(1)}</DialogTitle>
          <DialogDescription>
            Customize your export settings and download in your preferred format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label>Export Format</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <Button
                variant={format === 'csv' ? 'default' : 'outline'}
                onClick={() => setFormat('csv')}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                variant={format === 'excel' ? 'default' : 'outline'}
                onClick={() => setFormat('excel')}
                className="w-full"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button
                variant={format === 'pdf' ? 'default' : 'outline'}
                onClick={() => setFormat('pdf')}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <Label>Date Range (Optional)</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <Label className="text-xs text-muted-foreground">From</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">To</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Fields to Include</Label>
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeselectAll}
                >
                  Deselect All
                </Button>
              </div>
            </div>
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
              {FIELD_OPTIONS[dataType].map((field) => (
                <div key={field.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.value}
                    checked={selectedFields.includes(field.value)}
                    onCheckedChange={() => handleFieldToggle(field.value)}
                  />
                  <label
                    htmlFor={field.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {field.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeHeaders"
              checked={includeHeaders}
              onCheckedChange={(checked) => setIncludeHeaders(checked as boolean)}
            />
            <label
              htmlFor="includeHeaders"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Include column headers
            </label>
          </div>

          {/* Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Records to export:</span>{' '}
              {data.length} {dataType}
            </p>
            <p className="text-sm">
              <span className="font-medium">Selected fields:</span>{' '}
              {selectedFields.length} of {FIELD_OPTIONS[dataType].length}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={selectedFields.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export {format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};