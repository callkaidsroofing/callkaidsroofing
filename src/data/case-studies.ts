/**
 * Case Studies Data
 * Featured proof: Real projects with before/after photos and customer testimonials
 */

export interface CaseStudyImage {
  before: string;
  after: string;
  alt: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: 5;
  platform: 'Google' | 'Facebook';
  date: string;
  text: string;
  image: string; // Path to review screenshot
}

export interface CaseStudy {
  id: string;
  title: string;
  location: string;
  service: string;
  description: string;
  images: CaseStudyImage[];
  customerReview: CustomerReview;
  featured: boolean;
}

/**
 * Featured Case Study: Berwick Roof Restoration
 * Links 5 before/after photos to customer review from same job
 */
export const berwickRestorationCaseStudy: CaseStudy = {
  id: 'berwick-restoration-2024',
  title: 'Complete Roof Restoration',
  location: 'Berwick',
  service: 'Roof Restoration',
  description: 'Full restoration including high-pressure cleaning, rebedding, repointing, and premium Dulux AcraTex membrane coating. Transformed a faded, weathered roof into a protected, refreshed finish with 15-year warranty.',
  images: [
    {
      before: '/images/case-studies/berwick-restoration/before-1.jpg',
      after: '/images/case-studies/berwick-restoration/after-1.jpg',
      alt: 'Berwick roof restoration - Ridge capping before and after',
    },
    {
      before: '/images/case-studies/berwick-restoration/before-2.jpg',
      after: '/images/case-studies/berwick-restoration/after-2.jpg',
      alt: 'Berwick roof restoration - Full roof view transformation',
    },
    {
      before: '/images/case-studies/berwick-restoration/before-3.jpg',
      after: '/images/case-studies/berwick-restoration/after-3.jpg',
      alt: 'Berwick roof restoration - Tile condition improvement',
    },
    {
      before: '/images/case-studies/berwick-restoration/before-4.jpg',
      after: '/images/case-studies/berwick-restoration/after-4.jpg',
      alt: 'Berwick roof restoration - Valley and flashing work',
    },
    {
      before: '/images/case-studies/berwick-restoration/before-5.jpg',
      after: '/images/case-studies/berwick-restoration/after-5.jpg',
      alt: 'Berwick roof restoration - Overall finish quality',
    },
  ],
  customerReview: {
    id: 'berwick-restoration-review',
    customerName: 'Berwick Homeowner', // Update with actual name from review
    rating: 5,
    platform: 'Google', // Update based on actual review platform
    date: '2024',
    text: 'Outstanding work from start to finish. Kaidyn provided detailed photo documentation at every stage and the final result exceeded our expectations. Highly recommend!', // Update with actual review text
    image: '/images/reviews/berwick-restoration-review.jpg',
  },
  featured: true,
};

/**
 * Additional customer reviews (standalone)
 * These are the other 4 review screenshots provided
 */
export const additionalReviews: CustomerReview[] = [
  {
    id: 'review-2',
    customerName: 'Customer 2',
    rating: 5,
    platform: 'Google',
    date: '2024',
    text: 'Professional service and excellent communication throughout.',
    image: '/images/reviews/review-2.jpg',
  },
  {
    id: 'review-3',
    customerName: 'Customer 3',
    rating: 5,
    platform: 'Facebook',
    date: '2024',
    text: 'Great work, fair pricing, and no surprises.',
    image: '/images/reviews/review-3.jpg',
  },
  {
    id: 'review-4',
    customerName: 'Customer 4',
    rating: 5,
    platform: 'Google',
    date: '2024',
    text: 'Kaidyn went above and beyond to fix our roof leak.',
    image: '/images/reviews/review-4.jpg',
  },
  {
    id: 'review-5',
    customerName: 'Customer 5',
    rating: 5,
    platform: 'Facebook',
    date: '2024',
    text: 'Honest, reliable, and does what he says he will do.',
    image: '/images/reviews/review-5.jpg',
  },
];

export const allCaseStudies: CaseStudy[] = [berwickRestorationCaseStudy];
