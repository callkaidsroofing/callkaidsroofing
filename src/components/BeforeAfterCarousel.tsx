import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface ProjectAnalysis {
  stage: 'before' | 'after';
  roofType: string;
  condition: string;
  issues: string[];
  improvements: string[];
  lighting: string;
  confidence: number;
  description: string;
}

interface ProjectPair {
  before: {
    url: string;
    analysis: ProjectAnalysis;
  };
  after: {
    url: string;
    analysis: ProjectAnalysis;
  };
  location: string;
  workPerformed: string;
  confidence: number;
  testimonial?: string;
}

const projectImages = [
  '/images/testimonials/review-instagram-oct24.png',
  '/images/projects/before-nov02-1.jpg',
  '/images/projects/after-nov02-1.jpg',
  '/images/projects/before-nov01-1.jpg',
  '/images/projects/after-nov01-1.jpg',
  '/images/projects/before-nov02-2.jpg',
  '/images/projects/after-oct05.jpg',
  '/images/projects/before-oct15-1.jpg',
  '/images/projects/before-oct15-2.jpg',
  '/images/projects/after-oct15.jpg'
];

export const BeforeAfterCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [projects, setProjects] = useState<ProjectPair[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    analyzeProjects();
  }, []);

  const analyzeProjects = async () => {
    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      
      console.log('Starting AI analysis of project images...');
      
      const { data, error } = await supabase.functions.invoke('analyze-project-images', {
        body: { images: projectImages }
      });

      if (error) throw error;

      if (data?.success && data?.pairs) {
        console.log('AI analysis complete:', data.pairs);
        
        // Add testimonial to first project if available
        const enrichedPairs = data.pairs.map((pair: ProjectPair, idx: number) => {
          if (idx === 0) {
            return {
              ...pair,
              testimonial: '/images/testimonials/review-instagram-oct24.png'
            };
          }
          return pair;
        });
        
        setProjects(enrichedPairs);
        
        toast({
          title: "Analysis Complete",
          description: `AI analyzed ${enrichedPairs.length} project pairs`,
          duration: 3000,
        });
      } else {
        throw new Error('Invalid response from analysis');
      }
    } catch (error) {
      console.error('Error analyzing projects:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Failed to analyze images');
      
      toast({
        title: "Analysis Failed",
        description: "Using manual fallback data",
        variant: "destructive",
        duration: 3000,
      });
      
      // Fallback to manual data
      setProjects([
        {
          before: {
            url: '/images/projects/before-nov02-1.jpg',
            analysis: {
              stage: 'before',
              roofType: 'Tile',
              condition: 'poor',
              issues: ['Damaged tiles', 'Weathering'],
              improvements: [],
              lighting: 'daylight',
              confidence: 0.9,
              description: 'Damaged tile roof requiring restoration'
            }
          },
          after: {
            url: '/images/projects/after-nov02-1.jpg',
            analysis: {
              stage: 'after',
              roofType: 'Tile',
              condition: 'excellent',
              issues: [],
              improvements: ['Complete restoration', 'New protective coating'],
              lighting: 'daylight',
              confidence: 0.9,
              description: 'Fully restored tile roof with protective coating'
            }
          },
          location: 'SE Melbourne',
          workPerformed: 'Complete roof restoration with tile replacement and repointing',
          confidence: 0.95,
          testimonial: '/images/testimonials/review-instagram-oct24.png'
        }
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
  };

  if (isAnalyzing) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <Card className="overflow-hidden border-2 border-conversion-cyan/30 shadow-2xl">
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-conversion-cyan mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold mb-2">Analyzing Project Images</h3>
            <p className="text-muted-foreground">AI is analyzing roofing conditions and pairing before/after images...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <Card className="overflow-hidden border-2 border-destructive/30 shadow-2xl">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analysis Error</h3>
            <p className="text-muted-foreground mb-4">{analysisError}</p>
            <Button onClick={analyzeProjects} variant="outline">
              Retry Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentProject = projects[currentSlide];

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="overflow-hidden border-2 border-conversion-cyan/30 shadow-2xl">
        <CardContent className="p-0">
          {/* AI-Powered Badge */}
          <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-conversion-blue to-conversion-cyan text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Analyzed
          </div>

          {/* Testimonial Image - Main Focus */}
          {currentProject.testimonial && (
            <div className="relative w-full bg-gradient-to-br from-secondary/5 to-primary/5 p-4 md:p-6">
              <img
                src={currentProject.testimonial}
                alt="Customer testimonial"
                className="w-full max-w-xl mx-auto rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          )}

          {/* Before/After Images with AI Insights */}
          <div className="grid grid-cols-2 gap-1">
            {/* Before Image */}
            <div className="relative aspect-[4/3]">
              <img
                src={currentProject.before.url}
                alt="Before restoration"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-md text-sm font-semibold">
                BEFORE
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-xs">
                  {currentProject.before.analysis.roofType} • {currentProject.before.analysis.condition}
                </p>
                {currentProject.before.analysis.issues.length > 0 && (
                  <p className="text-white/80 text-xs mt-1">
                    {currentProject.before.analysis.issues.slice(0, 2).join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* After Image */}
            <div className="relative aspect-[4/3]">
              <img
                src={currentProject.after.url}
                alt="After restoration"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 bg-conversion-cyan/90 text-white px-3 py-1 rounded-md text-sm font-semibold">
                AFTER
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-xs">
                  {currentProject.after.analysis.roofType} • {currentProject.after.analysis.condition}
                </p>
                {currentProject.after.analysis.improvements.length > 0 && (
                  <p className="text-white/80 text-xs mt-1">
                    {currentProject.after.analysis.improvements.slice(0, 2).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* AI-Generated Project Info */}
          <div className="p-4 md:p-6 space-y-3 bg-gradient-to-t from-background via-background to-transparent">
            <div className="flex items-center gap-3">
              <span className="text-xs md:text-sm text-muted-foreground">📍 {currentProject.location}</span>
              <span className="text-xs px-2 py-1 bg-conversion-cyan/10 text-conversion-cyan rounded-full">
                {Math.round(currentProject.confidence * 100)}% match confidence
              </span>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-1">Work Performed</h4>
              <p className="text-xs md:text-sm text-foreground/80">
                {currentProject.workPerformed}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Issues Addressed</p>
                <ul className="text-xs space-y-0.5">
                  {currentProject.before.analysis.issues.map((issue, idx) => (
                    <li key={idx} className="text-foreground/70">• {issue}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Improvements Made</p>
                <ul className="text-xs space-y-0.5">
                  {currentProject.after.analysis.improvements.map((improvement, idx) => (
                    <li key={idx} className="text-foreground/70">• {improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Arrows */}
      {projects.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Previous project"
          >
            <ChevronLeft className="h-6 w-6 text-conversion-cyan" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Next project"
          >
            <ChevronRight className="h-6 w-6 text-conversion-cyan" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {projects.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? 'bg-conversion-cyan w-8' : 'bg-conversion-cyan/30'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
