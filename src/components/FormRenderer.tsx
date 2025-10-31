import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface FormRendererProps {
  formId: string;
  onSuccess?: () => void;
}

export function FormRenderer({ formId, onSuccess }: FormRendererProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formDef, setFormDef] = useState<any>(null);
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

      showSuccess("Form submitted successfully");
      form.reset();
      onSuccess?.();
    } catch (err: any) {
      handleError(err, "Submitting form");
    } finally {
      setSubmitting(false);
    }
  };

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

  const schema = formDef.schema;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{formDef.name}</h2>
        {formDef.description && (
          <p className="text-muted-foreground mt-1">{formDef.description}</p>
        )}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {schema.properties && Object.keys(schema.properties).map((key) => {
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

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </div>
  );
}
