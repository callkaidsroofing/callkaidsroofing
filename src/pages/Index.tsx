import { motion } from 'framer-motion';
import {
  Phone,
  ArrowDown,
  ShieldCheck,
  MapPin,
  Award,
  Camera,
  ClipboardCheck,
  FileCheck,
  CloudRain,
  Star,
  Home,
  Search,
  Wrench,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { LeadCaptureForm } from '@/public/components/LeadCaptureForm';
import { BeforeAfterCarousel } from '@/components/BeforeAfterCarousel';
import { ReviewsGrid } from '@/components/ReviewsGrid';
import {
  BUSINESS,
  CLAIMS,
  SERVICE_AREA_SUBURBS,
  getPublicWarrantySummary,
} from '@/config/business';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const TRUST_ITEMS = [
  {
    icon: Home,
    label: 'Owner-operated',
    detail: `${BUSINESS.owner} quotes, manages, and works each job`,
  },
  {
    icon: MapPin,
    label: `Based in ${BUSINESS.location.hqSuburb}`,
    detail: `Servicing ${BUSINESS.location.region}`,
  },
  {
    icon: ShieldCheck,
    label: 'Licensed & insured',
    detail: `Licence ${BUSINESS.licence} · ${BUSINESS.insurance.publicLiability}`,
  },
  {
    icon: Award,
    label: `${CLAIMS.warranty.workmanship.standardYears}-yr workmanship warranty`,
    detail: 'On standard work, in writing',
  },
  {
    icon: Camera,
    label: 'Photo-backed proof',
    detail: 'Before, during, and after on every job',
  },
] as const;

const SERVICES = [
  {
    icon: Home,
    name: 'Roof Restoration',
    slug: '/services/roof-restoration',
    tagline: 'Full clean, repairs, repointing, and coating system',
  },
  {
    icon: Star,
    name: 'Roof Painting',
    slug: '/services/roof-painting',
    tagline: 'Surface prep, primer, and manufacturer-backed coating',
  },
  {
    icon: Search,
    name: 'Leak Detection',
    slug: '/services/leak-detection',
    tagline: 'Inspection-first approach to tracing the real source',
  },
  {
    icon: Wrench,
    name: 'Roof Repairs',
    slug: '/services/roof-repairs',
    tagline: 'Broken tiles, loose ridge caps, storm and wind damage',
  },
  {
    icon: CloudRain,
    name: 'Roof Repointing',
    slug: '/services/roof-repointing',
    tagline: 'Cracked mortar, loose ridge caps, rebedding and repointing',
  },
  {
    icon: ArrowDown,
    name: 'Valley Iron Replacement',
    slug: '/services/valley-iron-replacement',
    tagline: 'Rusted or overflowing valleys replaced properly',
  },
  {
    icon: CheckCircle,
    name: 'Tile Replacement',
    slug: '/services/tile-replacement',
    tagline: 'Cracked, slipped, or storm-damaged tiles matched where possible',
  },
  {
    icon: Award,
    name: 'Gutter Cleaning',
    slug: '/services/gutter-cleaning',
    tagline: 'Cleared blockages and overflow from roof edge',
  },
  {
    icon: ShieldCheck,
    name: 'Roof Cleaning',
    slug: '/services/roof-cleaning',
    tagline: 'Moss, lichen, and dirt removal for maintenance or pre-paint prep',
  },
] as const;

const PROCESS_STEPS = [
  {
    icon: Phone,
    title: 'Enquire',
    desc: 'Call or send a request online. Kaidyn responds personally.',
  },
  {
    icon: Camera,
    title: 'Roof Inspection',
    desc: 'On-site assessment with photos taken before, during, and after.',
  },
  {
    icon: FileCheck,
    title: 'Photo-backed Quote',
    desc: 'Clear quote with evidence. No surprises, no pressure.',
  },
  {
    icon: ClipboardCheck,
    title: 'Book Approved Work',
    desc: 'Schedule at a time that suits you. Owner does the work.',
  },
] as const;

export default function Index() {
  const scrollToForm = () =>
    document.getElementById('get-quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <SEOHead
        title="Roof Restoration & Repairs | Call Kaids Roofing SE Melbourne"
        description={`Owner-operated roofing from ${BUSINESS.location.hqSuburb}. Roof restorations, repairs, painting, leak detection, and repointing across ${BUSINESS.location.region}. ${getPublicWarrantySummary()}`}
        keywords="roof restoration South East Melbourne, roof repairs Clyde North, leak detection SE Melbourne, roof painting Berwick Cranbourne Pakenham"
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60rem 30rem at 80% -10%, hsl(199 100% 40% / 0.22), transparent 60%), radial-gradient(40rem 24rem at -5% 100%, hsl(199 100% 30% / 0.14), transparent 60%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        <div className="container relative z-10 mx-auto px-4 pb-12 pt-16 md:pb-16 md:pt-24">
          <div className="mx-auto max-w-4xl">
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300"
            >
              <MapPin className="h-3.5 w-3.5" />
              {BUSINESS.slogan} — {BUSINESS.location.region}
            </motion.p>

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl"
            >
              Roof Restoration, Repairs &amp; Leak Detection
              <span className="mt-2 block text-sky-300">Across South-East Melbourne</span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl"
            >
              Owner-operated roofing from {BUSINESS.location.hqSuburb}. Photo-backed inspections,
              clear quotes, and {CLAIMS.warranty.workmanship.standardYears}-year workmanship
              warranties on standard work.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                size="lg"
                onClick={scrollToForm}
                className="h-14 px-8 text-base font-semibold shadow-lg shadow-sky-500/20"
              >
                Book a Free Roof Inspection
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
              <a
                href={BUSINESS.phone.href}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md border border-white/20 px-6 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                {BUSINESS.phone.display}
              </a>
            </motion.div>
          </div>

          {/* Trust strip */}
          <motion.ul
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
          >
            {TRUST_ITEMS.map(({ icon: Icon, label, detail }) => (
              <li
                key={label}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                <div>
                  <p className="text-sm font-semibold leading-tight">{label}</p>
                  <p className="mt-1 text-xs leading-snug text-slate-400">{detail}</p>
                </div>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ── Services overview ── */}
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              What we do
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Roofing services across {BUSINESS.location.region}
            </h2>
            <p className="mt-3 text-muted-foreground">
              Repairs, restorations, painting, repointing, valley irons, tile replacement, gutter
              cleaning, and leak detection — all owner-operated.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, name, slug, tagline }) => (
              <Link
                key={slug}
                to={slug}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-sky-500/40 hover:bg-sky-50/5"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 transition-colors group-hover:bg-sky-500/20">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{tagline}</p>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-sky-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Before / after proof ── */}
      <section className="bg-muted/30 py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Real jobs
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Before &amp; after — real {BUSINESS.location.region} roofs
            </h2>
            <p className="mt-3 text-muted-foreground">
              Every job documented where practical. Photos taken before, during, and after.
            </p>
          </div>
          <BeforeAfterCarousel />
        </div>
      </section>

      {/* ── How inspection works ── */}
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              The process
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              How a free roof inspection works
            </h2>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative flex flex-col gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                  <Icon className="h-5 w-5" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bg-muted/30 py-14 md:py-20">
        <div className="container mx-auto px-4">
          <ReviewsGrid
            title={`What ${BUSINESS.location.region} homeowners say`}
            description={`${BUSINESS.googleBusiness.ratingSnapshot.rating.toFixed(1)}★ from ${BUSINESS.googleBusiness.ratingSnapshot.reviewCount} Google reviews · as of ${BUSINESS.googleBusiness.ratingSnapshot.asOf}`}
          />
        </div>
      </section>

      {/* ── Warranty ── */}
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-sky-500/20 bg-sky-50/5 p-8 text-center md:p-12">
            <Award className="mx-auto mb-4 h-10 w-10 text-sky-500" />
            <h2 className="text-2xl font-bold md:text-3xl">
              {CLAIMS.warranty.workmanship.standardYears}-year workmanship warranty on standard work
            </h2>
            <p className="mt-4 text-muted-foreground">{getPublicWarrantySummary()}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {BUSINESS.insurance.publicLiability} public liability via {BUSINESS.insurance.provider}{' '}
              · certificate available on request · Licence {BUSINESS.licence}
            </p>
          </div>
        </div>
      </section>

      {/* ── Lead form ── */}
      <section
        id="get-quote"
        className="scroll-mt-6 bg-gradient-to-b from-slate-950 to-background pt-2"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl pt-10 text-center text-white">
            <h2 className="text-2xl font-bold md:text-3xl">Book a free roof inspection</h2>
            <p className="mt-2 text-slate-300">
              No obligation. {BUSINESS.owner} will review your request personally.
            </p>
          </div>
        </div>
        <LeadCaptureForm
          variant="full"
          title="Request Your Free Inspection"
          description={`${BUSINESS.owner} responds personally during business hours.`}
          serviceName="Free Roof Inspection — Homepage"
          ctaText="Book My Free Inspection"
          source="homepage_roof_health_check"
        />
      </section>

      {/* ── Service area ── */}
      <section className="bg-background py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Service area
            </p>
            <h3 className="mt-2 text-xl font-bold md:text-2xl">
              Servicing suburbs across {BUSINESS.location.region}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {SERVICE_AREA_SUBURBS.join(' · ')}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
