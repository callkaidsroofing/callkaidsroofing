import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, GitBranch, Key, Zap } from "lucide-react";

export default function Dependencies() {
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  // This would be loaded from the generated dependency map JSON
  const dependencyData = {
    "send-lead-notification": {
      status: "active",
      called_from: ["src/components/QuickCaptureForm.tsx", "src/components/HeroConversionForm.tsx"],
      tables_used: ["leads"],
      secrets_required: ["RESEND_API_KEY", "BUSINESS_EMAIL"],
      calls_functions: [],
      verify_jwt: false,
      lines_of_code: 127
    },
    "rag-search": {
      status: "active",
      called_from: ["src/components/SmartPricingSuggestions.tsx", "src/components/SmartContentSuggestions.tsx"],
      tables_used: ["master_knowledge"],
      secrets_required: ["OPENAI_API_KEY"],
      calls_functions: [],
      verify_jwt: false,
      lines_of_code: 215
    },
    "process-quote": {
      status: "active",
      called_from: ["src/pages/admin/QuickQuote.tsx"],
      tables_used: ["quotes", "quote_line_items", "pricing_items"],
      secrets_required: [],
      calls_functions: [],
      verify_jwt: true,
      lines_of_code: 342
    }
  };

  const stats = {
    total_functions: 48,
    active_functions: 25,
    dormant_functions: 20,
    total_tables: 60,
    active_tables: 28,
    orphaned_functions: ["admin-user-management", "ai-quote-helper", "notion-sync-content"]
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edge Function Dependencies</h1>
        <p className="text-muted-foreground">
          Visual map of all edge functions, database tables, secrets, and call paths
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Functions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_functions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active_functions} active, {stats.dormant_functions} dormant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Tables</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_tables}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active_tables} with data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secrets Used</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Across all functions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orphaned Functions</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orphaned_functions.length}</div>
            <p className="text-xs text-muted-foreground">
              Never called from frontend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="functions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="functions">Functions</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="secrets">Secrets</TabsTrigger>
          <TabsTrigger value="graph">Dependency Graph</TabsTrigger>
        </TabsList>

        <TabsContent value="functions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Edge Functions</CardTitle>
              <CardDescription>
                Click a function to view its dependencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {Object.entries(dependencyData).map(([name, data]) => (
                    <Card
                      key={name}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => setSelectedFunction(name)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-sm">{name}</CardTitle>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant={data.status === "active" ? "default" : "secondary"}>
                                {data.status}
                              </Badge>
                              {data.verify_jwt && <Badge variant="outline">🔐 JWT</Badge>}
                              <Badge variant="outline">{data.lines_of_code} LOC</Badge>
                            </div>
                          </div>
                        </div>
                        
                        {selectedFunction === name && (
                          <div className="mt-4 space-y-3 text-sm">
                            {data.tables_used.length > 0 && (
                              <div>
                                <span className="font-medium">Tables:</span>
                                <div className="flex gap-2 mt-1 flex-wrap">
                                  {data.tables_used.map(table => (
                                    <Badge key={table} variant="secondary">
                                      <Database className="h-3 w-3 mr-1" />
                                      {table}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {data.secrets_required.length > 0 && (
                              <div>
                                <span className="font-medium">Secrets:</span>
                                <div className="flex gap-2 mt-1 flex-wrap">
                                  {data.secrets_required.map(secret => (
                                    <Badge key={secret} variant="secondary">
                                      <Key className="h-3 w-3 mr-1" />
                                      {secret}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {data.called_from.length > 0 && (
                              <div>
                                <span className="font-medium">Called from:</span>
                                <ul className="mt-1 space-y-1">
                                  {data.called_from.map(path => (
                                    <li key={path} className="text-muted-foreground text-xs font-mono">
                                      {path}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>
                Tables used by edge functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Table dependency analysis will be loaded from dependency scanner output
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="secrets">
          <Card>
            <CardHeader>
              <CardTitle>Environment Secrets</CardTitle>
              <CardDescription>
                Secrets used across all functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["OPENAI_API_KEY", "RESEND_API_KEY", "BUSINESS_EMAIL"].map(secret => (
                  <div key={secret} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      <span className="font-mono text-sm">{secret}</span>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graph">
          <Card>
            <CardHeader>
              <CardTitle>Visual Dependency Graph</CardTitle>
              <CardDescription>
                Interactive visualization of function relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Interactive graph visualization will be added in Week 2</p>
                <p className="text-sm mt-2">Using D3.js or React Flow</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
