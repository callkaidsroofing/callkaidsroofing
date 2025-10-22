import { AuthGuard } from "@/components/AuthGuard";
import { NexusAIExample } from "@/components/NexusAIExample";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Demo page showing how to integrate Nexus AI anywhere in your website
 */
export default function NexusDemo() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="bg-primary text-primary-foreground py-6 border-b border-primary/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Nexus AI Integration Demo</h1>
                <p className="text-sm opacity-90">See how to use GPT-like powers anywhere in your app</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Tabs defaultValue="demo" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="code">Code Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="demo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🚀 Your Website → Nexus AI → CKR-GEM API</CardTitle>
                  <CardDescription>
                    This page demonstrates how to integrate AI-powered CRM actions into any component.
                    Try the examples below to see Nexus AI in action.
                  </CardDescription>
                </CardHeader>
              </Card>

              <NexusAIExample />
            </TabsContent>

            <TabsContent value="code" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Implementation Guide
                  </CardTitle>
                  <CardDescription>
                    Copy these patterns to add AI to any page in your app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">1. Import the Hook</h3>
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`import { useNexusAI } from "@/hooks/useNexusAI";

const MyComponent = () => {
  const { ask, commands, isProcessing } = useNexusAI();
  
  // Now you have AI powers!
}`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">2. Use Pre-Built Commands</h3>
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Create a lead
await commands.createLead({
  name: "John Smith",
  phone: "0412345678",
  suburb: "Berwick",
  service: "Roof Painting"
});

// Search leads
await commands.searchLeads({ 
  status: "new", 
  aiScoreMin: 7 
});

// Update status
await commands.updateLeadStatus(
  "lead-id", 
  "contacted", 
  "Called and left voicemail"
);

// Generate quote
await commands.generateQuote("report-id", "premium");`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">3. Natural Language Queries</h3>
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`// Ask anything in plain English
const result = await ask(
  "Show me all hot leads from Berwick this week"
);

// AI interprets intent and executes multiple actions
const result = await ask(
  "Create a lead for Sarah at 0435900709 in Cranbourne for leak repair, then schedule a follow-up in 2 days"
);

// Complex analysis
await ask("Analyze conversion rates by suburb for Q1");`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">4. Handle Responses</h3>
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`const { ask, isProcessing, lastResponse } = useNexusAI({
  onComplete: (response) => {
    toast.success("Task completed!");
    console.log(response);
  },
  onError: (error) => {
    toast.error(error);
  }
});

// Access detailed results
if (lastResponse) {
  console.log(lastResponse.response); // Natural language
  console.log(lastResponse.classification); // AI intent
  console.log(lastResponse.executionResults); // CRM actions
}`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">5. Real-World Integration Examples</h3>
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Contact Form:</p>
                        <pre className="text-xs bg-background/50 p-2 rounded">
{`const handleSubmit = async (formData) => {
  await commands.createLead(formData);
  // Lead created, scored, and notifications sent!
}`}
                        </pre>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Dashboard Widget:</p>
                        <pre className="text-xs bg-background/50 p-2 rounded">
{`useEffect(() => {
  ask("Get top 5 highest value leads this month")
    .then(result => setLeads(result.data));
}, []);`}
                        </pre>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Quote Builder:</p>
                        <pre className="text-xs bg-background/50 p-2 rounded">
{`const generateQuote = async (reportId) => {
  const quote = await commands.generateQuote(reportId, "premium");
  await commands.sendQuote(quote.data.quoteId, client.email);
  await commands.scheduleFollowup(quote.data.quoteId, 3, "email");
  // Done in 3 lines!
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-2">✨ What Makes This Powerful</h3>
                    <ul className="space-y-2 text-sm">
                      <li>✅ <strong>Natural Language:</strong> No need to memorize API actions - just ask in plain English</li>
                      <li>✅ <strong>Multi-Step Execution:</strong> AI can chain multiple CRM actions automatically</li>
                      <li>✅ <strong>Intelligent Routing:</strong> Nexus AI decides whether to call CKR-GEM API or query locally</li>
                      <li>✅ <strong>Error Handling:</strong> Built-in validation and friendly error messages</li>
                      <li>✅ <strong>Reusable:</strong> Use on any page - contact forms, dashboards, quote builders, etc.</li>
                      <li>✅ <strong>GPT-Like Intelligence:</strong> Same AI that powers your Custom GPT, now in your website</li>
                    </ul>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">🎯 Architecture Flow</p>
                    <pre className="text-xs">
{`Your Website Component
    ↓ (useNexusAI hook)
Nexus AI Hub (Edge Function)
    ↓ (Gemini 2.5 Flash - Intent Classification)
    ↓ (Executes Intelligent Plan)
    ├─→ Direct Supabase Queries (fast)
    └─→ CKR-GEM API Calls (20+ CRM actions)
        ↓ (With validation, rate limiting, audit logs)
Supabase Database
    ↓
Results → Natural Language Response`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  );
}
