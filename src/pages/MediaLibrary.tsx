import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Search, Image, Video, FileText, Tag, Eye, Download, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface MediaAsset {
  id: string;
  title: string;
  description?: string | null;
  image_url: string;
  category: string;
  featured?: boolean | null;
  created_at: string;
}

export default function MediaLibrary() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKind, setFilterKind] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAssets();
  }, [filterKind]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('media_gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterKind !== 'all') {
        query = query.eq('category', filterKind);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAssets((data || []) as MediaAsset[]);
    } catch (error) {
      console.error('Error loading assets:', error);
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('media')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(uploadData.path);

      // Create asset record in content_gallery
      const { error: insertError } = await supabase
        .from('content_gallery')
        .insert({
          title: file.name,
          description: `Uploaded ${new Date().toLocaleDateString()}`,
          image_url: urlData.publicUrl,
          category: 'general',
          featured: false
        });

      if (insertError) throw insertError;

      toast.success('Media uploaded successfully');
      loadAssets();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    if (!searchQuery) return true;
    return asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
           asset.description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>({});

  const extractPath = (url: string) => {
    const marker = '/storage/v1/object/public/media/';
    if (!url) return '';
    if (url.includes(marker)) return url.split(marker)[1];
    if (!url.startsWith('http')) return url.replace(/^\/+/, '');
    return '';
  };

  useEffect(() => {
    const blobUrls: string[] = [];
    
    const run = async () => {
      if (!assets || assets.length === 0) return;
      const entries: Array<[string, string]> = [];
      
      await Promise.all(
        assets.map(async (asset) => {
          const path = extractPath(asset.image_url);
          try {
            if (path) {
              const { data: blob, error } = await supabase.storage
                .from('media')
                .download(path);
              
              if (blob && !error) {
                const blobUrl = URL.createObjectURL(blob);
                blobUrls.push(blobUrl);
                entries.push([asset.id, blobUrl]);
                return;
              }
            }
            entries.push([asset.id, asset.image_url]);
          } catch (e) {
            console.warn('Blob download failed for', path, e);
            entries.push([asset.id, asset.image_url]);
          }
        })
      );
      
      setResolvedUrls(Object.fromEntries(entries));
    };
    
    run();
    
    return () => {
      blobUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [assets]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Manage photos, videos, and documents</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/admin/content/media/imports')}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Import Chat Uploads
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <label htmlFor="file-upload">
            <Button disabled={uploading} asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Media'}
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by filename or tags..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-10" 
              />
            </div>
            <Tabs value={filterKind} onValueChange={setFilterKind}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="project">Projects</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="testimonial">Testimonials</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No media found. Upload your first file.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {filteredAssets.map((asset) => (
                <Dialog key={asset.id}>
                  <DialogTrigger asChild>
                    <div 
                      className="relative aspect-square rounded-lg overflow-hidden border cursor-pointer hover:border-primary transition-colors group"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <img 
                        src={resolvedUrls[asset.id] ?? asset.image_url} 
                        alt={asset.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant={asset.featured ? "default" : "secondary"} className="text-xs">
                          {asset.featured ? 'Featured' : 'Standard'}
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-sm font-medium truncate">{asset.title}</p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{asset.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <img 
                        src={resolvedUrls[asset.id] ?? asset.image_url} 
                        alt={asset.title}
                        className="w-full rounded-lg"
                      />
                      {asset.description && (
                        <p className="text-sm text-muted-foreground">{asset.description}</p>
                      )}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Category:</span>
                          <Badge className="ml-2">{asset.category}</Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Uploaded:</span>
                          <span className="ml-2">{format(new Date(asset.created_at), 'dd/MM/yyyy')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.open(resolvedUrls[asset.id] ?? asset.image_url, '_blank')}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
