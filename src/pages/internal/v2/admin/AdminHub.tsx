import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Users, FileStack, Upload, Database, Sparkles, 
  ArrowRight, Shield, Zap
} from 'lucide-react';

const adminTools = [
  {
    title: 'User Management',
    description: 'Manage user accounts, roles, and permissions',
    icon: Users,
    path: '/internal/v2/admin/users',
    color: 'bg-blue-500/10 text-blue-500',
    badge: 'Access Control',
  },
  {
    title: 'Knowledge Files',
    description: 'Browse, edit, and manage knowledge base files',
    icon: FileStack,
    path: '/internal/v2/admin/storage',
    color: 'bg-purple-500/10 text-purple-500',
    badge: 'Storage',
  },
  {
    title: 'Upload Knowledge',
    description: 'Upload new documents with AI-powered categorization',
    icon: Upload,
    path: '/internal/v2/admin/upload',
    color: 'bg-green-500/10 text-green-500',
    badge: 'Import',
  },
  {
    title: 'Generate Embeddings',
    description: 'Create vector embeddings for RAG search',
    icon: Database,
    path: '/internal/v2/admin/embeddings',
    color: 'bg-orange-500/10 text-orange-500',
    badge: 'AI',
  },
  {
    title: 'AI Assistant',
    description: 'Internal AI assistant for admin tasks',
    icon: Sparkles,
    path: '/internal/v2/ai-assistant',
    color: 'bg-pink-500/10 text-pink-500',
    badge: 'Chat',
  },
];

export default function AdminHub() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-primary/10">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Hub</h1>
          <p className="text-muted-foreground">
            Central dashboard for all administrative tools and functions
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">96</span>
              <span className="text-sm text-muted-foreground">documents</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              RAG Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">26%</span>
              <span className="text-sm text-muted-foreground">embedded</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              <span className="text-lg font-semibold text-green-500">Operational</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tools Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Administrative Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminTools.map((tool) => (
            <Card
              key={tool.path}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(tool.path)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${tool.color}`}>
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {tool.badge}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  Open Tool
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate('/internal/v2/admin/upload')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New Knowledge File
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate('/internal/v2/admin/embeddings')}
          >
            <Database className="h-4 w-4 mr-2" />
            Generate Missing Embeddings
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate('/internal/v2/admin/storage')}
          >
            <FileStack className="h-4 w-4 mr-2" />
            Browse Knowledge Files
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
