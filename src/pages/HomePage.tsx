import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Sun, Moon, ArrowRight, PenLine, Layers, Clock } from 'lucide-react';
import { useTranslation } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import EarlyAccessModal from '../components/EarlyAccessModal';
import { startDemoSession } from '../services/leadService';

// Structured content — image paths default to /landing/*.jpg (place the four
// hero photos in public/landing/). Missing files fall back to a texture
// placeholder via onError.
const HERO_IMG        = '/landing/hero.png';
const HOW_IT_WORKS_IMG = '/landing/how-it-works.png';
const OUTPUT_IMG      = '/landing/output.png';
const FINAL_CTA_IMG   = '/landing/final-cta.png';

const withImageFallback: React.ImgHTMLAttributes<HTMLImageElement> = {
  onError: (e) => {
    const t = e.currentTarget;
    if (t.dataset.fallback === '1') return;
    t.dataset.fallback = '1';
    t.style.opacity = '0';
  },
};

const HomePage: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const startDemo = async () => {
    setDemoLoading(true);
    const sessionId = await startDemoSession();
    setDemoLoading(false);
    navigate(sessionId ? `/demo/${sessionId}` : '/demo/preview');
  };

  const openEarlyAccess = () => setEarlyAccessOpen(true);

  const specs = [
    { key: 'landing.spec.subject',     labelDefault: 'Subject',     valueKey: 'landing.spec.subjectValue',     valueDefault: 'Any professional domain' },
    { key: 'landing.spec.level',       labelDefault: 'Level',       valueKey: 'landing.spec.levelValue',       valueDefault: 'Novice through executive' },
    { key: 'landing.spec.duration',    labelDefault: 'Duration',    valueKey: 'landing.spec.durationValue',    valueDefault: 'Half-day through semester' },
    { key: 'landing.spec.tone',        labelDefault: 'Tone',        valueKey: 'landing.spec.toneValue',        valueDefault: 'Yours, verbatim' },
    { key: 'landing.spec.environment', labelDefault: 'Environment', valueKey: 'landing.spec.environmentValue', valueDefault: 'Live room or online cohort' },
  ];

  const problems = [
    {
      Icon: PenLine,
      titleKey: 'landing.problem.item1.title',   titleDefault: 'The blank page',
      bodyKey:  'landing.problem.item1.body',    bodyDefault: 'You know the material. You have delivered it before. Yet every new engagement starts with staring at Sunday-night whitespace, rewriting from memory a course you have already given ten times.',
    },
    {
      Icon: Layers,
      titleKey: 'landing.problem.item2.title',   titleDefault: 'The shallow slide',
      bodyKey:  'landing.problem.item2.body',    bodyDefault: 'Generic tools return generic slides — bullet lists that could belong to anyone\'s course on anything. Your subject matter deserves specificity. So does the room.',
    },
    {
      Icon: Clock,
      titleKey: 'landing.problem.item3.title',   titleDefault: 'The lost week',
      bodyKey:  'landing.problem.item3.body',    bodyDefault: 'Three weeks of prep for eight hours of delivery is the industry ratio. Enough of your calendar is already committed. This should not be part of it.',
    },
  ];

  const youProvide = [
    { k: 'landing.provide.item1', d: 'A subject and a learning outcome' },
    { k: 'landing.provide.item2', d: 'The audience — who they are, what they know' },
    { k: 'landing.provide.item3', d: 'The duration — how many hours, split how' },
    { k: 'landing.provide.item4', d: 'The environment — live workshop or async online' },
    { k: 'landing.provide.item5', d: 'Your voice — the tone, the metaphors, the taboos' },
    { k: 'landing.provide.item6', d: 'Optional: existing materials to inherit from' },
  ];

  const youReceive = [
    { k: 'landing.receive.item1', d: 'A trainer\'s guide — verbatim scripts, timing, transitions' },
    { k: 'landing.receive.item2', d: 'A participant manual — theory, exercises, reflection prompts' },
    { k: 'landing.receive.item3', d: 'A slide deck — one file, layered for editing' },
    { k: 'landing.receive.item4', d: 'Exercise sheets — scenario-based, debrief-ready' },
    { k: 'landing.receive.item5', d: 'A trainer flow — the choreography of your session' },
  ];

  const deliverables = [
    {
      slug: 'trainer_guide',
      titleKey: 'landing.output.trainer_guide.title', titleDefault: 'Trainer Guide',
      descKey:  'landing.output.trainer_guide.desc',  descDefault: 'Verbatim scripts. Timing markers. Transitions between sections.',
      previewKey: 'landing.output.trainer_guide.preview',
      previewDefault: '10:00 (5m) — Open module 2.\n10:05 (15m) — Lesson 1: sentence they cannot argue with.\n         Ask, hand up: which one names the person,\n         which one names the behaviour?',
    },
    {
      slug: 'participant_manual',
      titleKey: 'landing.output.participant_manual.title', titleDefault: 'Participant Manual',
      descKey:  'landing.output.participant_manual.desc',  descDefault: 'Theory, worked examples, reflection prompts, workspace for the day.',
      previewKey: 'landing.output.participant_manual.preview',
      previewDefault: 'MODULE 2 — Draft your opening sentence.\n\nFact:     ______________________________\nImpact:   ______________________________\nQuestion: ______________________________\n\nThen hold your seven seconds.',
    },
    {
      slug: 'slide_deck',
      titleKey: 'landing.output.slide_deck.title', titleDefault: 'Slide Deck',
      descKey:  'landing.output.slide_deck.desc',  descDefault: 'One editable file. Layered. Speaker notes embedded on every slide.',
      previewKey: 'landing.output.slide_deck.preview',
      previewDefault: 'SLIDE 12 · Titled "Fact vs character"\n\nLeft: Yesterday at 3pm you\n      sent the reply-all.\n\nRight: You are careless.\n\nSpeaker notes: give the room twenty seconds.',
    },
    {
      slug: 'exercises',
      titleKey: 'landing.output.exercises.title', titleDefault: 'Exercise Sheets',
      descKey:  'landing.output.exercises.desc',  descDefault: 'Scenario-based. Self-contained. Debrief on the back of every card.',
      previewKey: 'landing.output.exercises.preview',
      previewDefault: 'EXERCISE 3 · 15 min · pairs.\n\nScenario: A team member has been rewriting the\nmeeting notes to remove their own action items.\nDraft the four-step opening for a private one-to-one.\n\nDebrief on the back.',
    },
    {
      slug: 'trainer_flow',
      titleKey: 'landing.output.trainer_flow.title', titleDefault: 'Trainer Flow',
      descKey:  'landing.output.trainer_flow.desc',  descDefault: 'The choreography of the day — where you stand, when you sit, when to break.',
      previewKey: 'landing.output.trainer_flow.preview',
      previewDefault: '13:15 · Return from lunch. Stand behind the flipchart.\n13:20 · Recap from memory. Do not open the deck.\n13:25 · Cold call: one participant demonstrates.\n         You take the direct-report chair.\n13:35 · Break — quiet music, do not chase.',
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-graphite">
      <Helmet>
        <title>{t('landing.meta.title', { defaultValue: 'CourseCopilot — For trainers who craft' })}</title>
        <meta name="description" content={t('landing.meta.description', { defaultValue: 'Feed it your subject, your audience, your voice — and it returns a course as thorough as one you would build by hand, in a fraction of the time.' })} />
      </Helmet>

      {/* NAV — landing-specific, replaces the app Header on this route */}
      <header className="border-b border-hairline">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2 text-graphite">
            <BookOpen size={20} className="text-gold" />
            <span className="font-display text-lg tracking-tight">{t('header.title', { defaultValue: 'CourseCopilot' })}</span>
          </NavLink>
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="input-premium w-[70px] py-1 text-xs"
              aria-label="Language"
            >
              <option value="en">EN</option>
              <option value="ro">RO</option>
            </select>
            <button
              onClick={toggleTheme}
              className="p-2 text-stone hover:text-graphite transition-colors"
              aria-label={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            {user ? (
              <NavLink to="/dashboard" className="btn-premium">
                {t('landing.nav.dashboard', { defaultValue: 'Dashboard' })}
              </NavLink>
            ) : (
              <button onClick={openEarlyAccess} className="btn-premium">
                {t('landing.nav.cta', { defaultValue: 'Get Early Access' })}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-hairline">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="mono-eyebrow mb-6">{t('landing.hero.eyebrow', { defaultValue: 'For trainers who craft — not assemble' })}</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-graphite mb-8">
              <span className="block">{t('landing.hero.line1', { defaultValue: 'You have spent' })}</span>
              <span className="block">{t('landing.hero.line2', { defaultValue: 'twenty years' })}</span>
              <span className="block italic text-gold">{t('landing.hero.line3', { defaultValue: 'learning your craft.' })}</span>
            </h1>
            <p className="text-lg text-graphite leading-relaxed mb-10 max-w-xl">
              {t('landing.hero.body', { defaultValue: 'The system that respects that. Feed it your subject, your audience, your voice — and it returns a course as thorough as one you would build by hand, in a fraction of the time.' })}
            </p>

            {/* Spec tags in 2-col grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-10">
              {specs.map(s => (
                <div key={s.key} className="border-t border-hairline pt-3">
                  <p className="mono-eyebrow mb-1">{t(s.key, { defaultValue: s.labelDefault })}</p>
                  <p className="text-sm text-graphite">{t(s.valueKey, { defaultValue: s.valueDefault })}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={startDemo} disabled={demoLoading} className="btn-premium">
                {demoLoading
                  ? t('landing.hero.demoLoading', { defaultValue: 'Loading...' })
                  : t('landing.hero.demoCta', { defaultValue: 'Try a free demo' })}
                <ArrowRight size={12} />
              </button>
              <button onClick={openEarlyAccess} className="btn-premium--secondary">
                {t('landing.hero.leadCta', { defaultValue: 'Get early access' })}
              </button>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative aspect-[4/5] lg:aspect-square bg-paper-alt border border-hairline overflow-hidden">
            <img
              src={HERO_IMG}
              alt="Brass fountain pen on a blueprint grid"
              className="w-full h-full object-cover"
              {...withImageFallback}
            />
          </div>
        </div>
      </section>

      {/* PROBLEM — light section, 3 items with hairline dividers */}
      <section className="bg-paper-alt border-b border-hairline">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <p className="mono-eyebrow mb-6">{t('landing.problem.eyebrow', { defaultValue: 'The problem' })}</p>
          <h2 className="font-display text-3xl md:text-4xl text-graphite leading-tight mb-16 max-w-2xl">
            {t('landing.problem.title', { defaultValue: 'Three things every trainer has stopped talking about publicly.' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {problems.map((p, i) => (
              <div
                key={i}
                className={`p-8 border-t border-hairline ${i > 0 ? 'md:border-t-0 md:border-l' : ''}`}
              >
                <div className="mb-6 text-gold">
                  <p className="mono-eyebrow text-gold mb-4">{String(i + 1).padStart(2, '0')}</p>
                  <p.Icon size={24} />
                </div>
                <h3 className="font-display text-2xl text-graphite mb-4 leading-snug">
                  {t(p.titleKey, { defaultValue: p.titleDefault })}
                </h3>
                <p className="font-mono text-sm text-stone leading-relaxed">
                  {t(p.bodyKey, { defaultValue: p.bodyDefault })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — always-dark section, grid backdrop */}
      <section className="section-dark mastery-grid border-b border-hairline">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <p className="mono-eyebrow mb-6">{t('landing.how.eyebrow', { defaultValue: 'How it works' })}</p>
          <h2 className="font-display text-3xl md:text-4xl text-graphite leading-tight mb-16 max-w-2xl">
            {t('landing.how.title', { defaultValue: 'A trade of specifics — not prompts.' })}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* You provide */}
            <div>
              <p className="mono-eyebrow text-gold mb-6">{t('landing.how.provideEyebrow', { defaultValue: 'You provide' })}</p>
              <ol className="space-y-0 border-t border-hairline">
                {youProvide.map((p, i) => (
                  <li key={p.k} className="flex gap-6 py-5 border-b border-hairline">
                    <span className="mono-eyebrow text-gold shrink-0 w-8">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-graphite">{t(p.k, { defaultValue: p.d })}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* You receive */}
            <div>
              <p className="mono-eyebrow text-gold mb-6">{t('landing.how.receiveEyebrow', { defaultValue: 'You receive' })}</p>
              <ul className="space-y-0 border-t border-hairline">
                {youReceive.map(r => (
                  <li key={r.k} className="flex gap-4 py-5 border-b border-hairline">
                    <span className="mono-eyebrow text-gold shrink-0 mt-1">↳</span>
                    <span className="text-graphite">{t(r.k, { defaultValue: r.d })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bordered callout */}
          <div className="mt-20 border border-gold-dim p-8 md:p-12 max-w-3xl mx-auto text-center">
            <p className="font-display italic text-2xl md:text-3xl text-graphite leading-snug">
              "{t('landing.how.callout', { defaultValue: 'You keep the pen. It sharpens it.' })}"
            </p>
          </div>

          {/* Texture image at the bottom */}
          <div className="mt-16 aspect-[16/6] border border-hairline overflow-hidden">
            <img
              src={HOW_IT_WORKS_IMG}
              alt="Wood and brass cubes on slate"
              className="w-full h-full object-cover"
              {...withImageFallback}
            />
          </div>
        </div>
      </section>

      {/* THE OUTPUT — cards with EDITABLE PREVIEW boxes */}
      <section className="border-b border-hairline">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-start mb-16">
            <div>
              <p className="mono-eyebrow mb-6">{t('landing.output.eyebrow', { defaultValue: 'The output' })}</p>
              <h2 className="font-display text-3xl md:text-4xl text-graphite leading-tight max-w-lg">
                {t('landing.output.title', { defaultValue: 'Five artefacts. Ready for the room.' })}
              </h2>
              <p className="text-graphite leading-relaxed mt-6 max-w-md">
                {t('landing.output.body', { defaultValue: 'Not a blob of Markdown. Named files, each with a job — layered, editable, exported in one click when you approve them.' })}
              </p>
            </div>
            <div className="aspect-[4/3] border border-hairline overflow-hidden">
              <img
                src={OUTPUT_IMG}
                alt="Leather-bound book and handmade paper"
                className="w-full h-full object-cover"
                {...withImageFallback}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 border-t border-hairline">
            {deliverables.map((d, i) => (
              <div
                key={d.slug}
                className={`p-6 border-b border-hairline ${(i + 1) % 2 !== 0 ? 'md:border-r' : ''} ${(i + 1) % 3 !== 0 ? 'xl:border-r' : ''}`}
              >
                <p className="mono-eyebrow text-gold mb-3">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="font-display text-2xl text-graphite mb-3">
                  {t(d.titleKey, { defaultValue: d.titleDefault })}
                </h3>
                <p className="font-mono text-sm text-stone mb-5 leading-relaxed">
                  {t(d.descKey, { defaultValue: d.descDefault })}
                </p>
                <div className="bg-paper-alt border border-hairline p-4">
                  <p className="mono-eyebrow mb-3">
                    {t('landing.output.previewLabel', { defaultValue: 'Preview · editable' })}
                  </p>
                  <pre className="font-mono text-[11px] text-graphite whitespace-pre-wrap leading-relaxed">
                    {t(d.previewKey, { defaultValue: d.previewDefault })}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-b border-hairline">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="aspect-[4/3] border border-hairline overflow-hidden order-2 lg:order-1">
            <img
              src={FINAL_CTA_IMG}
              alt="Brutalist concrete library with brass task lamps"
              className="w-full h-full object-cover"
              {...withImageFallback}
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="mono-eyebrow mb-6">{t('landing.finalCta.eyebrow', { defaultValue: 'The invitation' })}</p>
            <h2 className="font-display text-3xl md:text-4xl text-graphite leading-tight mb-6">
              {t('landing.finalCta.title', { defaultValue: 'Built by trainers, for trainers who take the work seriously.' })}
            </h2>
            <p className="text-graphite leading-relaxed mb-8 max-w-lg">
              {t('landing.finalCta.body', { defaultValue: 'Early access is limited. You will hear from us once, when we open the door. No newsletter. No drip. No noise.' })}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={openEarlyAccess} className="btn-premium">
                {t('landing.finalCta.cta', { defaultValue: 'Get Early Access' })}
              </button>
              <button onClick={startDemo} disabled={demoLoading} className="btn-premium--secondary">
                {t('landing.finalCta.demoCta', { defaultValue: 'Try a free demo' })}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal footer within landing (no shared Footer here) */}
      <footer className="bg-paper-alt py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="mono-eyebrow">© {new Date().getFullYear()} CourseCopilot</p>
          <p className="mono-eyebrow">
            {t('landing.footer.tagline', { defaultValue: 'For trainers who craft — not assemble' })}
          </p>
        </div>
      </footer>

      <EarlyAccessModal open={earlyAccessOpen} onClose={() => setEarlyAccessOpen(false)} source="landing" />
    </div>
  );
};

export default HomePage;
