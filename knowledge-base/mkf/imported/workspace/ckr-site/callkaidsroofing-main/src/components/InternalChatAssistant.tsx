import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Loader2, Mic, MicOff, Command } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  commandResult?: any;
}

const COMMANDS = [
  { cmd: '/inspect', desc: 'Start inspection checklist' },
  { cmd: '/quote', desc: 'Generate quote' },
  { cmd: '/activate', desc: 'Activate job' },
  { cmd: '/closeout', desc: 'Close out job' },
  { cmd: '/sop', desc: 'Search SOPs' },
];

export function InternalChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Microphone error:', error);
      toast.error('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const durationSeconds = audioBlob.size / 16000; // Approximate

        const { data, error } = await supabase.functions.invoke('transcribe-voice', {
          body: {
            conversationId,
            audio: base64Audio,
            durationSeconds,
          },
        });

        if (error) throw error;

        setInput(data.text);
        toast.success('Voice transcribed');
      };
      reader.readAsDataURL(audioBlob);
    } catch (error: any) {
      console.error('Transcription error:', error);
      toast.error('Failed to transcribe audio');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: messageText }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("internal-assistant", {
        body: {
          conversationId,
          message: messageText,
        },
      });

      if (error) throw error;

      setConversationId(data.conversationId);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          commandResult: data.commandResult,
        },
      ]);
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const renderCommandResult = (result: any) => {
    if (!result) return null;

    switch (result.action) {
      case 'start_inspection':
        return (
          <div className="mt-2 p-3 bg-muted rounded-lg">
            <p className="font-semibold text-sm mb-2">Inspection Checklist:</p>
            <ul className="space-y-1">
              {result.checklist?.map((item: string, idx: number) => (
                <li key={idx} className="text-xs flex items-center gap-2">
                  <input type="checkbox" className="h-3 w-3" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'closeout_job':
        return (
          <div className="mt-2 p-3 bg-muted rounded-lg">
            <p className="font-semibold text-sm mb-2">Close-out Steps:</p>
            <ol className="space-y-1 list-decimal list-inside">
              {result.steps?.map((step: string, idx: number) => (
                <li key={idx} className="text-xs">{step}</li>
              ))}
            </ol>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Internal Assistant</CardTitle>
              <p className="text-xs text-muted-foreground">Field & Operations Support</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Command className="h-3 w-3 mr-1" />
            Commands Available
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-4">
                <Bot className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                <p className="text-sm font-semibold mb-1">Ready to assist!</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Use voice or commands for quick actions
                </p>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-left">Quick Commands:</p>
                  {COMMANDS.map((cmd, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs justify-start font-mono"
                      onClick={() => handleSend(cmd.cmd)}
                    >
                      <span className="text-primary">{cmd.cmd}</span>
                      <span className="ml-2 text-muted-foreground">- {cmd.desc}</span>
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
                
                <div className="flex flex-col gap-1 max-w-[85%]">
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {renderCommandResult(msg.commandResult)}
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
          <div className="flex gap-2">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type a message or command..."
              disabled={loading}
              className="text-sm font-mono"
            />
            <Button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              size="icon"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
