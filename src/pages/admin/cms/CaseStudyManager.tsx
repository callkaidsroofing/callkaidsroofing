import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Loader2, Trash2, Star, CheckCircle2, X } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface PhotoPair {
  before: File | null;
  after: File | null;
  alt: string;
}

interface ReviewData {
  file: File | null;
  customerName: string;
  rating: number;
  platform: 'Google' | 'Facebook';
  date: string;
  text: string;
}

const CaseStudyManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Case study metadata
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');

  // Photo pairs (5 pairs = 10 images)
  const [photoPairs, setPhotoPairs] = useState<PhotoPair[]>([
    { before: null, after: null, alt: '' },
    { before: null, after: null, alt: '' },
    { before: null, after: null, alt: '' },
    { before: null, after: null, alt: '' },
    { before: null, after: null, alt: '' },
  ]);

  // Main customer review (linked to photos)
  const [mainReview, setMainReview] = useState<ReviewData>({
    file: null,
    customerName: '',
    rating: 5,
    platform: 'Google',
    date: '',
    text: '',
  });

  // Additional reviews (4 reviews)
  const [additionalReviews, setAdditionalReviews] = useState<ReviewData[]>([
    { file: null, customerName: '', rating: 5, platform: 'Google', date: '', text: '' },
    { file: null, customerName: '', rating: 5, platform: 'Google', date: '', text: '' },
    { file: null, customerName: '', rating: 5, platform: 'Google', date: '', text: '' },
    { file: null, customerName: '', rating: 5, platform: 'Google', date: '', text: '' },
  ]);

  // Fetch existing case studies
  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ['case-studies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  const updatePhotoPair = (index: number, field: 'before' | 'after' | 'alt', value: File | string | null) => {
    const newPairs = [...photoPairs];
    if (field === 'alt') {
      newPairs[index].alt = value as string;
    } else {
      newPairs[index][field] = value as File | null;
    }
    setPhotoPairs(newPairs);
  };

  const updateMainReview = (field: keyof ReviewData, value: any) => {
    setMainReview(prev => ({ ...prev, [field]: value }));
  };

  const updateAdditionalReview = (index: number, field: keyof ReviewData, value: any) => {
    const newReviews = [...additionalReviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setAdditionalReviews(newReviews);
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async () => {
    // Validation
    if (!title || !location || !service || !description) {
      toast({ title: "Error", description: "Please fill in all case study metadata", variant: "destructive" });
      return;
    }

    const hasAllPhotos = photoPairs.every(pair => pair.before && pair.after);
    if (!hasAllPhotos) {
      toast({ title: "Error", description: "Please upload all 5 before/after photo pairs", variant: "destructive" });
      return;
    }

    if (!mainReview.file || !mainReview.customerName || !mainReview.text) {
      toast({ title: "Error", description: "Please complete the main customer review", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      // 1. Create case study record
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const { data: caseStudy, error: caseStudyError } = await supabase
        .from('case_studies')
        .insert({
          title,
          location,
          service,
          description,
          slug,
          published: true,
          featured: true,
          customer_review: null, // Will update after uploading review image
          additional_reviews: [],
        })
        .select()
        .single();

      if (caseStudyError) throw caseStudyError;

      // 2. Upload before/after photo pairs to content_gallery
      for (let i = 0; i < photoPairs.length; i++) {
        const pair = photoPairs[i];
        if (!pair.before || !pair.after) continue;

        const beforeUrl = await uploadFile(pair.before, 'case-studies/before');
        const afterUrl = await uploadFile(pair.after, 'case-studies/after');

        // Insert before image
        await supabase.from('content_gallery').insert({
          title: `${title} - Before ${i + 1}`,
          image_url: beforeUrl,
          category: 'before',
          case_study_id: caseStudy.id,
          display_order: i,
          featured: i === 0,
        });

        // Insert after image
        await supabase.from('content_gallery').insert({
          title: `${title} - After ${i + 1}`,
          image_url: afterUrl,
          category: 'after',
          case_study_id: caseStudy.id,
          display_order: i,
          featured: i === 0,
        });
      }

      // 3. Upload main review screenshot
      const mainReviewUrl = await uploadFile(mainReview.file, 'reviews');
      const mainReviewData = {
        customerName: mainReview.customerName,
        rating: mainReview.rating,
        platform: mainReview.platform,
        date: mainReview.date,
        text: mainReview.text,
        imageUrl: mainReviewUrl,
      };

      // 4. Upload additional review screenshots
      const additionalReviewsData = [];
      for (const review of additionalReviews) {
        if (review.file && review.customerName && review.text) {
          const reviewUrl = await uploadFile(review.file, 'reviews');
          additionalReviewsData.push({
            customerName: review.customerName,
            rating: review.rating,
            platform: review.platform,
            date: review.date,
            text: review.text,
            imageUrl: reviewUrl,
          });
        }
      }

      // 5. Update case study with review data
      const { error: updateError } = await supabase
        .from('case_studies')
        .update({
          customer_review: mainReviewData,
          additional_reviews: additionalReviewsData,
        })
        .eq('id', caseStudy.id);

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: `Case study "${title}" uploaded successfully`,
      });

      // Reset form
      setTitle('');
      setLocation('');
      setService('');
      setDescription('');
      setPhotoPairs([
        { before: null, after: null, alt: '' },
        { before: null, after: null, alt: '' },
        { before: null, after: null, alt: '' },
        { before: null, after: null, alt: '' },
        { before: null, after: null, alt: '' },
      ]);
      setMainReview({ file: null, customerName: '', rating: 5, platform: 'Google', date: '', text: '' });
      setAdditionalReviews([
        { file: null, customerName: '', rating: 5, platform: 'Google', date: '', text: '' },
        { file: null, customerName: '', rating: 5, platform: 'Google', date: '', text: '' },
        { file: null, customerName: '', rating: 5, platform: 'Google', date: '', text: '' },
        { file: null, customerName: '', rating: 5, platform: 'Google', date: '', text: '' },
      ]);

      queryClient.invalidateQueries({ queryKey: ['case-studies'] });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Failed to upload case study',
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this case study? This will also remove all associated photos.')) return;

    try {
      await supabase.from('case_studies').delete().eq('id', id);
      await supabase.from('content_gallery').delete().eq('case_study_id', id);

      toast({ title: "Deleted", description: "Case study removed" });
      queryClient.invalidateQueries({ queryKey: ['case-studies'] });
    } catch (error) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Case Study Manager</h1>
        <p className="text-sm text-muted-foreground">
          Upload complete project stories: Before/after photos + customer review
        </p>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Case Study</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Case Study Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Complete Roof Restoration"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Berwick"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service">Service *</Label>
              <Input
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g., Roof Restoration"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full restoration including rebedding, repointing, and membrane coating..."
              rows={3}
            />
          </div>

          {/* Photo Pairs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Before/After Photos (5 pairs required)</h3>
              <CheckCircle2 className={`h-5 w-5 ${photoPairs.every(p => p.before && p.after) ? 'text-green-500' : 'text-muted-foreground'}`} />
            </div>

            {photoPairs.map((pair, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Before Photo {index + 1} *</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => updatePhotoPair(index, 'before', e.target.files?.[0] || null)}
                    />
                    {pair.before && <p className="text-xs text-green-600">✓ {pair.before.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>After Photo {index + 1} *</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => updatePhotoPair(index, 'after', e.target.files?.[0] || null)}
                    />
                    {pair.after && <p className="text-xs text-green-600">✓ {pair.after.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={pair.alt}
                      onChange={(e) => updatePhotoPair(index, 'alt', e.target.value)}
                      placeholder="e.g., Ridge capping restoration"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Main Customer Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Main Customer Review (linked to photos)</h3>
            <Card className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Review Screenshot *</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateMainReview('file', e.target.files?.[0] || null)}
                  />
                  {mainReview.file && <p className="text-xs text-green-600">✓ {mainReview.file.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Customer Name *</Label>
                  <Input
                    value={mainReview.customerName}
                    onChange={(e) => updateMainReview('customerName', e.target.value)}
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Platform *</Label>
                  <Select value={mainReview.platform} onValueChange={(value) => updateMainReview('platform', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    value={mainReview.date}
                    onChange={(e) => updateMainReview('date', e.target.value)}
                    placeholder="e.g., December 2024"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Review Text *</Label>
                <Textarea
                  value={mainReview.text}
                  onChange={(e) => updateMainReview('text', e.target.value)}
                  placeholder="Copy the full review text here..."
                  rows={3}
                />
              </div>
            </Card>
          </div>

          {/* Additional Reviews */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Reviews (optional, up to 4)</h3>
            {additionalReviews.map((review, index) => (
              <Card key={index} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Review {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateAdditionalReview(index, 'file', null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Screenshot</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => updateAdditionalReview(index, 'file', e.target.files?.[0] || null)}
                    />
                    {review.file && <p className="text-xs text-green-600">✓ {review.file.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Name</Label>
                    <Input
                      value={review.customerName}
                      onChange={(e) => updateAdditionalReview(index, 'customerName', e.target.value)}
                      placeholder="Customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select
                      value={review.platform}
                      onValueChange={(value) => updateAdditionalReview(index, 'platform', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Google">Google</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      value={review.date}
                      onChange={(e) => updateAdditionalReview(index, 'date', e.target.value)}
                      placeholder="e.g., November 2024"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Review Text</Label>
                  <Textarea
                    value={review.text}
                    onChange={(e) => updateAdditionalReview(index, 'text', e.target.value)}
                    placeholder="Review text..."
                    rows={2}
                  />
                </div>
              </Card>
            ))}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isUploading}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading Case Study...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Upload Complete Case Study
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Case Studies */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Case Studies ({caseStudies?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : caseStudies && caseStudies.length > 0 ? (
            <div className="space-y-4">
              {caseStudies.map((study: any) => (
                <Card key={study.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{study.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {study.location} • {study.service}
                      </p>
                      <p className="text-sm mt-2">{study.description}</p>
                      {study.featured && (
                        <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(study.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No case studies yet. Create one above.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseStudyManager;
