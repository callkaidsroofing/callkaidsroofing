import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Trash2, Eye, EyeOff, Home, User, Briefcase, FolderOpen } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MediaGallery() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("general");
  const queryClient = useQueryClient();

  const { data: media, isLoading } = useQuery({
    queryKey: ["media-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_gallery")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("media_gallery").insert({
        title,
        description,
        image_url: imageUrl,
        category,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Image added to gallery");
      queryClient.invalidateQueries({ queryKey: ["media-gallery"] });
      setTitle("");
      setDescription("");
      setImageUrl("");
      setCategory("general");
    },
    onError: (error) => {
      toast.error("Failed to add image: " + error.message);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: boolean }) => {
      const { error } = await supabase
        .from("media_gallery")
        .update({ [field]: value })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-gallery"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("media_gallery").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Image deleted");
      queryClient.invalidateQueries({ queryKey: ["media-gallery"] });
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Gallery</h1>
          <p className="text-muted-foreground">Upload and manage images for your website</p>
        </div>
      </div>

      {/* Upload Form */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Image</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Image title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="testimonial">Testimonial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => uploadMutation.mutate()}
            disabled={!title || !imageUrl || uploadMutation.isPending}
          >
            <Upload className="w-4 h-4 mr-2" />
            Add to Gallery
          </Button>
        </div>
      </Card>

      {/* Gallery Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Images ({media?.length || 0})</h2>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {media?.map((item) => (
              <Card key={item.id} className="overflow-visible">
                <div className="aspect-video relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Category: {item.category}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold">Display on:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={item.show_on_homepage ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          toggleMutation.mutate({
                            id: item.id,
                            field: "show_on_homepage",
                            value: !item.show_on_homepage,
                          })
                        }
                      >
                        <Home className="w-3 h-3 mr-1" />
                        Home
                      </Button>
                      <Button
                        variant={item.show_on_about ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          toggleMutation.mutate({
                            id: item.id,
                            field: "show_on_about",
                            value: !item.show_on_about,
                          })
                        }
                      >
                        <User className="w-3 h-3 mr-1" />
                        About
                      </Button>
                      <Button
                        variant={item.show_on_services ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          toggleMutation.mutate({
                            id: item.id,
                            field: "show_on_services",
                            value: !item.show_on_services,
                          })
                        }
                      >
                        <Briefcase className="w-3 h-3 mr-1" />
                        Services
                      </Button>
                      <Button
                        variant={item.show_on_portfolio ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          toggleMutation.mutate({
                            id: item.id,
                            field: "show_on_portfolio",
                            value: !item.show_on_portfolio,
                          })
                        }
                      >
                        <FolderOpen className="w-3 h-3 mr-1" />
                        Portfolio
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toggleMutation.mutate({
                          id: item.id,
                          field: "is_active",
                          value: !item.is_active,
                        })
                      }
                    >
                      {item.is_active ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
