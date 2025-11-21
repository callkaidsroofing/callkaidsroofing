import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, Download, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { generateBrandedPDF } from "@/lib/pdfGenerator";

interface FormRendererProps {
  formId: string;
  onSuccess?: () => void;
  enablePdfExport?: boolean;
  workflowStyle?: boolean;
}

export function FormRenderer({ formId, onSuccess, enablePdfExport, workflowStyle }: FormRendererProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formDef, setFormDef] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { handleError, showSuccess } = useErrorHandler();

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      const { data, error } = await supabase
        .from("form_definitions")
        .select("*")
        .eq("id", formId)
        .eq("is_published", true)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Form not found or not published");

      setFormDef(data);
    } catch (err: any) {
      handleError(err, "Loading form");
    } finally {
      setLoading(false);
    }
  };

  // Build Zod schema from JSON schema
  const buildZodSchema = (schema: any) => {
    const shape: any = {};
    
    if (schema.properties) {
      Object.keys(schema.properties).forEach((key) => {
        const prop = schema.properties[key];
        const isRequired = schema.required?.includes(key);

        if (prop.type === "string") {
          shape[key] = isRequired ? z.string().min(1, `${prop.title || key} is required`) : z.string().optional();
        } else if (prop.type === "number") {
          shape[key] = isRequired ? z.number() : z.number().optional();
        } else if (prop.type === "boolean") {
          shape[key] = z.boolean().optional();
        }
      });
    }

    return z.object(shape);
  };

  const form = useForm({
    resolver: formDef ? zodResolver(buildZodSchema(formDef.schema)) : undefined,
  });

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from("form_submissions")
        .insert({
          form_id: formId,
          submitted_by: session.session?.user?.id || null,
          submitted_data: data,
        });

      if (error) throw error;

      setSubmittedData(data);
      setIsSubmitted(true);
      showSuccess("Form submitted successfully");
      onSuccess?.();
    } catch (err: any) {
      handleError(err, "Submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!formRef.current) return;
    
    try {
      await generateBrandedPDF(formRef.current, {
        title: formDef.name,
        filename: `${formDef.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      });
      showSuccess("PDF exported successfully");
    } catch (err: any) {
      handleError(err, "Exporting PDF");
    }
  };

  const schema = formDef?.schema;
  const fieldKeys = schema?.properties ? Object.keys(schema.properties) : [];
  const totalSteps = workflowStyle ? fieldKeys.length : 1;
  const progressPercent = workflowStyle ? ((currentStep + 1) / totalSteps) * 100 : 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!formDef) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Form not found or not published.</p>
      </div>
    );
  }

  if (isSubmitted && enablePdfExport) {
    return (
      <div ref={formRef} className="space-y-6 p-6">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-semibold">Form Submitted Successfully!</h2>
          <p className="text-muted-foreground">Your form has been submitted and saved.</p>
        </div>

        <div className="bg-muted/50 p-6 rounded-lg space-y-4">
          <h3 className="font-semibold text-lg">{formDef.name}</h3>
          {Object.entries(submittedData).map(([key, value]) => {
            const field = schema.properties[key];
            return (
              <div key={key} className="border-b border-border pb-2">
                <p className="text-sm font-medium text-muted-foreground">{field?.title || key}</p>
                <p className="text-base">{String(value)}</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button onClick={handleExportPDF} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Export as PDF
          </Button>
          <Button variant="outline" onClick={() => {
            setIsSubmitted(false);
            setSubmittedData(null);
            form.reset();
            setCurrentStep(0);
          }} className="flex-1">
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{formDef.name}</h2>
        {formDef.description && (
          <p className="text-muted-foreground mt-1">{formDef.description}</p>
        )}
      </div>

      {workflowStyle && totalSteps > 1 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Step {currentStep + 1} of {totalSteps}</span>
            <span className="font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {workflowStyle && totalSteps > 1 ? (
          // Workflow style - one field at a time
          <div className="space-y-4 min-h-[200px]">
            {fieldKeys[currentStep] && (() => {
              const key = fieldKeys[currentStep];
              const field = schema.properties[key];
              const isRequired = schema.required?.includes(key);
              const error = form.formState.errors[key];

              return (
                <div className="space-y-3 animate-in fade-in-50 duration-500">
                  <Label htmlFor={key} className="text-lg">
                    {field.title || key}
                    {isRequired && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {field.description && (
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                  )}
                  
                  {field.type === "string" && field.format !== "textarea" && (
                    <Input
                      id={key}
                      type={field.format === "email" ? "email" : "text"}
                      {...form.register(key)}
                      className="text-lg p-6"
                      autoFocus
                    />
                  )}

                  {field.type === "string" && field.format === "textarea" && (
                    <Textarea
                      id={key}
                      {...form.register(key)}
                      rows={6}
                      className="text-lg p-4"
                      autoFocus
                    />
                  )}

                  {field.type === "number" && (
                    <Input
                      id={key}
                      type="number"
                      {...form.register(key, { valueAsNumber: true })}
                      className="text-lg p-6"
                      autoFocus
                    />
                  )}

                  {error && (
                    <p className="text-sm text-destructive">{error.message as string}</p>
                  )}
                </div>
              );
            })()}
          </div>
        ) : (
          // Traditional style - all fields at once
          <div className="space-y-4">
            {fieldKeys.map((key) => {
              const field = schema.properties[key];
              const isRequired = schema.required?.includes(key);
              const error = form.formState.errors[key];

              return (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {field.title || key}
                    {isRequired && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  
                  {field.type === "string" && field.format !== "textarea" && (
                    <Input
                      id={key}
                      type={field.format === "email" ? "email" : "text"}
                      {...form.register(key)}
                      placeholder={field.description}
                    />
                  )}

                  {field.type === "string" && field.format === "textarea" && (
                    <Textarea
                      id={key}
                      {...form.register(key)}
                      placeholder={field.description}
                      rows={4}
                    />
                  )}

                  {field.type === "number" && (
                    <Input
                      id={key}
                      type="number"
                      {...form.register(key, { valueAsNumber: true })}
                      placeholder={field.description}
                    />
                  )}

                  {error && (
                    <p className="text-sm text-destructive">{error.message as string}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex gap-3">
          {workflowStyle && currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}
          
          {workflowStyle && currentStep < totalSteps - 1 ? (
            <Button
              type="button"
              onClick={async () => {
                const key = fieldKeys[currentStep];
                const isValid = await form.trigger(key);
                if (isValid) {
                  setCurrentStep(prev => prev + 1);
                }
              }}
              className="flex-1"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Form
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
