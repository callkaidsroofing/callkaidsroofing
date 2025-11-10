import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formSchema, formName, formDescription } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are an expert form design consultant specializing in workflow optimization. Your role is to analyze form schemas and provide actionable recommendations to improve the workflow-style filling experience.

ANALYSIS CRITERIA:
1. **Field Order**: Logical progression from basic to complex information
2. **Field Types**: Appropriate input types (text, email, textarea, number, date, etc.)
3. **Required Fields**: Balance between data collection and user friction
4. **Field Titles**: Clear, concise, and action-oriented labels
5. **Descriptions**: Helpful placeholder text and guidance
6. **Validation**: Proper format specifications (email, phone, etc.)
7. **Step Size**: Ideal number of fields per workflow step (recommend 1-3 fields per step for complex forms)
8. **User Experience**: Overall flow and cognitive load

PROVIDE:
- "issues": Array of specific problems found (if any)
- "recommendations": Array of actionable improvements
- "optimizedSchema": The improved JSON schema (if changes recommended)
- "workflowSuggestions": Specific guidance for workflow-style presentation
- "score": Overall quality score out of 10

Be constructive and specific. If the form is already well-designed, acknowledge it and provide minor enhancements only.`;

    const userPrompt = `Analyze this form and provide optimization recommendations for workflow-style filling:

Form Name: ${formName}
Description: ${formDescription || 'No description provided'}

Current Schema:
${JSON.stringify(formSchema, null, 2)}

Provide a comprehensive analysis with specific, actionable recommendations.`;

    console.log('Calling Lovable AI for form analysis...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'provide_form_analysis',
              description: 'Return structured form analysis with recommendations',
              parameters: {
                type: 'object',
                properties: {
                  score: {
                    type: 'number',
                    description: 'Quality score out of 10'
                  },
                  issues: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of identified issues'
                  },
                  recommendations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        priority: { type: 'string', enum: ['low', 'medium', 'high'] }
                      },
                      required: ['title', 'description', 'priority']
                    },
                    description: 'Actionable recommendations'
                  },
                  workflowSuggestions: {
                    type: 'string',
                    description: 'Specific guidance for workflow presentation'
                  },
                  hasOptimizedSchema: {
                    type: 'boolean',
                    description: 'Whether an optimized schema is provided'
                  },
                  optimizedSchema: {
                    type: 'object',
                    description: 'Improved JSON schema (only if changes recommended)'
                  }
                },
                required: ['score', 'issues', 'recommendations', 'workflowSuggestions', 'hasOptimizedSchema'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'provide_form_analysis' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({
        success: true,
        analysis
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in polish-form function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
