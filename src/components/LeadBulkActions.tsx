import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Archive, Trash2, Download, MoreHorizontal, Tag, CheckCircle } from 'lucide-react';

interface LeadBulkActionsProps {
  selectedLeads: string[];
  onActionComplete: () => void;
  onClearSelection: () => void;
}

export function LeadBulkActions({
  selectedLeads,
  onActionComplete,
  onClearSelection,
}: LeadBulkActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleBulkDelete = async () => {
    try {
      setProcessing(true);

      const { error } = await supabase
        .from('leads')
        .delete()
        .in('id', selectedLeads);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Deleted ${selectedLeads.length} lead(s)`,
      });

      onActionComplete();
      onClearSelection();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete leads',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkStatusUpdate = async (newStage: string) => {
    try {
      setProcessing(true);

      const { error } = await supabase
        .from('leads')
        .update({ stage: newStage, updated_at: new Date().toISOString() })
        .in('id', selectedLeads);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Updated ${selectedLeads.length} lead(s) to ${newStage}`,
      });

      onActionComplete();
      onClearSelection();
    } catch (error) {
      console.error('Error updating leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to update leads',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setProcessing(true);

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .in('id', selectedLeads);

      if (error) throw error;

      // Create CSV content - use actual schema columns
      const headers = ['Name', 'Phone', 'Email', 'Suburb', 'Source', 'Stage', 'Created At'];
      const rows = (data || []).map((lead) => [
        lead.name || '',
        lead.phone || '',
        lead.email || '',
        lead.suburb || '',
        lead.source || '',
        lead.stage || '',
        new Date(lead.created_at).toLocaleDateString(),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: `Exported ${selectedLeads.length} lead(s)`,
      });

      onClearSelection();
    } catch (error) {
      console.error('Error exporting leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to export leads',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (selectedLeads.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
        <span className="text-sm font-medium">
          {selectedLeads.length} lead(s) selected
        </span>

        <div className="flex items-center gap-1 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={processing}>
                <Tag className="mr-2 h-4 w-4" />
                Change Stage
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleBulkStatusUpdate('contacted')}>
                Contacted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkStatusUpdate('qualified')}>
                Qualified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkStatusUpdate('quoted')}>
                Quoted
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleBulkStatusUpdate('won')}>
                Won
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkStatusUpdate('lost')}>
                Lost
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={processing}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={processing}
          >
            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
            Delete
          </Button>

          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            Clear
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedLeads.length} Lead(s)</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete these leads? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={processing}
              className="bg-destructive text-destructive-foreground"
            >
              {processing ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
