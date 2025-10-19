import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2, Bot, User, Upload, Image as ImageIcon, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  analysisResult?: any;
}

export function EnhancedCustomerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setLoading(true);
    try {
      // Convert to base64 for analysis
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setUploadedImage(base64);

        // Auto-analyze roof image
        const { data, error } = await supabase.functions.invoke('analyze-image', {
          body: {
            conversationId,
            imageUrl: base64,
            analysisType: 'roof_condition',
          },
        });

        if (error) throw error;

        setMessages(prev => [
          ...prev,
          {
            role: 'user',
            content: 'Uploaded roof image for analysis',
            imageUrl: base64,
          },
          {
            role: 'assistant',
            content: generateAnalysisMessage(data.analysis),
            analysisResult: data.analysis,
          },
        ]);

        setUploadedImage(null);
        toast.success('Image analyzed successfully');
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast.error('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysisMessage = (analysis: any) => {
    return `I've analyzed your roof image! Here's what I found:

🏠 Roof Type: ${analysis.roofType || 'Not identified'}
📊 Condition: ${analysis.rating || 'Unknown'}
${analysis.damages?.length > 0 ? `\n⚠️ Issues Found:\n${analysis.damages.map((d: string) => `  • ${d}`).join('\n')}` : ''}
${analysis.recommendations?.length > 0 ? `\n✅ Recommendations:\n${analysis.recommendations.map((r: string) => `  • ${r}`).join('\n')}` : ''}

Would you like a free quote for these services? Fill out our contact form and we'll get back to you within 24 hours!`;
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: messageText }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-customer-support", {
        body: {
          conversationId,
          message: messageText,
        },
      });

      if (error) throw error;

      setConversationId(data.conversationId);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);

      // Track analytics
      await supabase.from('chat_analytics').insert({
        conversation_id: data.conversationId,
        event_type: 'message_sent',
        event_data: { userMessage: messageText },
      });

    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { text: "📸 Upload roof photo", action: () => fileInputRef.current?.click() },
    { text: "💰 Get a quote", action: () => handleSend("I'd like to get a quote") },
    { text: "📍 Check service area", action: () => handleSend("Do you service my area?") },
  ];

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[400px] h-[650px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Call Kaids Roofing</CardTitle>
                <p className="text-xs text-muted-foreground">Smart Quote Assistant</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-4">
                    <Bot className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                    <p className="text-sm font-semibold mb-1">G'day! How can I help?</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Upload a photo or tell me about your roof
                    </p>
                    
                    <div className="space-y-2">
                      {quickActions.map((action, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="w-full text-xs justify-start"
                          onClick={action.action}
                        >
                          {action.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2 max-w-[75%]">
                      {msg.imageUrl && (
                        <img 
                          src={msg.imageUrl} 
                          alt="Uploaded" 
                          className="rounded-lg max-w-full h-auto"
                        />
                      )}
                      <div
                        className={`rounded-lg px-3 py-2 text-sm ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>

                    {msg.role === "user" && (
                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2 justify-start">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t p-3">
              <div className="flex gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload Photo
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about our services..."
                  disabled={loading}
                  className="text-sm"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  size="icon"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
