import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { InternalChatAssistant } from "@/components/InternalChatAssistant";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bot, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function ChatDashboard() {
  const [analytics, setAnalytics] = useState({
    totalConversations: 0,
    leadsCaptured: 0,
    imagesAnalyzed: 0,
    voiceTranscriptions: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const [conversations, leads, images, voice] = await Promise.all([
      supabase.from('chat_conversations').select('id', { count: 'exact', head: true }),
      supabase.from('chat_conversations').select('id', { count: 'exact', head: true }).eq('lead_captured', true),
      supabase.from('image_analyses').select('id', { count: 'exact', head: true }),
      supabase.from('voice_transcriptions').select('id', { count: 'exact', head: true }),
    ]);

    setAnalytics({
      totalConversations: conversations.count || 0,
      leadsCaptured: leads.count || 0,
      imagesAnalyzed: images.count || 0,
      voiceTranscriptions: voice.count || 0,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant Dashboard</h1>
          <p className="text-muted-foreground">
            Manage both public-facing and internal chatbot systems
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalConversations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Captured</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.leadsCaptured}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Images Analyzed</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.imagesAnalyzed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voice Transcriptions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.voiceTranscriptions}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="internal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="internal">
              <Bot className="h-4 w-4 mr-2" />
              Internal Assistant
            </TabsTrigger>
            <TabsTrigger value="public">
              <MessageSquare className="h-4 w-4 mr-2" />
              Public Chat Preview
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="internal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Internal Operations Assistant</CardTitle>
                <CardDescription>
                  Voice-enabled assistant for inspections, quotes, and job management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InternalChatAssistant />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="public" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Public Customer Chat</CardTitle>
                <CardDescription>
                  Visible on website - handles lead capture and image analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge variant="secondary">Live on Website</Badge>
                  <p className="text-sm text-muted-foreground">
                    The enhanced customer chat widget is automatically displayed on the public website.
                    It includes:
                  </p>
                  <ul className="text-sm space-y-2 list-disc list-inside">
                    <li>Roof image upload and AI analysis (Gemini Vision)</li>
                    <li>Competitor quote OCR extraction</li>
                    <li>Automated lead capture and qualification</li>
                    <li>Integration with GWA-06 follow-up system</li>
                    <li>Real-time pricing estimates from KF_02 model</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Analytics</CardTitle>
                <CardDescription>
                  Track engagement, conversions, and AI performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Conversion Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lead → Quote Rate:</span>
                          <span className="font-medium">
                            {analytics.totalConversations > 0
                              ? ((analytics.leadsCaptured / analytics.totalConversations) * 100).toFixed(1)
                              : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Images with Analysis:</span>
                          <span className="font-medium">{analytics.imagesAnalyzed}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">AI Usage</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Voice Interactions:</span>
                          <span className="font-medium">{analytics.voiceTranscriptions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total AI Calls:</span>
                          <span className="font-medium">
                            {analytics.totalConversations + analytics.imagesAnalyzed}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
