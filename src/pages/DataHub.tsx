import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database } from 'lucide-react';

export default function DataHub() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Data Hub</h1>
        <p className="text-muted-foreground">Single source of truth for all entities</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entity Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inspections">
            <TabsList>
              <TabsTrigger value="inspections">Inspections</TabsTrigger>
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="inspections" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Inspections data table coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="quotes" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Quotes data table coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="invoices" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Invoices data table coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="clients" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Clients data table coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Projects data table coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
