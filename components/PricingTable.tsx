import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRICING_PLANS, STRIPE_PUBLISHABLE_KEY } from '../constants';
import { Plan, User } from '../types';
import { useTranslation } from '../contexts/I18nContext';
import { supabase } from '../services/supabaseClient';
import { Check, Loader2 } from 'lucide-react';

// Make Stripe available on the window object for TypeScript
declare global {
  interface Window { Stripe: any; }
}

interface PricingTableProps {
  user: User | null;
  error: string | null;
  setError: (error: string | null) => void;
}

const PricingTable: React.FC<PricingTableProps> = ({ user, error, setError }) => {
    const { t } = useTranslation();
    const plans = Object.values(PRICING_PLANS);
    const navigate = useNavigate();
    const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

    const handleCheckout = async (plan: typeof plans[0]) => {
      setError(null);

      // Add specific check for placeholder key to improve debugging experience
      if (STRIPE_PUBLISHABLE_KEY.includes('placeholder')) {
        setError("Configuration Error: Please replace the placeholder STRIPE_PUBLISHABLE_KEY in constants.ts with your actual key from the Stripe dashboard.");
        return;
      }

      // FIX: Use the 'in' operator to check for property existence on the union type.
      // This narrows the type of 'plan' to one that includes 'priceId', fixing errors in this function.
      if (!('priceId' in plan) || !plan.priceId) return;

      if (!user) {
        navigate('/login');
        return;
      }

      setLoadingPriceId(plan.priceId);

      try {
        const { data, error: invokeError } = await supabase.functions.invoke('create-checkout-session', {
          body: { priceId: plan.priceId },
        });

        if (invokeError) {
          throw new Error(`Failed to create checkout session: ${invokeError.message}. Ensure SITE_URL is set in Supabase function variables.`);
        }
        
        const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
        if (!stripe) {
            throw new Error('Stripe.js has not loaded correctly. Check your internet connection and script tag.');
        }

        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.id });
        
        if (stripeError) {
          throw new Error(`Stripe redirect failed: ${stripeError.message}`);
        }

      } catch (error: any) {
        console.error('Error handling checkout:', error);
        setError(error.message);
        setLoadingPriceId(null);
      }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
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
            <ul role="list" className="mt-8 space-y-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {(t(`homepage.pricing.${plan.featuresKey}`) as unknown as string[]).map((feature, index) => (
                <li key={index} className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary-600" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(plan)}
              disabled={user?.plan === plan.name || !!loadingPriceId || plan.price === 0}
              className="mt-8 block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
              bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline-primary-600"
            >
              {/* FIX: Use the 'in' operator to safely access 'priceId' on the union type before comparison. */}
              {loadingPriceId === ('priceId' in plan && plan.priceId) ? (
                <>
                  <Loader2 className="animate-spin inline mr-2" size={16}/>
                  {t('homepage.pricing.subscribing')}
                </>
              ) : (user?.plan === plan.name ? t('homepage.pricing.currentPlan') : t('homepage.pricing.getStarted'))}
            </button>
          </div>
        ))}
      </div>
    );
};

export default PricingTable;