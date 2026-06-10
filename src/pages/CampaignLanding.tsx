import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Star,
  ShieldCheck,
  MapPin,
  Award,
  Phone,
  ArrowDown,
  ClipboardCheck,
  Camera,
  FileCheck,
  CloudRain,
} from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { LeadCaptureForm } from '@/public/components/LeadCaptureForm';
import { BeforeAfterCarousel } from '@/components/BeforeAfterCarousel';
import { ReviewsGrid } from '@/components/ReviewsGrid';
import { BUSINESS, CLAIMS, getPublicWarrantySummary } from '@/config/business';
import { trackViewContent } from '@/lib/meta-pixel-events';

const UTM_STORAGE_KEY = 'ckr_lp_attribution';
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;

/** Sanitize the :campaign param to lowercase [a-z0-9-]+, falling back to "meta". */
function sanitizeCampaign(raw: string | undefined): string {
  const cleaned = (raw ?? '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  return cleaned || 'meta';
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const TRUST_ITEMS = [
  {
    icon: Star,
    label: `${BUSINESS.googleBusiness.ratingSnapshot.rating.toFixed(1)} Google rating`,
    detail: `${BUSINESS.googleBusiness.ratingSnapshot.reviewCount} reviews (as of ${BUSINESS.googleBusiness.ratingSnapshot.asOf})`,
  },
  {
    icon: ShieldCheck,
    label: 'Licensed & insured',
    detail: `${BUSINESS.insurance.publicLiability} public liability (${BUSINESS.insurance.provider})`,
  },
  {
    icon: Award,
    label: `${CLAIMS.warranty.workmanship.standardYears}-year workmanship warranty`,
    detail: 'On standard work, in writing',
  },
  {
    icon: MapPin,
    label: `${BUSINESS.location.hqSuburb} local`,
    detail: `Owner-operated across ${BUSINESS.location.region}`,
  },
] as const;

const HOW_IT_WORKS = [
  {
    icon: ClipboardCheck,
    step: '1',
    title: 'Enquire',
    description: `Send the form or call ${BUSINESS.phone.display}. You deal with ${BUSINESS.owner} directly — no call centre, no sales team.`,
  },
  {
    icon: Camera,
    step: '2',
    title: 'Free inspection + photo report',
    description:
      'Kaidyn inspects the roof and shows you photos of exactly what he finds — before, during, and after, where practical.',
  },
  {
    icon: FileCheck,
    step: '3',
    title: 'Fixed quote, no obligation',
    description:
      'You get a clear, fixed-price quote. No pressure, no surprises. If the roof only needs a small repair, that is what gets quoted.',
  },
] as const;

export default function CampaignLanding() {
  const { campaign } = useParams<{ campaign: string }>();
  const campaignId = useMemo(() => sanitizeCampaign(campaign), [campaign]);
  const [attribution, setAttribution] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const captured: Record<string, string> = {};
    for (const key of UTM_PARAMS) {
      const val = params.get(key);
      if (val) captured[key] = val;
    }
    captured.campaign = campaignId;
    captured.landed_at = new Date().toISOString();
    setAttribution(captured);
    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
    } catch {
      // private mode — attribution is best-effort only
    }
    trackViewContent('Campaign Landing Page', 'Roofing Lead');
  }, [campaignId]);

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <SEOHead
        title="Roof Restoration & Repairs South-East Melbourne | Call Kaids Roofing"
        description={`Owner-operated roof restoration and repairs from ${BUSINESS.location.hqSuburb}. Free inspection with photo report, fixed quote, ${CLAIMS.warranty.workmanship.standardYears}-year workmanship warranty.`}
        keywords="roof restoration Melbourne, roof repairs South East Melbourne, Clyde North roofer"
        canonical={`/lp/${campaignId}`}
      />
      {/* Campaign page: keep out of organic index. Overrides SEOHead's default
          robots/googlebot/bingbot directives (react-helmet-async dedupes by name). */}
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta name="bingbot" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden bg-slate-950 text-white">
          {/* Atmosphere: layered radial glows + faint grid, no images to slow first paint */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(60rem 30rem at 85% -10%, hsl(199 100% 40% / 0.28), transparent 60%), radial-gradient(40rem 24rem at -10% 110%, hsl(199 100% 30% / 0.18), transparent 60%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />

          <div className="container relative z-10 mx-auto px-4 pb-12 pt-16 md:pb-16 md:pt-24">
            <div className="mx-auto max-w-3xl">
              <motion.p
                {...fadeUp}
                transition={{ duration: 0.5 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300"
              >
                <MapPin className="h-3.5 w-3.5" />
                Roof restoration &amp; repairs — {BUSINESS.location.region}
              </motion.p>

              <motion.h1
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl"
              >
                Cracked tiles, faded colour, or a leak you can't trace?
                <span className="mt-3 block text-sky-300">
                  Get it fixed properly — and warranted for{' '}
                  {CLAIMS.warranty.workmanship.standardYears} years.
                </span>
              </motion.h1>

              <motion.p
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl"
              >
                Rated {BUSINESS.googleBusiness.ratingSnapshot.rating.toFixed(1)} from{' '}
                {BUSINESS.googleBusiness.ratingSnapshot.reviewCount} Google reviews.{' '}
                {BUSINESS.owner} quotes the job, does the work, and answers his own phone — from{' '}
                {BUSINESS.location.hqSuburb}, not a call centre.
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
                  Book My Free Roof Inspection
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

            {/* Trust strip — above the fold */}
            <motion.ul
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
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

        {/* ===== Lead form ===== */}
        <section id="lead-form" className="scroll-mt-6 bg-gradient-to-b from-slate-950 to-background pt-2">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl pt-10 text-center text-white">
              <h2 className="text-2xl font-bold md:text-3xl">
                Start with a free inspection and photo report
              </h2>
              <p className="mt-2 text-slate-300">
                No obligation. You see exactly what your roof needs before you spend a dollar.
              </p>
            </div>
          </div>
          <LeadCaptureForm
            variant="full"
            title="Request Your Free Roof Inspection"
            description={`${BUSINESS.owner} responds personally during business hours.`}
            serviceName="Campaign Landing — Roof Restoration/Repair"
            ctaText="Get My Free Inspection"
            source={`lp_${campaignId}`}
            metadata={attribution}
          />
        </section>

        {/* ===== Before / after proof ===== */}
        <section className="bg-background py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {BUSINESS.slogan}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Real roofs. Real before and after.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Every job is photo-documented — before, during, and after — so you can see the
                work, not just take our word for it.
              </p>
            </div>
            <BeforeAfterCarousel />
          </div>
        </section>

        {/* ===== Reviews ===== */}
        <section className="bg-secondary/5 py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                What {BUSINESS.location.region} homeowners say
              </h2>
              <p className="mt-3 text-muted-foreground">
                {BUSINESS.googleBusiness.ratingSnapshot.rating.toFixed(1)}-star average across{' '}
                {BUSINESS.googleBusiness.ratingSnapshot.reviewCount} Google reviews (as of{' '}
                {BUSINESS.googleBusiness.ratingSnapshot.asOf}).
              </p>
            </div>
            <ReviewsGrid />
          </div>
        </section>

        {/* ===== Warranty, plain English ===== */}
        <section className="bg-background py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                    The warranty, in plain English
                  </h2>
                  <p className="mt-4 leading-relaxed text-foreground/80">{getPublicWarrantySummary()}</p>
                  <p className="mt-3 leading-relaxed text-foreground/80">
                    If the workmanship fails within{' '}
                    {CLAIMS.warranty.workmanship.standardYears} years on standard work, Kaidyn comes
                    back and fixes it. Minor repairs carry a{' '}
                    {CLAIMS.warranty.workmanship.minorRepairs} workmanship warranty. Warranty
                    certificates and our {BUSINESS.insurance.publicLiability} public liability
                    certificate of currency are available on request.
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    ABN {BUSINESS.abn} • Licence {BUSINESS.licence} • Insured with{' '}
                    {BUSINESS.insurance.provider}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== How it works ===== */}
        <section className="bg-secondary/5 py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How it works</h2>
              <p className="mt-3 text-muted-foreground">
                Three steps. No pressure at any of them.
              </p>
            </div>
            <ol className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
              {HOW_IT_WORKS.map(({ icon: Icon, step, title, description }) => (
                <li
                  key={step}
                  className="relative rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <span className="absolute -top-4 left-6 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow">
                    {step}
                  </span>
                  <Icon className="mb-4 mt-2 h-7 w-7 text-primary" />
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== Final CTA ===== */}
        <section className="relative overflow-hidden bg-slate-950 py-16 text-white md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(50rem 26rem at 50% 120%, hsl(199 100% 40% / 0.25), transparent 65%)',
            }}
          />
          <div className="container relative z-10 mx-auto px-4 text-center">
            <p className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              <CloudRain className="h-3.5 w-3.5" />
              Melbourne weather doesn't wait
            </p>
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Small roof problems get bigger with every storm front
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              A free inspection now tells you exactly what your roof needs — and what it doesn't.
              Photo report and fixed quote included, no obligation.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={scrollToForm}
                className="h-14 px-8 text-base font-semibold shadow-lg shadow-sky-500/20"
              >
                Book My Free Roof Inspection
              </Button>
              <a
                href={BUSINESS.phone.href}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md border border-white/20 px-6 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                Call {BUSINESS.phone.display}
              </a>
            </div>
            <p className="mt-6 text-xs text-slate-400">
              Owner-operated from {BUSINESS.location.hqSuburb} • {BUSINESS.location.region} •{' '}
              {CLAIMS.warranty.workmanship.standardYears}-year workmanship warranty
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
