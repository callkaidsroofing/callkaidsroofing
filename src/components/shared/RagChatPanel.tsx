import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Bot, User, Sparkles, Database } from 'lucide-react';
import { useChatWithRag } from '@/hooks/useChatWithRag';
import { cn } from '@/lib/utils';

interface RagChatPanelProps {
  conversationType?: 'customer_support' | 'quote_assistant' | 'internal';
  title?: string;
  placeholder?: string;
  showRagToggle?: boolean;
  defaultRagEnabled?: boolean;
  filterCategory?: string;
}

export function RagChatPanel({
  conversationType = 'customer_support',
  title = 'AI Assistant',
  placeholder = 'Ask me anything...',
  showRagToggle = true,
  defaultRagEnabled = true,
  filterCategory,
}: RagChatPanelProps) {
  const [input, setInput] = useState('');
  const [ragEnabled, setRagEnabled] = useState(defaultRagEnabled);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { sendMessage, loading, messages, metadata, reset } = useChatWithRag({
    conversationType,
    useRag: ragEnabled,
    ragOptions: {
      matchThreshold: 0.7,
      matchCount: 3,
      filterCategory,
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">{title}</h3>
          </div>
          
          {showRagToggle && (
            <div className="flex items-center gap-2">
              <Label htmlFor="rag-toggle" className="text-xs flex items-center gap-1">
                <Database className="h-3 w-3" />
                RAG
              </Label>
              <Switch
                id="rag-toggle"
                checked={ragEnabled}
                onCheckedChange={setRagEnabled}
              />
            </div>
          )}
        </div>

        {/* Metadata Display */}
        {metadata && ragEnabled && metadata.contextsRetrieved > 0 && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Database className="h-3 w-3" />
            <span>{metadata.contextsRetrieved} knowledge sources used</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="mb-2">How can I help you today?</p>
              {ragEnabled && (
                <Badge variant="secondary" className="text-xs">
                  RAG Enabled - Using knowledge base
                </Badge>
              )}
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                'flex gap-3',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}

              <div
                className={cn(
                  'rounded-lg px-4 py-2 max-w-[80%]',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
