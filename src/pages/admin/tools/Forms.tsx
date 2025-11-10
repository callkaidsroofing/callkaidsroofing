import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { PremiumPageHeader } from "@/components/admin/PremiumPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormRenderer } from "@/components/FormRenderer";
import { FileText, FileCheck, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface FormDefinition {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  version: number;
}

export default function Forms() {
  const [forms, setForms] = useState<FormDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { handleError } = useErrorHandler();
  const navigate = useNavigate();

  useEffect(() => {
    loadPublishedForms();
  }, []);

  const loadPublishedForms = async () => {
    try {
      const { data, error } = await supabase
        .from("form_definitions")
        .select("id, name, description, created_at, version")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (err: any) {
      handleError(err, "Loading published forms");
    } finally {
      setLoading(false);
    }
  };

  const handleFormClick = (form: FormDefinition) => {
    setSelectedForm(form);
    setShowDialog(true);
  };

  const handleFormSuccess = () => {
    setShowDialog(false);
    setSelectedForm(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <PremiumPageHeader
        title="Published Forms"
        description="Access and fill out published workflow forms"
        icon={FileText}
      />

      <div className="container mx-auto px-4 py-8">
        {forms.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Published Forms</h3>
              <p className="text-muted-foreground mb-4">
                There are no published forms available yet.
              </p>
              <Button onClick={() => navigate("/admin/settings/forms")}>
                Go to Forms Builder
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card
                key={form.id}
                className="border-border/50 bg-card/50 backdrop-blur hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group"
                onClick={() => handleFormClick(form)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileCheck className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded">
                      v{form.version}
                    </span>
                  </div>
                  <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                    {form.name}
                  </CardTitle>
                  {form.description && (
                    <CardDescription className="line-clamp-2">
                      {form.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created {formatDistanceToNow(new Date(form.created_at), { addSuffix: true })}
                  </div>
                  <Button 
                    className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFormClick(form);
                    }}
                  >
                    Fill Out Form
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedForm && (
            <FormRenderer
              formId={selectedForm.id}
              onSuccess={handleFormSuccess}
              enablePdfExport
              workflowStyle
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
