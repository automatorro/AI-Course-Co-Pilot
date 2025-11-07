import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/I18nContext';
import { useToast } from '../contexts/ToastContext';
import PricingTable from '../components/PricingTable';
import { supabase } from '../services/supabaseClient';
import { ExternalLink, Loader2 } from 'lucide-react';

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null); // Kept for PricingTable prop
  
  const handleManageSubscription = async () => {
    setIsRedirecting(true);
    setError(null);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw new Error(`Authentication error: ${sessionError.message}`);
      if (!sessionData.session) throw new Error('You must be logged in to manage your subscription.');
      
      const token = sessionData.session.access_token;

      const { data, error: invokeError } = await supabase.functions.invoke('create-portal-session', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (invokeError) {
        const errorMessage = invokeError.context?.error_msg || invokeError.message;
        throw new Error(`Failed to create portal session: ${errorMessage}. Ensure SITE_URL is set in Supabase.`);
      }
      
      if (!data || !data.url) {
        throw new Error("The portal session function did not return a valid URL.");
      }

      window.open(data.url, '_blank', 'noopener,noreferrer');

    } catch(err: any) {
        console.error('Error redirecting to Stripe portal:', err);
        const friendlyMessage = err.message || 'An unknown error occurred.';
        setError(friendlyMessage);
        showToast(friendlyMessage, 'error');
    } finally {
        setIsRedirecting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-4">{t('billing.title')}</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
        {t('billing.currentPlan')}{' '}
        <span className="font-semibold text-primary-600 dark:text-primary-400">{user.plan}</span>.
      </p>

      <div className="max-w-5xl mx-auto">
        <PricingTable user={user} error={error} setError={(msg) => {
            setError(msg);
            if (msg) showToast(msg, 'error');
        }} />
      </div>
      
      <div className="mt-16 max-w-2xl mx-auto text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold">{t('billing.manage')}</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">{t('billing.manage.subtitle')}</p>
        <button 
          onClick={handleManageSubscription}
          disabled={isRedirecting}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
        >
          {isRedirecting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              {t('billing.redirecting')}
            </>
          ) : (
            <>
              <ExternalLink size={20} />
              {t('billing.goToPortal')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BillingPage;