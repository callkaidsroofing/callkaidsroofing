import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, CheckCircle2, Clock, AlertCircle, GitBranch } from "lucide-react";
import { toast } from "sonner";

interface Workflow {
  id: string;
  gwa_id: string;
  name: string;
  version: string;
  objective: string;
  trigger_type: string;
  trigger_criteria: any;
  workflow_steps: any[];
  dependencies: any[];
  success_metrics: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function Workflows() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflow-automations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_automations')
        .select('*')
        .order('gwa_id');
      
      if (error) throw error;
      return data as Workflow[];
    }
  });

  const handleTriggerWorkflow = async (gwaId: string) => {
    toast.info(`Triggering ${gwaId}...`);
    // This would call the workflow execution engine
    toast.success(`Workflow ${gwaId} triggered successfully`);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const { error } = await supabase
      .from('workflow_automations')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update workflow status');
    } else {
      toast.success(`Workflow ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    }
  };

  const workflowCategories = {
    'Lead Management': workflows?.filter(w => ['GWA-01', 'GWA-02', 'GWA-06'].includes(w.gwa_id)),
    'Project Execution': workflows?.filter(w => ['GWA-03', 'GWA-04', 'GWA-08'].includes(w.gwa_id)),
    'Marketing & Content': workflows?.filter(w => ['GWA-05', 'GWA-07', 'GWA-09', 'GWA-10'].includes(w.gwa_id)),
    'Analytics & Reporting': workflows?.filter(w => ['GWA-11', 'GWA-12', 'GWA-13', 'GWA-14'].includes(w.gwa_id)),
  };

  const selectedWF = workflows?.find(w => w.gwa_id === selectedWorkflow);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Workflow Automation Manager</h1>
        <p className="text-muted-foreground">Manage GWA-01 through GWA-14 automated workflows</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {workflows?.filter(w => w.status === 'active').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {workflows?.filter(w => w.status === 'inactive').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows?.reduce((sum, w) => sum + (w.dependencies?.length || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows by Category */}
      <Tabs defaultValue="Lead Management" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {Object.keys(workflowCategories).map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(workflowCategories).map(([category, categoryWorkflows]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryWorkflows?.map(workflow => (
                <Card 
                  key={workflow.id}
                  className={`glass-card cursor-pointer transition-all hover:scale-105 ${
                    selectedWorkflow === workflow.gwa_id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedWorkflow(
                    selectedWorkflow === workflow.gwa_id ? null : workflow.gwa_id
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{workflow.gwa_id}</CardTitle>
                          <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                            {workflow.status}
                          </Badge>
                        </div>
                        <CardDescription className="mt-1">{workflow.name}</CardDescription>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriggerWorkflow(workflow.gwa_id);
                        }}
                        disabled={workflow.status !== 'active'}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workflow.objective}
                    </p>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Trigger: {workflow.trigger_type}
                      </span>
                    </div>

                    {workflow.dependencies && workflow.dependencies.length > 0 && (
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {workflow.dependencies.map((dep: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {dep.ref || dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {workflow.workflow_steps?.length || 0} steps
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(workflow.id, workflow.status);
                        }}
                      >
                        {workflow.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Selected Workflow Details */}
      {selectedWF && (
        <Card className="glass-card border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedWF.gwa_id}: {selectedWF.name}</CardTitle>
                <CardDescription>{selectedWF.objective}</CardDescription>
              </div>
              <Badge variant={selectedWF.status === 'active' ? 'default' : 'secondary'}>
                {selectedWF.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Workflow Steps */}
            <div>
              <h4 className="font-semibold mb-3">Workflow Steps</h4>
              <div className="space-y-2">
                {selectedWF.workflow_steps?.map((step: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </div>
                    <p className="text-sm flex-1">{step.description || step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trigger Criteria */}
            {selectedWF.trigger_criteria && (
              <div>
                <h4 className="font-semibold mb-2">Trigger Criteria</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedWF.trigger_criteria.description || JSON.stringify(selectedWF.trigger_criteria)}
                </p>
              </div>
            )}

            {/* Success Metrics */}
            {selectedWF.success_metrics && (
              <div>
                <h4 className="font-semibold mb-2">Success Metrics</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedWF.success_metrics.description || JSON.stringify(selectedWF.success_metrics)}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={() => handleTriggerWorkflow(selectedWF.gwa_id)}>
                <Play className="w-4 h-4 mr-2" />
                Trigger Workflow
              </Button>
              <Button variant="outline">View Execution History</Button>
              <Button variant="outline">Edit Configuration</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
