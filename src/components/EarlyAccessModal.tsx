import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { useTranslation } from '../contexts/I18nContext';
import { submitWaitlistLead } from '../services/leadService';

interface Props {
  open: boolean;
  onClose: () => void;
  source?: string;
}

const EarlyAccessModal: React.FC<Props> = ({ open, onClose, source }) => {
  const { t, language } = useTranslation();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setStatus('idle');
      setErrorMsg(null);
      setTimeout(() => emailRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg(null);
    const res = await submitWaitlistLead({ email, role, locale: language, source });
    if (res.ok) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMsg(res.error === 'invalid_email'
        ? t('landing.earlyAccess.errorInvalidEmail', { defaultValue: 'That email address looks off — check for typos.' })
        : t('landing.earlyAccess.errorGeneric', { defaultValue: 'Something went wrong. Please try again.' })
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-graphite/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-paper border border-hairline p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-stone hover:text-graphite transition-colors"
          aria-label={t('landing.earlyAccess.close', { defaultValue: 'Close' })}
        >
          <X size={18} />
        </button>

        {status === 'success' ? (
          <div className="py-4">
            <div className="w-12 h-12 mb-4 flex items-center justify-center border border-gold">
              <Check className="w-6 h-6 text-gold" />
            </div>
            <p className="mono-eyebrow mb-3">{t('landing.earlyAccess.confirmedEyebrow', { defaultValue: 'You are on the list' })}</p>
            <h3 className="font-display text-2xl text-graphite mb-3">{t('landing.earlyAccess.confirmedTitle', { defaultValue: "We'll write when it's ready." })}</h3>
            <p className="text-sm text-stone leading-relaxed">
              {t('landing.earlyAccess.confirmedBody', { defaultValue: 'No newsletter, no drip campaign. One email when early access opens.' })}
            </p>
          </div>
        ) : (
          <>
            <p className="mono-eyebrow mb-3">{t('landing.earlyAccess.eyebrow', { defaultValue: 'Early access' })}</p>
            <h3 className="font-display text-2xl text-graphite mb-2">{t('landing.earlyAccess.title', { defaultValue: 'Keep me posted.' })}</h3>
            <p className="text-sm text-stone mb-6 leading-relaxed">
              {t('landing.earlyAccess.body', { defaultValue: "Leave an email. We'll write once — when we open the door — and never again unless you ask." })}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mono-eyebrow block mb-2" htmlFor="ea-email">
                  {t('landing.earlyAccess.emailLabel', { defaultValue: 'Email' })}
                </label>
                <input
                  ref={emailRef}
                  id="ea-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-premium"
                  placeholder="you@studio.com"
                />
              </div>
              <div>
                <label className="mono-eyebrow block mb-2" htmlFor="ea-role">
                  {t('landing.earlyAccess.roleLabel', { defaultValue: 'What you do (optional)' })}
                </label>
                <input
                  id="ea-role"
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="input-premium"
                  placeholder={t('landing.earlyAccess.rolePlaceholder', { defaultValue: 'Freelance trainer, L&D lead...' })}
                />
              </div>

              {errorMsg && (
                <p className="text-sm font-mono text-red-700 dark:text-red-400">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-premium w-full mt-2"
              >
                {status === 'submitting'
                  ? t('landing.earlyAccess.submitting', { defaultValue: 'Sending...' })
                  : t('landing.earlyAccess.submit', { defaultValue: 'Send' })}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EarlyAccessModal;
