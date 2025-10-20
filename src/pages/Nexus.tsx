import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Loader2, Zap, TrendingUp, Package, Code, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthGuard } from "@/components/AuthGuard";

interface Message {
  role: "user" | "assistant";
  content: string;
  classification?: any;
  executionResults?: any[];
  executionTime?: number;
}

const Nexus = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const messageText = input.trim();
    if (!messageText || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: messageText }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("nexus-ai-hub", {
        body: {
          conversationId,
          message: messageText,
          context: {
            currentPage: '/internal/nexus',
          },
        },
      });

      if (error) throw error;

      setConversationId(data.conversationId);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          classification: data.classification,
          executionResults: data.executionResults,
          executionTime: data.executionTime,
        },
      ]);
    } catch (error: any) {
      console.error("Nexus error:", error);
      toast.error("Failed to process request");
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I encountered an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickCommands = [
    { icon: TrendingUp, text: "Show today's leads", color: "text-green-600" },
    { icon: Package, text: "Generate quote for latest lead", color: "text-blue-600" },
    { icon: Zap, text: "Analyze conversion rates this month", color: "text-orange-600" },
    { icon: Code, text: "Create a blog post about roof repairs", color: "text-purple-600" },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        {/* Header */}
        <div className="bg-primary text-primary-foreground py-6 border-b border-primary/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">CKR Nexus AI</h1>
                <p className="text-sm opacity-90">Autonomous Command Center</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Card className="h-[calc(100vh-240px)] flex flex-col">
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                <div className="space-y-6">
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-10 w-10 text-primary" />
                      </div>
                      <h2 className="text-xl font-bold mb-2">Welcome to Nexus</h2>
                      <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                        Your AI-powered command center. Ask anything in natural language - query data, generate quotes, analyze trends, or create content.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                        {quickCommands.map((cmd, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            className="h-auto py-4 px-4 justify-start text-left"
                            onClick={() => {
                              setInput(cmd.text);
                            }}
                          >
                            <cmd.icon className={`h-5 w-5 mr-3 shrink-0 ${cmd.color}`} />
                            <span className="text-sm">{cmd.text}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2 max-w-[75%]">
                        <div
                          className={`rounded-lg px-4 py-3 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>

                        {msg.classification && (
                          <div className="flex gap-2 text-xs">
                            <Badge variant="outline" className="capitalize">
                              {msg.classification.intent.replace('_', ' ')}
                            </Badge>
                            {msg.executionTime && (
                              <Badge variant="secondary">
                                {(msg.executionTime / 1000).toFixed(2)}s
                              </Badge>
                            )}
                            <Badge variant="secondary">
                              {msg.classification.confidence?.toFixed(2) || '0.00'} confidence
                            </Badge>
                          </div>
                        )}
                      </div>

                      {msg.role === "user" && (
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-3 justify-start">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Processing...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="border-t p-4 bg-muted/30">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Ask anything... e.g., 'Show unviewed quotes from this week'"
                    disabled={loading}
                    className="text-sm"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    size="icon"
                    className="shrink-0"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Powered by Gemini 2.5 • Natural language understanding • Multi-step execution
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Nexus;
