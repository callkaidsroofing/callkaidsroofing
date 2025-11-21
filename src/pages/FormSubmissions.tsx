import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowLeft, Eye, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function FormSubmissions() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formName, setFormName] = useState("");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (formId) {
      loadData();
    }
  }, [formId]);

  const loadData = async () => {
    try {
      // Load form definition
      const { data: formData, error: formError } = await supabase
        .from("form_definitions")
        .select("name")
        .eq("id", formId)
        .single();

      if (formError) throw formError;
      setFormName(formData.name);

      // Load submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from("form_submissions")
        .select("*")
        .eq("form_id", formId)
        .order("created_at", { ascending: false });

      if (submissionsError) throw submissionsError;
      setSubmissions(submissionsData || []);
    } catch (err: any) {
      handleError(err, "Loading submissions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/settings/forms')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Form Submissions</h1>
          <p className="text-muted-foreground">{formName}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {submissions.length} Submission{submissions.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No submissions yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      {format(new Date(submission.created_at), "dd MMM yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      {submission.submitted_by || "Anonymous"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Submission Details</SheetTitle>
          </SheetHeader>
          {selectedSubmission && (
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">
                  {format(new Date(selectedSubmission.created_at), "dd MMM yyyy HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted By</p>
                <p className="font-medium">{selectedSubmission.submitted_by || "Anonymous"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Form Data</p>
                <Card>
                  <CardContent className="pt-6">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(selectedSubmission.submitted_data, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
