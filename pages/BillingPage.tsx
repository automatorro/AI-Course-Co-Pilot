
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/I18nContext';
import PricingTable from '../components/PricingTable';
import { ExternalLink } from 'lucide-react';

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // In a real app, this would redirect to a Stripe customer portal URL fetched from the backend.
  const handleManageSubscription = () => {
    alert("Redirecting to Stripe Customer Portal...");
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
        <PricingTable user={user} />
      </div>
      
      <div className="mt-16 max-w-2xl mx-auto text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold">{t('billing.manage')}</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">{t('billing.manage.subtitle')}</p>
        <button 
          onClick={handleManageSubscription}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <ExternalLink size={20} />
          Go to Stripe Portal
        </button>
      </div>
    </div>
  );
};

export default BillingPage;
