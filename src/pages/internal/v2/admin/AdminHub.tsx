import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Users, FileStack, Upload, Database, Sparkles, 
  Shield, ChevronRight
} from 'lucide-react';

const adminTools = [
  {
    title: 'Users',
    icon: Users,
    path: '/admin/system/users',
    gradient: 'from-blue-500/20 to-blue-600/10',
  },
  {
    title: 'Knowledge',
    icon: FileStack,
    path: '/admin/system/storage',
    gradient: 'from-purple-500/20 to-purple-600/10',
  },
  {
    title: 'Upload',
    icon: Upload,
    path: '/admin/system/upload',
    gradient: 'from-green-500/20 to-green-600/10',
  },
  {
    title: 'Embeddings',
    icon: Database,
    path: '/admin/system/embeddings',
    gradient: 'from-orange-500/20 to-orange-600/10',
  },
  {
    title: 'AI Assistant',
    icon: Sparkles,
    path: '/admin/ai-assistant',
    gradient: 'from-pink-500/20 to-pink-600/10',
  },
];

export default function AdminHub() {
  const navigate = useNavigate();
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-8 space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-12 bg-gradient-to-br from-primary/10 via-secondary/5 to-background border border-primary/20">
        <div className="absolute inset-0 pattern-overlay opacity-30" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-primary/10 backdrop-blur-sm">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-2">System Admin</h1>
            <p className="text-lg text-muted-foreground">Knowledge & user management</p>
          </div>
        </div>
      </div>

      {/* Simplified Admin Tools Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {adminTools.map((tool) => (
          <Card
            key={tool.path}
            className={`relative overflow-hidden cursor-pointer group hover-lift border-primary/20 transition-all duration-300 ${
              hoveredTool === tool.path ? 'ring-2 ring-primary/50' : ''
            }`}
            onClick={() => navigate(tool.path)}
            onMouseEnter={() => setHoveredTool(tool.path)}
            onMouseLeave={() => setHoveredTool(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10 p-6 flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                <tool.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {tool.title}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
