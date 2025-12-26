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
  customerReview: CustomerReview;
  additionalReviews: CustomerReview[];
  featured: boolean;
  published: boolean;
  slug: string;
}

/**
 * Hook to fetch featured case study
 */
export function useFeaturedCaseStudy() {
  return useQuery({
    queryKey: ['case-study', 'featured'],
    queryFn: async (): Promise<CaseStudy | null> => {
      // Get featured case study
      const { data: caseStudy, error: caseStudyError } = await supabase
        .from('case_studies')
        .select('*')
        .eq('featured', true)
        .eq('published', true)
        .single();

      if (caseStudyError) {
        if (caseStudyError.code === 'PGRST116') {
          // No featured case study found
          return null;
        }
        throw caseStudyError;
      }

      if (!caseStudy) return null;

      // Get associated before/after photos from content_gallery
      const { data: photos, error: photosError } = await supabase
        .from('content_gallery')
        .select('*')
        .eq('case_study_id', caseStudy.id)
        .order('display_order', { ascending: true });

      if (photosError) throw photosError;

      // Group photos into before/after pairs
      const beforePhotos = photos?.filter(p => p.category === 'before') || [];
      const afterPhotos = photos?.filter(p => p.category === 'after') || [];

      const images: CaseStudyImage[] = beforePhotos.map((before, index) => ({
        before: before.image_url,
        after: afterPhotos[index]?.image_url || '',
        alt: before.title || `${caseStudy.title} - Photo ${index + 1}`,
      }));

      return {
        id: caseStudy.id,
        title: caseStudy.title,
        location: caseStudy.location,
        service: caseStudy.service,
        description: caseStudy.description,
        images,
        customerReview: caseStudy.customer_review as CustomerReview,
        additionalReviews: (caseStudy.additional_reviews || []) as CustomerReview[],
        featured: caseStudy.featured,
        published: caseStudy.published,
        slug: caseStudy.slug,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch all published case studies
 */
export function useCaseStudies() {
  return useQuery({
    queryKey: ['case-studies', 'published'],
    queryFn: async (): Promise<CaseStudy[]> => {
      const { data: caseStudies, error: caseStudiesError } = await supabase
        .from('case_studies')
        .select('*')
        .eq('published', true)
        .order('display_order', { ascending: true });

      if (caseStudiesError) throw caseStudiesError;

      if (!caseStudies || caseStudies.length === 0) return [];

      // Fetch photos for all case studies
      const caseStudiesWithPhotos = await Promise.all(
        caseStudies.map(async (caseStudy) => {
          const { data: photos } = await supabase
            .from('content_gallery')
            .select('*')
            .eq('case_study_id', caseStudy.id)
            .order('display_order', { ascending: true });

          const beforePhotos = photos?.filter(p => p.category === 'before') || [];
          const afterPhotos = photos?.filter(p => p.category === 'after') || [];

          const images: CaseStudyImage[] = beforePhotos.map((before, index) => ({
            before: before.image_url,
            after: afterPhotos[index]?.image_url || '',
            alt: before.title || `${caseStudy.title} - Photo ${index + 1}`,
          }));

          return {
            id: caseStudy.id,
            title: caseStudy.title,
            location: caseStudy.location,
            service: caseStudy.service,
            description: caseStudy.description,
            images,
            customerReview: caseStudy.customer_review as CustomerReview,
            additionalReviews: (caseStudy.additional_reviews || []) as CustomerReview[],
            featured: caseStudy.featured,
            published: caseStudy.published,
            slug: caseStudy.slug,
          };
        })
      );

      return caseStudiesWithPhotos;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch additional reviews from all case studies
 */
export function useAdditionalReviews() {
  return useQuery({
    queryKey: ['reviews', 'additional'],
    queryFn: async (): Promise<CustomerReview[]> => {
      const { data: caseStudies, error } = await supabase
        .from('case_studies')
        .select('additional_reviews')
        .eq('published', true);

      if (error) throw error;

      // Flatten all additional reviews from all case studies
      const allReviews = caseStudies
        ?.flatMap(cs => (cs.additional_reviews || []) as CustomerReview[])
        .filter(review => review && review.imageUrl) || [];

      return allReviews;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
