import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Plus, Edit, Trash2, ExternalLink, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SuburbPage {
  id: string;
  name: string;
  postcode: string;
  region: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
  keywords: string[];
}

export default function Suburbs() {
  const { toast } = useToast();
  const [suburbs, setSuburbs] = useState<SuburbPage[]>([
    {
      id: '1',
      name: 'Brighton',
      postcode: '3186',
      region: 'Bayside',
      content: 'Expert roofing services in Brighton...',
      metaTitle: 'Roof Restoration Brighton 3186 | Call Kaids Roofing',
      metaDescription: 'Professional roof restoration and repairs in Brighton. Licensed roofers serving 3186 area.',
      published: true,
      keywords: ['brighton roofing', 'roof restoration brighton', '3186 roofer'],
    },
    {
      id: '2',
      name: 'Bentleigh',
      postcode: '3204',
      region: 'Glen Eira',
      content: 'Quality roofing solutions in Bentleigh...',
      metaTitle: 'Bentleigh Roof Repairs & Restoration | Call Kaids Roofing',
      metaDescription: 'Trusted roofing services in Bentleigh 3204. Specializing in tile roof repairs and restoration.',
      published: true,
      keywords: ['bentleigh roofing', 'roof repairs bentleigh', '3204 roofing services'],
    },
    {
      id: '3',
      name: 'Carnegie',
      postcode: '3163',
      region: 'Glen Eira',
      content: 'Reliable roofing contractors in Carnegie...',
      metaTitle: 'Carnegie Roofing Services 3163 | Call Kaids Roofing',
      metaDescription: 'Local roofing experts in Carnegie. All types of roof repairs, restoration, and maintenance.',
      published: false,
      keywords: ['carnegie roofing', 'roof restoration carnegie', '3163 roofer'],
    },
  ]);

  const [selectedSuburb, setSelectedSuburb] = useState<SuburbPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    postcode: '',
    region: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
  });

  const handleSelectSuburb = (suburb: SuburbPage) => {
    setSelectedSuburb(suburb);
    setFormData({
      name: suburb.name,
      postcode: suburb.postcode,
      region: suburb.region,
      content: suburb.content,
      metaTitle: suburb.metaTitle,
      metaDescription: suburb.metaDescription,
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    if (selectedSuburb) {
      setSuburbs(suburbs.map(s => 
        s.id === selectedSuburb.id 
          ? { ...s, ...formData }
          : s
      ));
      toast({
        title: "Suburb page updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const newSuburb: SuburbPage = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        published: false,
        keywords: [],
      };
      setSuburbs([...suburbs, newSuburb]);
      toast({
        title: "Suburb page created",
        description: `${formData.name} has been created successfully.`,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    setSuburbs(suburbs.filter(s => s.id !== id));
    setSelectedSuburb(null);
    toast({
      title: "Suburb page deleted",
      description: "The suburb page has been removed.",
    });
  };

  const handleTogglePublish = (id: string) => {
    setSuburbs(suburbs.map(s => 
      s.id === id 
        ? { ...s, published: !s.published }
        : s
    ));
  };

  const filteredSuburbs = suburbs.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.postcode.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Suburbs Editor</h1>
          <p className="text-muted-foreground">Manage suburb pages and local SEO</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle>Suburbs List</CardTitle>
              <Button size="sm" onClick={() => {
                setSelectedSuburb(null);
                setFormData({
                  name: '',
                  postcode: '',
                  region: '',
                  content: '',
                  metaTitle: '',
                  metaDescription: '',
                });
                setIsEditing(true);
              }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suburbs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredSuburbs.map((suburb) => (
              <div
                key={suburb.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedSuburb?.id === suburb.id ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleSelectSuburb(suburb)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{suburb.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {suburb.postcode} • {suburb.region}
                    </div>
                  </div>
                  {suburb.published ? (
                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400" variant="secondary">
                      Live
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          {selectedSuburb || isEditing ? (
            <Tabs defaultValue="content">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {isEditing ? (selectedSuburb ? 'Edit' : 'New') : ''} {formData.name || 'Suburb Page'}
                  </CardTitle>
                  <div className="flex gap-2">
                    {selectedSuburb && (
                      <>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          variant={selectedSuburb.published ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleTogglePublish(selectedSuburb.id)}
                        >
                          {selectedSuburb.published ? 'Unpublish' : 'Publish'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="content" className="space-y-4 mt-0">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="name">Suburb Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input
                        id="postcode"
                        value={formData.postcode}
                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Page Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      disabled={!isEditing}
                      rows={12}
                      placeholder="Enter suburb-specific content, including services, local landmarks, and relevant information..."
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <div className="flex gap-2">
                      {selectedSuburb && (
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(selectedSuburb.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button variant="outline" onClick={() => {
                            setIsEditing(false);
                            if (selectedSuburb) {
                              handleSelectSuburb(selectedSuburb);
                            } else {
                              setSelectedSuburb(null);
                            }
                          }}>
                            Cancel
                          </Button>
                          <Button onClick={handleSave}>Save Changes</Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      disabled={!isEditing}
                      maxLength={60}
                    />
                    <div className="text-sm text-muted-foreground">
                      {formData.metaTitle.length}/60 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      maxLength={160}
                    />
                    <div className="text-sm text-muted-foreground">
                      {formData.metaDescription.length}/160 characters
                    </div>
                  </div>

                  {selectedSuburb && selectedSuburb.keywords.length > 0 && (
                    <div className="space-y-2">
                      <Label>Target Keywords</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedSuburb.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    {isEditing ? (
                      <>
                        <Button variant="outline" className="mr-2" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>Save SEO Settings</Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit SEO
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          ) : (
            <CardContent className="flex flex-col items-center justify-center py-16">
              <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No suburb selected</h3>
              <p className="text-muted-foreground text-center mb-4">
                Select a suburb from the list or create a new one
              </p>
              <Button onClick={() => {
                setSelectedSuburb(null);
                setFormData({
                  name: '',
                  postcode: '',
                  region: '',
                  content: '',
                  metaTitle: '',
                  metaDescription: '',
                });
                setIsEditing(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Suburb Page
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
