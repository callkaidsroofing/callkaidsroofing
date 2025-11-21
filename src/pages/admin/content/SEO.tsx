import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Search, Target, Award, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Keyword {
  id: string;
  term: string;
  volume: number;
  difficulty: 'low' | 'medium' | 'high';
  ranking?: number;
}

export default function SEO() {
  const { toast } = useToast();
  const [keywords, setKeywords] = useState<Keyword[]>([
    { id: '1', term: 'roof restoration melbourne', volume: 2400, difficulty: 'medium', ranking: 3 },
    { id: '2', term: 'tile roof repairs', volume: 1800, difficulty: 'low', ranking: 7 },
    { id: '3', term: 'gutter replacement', volume: 3200, difficulty: 'high', ranking: 12 },
  ]);
  const [newKeyword, setNewKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;

    const keyword: Keyword = {
      id: Math.random().toString(36).substr(2, 9),
      term: newKeyword.toLowerCase(),
      volume: Math.floor(Math.random() * 5000) + 500,
      difficulty: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
    };

    setKeywords([keyword, ...keywords]);
    setNewKeyword('');
    
    toast({
      title: "Keyword added",
      description: "Keyword has been added to tracking list.",
    });
  };

  const handleRemoveKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'high': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default: return 'bg-muted';
    }
  };

  const analyzeMetaTitle = () => {
    const length = metaTitle.length;
    if (length === 0) return { color: 'text-muted-foreground', message: 'Not set' };
    if (length < 30) return { color: 'text-yellow-600', message: 'Too short' };
    if (length > 60) return { color: 'text-red-600', message: 'Too long' };
    return { color: 'text-green-600', message: 'Optimal' };
  };

  const analyzeMetaDescription = () => {
    const length = metaDescription.length;
    if (length === 0) return { color: 'text-muted-foreground', message: 'Not set' };
    if (length < 120) return { color: 'text-yellow-600', message: 'Too short' };
    if (length > 160) return { color: 'text-red-600', message: 'Too long' };
    return { color: 'text-green-600', message: 'Optimal' };
  };

  const titleAnalysis = analyzeMetaTitle();
  const descriptionAnalysis = analyzeMetaDescription();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">SEO Studio</h1>
          <p className="text-muted-foreground">Optimize content and track search performance</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meta Tags Optimizer</CardTitle>
              <CardDescription>
                Optimize title and description for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <span className={`text-sm ${titleAnalysis.color}`}>
                    {metaTitle.length}/60 - {titleAnalysis.message}
                  </span>
                </div>
                <Input
                  id="metaTitle"
                  placeholder="Expert Roof Restoration Services in Melbourne | Call Kaids Roofing"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  maxLength={70}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <span className={`text-sm ${descriptionAnalysis.color}`}>
                    {metaDescription.length}/160 - {descriptionAnalysis.message}
                  </span>
                </div>
                <Textarea
                  id="metaDescription"
                  placeholder="Professional roof restoration, repairs, and maintenance across Melbourne. Licensed, insured, and committed to quality. Get your free quote today!"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  maxLength={170}
                  rows={3}
                />
              </div>

              <Button className="w-full" onClick={() => toast({ title: "Saved", description: "Meta tags have been updated." })}>
                Save Meta Tags
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyword Tracking</CardTitle>
              <CardDescription>
                Monitor target keywords and rankings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add keyword to track..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <Button onClick={handleAddKeyword}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {keywords.map((keyword) => (
                  <div key={keyword.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{keyword.term}</div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Search className="h-3 w-3" />
                          {keyword.volume.toLocaleString()}/mo
                        </span>
                        {keyword.ranking && (
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Rank #{keyword.ranking}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(keyword.difficulty)} variant="secondary">
                        {keyword.difficulty}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveKeyword(keyword.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Score</CardTitle>
              <CardDescription>
                Current page optimization score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="relative">
                  <div className="text-6xl font-bold text-primary">78</div>
                  <div className="text-sm text-muted-foreground text-center mt-2">Good</div>
                </div>
              </div>
              <div className="space-y-3 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Title Tag</span>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                    <Award className="h-3 w-3 mr-1" />
                    Good
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Meta Description</span>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                    <Award className="h-3 w-3 mr-1" />
                    Good
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Heading Structure</span>
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700">
                    <Award className="h-3 w-3 mr-1" />
                    Fair
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Image Alt Text</span>
                  <Badge variant="secondary" className="bg-red-500/10 text-red-700">
                    <Award className="h-3 w-3 mr-1" />
                    Poor
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Internal Links</span>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                    <Award className="h-3 w-3 mr-1" />
                    Good
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>
                Recommendations to improve SEO
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg bg-muted/50">
                <div className="font-medium text-sm mb-1">Add alt text to images</div>
                <div className="text-sm text-muted-foreground">
                  12 images are missing descriptive alt text
                </div>
              </div>
              <div className="p-3 border rounded-lg bg-muted/50">
                <div className="font-medium text-sm mb-1">Improve page speed</div>
                <div className="text-sm text-muted-foreground">
                  Optimize images to reduce load time by 2.3s
                </div>
              </div>
              <div className="p-3 border rounded-lg bg-muted/50">
                <div className="font-medium text-sm mb-1">Add structured data</div>
                <div className="text-sm text-muted-foreground">
                  Include LocalBusiness schema markup
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
