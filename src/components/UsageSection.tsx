import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Loader2, Zap, TrendingUp, Clock, BarChart2 } from 'lucide-react';

interface CreditStatus {
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
  reset_at: string;
  is_over_limit: boolean;
}

interface MonthlyCost {
  luna: string;
  numar_cereri: number;
  total_tokeni: number;
  cost_total_usd: number;
}

interface RecentCall {
  id: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  action: string;
  created_at: string;
  cost_usd: number;
}

interface Props {
  userId: string;
}

const ACTION_LABELS: Record<string, string> = {
  generate_module_context: 'Structură modul',
  generate_workbook: 'Caiet participant',
  generate_manual: 'Manual trainer',
  generate_slides: 'Slide-uri',
  generate_exercises: 'Exerciții',
  generate_video_script: 'Script video',
  generate_lesson_content: 'Conținut lecție',
  backfill_key_takeaways: 'Concluzii cheie',
  generate: 'Generare',
};

function formatUSD(val: number): string {
  if (val < 0.01) return `$${(val * 100).toFixed(3)}¢`;
  return `$${val.toFixed(4)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
}

const UsageSection: React.FC<Props> = ({ userId }) => {
  const [credits, setCredits] = useState<CreditStatus | null>(null);
  const [monthly, setMonthly] = useState<MonthlyCost[]>([]);
  const [recent, setRecent] = useState<RecentCall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      const [creditsRes, monthlyRes, recentRes] = await Promise.all([
        supabase.rpc('get_ai_credit_status', { p_user_id: userId }),
        supabase
          .from('monthly_cost_report')
          .select('luna, numar_cereri, total_tokeni, cost_total_usd')
          .eq('user_id', userId)
          .order('luna', { ascending: false })
          .limit(3),
        supabase
          .from('usage_logs_with_cost')
          .select('id, model, input_tokens, output_tokens, total_tokens, action, created_at, cost_usd')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(15),
      ]);

      if (!mounted) return;

      if (creditsRes.data) setCredits(creditsRes.data as CreditStatus);
      if (monthlyRes.data) setMonthly(monthlyRes.data as MonthlyCost[]);
      if (recentRes.data) setRecent(recentRes.data as RecentCall[]);

      setLoading(false);
    };

    load();
    return () => { mounted = false; };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    );
  }

  const gaugeColor = credits
    ? credits.percentage >= 90 ? 'bg-red-500' : credits.percentage >= 70 ? 'bg-yellow-400' : 'bg-green-500'
    : 'bg-gold';

  const resetDate = credits?.reset_at
    ? new Date(credits.reset_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' })
    : '—';

  return (
    <div className="space-y-6">

      {/* Credit operații AI */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-gold" />
          <h3 className="font-semibold text-lg">Operații AI luna aceasta</h3>
        </div>

        {credits ? (
          <>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
              <span>{credits.used} utilizate</span>
              <span>{credits.limit} limită</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`${gaugeColor} h-3 rounded-full transition-all`}
                style={{ width: `${Math.min(credits.percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>{credits.remaining} rămase</span>
              <span>Reset: {resetDate}</span>
            </div>
            {credits.is_over_limit && (
              <p className="mt-3 text-sm text-red-500 font-medium">
                Ai atins limita lunară. Generările sunt blocate până la reset.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400">Nu s-au putut încărca creditele.</p>
        )}
      </div>

      {/* Cost lunar */}
      {monthly.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-gold" />
            <h3 className="font-semibold text-lg">Cost estimat per lună</h3>
          </div>
          <div className="space-y-3">
            {monthly.map((m) => (
              <div key={m.luna} className="flex items-center justify-between py-2 border-b dark:border-gray-700 last:border-0">
                <div>
                  <p className="font-medium capitalize">{formatMonth(m.luna)}</p>
                  <p className="text-xs text-gray-400">{m.numar_cereri} cereri · {m.total_tokeni.toLocaleString('ro-RO')} tokeni</p>
                </div>
                <span className="font-mono font-semibold text-gold">{formatUSD(m.cost_total_usd)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            * Costuri estimate pe baza prețurilor publice Google Gemini. Nu reprezintă o factură.
          </p>
        </div>
      )}

      {/* Activitate recentă */}
      {recent.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-gold" />
            <h3 className="font-semibold text-lg">Activitate recentă</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b dark:border-gray-700">
                  <th className="pb-2 pr-4">Acțiune</th>
                  <th className="pb-2 pr-4">Model</th>
                  <th className="pb-2 pr-4 text-right">Tokeni</th>
                  <th className="pb-2 pr-4 text-right">Cost</th>
                  <th className="pb-2 text-right">Data</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">
                      {ACTION_LABELS[r.action] ?? r.action}
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-gray-400 truncate max-w-[120px]">
                      {r.model}
                    </td>
                    <td className="py-2 pr-4 text-right text-gray-500">
                      {r.total_tokens.toLocaleString('ro-RO')}
                    </td>
                    <td className="py-2 pr-4 text-right font-mono text-xs text-gold">
                      {formatUSD(r.cost_usd)}
                    </td>
                    <td className="py-2 text-right text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(r.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {recent.length === 0 && monthly.length === 0 && !credits && (
        <div className="text-center py-8 text-gray-400">
          <BarChart2 size={32} className="mx-auto mb-2 opacity-40" />
          <p>Nicio activitate înregistrată încă.</p>
        </div>
      )}
    </div>
  );
};

export default UsageSection;
