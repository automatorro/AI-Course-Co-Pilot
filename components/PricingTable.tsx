
import React from 'react';
import { PRICING_PLANS } from '../constants';
import { Plan, User } from '../types';
import { useTranslation } from '../contexts/I18nContext';
import { Check } from 'lucide-react';

interface PricingTableProps {
  user: User | null;
}

const PricingTable: React.FC<PricingTableProps> = ({ user }) => {
    const { t } = useTranslation();
    const plans = Object.values(PRICING_PLANS);

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
              disabled={user?.plan === plan.name}
              className="mt-8 block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
              bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline-primary-600"
            >
              {user?.plan === plan.name ? t('homepage.pricing.currentPlan') : t('homepage.pricing.getStarted')}
            </button>
          </div>
        ))}
      </div>
    );
};

export default PricingTable;
