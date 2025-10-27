import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Search, Image, Video, FileText, Tag, Eye, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface MediaAsset {
  id: string;
  filename: string;
  file_path: string;
  kind: 'photo' | 'video' | 'document';
  tags: string[];
  meta: any;
  created_at: string;
  job_id?: string;
}

export default function MediaLibrary() {
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
        .from('media_assets' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (filterKind !== 'all') {
        query = query.eq('kind', filterKind);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAssets((data || []) as any);
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

      // Create asset record
      const { error: insertError } = await supabase
        .from('media_assets' as any)
        .insert({
          filename: file.name,
          file_path: uploadData.path,
          kind: file.type.startsWith('image/') ? 'photo' : file.type.startsWith('video/') ? 'video' : 'document',
          tags: [],
          meta: {
            size: file.size,
            type: file.type
          }
        } as any);

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
    return asset.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
           asset.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const getMediaUrl = (path: string) => {
    return `${supabase.storage.from('media').getPublicUrl(path).data.publicUrl}`;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Manage photos, videos, and documents</p>
        </div>
        <div className="flex gap-2">
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
                <TabsTrigger value="photo">
                  <Image className="h-4 w-4 mr-2" />
                  Photos
                </TabsTrigger>
                <TabsTrigger value="video">
                  <Video className="h-4 w-4 mr-2" />
                  Videos
                </TabsTrigger>
                <TabsTrigger value="document">
                  <FileText className="h-4 w-4 mr-2" />
                  Docs
                </TabsTrigger>
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
                      {asset.kind === 'photo' ? (
                        <img 
                          src={getMediaUrl(asset.file_path)} 
                          alt={asset.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : asset.kind === 'video' ? (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Video className="h-12 w-12 text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      {asset.tags && asset.tags.length > 0 && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {asset.tags.length}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{asset.filename}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {asset.kind === 'photo' && (
                        <img 
                          src={getMediaUrl(asset.file_path)} 
                          alt={asset.filename}
                          className="w-full rounded-lg"
                        />
                      )}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <Badge className="ml-2">{asset.kind}</Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Uploaded:</span>
                          <span className="ml-2">{format(new Date(asset.created_at), 'dd/MM/yyyy')}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Size:</span>
                          <span className="ml-2">{asset.meta?.size ? `${(asset.meta.size / 1024).toFixed(1)} KB` : 'Unknown'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tags:</span>
                          <div className="ml-2 flex gap-1 flex-wrap">
                            {asset.tags && asset.tags.length > 0 ? (
                              asset.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-xs">None</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.open(getMediaUrl(asset.file_path), '_blank')}>
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
