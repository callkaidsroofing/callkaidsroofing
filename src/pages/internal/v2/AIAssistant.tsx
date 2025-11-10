import { RagChatPanel } from '@/components/shared/RagChatPanel';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Database, Bot } from 'lucide-react';

export default function AIAssistant() {
  return (
    <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Assistant</h1>
              <p className="text-muted-foreground">
                RAG-powered assistant with access to CKR's Master Knowledge Framework
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Features Overview */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Capabilities
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Access to 26 MKF documents covering policies, services, pricing, and procedures</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Semantic search across 150+ knowledge chunks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Context-aware responses with source citations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Real-time streaming responses powered by Lovable AI</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Knowledge Base Status
              </h3>
              <div className="space-y-2">
                <Badge variant="default" className="w-full justify-center">
                  RAG System Active
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Vector similarity threshold: 0.70
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">Example Queries</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• What services does CKR offer?</li>
                <li>• What are the pricing rates for roof repairs?</li>
                <li>• What suburbs does CKR service?</li>
                <li>• What is CKR's warranty policy?</li>
                <li>• How do I handle a customer complaint?</li>
              </ul>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="h-[calc(100vh-200px)]">
              <RagChatPanel
                conversationType="internal"
                title="CKR AI Assistant"
                placeholder="Ask me anything about CKR's services, pricing, policies..."
                showRagToggle={true}
                defaultRagEnabled={true}
              />
            </div>
          </div>
        </div>
      </div>
  );
}
