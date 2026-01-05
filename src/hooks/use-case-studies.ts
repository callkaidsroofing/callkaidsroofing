import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CustomerReview {
  customerName: string;
  rating: number;
  platform: 'Google' | 'Facebook';
  date: string;
  text: string;
  imageUrl: string;
}

export interface CaseStudyImage {
  before: string;
  after: string;
  alt: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  location: string;
  service: string;
  description: string;
  images: CaseStudyImage[];
  customerReview: CustomerReview | null;
  additionalReviews: CustomerReview[];
  featured: boolean;
  published: boolean;
  slug: string;
}

/**
 * Hook to fetch featured case study from content_case_studies table
 */
export function useFeaturedCaseStudy() {
  return useQuery({
    queryKey: ['case-study', 'featured'],
    queryFn: async (): Promise<CaseStudy | null> => {
      // Get featured case study from content_case_studies
      const { data: caseStudy, error: caseStudyError } = await supabase
        .from('content_case_studies')
        .select('*')
        .eq('featured', true)
        .single();

      if (caseStudyError) {
        if (caseStudyError.code === 'PGRST116') {
          return null;
        }
        throw caseStudyError;
      }

      if (!caseStudy) return null;

      // Get associated photos from content_gallery
      const { data: photos, error: photosError } = await supabase
        .from('content_gallery')
        .select('*')
        .eq('case_study_id', caseStudy.id)
        .order('display_order', { ascending: true });

      if (photosError) throw photosError;

      const beforePhotos = photos?.filter(p => p.category === 'before') || [];
      const afterPhotos = photos?.filter(p => p.category === 'after') || [];

      const images: CaseStudyImage[] = beforePhotos.map((before, index) => ({
        before: before.image_url,
        after: afterPhotos[index]?.image_url || '',
        alt: before.title || `${caseStudy.job_type} - Photo ${index + 1}`,
      }));

      // If no gallery photos, use before/after from case study itself
      if (images.length === 0 && caseStudy.before_image && caseStudy.after_image) {
        images.push({
          before: caseStudy.before_image,
          after: caseStudy.after_image,
          alt: caseStudy.job_type,
        });
      }

      return {
        id: caseStudy.id,
        title: caseStudy.job_type,
        location: caseStudy.suburb,
        service: caseStudy.job_type,
        description: caseStudy.solution_provided,
        images,
        customerReview: caseStudy.testimonial ? {
          customerName: 'Customer',
          rating: 5,
          platform: 'Google',
          date: caseStudy.project_date || '',
          text: caseStudy.testimonial,
          imageUrl: '',
        } : null,
        additionalReviews: [],
        featured: caseStudy.featured ?? false,
        published: true,
        slug: caseStudy.slug || caseStudy.study_id,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch all published case studies from content_case_studies
 */
export function useCaseStudies() {
  return useQuery({
    queryKey: ['case-studies', 'published'],
    queryFn: async (): Promise<CaseStudy[]> => {
      const { data: caseStudies, error: caseStudiesError } = await supabase
        .from('content_case_studies')
        .select('*')
        .order('created_at', { ascending: false });

      if (caseStudiesError) throw caseStudiesError;
      if (!caseStudies || caseStudies.length === 0) return [];

      return caseStudies.map(cs => ({
        id: cs.id,
        title: cs.job_type,
        location: cs.suburb,
        service: cs.job_type,
        description: cs.solution_provided,
        images: cs.before_image && cs.after_image ? [{
          before: cs.before_image,
          after: cs.after_image,
          alt: cs.job_type,
        }] : [],
        customerReview: cs.testimonial ? {
          customerName: 'Customer',
          rating: 5,
          platform: 'Google' as const,
          date: cs.project_date || '',
          text: cs.testimonial,
          imageUrl: '',
        } : null,
        additionalReviews: [],
        featured: cs.featured ?? false,
        published: true,
        slug: cs.slug || cs.study_id,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch additional reviews - now returns empty as we use ReputationHub widget
 */
export function useAdditionalReviews() {
  return useQuery({
    queryKey: ['reviews', 'additional'],
    queryFn: async (): Promise<CustomerReview[]> => {
      // Reviews are now handled by ReputationHub widget
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });
}
