import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ReviewData {
  overallCondition?: string;
  priority?: string;
  overallConditionNotes?: string;
  status?: string;
}

interface ReviewSubmitStepProps {
  value: ReviewData;
  onChange: (data: ReviewData) => void;
  reportData: any;
}

export function ReviewSubmitStep({ value, onChange, reportData }: ReviewSubmitStepProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Report Summary</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="overallCondition">Overall Condition</Label>
              <Select
                value={value.overallCondition || ''}
                onValueChange={(val) => onChange({ ...value, overallCondition: val })}
              >
                <SelectTrigger id="overallCondition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select
                value={value.priority || ''}
                onValueChange={(val) => onChange({ ...value, priority: val })}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="overallConditionNotes">Summary Notes</Label>
            <Textarea
              id="overallConditionNotes"
              value={value.overallConditionNotes || ''}
              onChange={(e) => onChange({ ...value, overallConditionNotes: e.target.value })}
              placeholder="Overall findings, key concerns, recommendations..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="status">Report Status</Label>
            <Select
              value={value.status || 'draft'}
              onValueChange={(val) => onChange({ ...value, status: val })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-4">Report Preview</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Client:</span>
            <span className="font-medium">{reportData.clientSite?.clientName || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Site Address:</span>
            <span className="font-medium">{reportData.clientSite?.siteAddress || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cladding Type:</span>
            <span className="font-medium">{reportData.roofDetails?.claddingType || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Roof Area:</span>
            <span className="font-medium">
              {reportData.measurements?.roofArea ? `${reportData.measurements.roofArea} m²` : 'Not set'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Work Items:</span>
            <span className="font-medium">
              {reportData.recommendedWorks?.workItems?.length || 0} items
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Photos Uploaded:</span>
            <span className="font-medium">
              {Object.values(reportData.photos || {}).flat().length} photos
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
