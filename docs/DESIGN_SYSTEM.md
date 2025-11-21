# CKR Digital Engine - Design System Documentation

## Overview
This document defines the consistent design patterns, components, and defaults for the Call Kaids Roofing website.

---

## Core Principles

### 1. **Consistency Over Customization**
- Use design system components for all pages
- Avoid one-off inline styles
- Follow established spacing and color patterns

### 2. **Mobile-First Responsive**
- All components work on mobile (320px+)
- Breakpoints: `md:` (768px), `lg:` (1024px), `xl:` (1280px)

### 3. **Performance Optimized**
- Lazy load images
- Use semantic HTML
- Minimize JavaScript
- GPU-accelerated animations

---

## Spacing System

### Section Spacing (Vertical Padding)
```tsx
variant="compact"   // py-12 md:py-16
variant="default"   // py-16 md:py-24 (STANDARD)
variant="spacious"  // py-24 md:py-32
variant="hero"      // py-16 md:py-24 min-h-[60vh] md:min-h-[70vh]
```

**Default Rule:** Use `variant="default"` for most sections unless there's a specific reason to deviate.

### Container Widths
```tsx
size="sm"       // max-w-2xl  (narrow content, forms)
size="default"  // max-w-6xl (STANDARD - most content)
size="lg"       // max-w-7xl (wide layouts)
size="full"     // max-w-full (edge-to-edge)
```

**Default Rule:** Use `max-w-6xl` with `mx-auto px-4` for consistency.

---

## Color System

### CKR Brand Color Hierarchy (Official)
```css
--primary: 199 100% 40%           /* #007ACC - Action Blue (brand primary) */
--secondary: 205 81% 22%          /* #0B3B69 - Deep Navy (brand secondary) */
--accent: 0 0% 75%                /* #BFBFBF - Steel Gray */
--charcoal: 220 13% 9%            /* #111827 - Brand Charcoal */
--silver: 0 0% 91%                /* #E8E8E8 - Metallic silver */
```

**Brand Guidelines:**
- Primary #007ACC is the main brand color for CTAs, links, and accents
- Secondary #0B3B69 is Deep Navy for headers, backgrounds, and authority
- Charcoal #111827 for body text and strong contrast elements
- Steel Gray and Silver for subtle accents and metallic effects
- **NEVER use orange** (except safety icons)

### Background Variants
```tsx
background="white"            // bg-background (pure white)
background="muted"            // bg-muted/50 (light gray)
background="gradient-primary" // from-primary/10 via-accent/5 to-secondary/10
background="gradient-dark"    // from-secondary via-charcoal to-secondary
background="transparent"      // no background
```

### Gradient Patterns (STANDARD)
```css
/* Hero gradients - Deep Navy to Charcoal */
bg-gradient-to-br from-secondary via-charcoal to-secondary
/* CSS Variable: var(--gradient-hero) */

/* Light gradients - Subtle brand wash */
bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10

/* CTA gradients - Action Blue to Deep Navy */
bg-gradient-to-br from-primary to-secondary
/* CSS Variable: var(--gradient-primary-accent) */
```

---

## Typography

### Headings
```tsx
h1: text-4xl md:text-6xl font-bold        // Hero headlines
h2: text-2xl md:text-4xl font-bold        // Section headlines
h3: text-lg md:text-xl font-bold          // Card/Feature titles
```

### Body Text
```tsx
Lead text:    text-xl md:text-2xl         // Hero subheadlines
Body:         text-base                   // Default paragraph
Small:        text-sm                     // Card descriptions
Tiny:         text-xs                     // Legal/fine print
```

### Font Weights
- Regular: `font-normal` (400)
- Medium: `font-medium` (500)
- Semibold: `font-semibold` (600)
- Bold: `font-bold` (700)

---

## Component Library

### 1. SectionWrapper
**Purpose:** Consistent section containers with spacing and backgrounds

```tsx
<SectionWrapper 
  variant="default"           // compact | default | spacious | hero
  background="transparent"    // white | muted | gradient-primary | gradient-dark
  className=""                // Optional custom classes
>
  <Container>
    {/* Content */}
  </Container>
</SectionWrapper>
```

**When to use:** Every major content section on a page.

---

### 2. HeroSection
**Purpose:** Reusable hero component with consistent CTA patterns

```tsx
<HeroSection
  headline="Your Headline"
  subheadline="Supporting text"
  description="Optional italic slogan"
  badge="Limited Time Offer"
  trustSignals={['Signal 1', 'Signal 2']}
  ctaPrimary={{ text: 'Call Now', href: 'tel:0435900709' }}
  ctaSecondary={{ text: 'Get Quote', href: '/quote' }}
/>
```

**Standard CTA Pattern:**
- Primary: Phone call (white button)
- Secondary: Online quote (outline button)

---

### 3. CTASection
**Purpose:** Reusable call-to-action sections

```tsx
<CTASection
  headline="Book Your Free Roof Health Check"
  description="Free quotes • Honest advice • Zero pressure"
  variant="gradient"          // gradient | solid
  size="default"              // default | compact
/>
```

**When to use:** End of pages, between major sections, conversion points.

---

### 4. FeatureCard
**Purpose:** Service/feature cards with consistent hover effects

```tsx
<FeatureCard
  icon="🏠"                   // Emoji or React component
  title="Roof Restoration"
  description="Add 15+ years to your roof's life"
  price="From $4,500"
  link="/services/roof-restoration"
  variant="default"           // default | compact | horizontal
/>
```

**Standard Effects:**
- Hover: `hover:shadow-2xl hover:border-primary/50 hover:scale-[1.02]`
- Transition: `transition-all duration-300`
- Border: `border-2`

---

## Animation System

### Standard Transitions
```css
transition-all duration-300   /* Default for most elements */
transition-transform duration-300   /* For scale/transform only */
```

### Hover Effects
```tsx
// Cards
hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.02]

// Buttons
hover:bg-primary/90 hover:shadow-xl

// Icons
group-hover:scale-110 transition-transform
```

### Custom Animations (index.css)
```css
@keyframes float           // Floating elements (6s)
@keyframes float-delayed   // Delayed float (8s)
@keyframes shimmer         // Light streak (4s)
@keyframes gradient        // Opacity pulse (5s)
```

---

## Parallax System

### Usage
```tsx
<ParallaxBackground variant="hero" density="high">
  <SectionWrapper>
    {/* Content */}
  </SectionWrapper>
</ParallaxBackground>
```

### Variants
- `hero` - Roof silhouettes + geometric grids (high density)
- `services` - Tile patterns + floating shapes (low density)
- `testimonials` - Subtle floating shapes (medium density)
- `cta` - Geometric grids + tile patterns (medium density)

### Density Levels
- `low`: opacity 0.25
- `medium`: opacity 0.35
- `high`: opacity 0.45

**Mobile Behavior:** Static background with simplified graphics (no parallax scroll).

---

## Button Patterns

### Primary CTA (Phone)
```tsx
<Button className="bg-white text-primary hover:bg-white/90 font-bold shadow-2xl">
  <Phone className="h-6 w-6" />
  Call 0435 900 709
</Button>
```

### Secondary CTA (Quote)
```tsx
<Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary">
  Request Quote Online
  <ArrowRight className="h-5 w-5" />
</Button>
```

### Mobile Sticky CTA
```tsx
<a 
  href="tel:0435900709" 
  className="fixed bottom-4 left-4 right-4 z-50 bg-primary text-primary-foreground py-3 px-4 rounded-full shadow-2xl animate-pulse"
>
  <Phone className="h-4 w-4" />
  Call Kaidyn: 0435 900 709
</a>
```

---

## Content Data Pattern

### Centralized Content Files
**Location:** `src/data/homepage-content.ts`

**Why:** 
- Single source of truth for content
- Easy to update without touching UI code
- Supports future CMS integration

**Example:**
```typescript
export const servicesData = [
  {
    id: 'restoration',
    icon: '🏠',
    title: 'Roof Restoration',
    benefit: 'Add 15+ years to your roof\'s life',
    price: 'From $4,500',
    link: '/services/roof-restoration',
  },
  // ...
];
```

---

## Page Structure Template

### Standard Page Layout
```tsx
import { SectionWrapper, Container } from "@/components/ui/section-wrapper";
import { HeroSection } from "@/components/ui/hero-section";
import { CTASection } from "@/components/ui/cta-section";
import ParallaxBackground from "@/components/ParallaxBackground";

const PageName = () => {
  return (
    <div className="min-h-screen">
      <SEOHead title="Page Title" description="Description" />

      {/* Hero */}
      <ParallaxBackground variant="hero" density="high">
        <SectionWrapper variant="hero" background="gradient-dark">
          <Container>
            <HeroSection {...heroData} />
          </Container>
        </SectionWrapper>
      </ParallaxBackground>

      {/* Content Sections */}
      <SectionWrapper background="white">
        <Container>
          {/* Content */}
        </Container>
      </SectionWrapper>

      {/* CTA */}
      <CTASection {...ctaData} />
    </div>
  );
};
```

---

## Responsive Breakpoints

### Standard Media Queries
```tsx
md:   // 768px+ (tablet portrait)
lg:   // 1024px+ (tablet landscape)
xl:   // 1280px+ (desktop)
2xl:  // 1536px+ (large desktop)
```

### Mobile-First Approach
```tsx
// Mobile default, then desktop
<div className="py-12 md:py-24">

// Hide on mobile
<div className="hidden md:block">

// Show only on mobile
<div className="md:hidden">
```

---

## SEO Best Practices

### Every Page Must Have
```tsx
<SEOHead 
  title="Page Title - Call Kaids Roofing"
  description="Meta description under 160 characters with keywords"
/>
```

### Heading Hierarchy
- One `<h1>` per page (hero headline)
- `<h2>` for section headlines
- `<h3>` for card titles
- Maintain logical order (no skipping levels)

### Image Optimization
```tsx
<img 
  src={imageUrl}
  alt="Descriptive alt text with keywords"
  loading="lazy"
  className="w-full h-full object-cover"
/>
```

---

## Brand Compliance

### Mandatory Elements
1. **Slogan:** Always italicized - *"Proof In Every Roof"*
2. **Phone:** 0435 900 709 (formatted consistently)
3. **Email:** info@callkaidsroofing.com.au
4. **ABN:** 39475055075
5. **Warranty:** 15-year standard, 20-year premium
6. **Colors:** Action Blue (#007ACC), Deep Navy (#0B3B69), Charcoal (#111827)

### Forbidden
- Orange colors (except safety icons)
- Claims of "cheapest" (use "best value")
- Generic stock photos (use real job photos)
- Incorrect brand colors (always use semantic tokens from index.css)

---

## Performance Checklist

### Every Component Should
- ✅ Use semantic HTML (`<section>`, `<article>`, `<header>`)
- ✅ Lazy load images below the fold
- ✅ Use CSS transforms for animations (GPU-accelerated)
- ✅ Minimize JavaScript bundle size
- ✅ Include ARIA labels for accessibility

### Loading States
```tsx
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage />;
if (!data || data.length === 0) return null;
```

---

## File Organization

```
src/
├── components/
│   ├── ui/                     # Design system components
│   │   ├── section-wrapper.tsx
│   │   ├── hero-section.tsx
│   │   ├── cta-section.tsx
│   │   └── feature-card.tsx
│   ├── shared/                 # Reusable business components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ParallaxBackground.tsx
│   └── [feature]/              # Feature-specific components
├── data/                       # Content data files
│   ├── homepage-content.ts
│   └── services-data.ts
├── pages/                      # Route pages
│   ├── Index.tsx
│   └── [feature]/
└── lib/                        # Utilities
    └── parallax-graphics.tsx
```

---

## When to Deviate from Standards

### You can break these rules when:
1. **A/B Testing:** Trying conversion optimization variants
2. **Emergency Fixes:** Critical bugs require quick solutions
3. **Customer Request:** User explicitly wants different approach
4. **Performance:** Proven performance improvement

### Always Document Deviations
```tsx
// DEVIATION: Using py-8 instead of py-16 because [reason]
<SectionWrapper className="py-8">
```

---

## Version History
- **v1.0** (2025-01-11): Initial design system documentation
- Components created: SectionWrapper, HeroSection, CTASection, FeatureCard
- Homepage refactored to use design system
- Centralized content data files

---

## Future Roadmap
- [ ] Dark mode variants
- [ ] Animation library expansion
- [ ] A/B testing framework
- [ ] CMS integration for content data
- [ ] Component Storybook documentation
