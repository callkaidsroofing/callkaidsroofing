import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface QuoteChatPanelProps {
  quoteId: string;
}

export function QuoteChatPanel({ quoteId }: QuoteChatPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = () => {
    if (!prompt.trim()) return;
    setMessages(prev => [...prev, `Request for quote ${quoteId}: ${prompt}`]);
    setPrompt("");
  };

  return (
    <Card className="p-4 space-y-3" aria-live="polite">
      <div className="space-y-1">
        <h3 className="text-base font-semibold">AI Refinement</h3>
        <p className="text-sm text-muted-foreground">
          Draft notes to refine the quote. This lightweight panel stores text locally only.
        </p>
      </div>

      <Textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Describe the changes you want"
        aria-label="Quote refinement prompt"
      />

      <Button onClick={handleSend}>Save Note</Button>

      {messages.length > 0 && (
        <div className="space-y-2" aria-label="Saved notes">
          {messages.map((message, index) => (
            <Card key={index} className="p-3 text-sm text-muted-foreground">
              {message}
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
