import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { PRICING_PLANS, STRIPE_PUBLISHABLE_KEY } from '../constants';
import { User } from '../types';
import { useTranslation } from '../contexts/I18nContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../services/supabaseClient';
import { Check, Loader2 } from 'lucide-react';

interface PricingTableProps {
  user: User | null;
  error: string | null;
  setError: (error: string | null) => void;
}

const PricingTableNext: React.FC<PricingTableProps> = ({ user, setError }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const plans = Object.values(PRICING_PLANS);
    const router = useRouter();
    const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
    
    const handleError = (message: string) => {
        setError(message);
        showToast(message, 'error');
    };

    const handleCheckout = async (plan: typeof plans[0]) => {
      setError(null);

      if (STRIPE_PUBLISHABLE_KEY.includes('YOUR_') || !STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
        handleError("Configuration Error: Please replace the placeholder STRIPE_PUBLISHABLE_KEY in constants.ts with your actual key from the Stripe dashboard.");
        return;
      }
      
      if (!('priceId' in plan) || !plan.priceId) return;
      
      if (plan.priceId.startsWith('prod_')) {
        handleError("Configuration Error: You have entered a Product ID (prod_...). Please use the Price ID (starts with 'price_') from your Stripe dashboard's product page.");
        return;
      }

      if (plan.priceId.includes('YOUR_') || !plan.priceId.startsWith('price_')) {
        handleError("Configuration Error: Please provide a valid Stripe Price ID (starting with 'price_') for this plan in constants.ts.");
        return;
      }

      if (!user) {
        router.push('/login');
        return;
      }

      setLoadingPriceId(plan.priceId);

      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw new Error(`Authentication error: ${sessionError.message}`);
        if (!sessionData.session) throw new Error('You must be logged in to subscribe.');

        const token = sessionData.session.access_token;

        const { data, error: invokeError } = await supabase.functions.invoke('create-checkout-session', {
          headers: { 'Authorization': `Bearer ${token}` },
          body: { priceId: plan.priceId },
        });

        if (invokeError) {
          const errorMessage = invokeError.context?.error_msg || invokeError.message;
          throw new Error(`Failed to create checkout session: ${errorMessage}. Ensure SITE_URL is set in Supabase function variables.`);
        }
        
        if (!data || !data.url) {
            throw new Error("The checkout session function did not return a valid URL.");
        }
        
        window.open(data.url, '_blank', 'noopener,noreferrer');

      } catch (error: any) {
        console.error('Error handling checkout:', error);
        handleError(error.message);
      } finally {
        setLoadingPriceId(null);
      }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
            const priceId = 'priceId' in plan ? (plan as any).priceId : undefined;
            return (
          <div
            key={plan.name}
            className={`rounded-2xl p-8 shadow-lg border transform transition-transform hover:scale-105 ${
              user?.plan === plan.name ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200 dark:border-gray-700'
            } bg-white dark:bg-gray-800`}
          >
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
            <p className="mt-4 text-gray-500 dark:text-gray-400">{t(`homepage.pricing.${plan.featuresKey}`)[0]}</p>
            <p className="mt-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              {plan.price > 0 ? `€${plan.price}` : 'Free'}
              <span className="text-lg font-medium text-gray-500 dark:text-gray-400">{plan.duration}</span>
            </p>
            <ul className="mt-6 space-y-4">
              {t(`homepage.pricing.${plan.featuresKey}`).map((feature: string) => (
                <li key={feature} className="flex">
                  <Check className="h-6 w-6 flex-shrink-0 text-primary-500" />
                  <span className="ml-3 text-gray-500 dark:text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(plan)}
              disabled={(priceId && loadingPriceId === priceId) || (user?.plan === plan.name && plan.price > 0)}
              className={`mt-8 w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all ${
                user?.plan === plan.name
                  ? 'bg-green-600 cursor-default'
                  : 'bg-primary-600 hover:bg-primary-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {priceId && loadingPriceId === priceId ? (
                <Loader2 className="animate-spin mx-auto h-5 w-5" />
              ) : user?.plan === plan.name ? (
                t('pricing.currentPlan', { defaultValue: 'Current Plan' })
              ) : (
                plan.price > 0 ? t('pricing.subscribe', { defaultValue: 'Subscribe' }) : t('pricing.getStarted', { defaultValue: 'Get Started' })
              )}
            </button>
          </div>
        );
        })}
      </div>
    );
};

export default PricingTableNext;
