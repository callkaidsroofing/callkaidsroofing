import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PremiumPageHeader } from "@/components/admin/PremiumPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  RefreshCw, 
  Database, 
  Sparkles, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Clock,
  Zap,
  Upload
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface SyncStatus {
  name: string;
  description: string;
  icon: any;
  loading: boolean;
  lastSync: Date | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
  stats?: { label: string; value: string }[];
  error?: string;
}

interface EmbeddingStats {
  source_table: string;
  total: number;
  embedded: number;
  percentage: number;
}

export default function DataSync() {
  const [embeddingStats, setEmbeddingStats] = useState<EmbeddingStats[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [syncStatuses, setSyncStatuses] = useState<Record<string, SyncStatus>>({
    blueprint: {
      name: "Blueprint Upload",
      description: "Upload and parse ckr5.md blueprint file",
      icon: Upload,
      loading: false,
      lastSync: null,
      status: 'idle',
    },
    rag: {
      name: "RAG Vector Index",
      description: "Sync content to AI documents table with embeddings",
      icon: Sparkles,
      loading: false,
      lastSync: null,
      status: 'idle',
    },
    pricing: {
      name: "Pricing Database",
      description: "Sync pricing model from JSON to database with vectors",
      icon: DollarSign,
      loading: false,
      lastSync: null,
      status: 'idle',
    },
    knowledge: {
      name: "Knowledge Base",
      description: "Embed knowledge documents for RAG retrieval",
      icon: FileText,
      loading: false,
      lastSync: null,
      status: 'idle',
    },
  });

  useEffect(() => {
    loadEmbeddingStats();
  }, []);

  const loadEmbeddingStats = async () => {
    setLoadingStats(true);
    try {
      const { data, error } = await supabase.rpc('get_embedding_stats');
      
      if (error) throw error;
      
      setEmbeddingStats(data || []);
    } catch (err: any) {
      console.error('Error loading embedding stats:', err);
      toast.error('Failed to load embedding statistics');
    } finally {
      setLoadingStats(false);
    }
  };

  const updateSyncStatus = (key: string, updates: Partial<SyncStatus>) => {
    setSyncStatuses(prev => ({
      ...prev,
      [key]: { ...prev[key], ...updates }
    }));
  };

  const handleSyncRAG = async () => {
    updateSyncStatus('rag', { loading: true, status: 'syncing', error: undefined });
    
    try {
      const { data, error } = await supabase.functions.invoke('rag-indexer', {
        body: { mode: 'full' }
      });

      if (error) throw error;

      updateSyncStatus('rag', {
        loading: false,
        status: 'success',
        lastSync: new Date(),
        stats: [
          { label: 'Documents Indexed', value: String(data?.indexed || 0) },
          { label: 'Embeddings Generated', value: String(data?.embeddings || 0) }
        ]
      });
      
      toast.success('RAG index synchronized successfully');
      loadEmbeddingStats();
    } catch (err: any) {
      console.error('RAG sync error:', err);
      updateSyncStatus('rag', {
        loading: false,
        status: 'error',
        error: err.message || 'Failed to sync RAG index'
      });
      toast.error('Failed to sync RAG index', {
        description: err.message
      });
    }
  };

  const handleSyncPricing = async () => {
    updateSyncStatus('pricing', { loading: true, status: 'syncing', error: undefined });
    
    try {
      // Fetch the pricing JSON file
      const response = await fetch('/pricing/KF_02_PRICING_MODEL.json');
      if (!response.ok) throw new Error('Failed to fetch pricing model');
      const pricingData = await response.json();

      // Sync to database with embeddings
      const { data, error } = await supabase.functions.invoke('sync-pricing-data', {
        body: { 
          action: 'sync_from_json',
          data: pricingData
        }
      });

      if (error) throw error;

      updateSyncStatus('pricing', {
        loading: false,
        status: 'success',
        lastSync: new Date(),
        stats: [
          { label: 'Items Synced', value: String(data?.results?.success || 0) },
          { label: 'Failed', value: String(data?.results?.failed || 0) }
        ]
      });
      
      toast.success('Pricing database synchronized successfully');
      loadEmbeddingStats();
    } catch (err: any) {
      console.error('Pricing sync error:', err);
      updateSyncStatus('pricing', {
        loading: false,
        status: 'error',
        error: err.message || 'Failed to sync pricing data'
      });
      toast.error('Failed to sync pricing data', {
        description: err.message
      });
    }
  };

  const handleSyncKnowledge = async () => {
    updateSyncStatus('knowledge', { loading: true, status: 'syncing', error: undefined });
    
    try {
      const { data, error } = await supabase.functions.invoke('embed-knowledge-docs', {
        body: { reembed: false }
      });

      if (error) throw error;

      updateSyncStatus('knowledge', {
        loading: false,
        status: 'success',
        lastSync: new Date(),
        stats: [
          { label: 'Documents Processed', value: String(data?.processed || 0) },
          { label: 'Embeddings Created', value: String(data?.embeddings || 0) }
        ]
      });
      
      toast.success('Knowledge base synchronized successfully');
      loadEmbeddingStats();
    } catch (err: any) {
      console.error('Knowledge sync error:', err);
      updateSyncStatus('knowledge', {
        loading: false,
        status: 'error',
        error: err.message || 'Failed to sync knowledge base'
      });
      toast.error('Failed to sync knowledge base', {
        description: err.message
      });
    }
  };

  const handleBlueprintUpload = async (file: File) => {
    updateSyncStatus('blueprint', { loading: true, status: 'syncing', error: undefined });
    
    try {
      const fileName = `blueprints/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('knowledge-uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data, error } = await supabase.functions.invoke('parse-ckr-blueprint', {
        body: { filePath: fileName }
      });

      if (error) throw error;

      updateSyncStatus('blueprint', {
        loading: false,
        status: 'success',
        lastSync: new Date(),
        stats: [
          { label: 'KF Files', value: String(data?.summary?.kf_files || 0) },
          { label: 'Workflows', value: String(data?.summary?.workflows || 0) },
          { label: 'Chunks', value: String(data?.summary?.processed_chunks || 0) }
        ]
      });
      
      toast.success('Blueprint uploaded and parsed successfully');
      loadEmbeddingStats();
    } catch (err: any) {
      console.error('Blueprint upload error:', err);
      updateSyncStatus('blueprint', {
        loading: false,
        status: 'error',
        error: err.message || 'Failed to upload blueprint'
      });
      toast.error('Failed to upload blueprint', {
        description: err.message
      });
    }
  };


  const handleKnowledgeUpload = async (file: File) => {
    updateSyncStatus('knowledge', { loading: true, status: 'syncing', error: undefined });
    
    try {
      // Upload file directly to storage first
      const fileName = `system-uploads/${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('knowledge-uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Then process it via edge function
      const { data, error } = await supabase.functions.invoke('process-knowledge-upload', {
        body: { 
          filePath: fileName,
          fileName: file.name
        }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Upload failed');
      }

      updateSyncStatus('knowledge', {
        loading: false,
        status: 'success',
        lastSync: new Date(),
        stats: [
          { label: 'File Uploaded', value: data.file_name },
          { label: 'Processing', value: 'In Queue' }
        ]
      });
      
      toast.success('Knowledge system uploaded successfully', {
        description: 'File will be processed and embedded into RAG database'
      });
      loadEmbeddingStats();
    } catch (err: any) {
      console.error('Knowledge upload error:', err);
      updateSyncStatus('knowledge', {
        loading: false,
        status: 'error',
        error: err.message || 'Failed to upload knowledge system'
      });
      toast.error('Failed to upload knowledge system', {
        description: err.message
      });
    }
  };

  const handleSyncAll = async () => {
    toast.info('Starting full system sync...');
    await handleSyncPricing();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await handleSyncKnowledge();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await handleSyncRAG();
    toast.success('Full system sync completed!');
  };

  const syncHandlers = {
    blueprint: () => fileInputRef.current?.click(),
    rag: handleSyncRAG,
    pricing: handleSyncPricing,
    knowledge: handleSyncKnowledge,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-primary animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <PremiumPageHeader
        title="Data Sync & RAG Management"
        description="Synchronize databases, generate embeddings, and manage vector indices"
        icon={Database}
      />

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Quick Actions */}
        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Synchronize all systems or trigger individual syncs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSyncAll}
              disabled={Object.values(syncStatuses).some(s => s.loading)}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${Object.values(syncStatuses).some(s => s.loading) ? 'animate-spin' : ''}`} />
              Sync All Systems
            </Button>
          </CardContent>
        </Card>

        {/* Embedding Statistics */}
        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Vector Embedding Statistics
            </CardTitle>
            <CardDescription>
              Current status of vector embeddings across all tables
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : embeddingStats.length === 0 ? (
              <Alert>
                <AlertDescription>No embedding data available yet</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {embeddingStats.map((stat) => (
                  <div key={stat.source_table} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">
                        {stat.source_table.replace(/_/g, ' ')}
                      </span>
                      <Badge variant={stat.percentage === 100 ? "default" : "secondary"}>
                        {stat.embedded} / {stat.total}
                      </Badge>
                    </div>
                    <Progress value={stat.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {stat.percentage.toFixed(1)}% embedded
                    </p>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadEmbeddingStats}
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Refresh Statistics
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sync Operations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(syncStatuses).map(([key, status]) => {
            const Icon = status.icon;
            return (
              <Card 
                key={key}
                className="border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-all"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-primary" />
                    {getStatusIcon(status.status)}
                  </div>
                  <CardTitle className="mt-4">{status.name}</CardTitle>
                  <CardDescription>{status.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {status.lastSync && (
                    <p className="text-xs text-muted-foreground">
                      Last synced {formatDistanceToNow(status.lastSync, { addSuffix: true })}
                    </p>
                  )}

                  {status.error && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-xs">
                        {status.error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {status.stats && (
                    <div className="grid grid-cols-2 gap-2">
                      {status.stats.map((stat, idx) => (
                        <div key={idx} className="bg-muted/50 p-2 rounded">
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                          <p className="text-lg font-bold">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {key === 'knowledge' ? (
                    <div className="space-y-2">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".zip"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleKnowledgeUpload(file);
                        }}
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={status.loading}
                        className="w-full"
                        variant="outline"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Knowledge System
                      </Button>
                      <Button
                        onClick={syncHandlers[key as keyof typeof syncHandlers]}
                        disabled={status.loading}
                        className="w-full"
                        variant={status.status === 'success' ? 'outline' : 'default'}
                      >
                        {status.loading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Sync Existing
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={syncHandlers[key as keyof typeof syncHandlers]}
                      disabled={status.loading}
                      className="w-full"
                      variant={status.status === 'success' ? 'outline' : 'default'}
                    >
                      {status.loading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync Now
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
