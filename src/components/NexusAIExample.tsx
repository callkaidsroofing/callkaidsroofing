import { useState } from "react";
import { useNexusAI } from "@/hooks/useNexusAI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, UserPlus } from "lucide-react";
import { toast } from "sonner";

/**
 * Example component showing how to integrate Nexus AI anywhere in your app
 * 
 * This demonstrates:
 * 1. Using pre-built commands for common actions
 * 2. Free-form natural language queries
 * 3. Handling loading states and responses
 * 
 * YOU CAN USE THIS ON ANY PAGE - leads dashboard, contact forms, quote builders, etc.
 */
export function NexusAIExample() {
  const { commands, ask, isProcessing, lastResponse } = useNexusAI({
    onComplete: (response) => {
      toast.success("AI completed task", {
        description: response.substring(0, 100) + "..."
      });
    }
  });

  // Example: Quick lead creation form with AI
  const [leadData, setLeadData] = useState({
    name: "",
    phone: "",
    suburb: "",
    service: "Roof Painting"
  });

  const handleQuickCreateLead = async () => {
    const result = await commands.createLead(leadData);
    if (result) {
      setLeadData({ name: "", phone: "", suburb: "", service: "Roof Painting" });
    }
  };

  // Example: Natural language query
  const [freeformQuery, setFreeformQuery] = useState("");

  const handleFreeformQuery = async () => {
    await ask(freeformQuery);
    setFreeformQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Example 1: Structured Command */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            AI-Powered Lead Creation
          </CardTitle>
          <CardDescription>
            Create leads using Nexus AI - it handles validation, scoring, and CRM integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={leadData.name}
                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={leadData.phone}
                onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                placeholder="0412345678"
              />
            </div>
            <div>
              <Label>Suburb</Label>
              <Input
                value={leadData.suburb}
                onChange={(e) => setLeadData({ ...leadData, suburb: e.target.value })}
                placeholder="Berwick"
              />
            </div>
            <div>
              <Label>Service</Label>
              <Input
                value={leadData.service}
                onChange={(e) => setLeadData({ ...leadData, service: e.target.value })}
                placeholder="Roof Painting"
              />
            </div>
          </div>

          <Button 
            onClick={handleQuickCreateLead} 
            disabled={isProcessing || !leadData.name || !leadData.phone}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Lead with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Example 2: Natural Language Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Natural Language Queries
          </CardTitle>
          <CardDescription>
            Ask AI to do anything - search, update, analyze, generate content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={freeformQuery}
              onChange={(e) => setFreeformQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFreeformQuery()}
              placeholder="e.g., 'Show all hot leads from Berwick this week'"
              disabled={isProcessing}
            />
            <Button 
              onClick={handleFreeformQuery}
              disabled={isProcessing || !freeformQuery.trim()}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => commands.searchLeads({ status: "new", aiScoreMin: 7 })}
              disabled={isProcessing}
            >
              High-Score Leads
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => commands.analyzeMetrics("last 7 days")}
              disabled={isProcessing}
            >
              Weekly Metrics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Show last AI response */}
      {lastResponse && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-sm">AI Response</CardTitle>
            <CardDescription className="text-xs">
              Intent: {lastResponse.classification.intent} • 
              Confidence: {(lastResponse.classification.confidence * 100).toFixed(0)}% • 
              Time: {(lastResponse.executionTime / 1000).toFixed(2)}s
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{lastResponse.response}</p>
            
            {lastResponse.executionResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Actions Executed:</p>
                {lastResponse.executionResults.map((result, idx) => (
                  <div key={idx} className="text-xs bg-background/50 rounded p-2">
                    <span className="font-medium">{result.tool}</span>
                    {result.crmAction && (
                      <span className="text-muted-foreground ml-2">→ {result.crmAction}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Integration Examples */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">💡 Use This Anywhere</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <p><strong>Contact Forms:</strong> Auto-create leads when forms submitted</p>
          <p><strong>Quote Builder:</strong> Ask AI to suggest pricing or generate descriptions</p>
          <p><strong>Dashboard Widgets:</strong> Natural language data queries</p>
          <p><strong>Customer Chat:</strong> AI-assisted support with CRM integration</p>
          <p><strong>Email Templates:</strong> Generate personalized content</p>
        </CardContent>
      </Card>
    </div>
  );
}
