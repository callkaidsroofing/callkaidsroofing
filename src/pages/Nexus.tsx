import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Loader2, Zap, TrendingUp, Package, Code, Sparkles, Plus, Search, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/AuthGuard";
import { useNexusAI } from "@/hooks/useNexusAI";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const { ask, isProcessing } = useNexusAI({
    onComplete: (response) => {
      // Response already added by handleSend
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const messageText = input.trim();
    if (!messageText || isProcessing) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: messageText }]);

    const result = await ask(messageText, { currentPage: '/internal/nexus' });

    if (result) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: result.response,
          classification: result.classification,
          executionResults: result.executionResults,
          executionTime: result.executionTime,
        },
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I encountered an error processing your request. Please try again.",
        },
      ]);
    }
  };

  const quickCommands = [
    { icon: Plus, text: "Create a lead for John in Berwick - roof painting", color: "text-green-600" },
    { icon: Search, text: "Show all new leads from this week", color: "text-blue-600" },
    { icon: Calendar, text: "Schedule follow-ups for pending quotes", color: "text-orange-600" },
    { icon: FileText, text: "Generate premium quote for latest inspection", color: "text-purple-600" },
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

                  {isProcessing && (
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
                    placeholder="Try: 'Create lead for Sarah at 0412345678 - leak repair in Cranbourne'"
                    disabled={isProcessing}
                    className="text-sm"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isProcessing || !input.trim()}
                    size="icon"
                    className="shrink-0"
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Powered by Gemini 2.5 + CKR-GEM API • Full CRM control via natural language • 20+ automated actions
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
