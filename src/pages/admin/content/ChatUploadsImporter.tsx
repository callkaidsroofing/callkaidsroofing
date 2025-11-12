import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Download, Image as ImageIcon, Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ChatUploadsImporter() {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [customTitles, setCustomTitles] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  // Fetch files from the media storage bucket
  const { data: uploadedFiles, isLoading } = useQuery({
    queryKey: ["chat-uploads"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("media").list("", {
        sortBy: { column: "name", order: "desc" },
      });

      if (error) throw error;

      // Build both signed and public URLs to maximize compatibility
      const filesWithUrls = await Promise.all(
        (data || [])
          .filter((file) => file.name !== ".emptyFolderPlaceholder")
          .map(async (file) => {
            const publicUrl = supabase.storage.from("media").getPublicUrl(file.name).data.publicUrl;
            const { data: signed } = await supabase.storage.from("media").createSignedUrl(file.name, 60 * 60); // 1h
            return {
              name: file.name,
              url: publicUrl,
              signedUrl: signed?.signedUrl || publicUrl,
              created_at: (file as any).created_at || undefined,
              size: (file as any).metadata?.size,
            } as any;
          })
      );

      return filesWithUrls;
    },
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      const imagesToImport = Array.from(selectedImages);

      if (imagesToImport.length === 0) {
        throw new Error("No images selected");
      }

      const inserts = imagesToImport.map((imageUrl) => {
        const fileName = imageUrl.split("/").pop() || "Untitled";
        const customTitle = customTitles[imageUrl] || fileName;

        return {
          title: customTitle,
          description: "Imported from chat uploads",
          image_url: imageUrl,
          category: "project",
          is_active: true,
          show_on_homepage: false,
          show_on_about: false,
          show_on_services: false,
          show_on_portfolio: true,
        };
      });

      const { error } = await supabase.from("media_gallery").insert(inserts);

      if (error) throw error;

      return inserts.length;
    },
    onSuccess: (count) => {
      toast.success(`Successfully imported ${count} image${count > 1 ? "s" : ""}`);
      queryClient.invalidateQueries({ queryKey: ["media-gallery"] });
      setSelectedImages(new Set());
      setCustomTitles({});
    },
    onError: (error) => {
      toast.error("Failed to import images: " + error.message);
    },
  });

  const toggleImageSelection = (url: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(url)) {
      newSelection.delete(url);
    } else {
      newSelection.add(url);
    }
    setSelectedImages(newSelection);
  };

  const toggleAll = () => {
    if (selectedImages.size === uploadedFiles?.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(uploadedFiles?.map((f) => f.url) || []));
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Download className="h-8 w-8 text-primary" />
            Chat Uploads Importer
          </h1>
          <p className="text-muted-foreground mt-1">
            Import images uploaded during chat conversations into your media gallery
          </p>
        </div>
        <Button
          onClick={() => importMutation.mutate()}
          disabled={selectedImages.size === 0 || importMutation.isPending}
          size="lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import {selectedImages.size > 0 && `(${selectedImages.size})`}
        </Button>
      </div>

      {/* Stats Card */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Images</p>
              <p className="text-2xl font-bold">{uploadedFiles?.length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="text-2xl font-bold">{selectedImages.size}</p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button onClick={toggleAll} variant="outline">
              {selectedImages.size === uploadedFiles?.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Images Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Chat Uploaded Images ({uploadedFiles?.length || 0})
        </h2>
        {isLoading ? (
          <p className="text-muted-foreground">Loading uploaded images...</p>
        ) : uploadedFiles && uploadedFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedFiles.map((file) => {
              const isSelected = selectedImages.has(file.signedUrl || file.url);
              const src = file.signedUrl || file.url;
              return (
                <Card
                  key={src}
                  className={`overflow-visible transition-all ${
                    isSelected ? "ring-2 ring-primary shadow-xl" : ""
                  }`}
                >
                  <div className="relative aspect-video">
                    <img
                      src={src}
                      alt={file.name}
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (img.src !== file.url) img.src = file.url; // fallback to public
                      }}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleImageSelection(src)}
                        className="bg-background border-2"
                      />
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground truncate">
                        {file.name}
                      </p>
                      {file.created_at && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <div>
                        <Label htmlFor={`title-${file.url}`} className="text-xs">
                          Custom Title (Optional)
                        </Label>
                        <Input
                          id={`title-${file.url}`}
                          placeholder={file.name}
                          value={customTitles[file.url] || ""}
                          onChange={(e) =>
                            setCustomTitles({
                              ...customTitles,
                              [file.url]: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    )}

                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={() => toggleImageSelection(file.url)}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Selected
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Select
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Uploaded Images Found</h3>
            <p className="text-muted-foreground">
              Upload images during chat conversations to see them here
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
