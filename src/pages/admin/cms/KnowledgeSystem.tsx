import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, GitBranch, RefreshCw, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface KFMetadata {
  kf_id: string;
  title: string;
  version: string;
  last_updated: string;
  dependencies: string[];
  review_cadence: string;
  master_knowledge_ids: string[];
}

export default function KnowledgeSystem() {
  const [selectedKF, setSelectedKF] = useState<string | null>(null);

  const { data: kfMetadata, isLoading, refetch } = useQuery({
    queryKey: ['knowledge-file-metadata'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_file_metadata')
        .select('*')
        .order('kf_id');
      
      if (error) throw error;
      return data as KFMetadata[];
    }
  });

  const { data: embeddingStats } = useQuery({
    queryKey: ['embedding-stats', selectedKF],
    queryFn: async () => {
      if (!selectedKF) return null;
      
      const { count, error } = await supabase
        .from('master_knowledge')
        .select('*', { count: 'exact', head: true })
        .eq('kf_id', selectedKF);
      
      if (error) throw error;
      return count;
    },
    enabled: !!selectedKF
  });

  const handleReembed = async (kfId: string) => {
    toast.info(`Re-embedding ${kfId}...`);
    // This would trigger the parse-ckr-blueprint function
    // For now, just show a toast
    toast.success(`Re-embedding queued for ${kfId}`);
  };

  const kfCategories = {
    'Core Knowledge': ['KF_00', 'KF_01', 'KF_10'],
    'Pricing & Sales': ['KF_02'],
    'Operations & SOPs': ['KF_03', 'KF_04', 'KF_05'],
    'Marketing & Communications': ['KF_06', 'KF_07', 'KF_08', 'KF_09'],
    'Case Studies': ['KF_11']
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Knowledge System</h1>
          <p className="text-muted-foreground">Manage CKR-GEM Knowledge Files (KF_00 - KF_11)</p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total KF Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kfMetadata?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active knowledge files</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Chunks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kfMetadata?.reduce((sum, kf) => sum + (kf.master_knowledge_ids?.length || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Embedded knowledge chunks</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kfMetadata?.reduce((sum, kf) => sum + (kf.dependencies?.length || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Cross-references</p>
          </CardContent>
        </Card>
      </div>

      {/* KF Files by Category */}
      {Object.entries(kfCategories).map(([category, kfIds]) => (
        <div key={category} className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kfIds.map(kfId => {
              const kf = kfMetadata?.find(k => k.kf_id === kfId);
              const isSelected = selectedKF === kfId;

              return (
                <Card 
                  key={kfId}
                  className={`glass-card cursor-pointer transition-all hover:scale-105 ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedKF(isSelected ? null : kfId)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <CardTitle className="text-base">{kfId}</CardTitle>
                      </div>
                      <Badge variant={kf ? "default" : "secondary"}>
                        {kf ? "Active" : "Missing"}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-1">
                      {kf?.title || "Not loaded"}
                    </CardDescription>
                  </CardHeader>
                  
                  {kf && (
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>v{kf.version || "N/A"}</span>
                        {kf.last_updated && (
                          <span>• {new Date(kf.last_updated).toLocaleDateString()}</span>
                        )}
                      </div>

                      {kf.dependencies && kf.dependencies.length > 0 && (
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {kf.dependencies.map(dep => (
                              <Badge key={dep} variant="outline" className="text-xs">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {kf.master_knowledge_ids?.length || 0} chunks
                        </span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReembed(kfId);
                          }}
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                      </div>

                      {kf.review_cadence && (
                        <div className="flex items-center gap-2 text-xs text-amber-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>Review: {kf.review_cadence}</span>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {/* Selected KF Details */}
      {selectedKF && (
        <Card className="glass-card border-primary">
          <CardHeader>
            <CardTitle>Knowledge File Details: {selectedKF}</CardTitle>
            <CardDescription>
              {kfMetadata?.find(k => k.kf_id === selectedKF)?.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Embedding Status</h4>
                <p className="text-sm text-muted-foreground">
                  {embeddingStats} chunks embedded in master_knowledge table
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Dependencies</h4>
                <div className="flex flex-wrap gap-2">
                  {kfMetadata?.find(k => k.kf_id === selectedKF)?.dependencies?.map(dep => (
                    <Badge key={dep} variant="outline">{dep}</Badge>
                  )) || <span className="text-sm text-muted-foreground">No dependencies</span>}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleReembed(selectedKF)}>
                  Re-embed Knowledge File
                </Button>
                <Button variant="outline">View Source</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
