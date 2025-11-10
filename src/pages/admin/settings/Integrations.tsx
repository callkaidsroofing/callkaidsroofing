import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plug, Check, X, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  category: 'mapping' | 'calendar' | 'communication' | 'productivity';
}

export default function Integrations() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'nearmap',
      name: 'Nearmap',
      description: 'High-resolution aerial imagery for roof measurements',
      icon: '🗺️',
      status: 'disconnected',
      category: 'mapping',
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync appointments and job schedules',
      icon: '📅',
      status: 'disconnected',
      category: 'calendar',
    },
    {
      id: 'google-earth',
      name: 'Google Earth Pro',
      description: 'Satellite imagery for property assessment',
      icon: '🌍',
      status: 'disconnected',
      category: 'mapping',
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Sync knowledge base and documentation',
      icon: '📝',
      status: 'disconnected',
      category: 'productivity',
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      description: 'Email delivery and marketing campaigns',
      icon: '✉️',
      status: 'disconnected',
      category: 'communication',
    },
    {
      id: 'twilio',
      name: 'Twilio',
      description: 'SMS notifications and phone services',
      icon: '📱',
      status: 'disconnected',
      category: 'communication',
    },
  ]);

  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEnabled, setWebhookEnabled] = useState(false);

  const handleToggleIntegration = (id: string) => {
    setIntegrations(integrations.map(int => 
      int.id === id 
        ? { ...int, status: int.status === 'connected' ? 'disconnected' : 'connected' }
        : int
    ));

    const integration = integrations.find(int => int.id === id);
    toast({
      title: integration?.status === 'connected' ? 'Disconnected' : 'Connected',
      description: `${integration?.name} has been ${integration?.status === 'connected' ? 'disconnected' : 'connected'}.`,
    });
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
            <Check className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
            <X className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Disconnected
          </Badge>
        );
    }
  };

  const categories = {
    mapping: 'Mapping & Imagery',
    calendar: 'Calendar & Scheduling',
    communication: 'Communication',
    productivity: 'Productivity',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Plug className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">Connect external services and APIs</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {Object.entries(categories).map(([key, label]) => {
            const categoryIntegrations = integrations.filter(int => int.category === key);
            if (categoryIntegrations.length === 0) return null;

            return (
              <Card key={key}>
                <CardHeader>
                  <CardTitle>{label}</CardTitle>
                  <CardDescription>
                    {categoryIntegrations.length} integration{categoryIntegrations.length !== 1 ? 's' : ''} available
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryIntegrations.map((integration) => (
                    <div key={integration.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex gap-3 flex-1">
                        <div className="text-3xl">{integration.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium mb-1">{integration.name}</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {integration.description}
                          </div>
                          {getStatusBadge(integration.status)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleIntegration(integration.id)}
                        >
                          {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Manage API keys and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nearmapKey">Nearmap API Key</Label>
                <Input
                  id="nearmapKey"
                  type="password"
                  placeholder="Enter API key..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="googleKey">Google API Key</Label>
                <Input
                  id="googleKey"
                  type="password"
                  placeholder="Enter API key..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sendgridKey">SendGrid API Key</Label>
                <Input
                  id="sendgridKey"
                  type="password"
                  placeholder="Enter API key..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilioSid">Twilio Account SID</Label>
                <Input
                  id="twilioSid"
                  type="password"
                  placeholder="Enter SID..."
                />
              </div>
              <Button className="w-full">Save API Keys</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>
                Configure webhooks for external systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable Webhooks</div>
                  <div className="text-sm text-muted-foreground">
                    Send events to external URLs
                  </div>
                </div>
                <Switch
                  checked={webhookEnabled}
                  onCheckedChange={setWebhookEnabled}
                />
              </div>

              {webhookEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      type="url"
                      placeholder="https://your-server.com/webhook"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Events to Send</Label>
                    <div className="space-y-2">
                      {['Lead Created', 'Quote Generated', 'Job Completed', 'Payment Received'].map((event) => (
                        <div key={event} className="flex items-center space-x-2">
                          <Switch id={event.replace(/\s+/g, '-')} />
                          <Label htmlFor={event.replace(/\s+/g, '-')} className="font-normal">
                            {event}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">Save Webhook Settings</Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Docs</CardTitle>
              <CardDescription>
                API documentation and guides
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                API Documentation
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Integration Guides
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Webhook Examples
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
