import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, AlertCircle, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

export const BeforeAfterCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { toast } = useToast();

  // Query database for AI-analyzed case studies
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['ai-analyzed-projects'],
    queryFn: async () => {
      console.log('Loading AI-analyzed projects from database...');
      
      const { data, error } = await supabase
        .from('content_case_studies')
        .select('*')
        .eq('verification_status', 'verified')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Transform database records to match expected format
      return data.map(study => {
        const aiAnalysis = study.ai_analysis as any;
        return {
          before: {
            url: study.before_image || '',
            analysis: aiAnalysis?.before || {
              stage: 'before',
              roofType: 'Tile/Metal',
              condition: 'Requires attention',
              issues: [],
              improvements: [],
              confidence: 0.9,
              description: 'Before restoration'
            }
          },
          after: {
            url: study.after_image || '',
            analysis: aiAnalysis?.after || {
              stage: 'after',
              roofType: 'Tile/Metal',
              condition: 'Excellent',
              issues: [],
              improvements: ['Complete restoration', 'Professional finish'],
              confidence: 0.9,
              description: 'After restoration'
            }
          },
          location: study.suburb || 'SE Melbourne',
          workPerformed: study.testimonial || 'Professional roof restoration',
          confidence: study.pairing_confidence || 0.9,
          authenticityScore: study.authenticity_score || 0.9,
          verificationStatus: study.verification_status,
          id: study.id,
          studyId: study.study_id
        };
      });
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const nextSlide = () => {
    if (projects) {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }
  };

  const prevSlide = () => {
    if (projects) {
      setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
    }
  };

  if (isLoading) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <Card className="overflow-hidden border-2 border-conversion-cyan/30 shadow-2xl">
          <CardContent className="p-12 text-center">
            <Database className="h-12 w-12 text-conversion-cyan mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold mb-2">Loading Projects</h3>
            <p className="text-muted-foreground">Retrieving AI-analyzed projects from database...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !projects || projects.length === 0) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <Card className="overflow-hidden border-2 border-destructive/30 shadow-2xl">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Projects Available</h3>
            <p className="text-muted-foreground mb-4">
              {error ? 'Failed to load projects' : 'No case studies found in database'}
            </p>
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
          {/* RAG-Powered Badge */}
          <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-conversion-blue to-conversion-cyan text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Verified
          </div>

          {/* Database Source Indicator */}
          <div className="absolute top-4 right-4 z-20 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-2 border border-conversion-cyan/30">
            <Database className="h-3 w-3 text-conversion-cyan" />
            Stored Analysis
          </div>

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
              <div className="absolute top-2 left-2 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-md text-sm font-semibold shadow-lg">
                BEFORE
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-xs">
                  {currentProject.before.analysis.roofType} • {currentProject.before.analysis.condition}
                </p>
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
              <div className="absolute top-2 right-2 bg-conversion-cyan/90 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-lg">
                AFTER
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-xs">
                  {currentProject.after.analysis.roofType} • {currentProject.after.analysis.condition}
                </p>
                {currentProject.after.analysis.improvements.length > 0 && (
                  <p className="text-white/80 text-xs mt-1">
                    {currentProject.after.analysis.improvements[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* AI-Generated Project Info */}
          <div className="p-4 md:p-6 space-y-3 bg-gradient-to-t from-background via-background to-transparent">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs md:text-sm text-muted-foreground">📍 {currentProject.location}</span>
              {currentProject.authenticityScore && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  currentProject.authenticityScore >= 0.85 ? 'bg-green-500/10 text-green-700' :
                  currentProject.authenticityScore >= 0.7 ? 'bg-amber-500/10 text-amber-700' :
                  'bg-red-500/10 text-red-700'
                }`}>
                  Auth: {Math.round(currentProject.authenticityScore * 100)}%
                </span>
              )}
              {currentProject.confidence && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  currentProject.confidence >= 0.85 ? 'bg-green-500/10 text-green-700' :
                  currentProject.confidence >= 0.7 ? 'bg-amber-500/10 text-amber-700' :
                  'bg-red-500/10 text-red-700'
                }`}>
                  Pair: {Math.round(currentProject.confidence * 100)}%
                </span>
              )}
              {currentProject.studyId && (
                <span className="text-xs px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-full">
                  {currentProject.studyId}
                </span>
              )}
            </div>
            
            <div>
              <h4 className="font-semibold text-sm md:text-base mb-1">Work Performed</h4>
              <p className="text-xs md:text-sm text-foreground/80 leading-relaxed">
                {currentProject.workPerformed}
              </p>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-conversion-cyan" />
                Analysis enhanced with RAG system knowledge base
              </p>
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
