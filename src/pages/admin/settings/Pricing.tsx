import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RateCard {
  id: string;
  service: string;
  laborRate: number;
  materialRate: number;
  unit: string;
}

interface Material {
  id: string;
  name: string;
  cost: number;
  unit: string;
  supplier: string;
}

export default function Pricing() {
  const { toast } = useToast();
  const [rates, setRates] = useState<RateCard[]>([
    { id: '1', service: 'Roof Restoration', laborRate: 85, materialRate: 45, unit: 'm²' },
    { id: '2', service: 'Roof Repairs', laborRate: 120, materialRate: 35, unit: 'm²' },
    { id: '3', service: 'Gutter Replacement', laborRate: 95, materialRate: 55, unit: 'm' },
    { id: '4', service: 'Tile Replacement', laborRate: 110, materialRate: 40, unit: 'tile' },
  ]);

  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', name: 'Terracotta Tiles', cost: 45, unit: 'tile', supplier: 'Boral' },
    { id: '2', name: 'Concrete Tiles', cost: 35, unit: 'tile', supplier: 'Monier' },
    { id: '3', name: 'Metal Roofing (Colorbond)', cost: 75, unit: 'm²', supplier: 'BlueScope' },
    { id: '4', name: 'Ridge Capping', cost: 85, unit: 'm', supplier: 'Boral' },
  ]);

  const [editingRate, setEditingRate] = useState<string | null>(null);
  const [newService, setNewService] = useState('');
  const [newLaborRate, setNewLaborRate] = useState('');
  const [newMaterialRate, setNewMaterialRate] = useState('');

  const handleAddRate = () => {
    if (!newService || !newLaborRate || !newMaterialRate) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const newRate: RateCard = {
      id: Math.random().toString(36).substr(2, 9),
      service: newService,
      laborRate: parseFloat(newLaborRate),
      materialRate: parseFloat(newMaterialRate),
      unit: 'm²',
    };

    setRates([...rates, newRate]);
    setNewService('');
    setNewLaborRate('');
    setNewMaterialRate('');

    toast({
      title: "Rate card added",
      description: "New service rate has been added successfully.",
    });
  };

  const handleDeleteRate = (id: string) => {
    setRates(rates.filter(r => r.id !== id));
    toast({
      title: "Rate card deleted",
      description: "Service rate has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Pricing Settings</h1>
          <p className="text-muted-foreground">Manage pricing rules and rate cards</p>
        </div>
      </div>

      <Tabs defaultValue="rates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rates">Service Rates</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="markup">Markup Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="rates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Service Rate</CardTitle>
              <CardDescription>
                Define labor and material rates for services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="service">Service Name</Label>
                  <Input
                    id="service"
                    placeholder="Re-bedding & Re-pointing"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="laborRate">Labor Rate ($/m²)</Label>
                  <Input
                    id="laborRate"
                    type="number"
                    placeholder="100"
                    value={newLaborRate}
                    onChange={(e) => setNewLaborRate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materialRate">Material Rate ($/m²)</Label>
                  <Input
                    id="materialRate"
                    type="number"
                    placeholder="30"
                    value={newMaterialRate}
                    onChange={(e) => setNewMaterialRate(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleAddRate} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Service Rate
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {rates.map((rate) => (
              <Card key={rate.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{rate.service}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Labor Rate:</span>
                          <span className="ml-2 font-semibold">${rate.laborRate}/{rate.unit}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Material Rate:</span>
                          <span className="ml-2 font-semibold">${rate.materialRate}/{rate.unit}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Rate:</span>
                          <span className="ml-2 font-semibold text-primary">
                            ${rate.laborRate + rate.materialRate}/{rate.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRate(rate.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Material Costs</CardTitle>
              <CardDescription>
                Track material costs from suppliers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {materials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{material.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Supplier: {material.supplier}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${material.cost}/{material.unit}</div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="markup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Markup Rules</CardTitle>
              <CardDescription>
                Configure profit margins and discounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="standardMarkup">Standard Markup (%)</Label>
                <Input id="standardMarkup" type="number" defaultValue="35" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="materialMarkup">Material Markup (%)</Label>
                <Input id="materialMarkup" type="number" defaultValue="25" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulkDiscount">Bulk Discount Threshold (m²)</Label>
                <Input id="bulkDiscount" type="number" defaultValue="200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulkDiscountRate">Bulk Discount Rate (%)</Label>
                <Input id="bulkDiscountRate" type="number" defaultValue="10" />
              </div>
              <Button className="w-full">Save Markup Rules</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
