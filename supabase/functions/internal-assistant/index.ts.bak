import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { loadMKF, auditMKFAction } from "../_shared/mkf-loader.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, message } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth user
    const authHeader = req.headers.get('authorization');
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      
      if (error) throw new Error('Conversation not found');
      conversation = data;
    } else {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          conversation_type: 'internal_assistant',
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw new Error('Failed to create conversation');
      conversation = data;
    }

    // Check if message is a command
    const isCommand = message.trim().startsWith('/');
    let commandResult = null;

    if (isCommand) {
      const commandName = message.trim().split(' ')[0];
      const { data: command } = await supabase
        .from('chat_commands')
        .select('*')
        .eq('command', commandName)
        .eq('is_active', true)
        .single();

      if (command) {
        commandResult = await handleCommand(command, message, supabase);
      }
    }

    // Get conversation history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });

    // Save user message
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversation.id,
        role: 'user',
        content: message,
      });

    // Load MKF knowledge dynamically
    const mkfPrompt = await loadMKF('internal-assistant', supabase, {
      customPrompt: `You are an internal operations assistant for Call Kaids Roofing staff.

CAPABILITIES:
- Help with inspection reporting (use /inspect to start)
- Generate quotes (use /quote <details>)
- Job activation (use /activate <job-id>)
- Close-out procedures (use /closeout <job-id>)
- SOP lookup (use /sop <topic>)
- Field assistance and guidance

COMMANDS AVAILABLE:
/inspect - Start site checklist
/quote - Generate client quote
/activate - Activate job and create tasks
/closeout - Trigger proof package
/sop - Search SOP documentation

RESPONSE STYLE:
- Direct and practical
- Reference SOP sections from MKF_05 when relevant
- Provide step-by-step guidance
- Include safety considerations
- Follow MKF_07 authorization rules

${commandResult ? `\nCOMMAND RESULT: ${JSON.stringify(commandResult)}` : ''}

Respond conversationally but stay focused on helping staff complete tasks efficiently.`
    });

    // Log MKF usage
    await auditMKFAction(supabase, 'load_mkf', {
      function: 'internal-assistant',
      conversation_id: conversation.id
    });

    const systemPrompt = mkfPrompt;

    // Build conversation history
    const conversationHistory = (messages || []).map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Error:', aiResponse.status, errorText);
      throw new Error(`AI generation failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const assistantResponse = aiData.choices[0].message.content;

    // Save assistant message
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: assistantResponse,
        metadata: commandResult ? { commandResult } : {},
      });

    return new Response(
      JSON.stringify({
        conversationId: conversation.id,
        response: assistantResponse,
        commandResult,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in internal-assistant:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function handleCommand(command: any, message: string, supabase: any) {
  const args = message.trim().split(' ').slice(1);
  
  switch (command.handler_type) {
    case 'inspection':
      return {
        action: 'start_inspection',
        checklist: [
          'Access assessment',
          'Roof type identification',
          'Ridge cap condition',
          'Valley iron condition',
          'Pointing condition',
          'Photo documentation'
        ]
      };
    
    case 'quote':
      return {
        action: 'quote_wizard',
        message: 'Provide: client name, address, and service required'
      };
    
    case 'closeout':
      const jobId = args[0];
      return {
        action: 'closeout_job',
        jobId,
        steps: ['Verify photos', 'Generate proof package', 'Archive job', 'Send to client']
      };
    
    case 'sop_lookup':
      const topic = args.join(' ');
      return {
        action: 'sop_search',
        topic,
        message: 'Searching SOP documentation...'
      };
    
    case 'job_activation':
      const activateJobId = args[0];
      return {
        action: 'activate_job',
        jobId: activateJobId,
        tasks: ['Create material order', 'Schedule crew', 'Client confirmation']
      };
    
    default:
      return { action: 'unknown_command' };
  }
}
