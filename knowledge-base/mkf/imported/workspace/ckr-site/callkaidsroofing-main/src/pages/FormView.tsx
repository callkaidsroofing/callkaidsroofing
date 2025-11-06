import { useParams } from "react-router-dom";
import { FormRenderer } from "@/components/FormRenderer";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";

export default function FormView() {
  const { formId } = useParams<{ formId: string }>();

  if (!formId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Form ID not provided</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Form | Call Kaids Roofing"
        description="Fill out our form to get started"
      />
      
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <FormRenderer formId={formId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
