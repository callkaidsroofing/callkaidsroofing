import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  CloudRain, 
  Database, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  Zap
} from 'lucide-react';
import { AIModuleCard } from '@/components/AIModuleCard';
import { loadJobs, loadLeads, loadWorkflows, checkKnowledgeBaseHealth, type Job, type Lead, type Workflow } from '@/lib/knowledgeBase';

export default function OperationsAI() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [kbHealth, setKbHealth] = useState<{ accessible: boolean; filesFound: string[]; filesMissing: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [jobsData, leadsData, workflowsData, healthData] = await Promise.all([
          loadJobs(),
          loadLeads(),
          loadWorkflows(),
          checkKnowledgeBaseHealth()
        ]);
        
        setJobs(jobsData);
        setLeads(leadsData);
        setWorkflows(workflowsData);
        setKbHealth(healthData);
      } catch (error) {
        console.error('Error loading operations data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const activeJobs = jobs.filter(j => j.status === 'In Progress' || j.status === 'Scheduled');
  const overdueQuotes = leads.filter(l => l.status === 'Quoted' && new Date(l.created) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const activeWorkflows = workflows.filter(w => w.automation === 'Fully automated');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operations AI Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered operational intelligence and automation
          </p>
        </div>
        <Badge variant={kbHealth?.accessible ? "default" : "destructive"} className="h-8">
          {kbHealth?.accessible ? (
            <>
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Knowledge Base Connected
            </>
          ) : (
            <>
              <AlertCircle className="mr-1 h-4 w-4" />
              Knowledge Base Offline
            </>
          )}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs.length}</div>
            <p className="text-xs text-muted-foreground">
              {jobs.length} total jobs tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Quotes</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueQuotes.length}</div>
            <p className="text-xs text-muted-foreground">
              Require follow-up action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWorkflows.length}</div>
            <p className="text-xs text-muted-foreground">
              Automated processes running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter(l => l.status === 'New').length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting initial contact
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="scheduling" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduling">Job Scheduling</TabsTrigger>
          <TabsTrigger value="sync">Supabase ↔ Drive Sync</TabsTrigger>
          <TabsTrigger value="insights">Operational Insights</TabsTrigger>
          <TabsTrigger value="workflows">Workflow Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduling" className="space-y-4">
          <AIModuleCard
            title="AI Job Scheduling"
            description="Intelligent scheduling with weather integration"
            icon={<Calendar className="h-5 w-5" />}
            status="active"
            metrics={[
              { label: 'Jobs This Week', value: activeJobs.length.toString() },
              { label: 'Weather Alerts', value: '2' }
            ]}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <CloudRain className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Weather Advisory</p>
                  <p className="text-xs text-muted-foreground">
                    Rain forecast Thu-Fri. 3 jobs may need rescheduling.
                  </p>
                </div>
                <Button size="sm" variant="outline">Review</Button>
              </div>

              {loading ? (
                <p className="text-sm text-muted-foreground">Loading jobs...</p>
              ) : activeJobs.length > 0 ? (
                <div className="space-y-2">
                  {activeJobs.slice(0, 3).map((job) => (
                    <div key={job.uid} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{job.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'Not scheduled'}
                        </p>
                      </div>
                      <Badge variant={job.status === 'In Progress' ? 'default' : 'secondary'}>
                        {job.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active jobs found</p>
              )}

              <Button className="w-full" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Open Full Calendar
              </Button>
            </div>
          </AIModuleCard>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <AIModuleCard
            title="Supabase ↔ Google Drive Sync"
            description="Real-time bidirectional data synchronization"
            icon={<Database className="h-5 w-5" />}
            status="active"
            metrics={[
              { label: 'Last Sync', value: '2 min ago' },
              { label: 'Files Synced', value: '847' }
            ]}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Supabase</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{jobs.length} jobs, {leads.length} leads</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Google Drive</span>
                  </div>
                  <p className="text-xs text-muted-foreground">847 files synced</p>
                </div>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Recent Sync Activity</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Quote documents uploaded to Drive</p>
                  <p>• Job photos synced from Drive to Supabase</p>
                  <p>• Lead data updated in both systems</p>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <Database className="mr-2 h-4 w-4" />
                View Sync Logs
              </Button>
            </div>
          </AIModuleCard>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <AIModuleCard
            title="Operational Insights"
            description="AI-powered recommendations and alerts"
            icon={<TrendingUp className="h-5 w-5" />}
            status="active"
            metrics={[
              { label: 'Insights', value: '7' },
              { label: 'Priority', value: 'High' }
            ]}
          >
            <div className="space-y-3">
              {overdueQuotes.length > 0 && (
                <div className="p-3 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20 rounded">
                  <p className="text-sm font-medium">Overdue Quote Follow-ups</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {overdueQuotes.length} quotes sent over 7 days ago need follow-up
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Review Quotes
                  </Button>
                </div>
              )}

              <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 rounded">
                <p className="text-sm font-medium">Crew Optimization</p>
                <p className="text-xs text-muted-foreground mt-1">
                  2 jobs in Cranbourne area could be scheduled together
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  View Suggestion
                </Button>
              </div>

              <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded">
                <p className="text-sm font-medium">High Conversion Rate</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Referral leads converting at 78% this month
                </p>
              </div>
            </div>
          </AIModuleCard>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <AIModuleCard
            title="Workflow Automation Status"
            description="Automated processes and triggers"
            icon={<Zap className="h-5 w-5" />}
            status="active"
            metrics={[
              { label: 'Active', value: activeWorkflows.length.toString() },
              { label: 'Completed Today', value: '12' }
            ]}
          >
            <div className="space-y-3">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{workflow.name}</p>
                    <Badge variant={workflow.automation === 'Fully automated' ? 'default' : 'secondary'}>
                      {workflow.automation}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Trigger: {workflow.trigger}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {workflow.steps.length} steps
                  </div>
                </div>
              ))}

              <Button className="w-full" variant="outline">
                <Zap className="mr-2 h-4 w-4" />
                Manage Workflows
              </Button>
            </div>
          </AIModuleCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}