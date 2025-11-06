import { useEffect, useState } from 'react';
import { FileText, Image as ImageIcon, Globe, Calendar, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { AIModuleCard } from '@/components/AIModuleCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { loadCaseStudies, loadTestimonials, loadProofPoints, loadBrandGuidelines, checkKnowledgeBaseHealth } from '@/lib/knowledgeBase';
import { toast } from 'sonner';

interface CaseStudy {
  uid: string;
  title: string;
  jobUID: string;
  suburb: string;
  service: string;
  beforeImage: string;
  afterImage: string;
  testimonial: string;
  published: boolean;
}

interface Testimonial {
  uid: string;
  clientName: string;
  jobUID: string;
  rating: number;
  text: string;
  date: string;
  featured: boolean;
}

export default function ContentEngine() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [proofPoints, setProofPoints] = useState<any>(null);
  const [brandGuidelines, setBrandGuidelines] = useState<any>(null);
  const [kbHealth, setKbHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('markdown');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studies, testimonialData, proof, brand, health] = await Promise.all([
          loadCaseStudies(),
          loadTestimonials(),
          loadProofPoints(),
          loadBrandGuidelines(),
          checkKnowledgeBaseHealth()
        ]);
        
        setCaseStudies(studies);
        setTestimonials(testimonialData);
        setProofPoints(proof);
        setBrandGuidelines(brand);
        setKbHealth(health);
      } catch (error) {
        console.error('Failed to load content data:', error);
        toast.error('Failed to load content data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const publishedCaseStudies = caseStudies.filter(cs => cs.published);
  const featuredTestimonials = testimonials.filter(t => t.featured);

  const contentMetrics = [
    { label: 'Case Studies', value: publishedCaseStudies.length },
    { label: 'Testimonials', value: testimonials.length },
    { label: 'Featured', value: featuredTestimonials.length },
    { label: 'Avg Rating', value: testimonials.length > 0 ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '0' }
  ];

  const handleGenerateCaseStudy = (studyId: string) => {
    toast.success('Case study generation started', {
      description: 'Your case study will be ready in a few moments'
    });
  };

  const handleGenerateBlogPost = () => {
    toast.success('Blog post generation started', {
      description: 'AI is crafting your SEO-optimized content'
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0B3B69] mb-2">Content Engine Studio</h1>
          <p className="text-muted-foreground">
            AI-powered content generation for case studies, blog posts, and marketing materials
          </p>
        </div>
        <Badge variant={kbHealth?.accessible ? "default" : "destructive"} className="h-8">
          {kbHealth?.accessible ? (
            <>
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Knowledge Base: {kbHealth?.structure}
            </>
          ) : (
            <>
              <AlertCircle className="mr-1 h-4 w-4" />
              Knowledge Base Offline
            </>
          )}
        </Badge>
      </div>

      {/* Brand Voice Guidelines */}
      {brandGuidelines && (
        <Card className="border-l-4 border-l-[#007ACC]">
          <CardHeader>
            <CardTitle className="text-[#0B3B69]">Brand Voice Guidelines</CardTitle>
            <CardDescription>All content follows CKR brand standards from MKF_01</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Tone</p>
                <p className="text-sm">{brandGuidelines.voice.tone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Style</p>
                <p className="text-sm">{brandGuidelines.voice.style}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Tagline</p>
                <p className="text-sm font-semibold text-[#007ACC]">{brandGuidelines.messaging.tagline}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Metrics */}
      <AIModuleCard
        title="Content Production Overview"
        description="Track your AI-generated content across all channels"
        icon={Sparkles}
        status="active"
        metrics={contentMetrics}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="case-studies" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          <TabsTrigger value="blog-posts">Blog Posts</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        {/* Case Studies Tab */}
        <TabsContent value="case-studies" className="space-y-4 mt-6">
          <Card className="border-l-4 border-l-[#007ACC]">
            <CardHeader>
              <CardTitle className="text-[#0B3B69]">Auto-Generate Case Studies</CardTitle>
              <CardDescription>
                Transform completed jobs into compelling case studies with before/after visuals (from MKF_07 template)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Output format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-[#007ACC] hover:bg-[#0B3B69]">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate New Case Study
                </Button>
              </div>

              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading case studies from knowledge base...</p>
              ) : caseStudies.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {publishedCaseStudies.map((study) => (
                    <Card key={study.uid} className="overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-[#007ACC]/20 to-[#0B3B69]/20 flex items-center justify-center">
                        {study.beforeImage ? (
                          <img src={study.beforeImage} alt={study.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-[#007ACC]" />
                        )}
                      </div>
                      <CardContent className="pt-4">
                        <h4 className="font-semibold text-[#0B3B69] mb-1">{study.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{study.suburb}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{study.service}</Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleGenerateCaseStudy(study.uid)}
                          >
                            Regenerate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No case studies found in knowledge base</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blog Posts Tab */}
        <TabsContent value="blog-posts" className="space-y-4 mt-6">
          <Card className="border-l-4 border-l-[#007ACC]">
            <CardHeader>
              <CardTitle className="text-[#0B3B69]">SEO-Optimized Blog Content</CardTitle>
              <CardDescription>
                Generate blog posts mapped to local SEO matrix (Tier 1-3 intent keywords from CKR_03_SEO_KEYWORD_MATRIX.csv)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">Topic/Keyword</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="roof-restoration-clyde-north">Roof Restoration Clyde North (Tier 1)</SelectItem>
                      <SelectItem value="roof-painting-cranbourne">Roof Painting Cranbourne (Tier 1)</SelectItem>
                      <SelectItem value="gutter-cleaning-guide">Gutter Cleaning Guide (Tier 2)</SelectItem>
                      <SelectItem value="roof-maintenance">Roof Maintenance Checklist (Tier 3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">SEO Tier</label>
                  <Select defaultValue="tier-2">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tier-1">Tier 1 (High Intent - Transactional)</SelectItem>
                      <SelectItem value="tier-2">Tier 2 (Medium Intent - Consideration)</SelectItem>
                      <SelectItem value="tier-3">Tier 3 (Informational - Awareness)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                className="w-full bg-[#007ACC] hover:bg-[#0B3B69]"
                onClick={handleGenerateBlogPost}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Blog Post (Using MKF_06 Copy Kit)
              </Button>

              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-[#0B3B69]">Recent Blog Posts</h4>
                {[
                  { title: '5 Signs Your Roof Needs Restoration', date: '2024-11-01', status: 'Published', tier: 'Tier 2' },
                  { title: 'Complete Guide to Gutter Cleaning', date: '2024-10-28', status: 'Published', tier: 'Tier 3' },
                  { title: 'Roof Restoration Clyde North - Expert Service', date: '2024-10-25', status: 'Draft', tier: 'Tier 1' }
                ].map((post, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-[#0B3B69]">{post.title}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">{post.date}</p>
                          <Badge variant="outline" className="text-xs">{post.tier}</Badge>
                        </div>
                      </div>
                      <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials" className="space-y-4 mt-6">
          <Card className="border-l-4 border-l-[#007ACC]">
            <CardHeader>
              <CardTitle className="text-[#0B3B69]">Testimonial Carousels & Proof Packages</CardTitle>
              <CardDescription>
                Build dynamic testimonial displays with before/after visuals (from MKF_08 Proof Points)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {proofPoints && (
                <div className="grid gap-4 md:grid-cols-4 mb-6">
                  <Card className="p-4 text-center">
                    <p className="text-3xl font-bold text-[#007ACC]">{proofPoints.statistics.projectsCompleted}</p>
                    <p className="text-sm text-muted-foreground mt-1">Projects Completed</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-3xl font-bold text-[#007ACC]">{proofPoints.statistics.satisfactionRate}</p>
                    <p className="text-sm text-muted-foreground mt-1">Satisfaction Rate</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-3xl font-bold text-[#007ACC]">{proofPoints.statistics.warrantyYears} Years</p>
                    <p className="text-sm text-muted-foreground mt-1">Warranty Coverage</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-3xl font-bold text-[#007ACC]">{testimonials.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Total Testimonials</p>
                  </Card>
                </div>
              )}

              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading testimonials...</p>
              ) : testimonials.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#0B3B69]">Featured Testimonials</h4>
                  {featuredTestimonials.slice(0, 3).map((testimonial) => (
                    <Card key={testimonial.uid} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-[#0B3B69]">{testimonial.clientName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < testimonial.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                            ))}
                          </div>
                        </div>
                        <Badge variant="secondary">Featured</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(testimonial.date).toLocaleDateString()}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No testimonials found in knowledge base</p>
              )}

              <Button className="w-full bg-[#007ACC] hover:bg-[#0B3B69]">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Testimonial Package
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Publishing Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0B3B69]">
            <Calendar className="h-5 w-5" />
            Publishing Schedule (GWA Workflows)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-[#0B3B69]">Weekly Blog Post</p>
                <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM • Workflow: MKF_09</p>
              </div>
              <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-[#0B3B69]">Case Study Generation</p>
                <p className="text-sm text-muted-foreground">After project completion • Workflow: MKF_12</p>
              </div>
              <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-[#0B3B69]">GBP Content Update</p>
                <p className="text-sm text-muted-foreground">Every Wednesday at 10:00 AM • Workflow: MKF_13</p>
              </div>
              <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}