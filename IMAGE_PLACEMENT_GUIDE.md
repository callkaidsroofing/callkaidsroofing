# Image Placement Guide

## Overview
This guide explains where to place the 10 provided images (5 before/after photos + 5 customer review screenshots) for the Berwick roof restoration case study.

## Directory Structure
```
public/
  images/
    case-studies/
      berwick-restoration/
        before-1.jpg    # Ridge capping - before
        after-1.jpg     # Ridge capping - after
        before-2.jpg    # Full roof view - before
        after-2.jpg     # Full roof view - after
        before-3.jpg    # Tile condition - before
        after-3.jpg     # Tile condition - after
        before-4.jpg    # Valley and flashing - before
        after-4.jpg     # Valley and flashing - after
        before-5.jpg    # Overall finish - before
        after-5.jpg     # Overall finish - after
    reviews/
      berwick-restoration-review.jpg    # The review from the Berwick customer (linked to photos)
      review-2.jpg                       # Additional review screenshot 1
      review-3.jpg                       # Additional review screenshot 2
      review-4.jpg                       # Additional review screenshot 3
      review-5.jpg                       # Additional review screenshot 4
```

## Image Requirements

### Before/After Photos (5 pairs = 10 images)
- **Location:** `/public/images/case-studies/berwick-restoration/`
- **Format:** JPG or PNG
- **Recommended size:** 1200x900px (4:3 aspect ratio)
- **File naming:** `before-[1-5].jpg` and `after-[1-5].jpg`

### Customer Reviews (5 screenshots)
- **Location:** `/public/images/reviews/`
- **Format:** JPG or PNG
- **Content:** Screenshots of Google/Facebook reviews
- **Special:** `berwick-restoration-review.jpg` should be the review from the customer whose roof is shown in the before/after photos

## Data Structure Reference

The images are referenced in `/src/data/case-studies.ts`:

```typescript
// Featured case study with linked review
export const berwickRestorationCaseStudy: CaseStudy = {
  images: [
    { before: '/images/case-studies/berwick-restoration/before-1.jpg', ... },
    { before: '/images/case-studies/berwick-restoration/before-2.jpg', ... },
    // ... etc
  ],
  customerReview: {
    image: '/images/reviews/berwick-restoration-review.jpg',
    // This review should be from the same customer as the photos
  }
}

// Additional standalone reviews
export const additionalReviews: CustomerReview[] = [
  { image: '/images/reviews/review-2.jpg', ... },
  { image: '/images/reviews/review-3.jpg', ... },
  { image: '/images/reviews/review-4.jpg', ... },
  { image: '/images/reviews/review-5.jpg', ... },
]
```

## Where Images Appear

### Homepage Integration

1. **Featured Case Study Section** (replaces old carousel)
   - Shows before/after photo viewer with thumbnails
   - Displays linked customer review alongside
   - Interactive before/after toggle

2. **Additional Reviews Grid**
   - Shows 4 additional review screenshots
   - Displays below main testimonials section

## Updating Review Details

After placing images, update the actual review content in `/src/data/case-studies.ts`:

```typescript
customerReview: {
  customerName: 'Actual Name from Review',  // Update this
  platform: 'Google' or 'Facebook',         // Update this
  date: '2024',                             // Update with actual date
  text: 'Actual review text...',            // Copy actual review text
  image: '/images/reviews/berwick-restoration-review.jpg',
}
```

Do the same for the 4 additional reviews in `additionalReviews` array.

## Verification Checklist

- [ ] All 10 before images placed in `/public/images/case-studies/berwick-restoration/`
- [ ] All 10 after images placed in same directory
- [ ] Main review screenshot (linked to photos) placed in `/public/images/reviews/`
- [ ] 4 additional review screenshots placed in `/public/images/reviews/`
- [ ] Review text content updated in `/src/data/case-studies.ts`
- [ ] Customer names updated
- [ ] Review platforms (Google/Facebook) verified
- [ ] Homepage loads without broken images

## Component Files

- **FeaturedCaseStudy:** `/src/components/FeaturedCaseStudy.tsx`
- **ReviewsGrid:** `/src/components/ReviewsGrid.tsx`
- **Data:** `/src/data/case-studies.ts`
- **Homepage:** `/src/pages/Index.tsx` (lines 202-233)
