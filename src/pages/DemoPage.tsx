import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Download, Lock } from 'lucide-react';
import { useTranslation } from '../contexts/I18nContext';
import { DEMO_COURSE, DemoModule, DemoDeliverable } from '../data/demoFixture';
import { getStoredDemoSessionId } from '../services/leadService';

const specTags = (c: typeof DEMO_COURSE) => [
  { key: 'landing.spec.subject',     label: 'Subject',     value: c.subject },
  { key: 'landing.spec.level',       label: 'Level',       value: c.level },
  { key: 'landing.spec.duration',    label: 'Duration',    value: c.duration },
  { key: 'landing.spec.tone',        label: 'Tone',        value: c.tone },
  { key: 'landing.spec.environment', label: 'Environment', value: c.environment },
];

const DemoPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedModuleId, setSelectedModuleId] = useState<string>(DEMO_COURSE.modules[0].id);
  const [selectedDeliverable, setSelectedDeliverable] = useState<DemoDeliverable | null>(null);

  useEffect(() => {
    // Rehydrate from localStorage if the URL didn't carry a session id.
    if (!sessionId) {
      const stored = getStoredDemoSessionId();
      if (stored) navigate(`/demo/${stored}`, { replace: true });
    }
  }, [sessionId, navigate]);

  const selectedModule: DemoModule = DEMO_COURSE.modules.find(m => m.id === selectedModuleId) || DEMO_COURSE.modules[0];

  const handleSignup = () => {
    // localStorage keeps the demoSessionId; AuthContext flips converted_to_signup after signup.
    navigate('/login?from=demo');
  };

  return (
    <div className="min-h-screen bg-paper text-graphite">
      <Helmet>
        <title>{t('demo.meta.title', { defaultValue: 'Demo — CourseCopilot' })}</title>
      </Helmet>

      {/* Landing-parity nav */}
      <header className="sticky top-0 z-40 bg-paper border-b border-hairline">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2 text-graphite">
            <BookOpen size={20} className="text-gold" />
            <span className="font-display text-lg tracking-tight">{t('header.title', { defaultValue: 'CourseCopilot' })}</span>
          </NavLink>
          <div className="flex items-center gap-4">
            <span className="mono-eyebrow hidden sm:inline">
              {t('demo.banner', { defaultValue: 'Read-only demo · no account · one sample course' })}
            </span>
            <button onClick={handleSignup} className="btn-premium">
              {t('demo.cta', { defaultValue: 'Get Early Access' })}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        {/* Course meta */}
        <section className="mb-16">
          <p className="mono-eyebrow mb-4">{t('demo.eyebrow', { defaultValue: 'Sample course' })}</p>
          <h1 className="font-display text-4xl md:text-5xl text-graphite mb-6 leading-tight max-w-3xl">
            {DEMO_COURSE.title}
          </h1>
          <p className="text-graphite text-lg leading-relaxed max-w-3xl mb-8">
            {DEMO_COURSE.learning_outcome}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl">
            {specTags(DEMO_COURSE).map(tag => (
              <div key={tag.label} className="border-t border-hairline pt-3">
                <p className="mono-eyebrow mb-1">{t(tag.key, { defaultValue: tag.label })}</p>
                <p className="text-sm text-graphite">{tag.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Module walker */}
        <section className="mb-20">
          <p className="mono-eyebrow mb-4">{t('demo.structureEyebrow', { defaultValue: 'Structure' })}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-hairline">
            {DEMO_COURSE.modules.map(m => {
              const active = m.id === selectedModuleId;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModuleId(m.id)}
                  className={`text-left p-6 border-b md:border-b-0 md:border-r border-hairline last:border-r-0 transition-colors ${active ? 'bg-paper-alt' : 'hover:bg-paper-alt'}`}
                >
                  <p className={`mono-eyebrow mb-3 ${active ? 'text-gold' : ''}`}>{m.index}</p>
                  <h3 className="font-display text-lg text-graphite mb-2 leading-snug">{m.title}</h3>
                  <p className="text-sm text-stone">{m.duration}</p>
                </button>
              );
            })}
          </div>

          {/* Module detail */}
          <div className="border-l border-r border-b border-hairline p-8 bg-paper-alt/30">
            <p className="mono-eyebrow mb-2">{t('demo.moduleObjective', { defaultValue: 'Learning objective' })}</p>
            <p className="text-graphite mb-8 leading-relaxed">{selectedModule.learning_objective}</p>

            <div className="space-y-6">
              {selectedModule.lessons.map((l, i) => (
                <div key={l.id} className="border-t border-hairline pt-6 first:border-t-0 first:pt-0">
                  <div className="flex items-baseline justify-between mb-3 gap-4">
                    <h4 className="font-display text-xl text-graphite leading-tight">
                      <span className="mono-eyebrow text-gold mr-3">{String(i + 1).padStart(2, '0')}</span>
                      {l.title}
                    </h4>
                    <span className="mono-eyebrow whitespace-nowrap">{l.duration_minutes}m</span>
                  </div>
                  <p className="text-sm text-stone mb-4">{l.learning_objective}</p>
                  <div className="border-l-2 border-gold pl-4 text-sm text-graphite italic leading-relaxed mb-4">
                    "{l.excerpt}"
                  </div>
                  <ul className="space-y-2">
                    {l.key_takeaways.map((k, ki) => (
                      <li key={ki} className="flex gap-3 text-sm text-graphite">
                        <span className="mono-eyebrow text-gold mt-0.5">↳</span>
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deliverables — preview boxes */}
        <section className="mb-20">
          <p className="mono-eyebrow mb-4">{t('demo.deliverablesEyebrow', { defaultValue: 'What you get' })}</p>
          <h2 className="font-display text-3xl text-graphite mb-8 max-w-2xl">
            {t('demo.deliverablesTitle', { defaultValue: 'Five artefacts, one course.' })}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-hairline">
            {DEMO_COURSE.deliverables.map((d, i) => (
              <div
                key={d.slug}
                className={`p-6 border-b border-hairline ${i % 2 === 0 ? 'lg:border-r' : ''}`}
              >
                <div className="flex items-start justify-between mb-3 gap-4">
                  <div>
                    <p className="mono-eyebrow text-gold mb-2">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="font-display text-xl text-graphite mb-1">{d.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedDeliverable(d)}
                    className="btn-premium--secondary-sm"
                    aria-label={`Open ${d.title}`}
                  >
                    <ArrowRight size={12} />
                  </button>
                </div>
                <p className="text-sm text-stone mb-4">{d.description}</p>
                <div className="bg-paper border border-hairline p-4">
                  <p className="mono-eyebrow mb-3">{t('demo.previewEditable', { defaultValue: 'Preview · editable' })}</p>
                  <pre className="font-mono text-[11px] text-graphite whitespace-pre-wrap leading-relaxed">
                    {d.excerpt.split('\n').slice(0, 3).join('\n')}
                    {d.excerpt.split('\n').length > 3 ? '\n...' : ''}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Signup call */}
        <section className="border-t border-hairline pt-16 pb-8 text-center max-w-2xl mx-auto">
          <p className="mono-eyebrow mb-4">{t('demo.wallEyebrow', { defaultValue: 'The wall' })}</p>
          <h2 className="font-display text-3xl text-graphite mb-6 leading-tight">
            {t('demo.wallTitle', { defaultValue: 'Real generation is behind an account.' })}
          </h2>
          <p className="text-stone leading-relaxed mb-8">
            {t('demo.wallBody', { defaultValue: 'What you just walked through is one pre-made sample. To feed us your own subject, audience, and voice — and get back an equally thorough course — grab an early-access slot.' })}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleSignup} className="btn-premium">
              <Lock size={12} />
              {t('demo.wallCta', { defaultValue: 'Get Early Access' })}
            </button>
            <NavLink to="/" className="btn-premium--secondary">
              <ArrowLeft size={12} />
              {t('demo.wallBack', { defaultValue: 'Back to landing' })}
            </NavLink>
          </div>
        </section>
      </main>

      {/* Deliverable focus modal */}
      {selectedDeliverable && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center p-4 md:p-8 bg-graphite/70 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedDeliverable(null)}
        >
          <div
            className="w-full max-w-3xl bg-paper border border-hairline p-8 my-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <p className="mono-eyebrow text-gold mb-2">{t('demo.previewEditable', { defaultValue: 'Preview · editable' })}</p>
                <h3 className="font-display text-2xl text-graphite">{selectedDeliverable.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDeliverable(null)}
                className="mono-eyebrow p-2 hover:text-gold"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-stone mb-6">{selectedDeliverable.description}</p>
            <div className="bg-paper-alt border border-hairline p-6">
              <pre className="font-mono text-[12px] text-graphite whitespace-pre-wrap leading-relaxed">
                {selectedDeliverable.excerpt}
              </pre>
            </div>
            <div className="flex gap-3 mt-6 items-center flex-wrap">
              <button
                disabled
                className="btn-premium--secondary opacity-60 cursor-not-allowed"
                title={t('demo.exportDisabled', { defaultValue: 'Export is available after signup' })}
              >
                <Download size={12} />
                {t('demo.export', { defaultValue: 'Export' })}
              </button>
              <p className="text-xs text-stone font-mono">
                {t('demo.exportDisabled', { defaultValue: 'Export is available after signup' })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoPage;
