import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConflictResolver, ConflictResolution } from '@/hooks/useConflictResolver';
import { AlertTriangle, Send, Check, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ConflictResolverChatProps {
  conflict: ConflictResolution | null;
  onResolved: () => void;
  onCancel: () => void;
}

export function ConflictResolverChat({ conflict, onResolved, onCancel }: ConflictResolverChatProps) {
  const { loading, chatWithResolver, resolveConflict } = useConflictResolver();
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  if (!conflict) return null;

  const handleSend = async () => {
    if (!input.trim() || !conflict) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setStreamingContent('');

    try {
      const response = await chatWithResolver(conflict.id, updatedMessages);
      
      if (response && response.data) {
        const reader = response.data.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantContent += content;
                  setStreamingContent(assistantContent);
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }

        setMessages([...updatedMessages, { role: 'assistant', content: assistantContent }]);
        setStreamingContent('');
      }
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  const handleResolve = async (strategy: 'keep_original' | 'accept_proposed' | 'merge') => {
    const success = await resolveConflict(conflict.id, strategy);
    if (success) {
      onResolved();
    }
  };

  const recommendation = conflict.ai_recommendation as any;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-600">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="font-semibold">Conflict Resolution Assistant</h3>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList>
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
            <TabsTrigger value="diff">View Differences</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <ScrollArea className="h-[300px] border rounded-lg p-4" ref={scrollRef}>
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium mb-2">AI Analysis:</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {recommendation?.summary || 'Content differences detected'}
                  </p>
                  <Badge variant="outline">
                    Recommendation: {recommendation?.recommendation || 'manual_review'}
                  </Badge>
                </div>

                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-12'
                        : 'bg-muted mr-12'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}

                {streamingContent && (
                  <div className="bg-muted p-3 rounded-lg mr-12">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{streamingContent}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask the AI about the conflicts..."
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="diff">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Original Content</h4>
                <ScrollArea className="h-[300px] border rounded-lg p-4">
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {conflict.original_content}
                  </pre>
                </ScrollArea>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Proposed Content</h4>
                <ScrollArea className="h-[300px] border rounded-lg p-4">
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {conflict.proposed_content}
                  </pre>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleResolve('keep_original')}
              disabled={loading}
            >
              Keep Original
            </Button>
            <Button
              variant="outline"
              onClick={() => handleResolve('accept_proposed')}
              disabled={loading}
            >
              Accept Proposed
            </Button>
            <Button
              onClick={() => handleResolve('merge')}
              disabled={loading}
            >
              <Check className="h-4 w-4 mr-2" />
              AI Merge
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
