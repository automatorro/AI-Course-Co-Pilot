/**
 * creditService.ts
 * ==========================================
 * AI Operation Credit System for CourseCopilot
 *
 * Enforces per-plan AI operation limits to prevent runaway costs.
 * Integrates with the Supabase DB functions:
 *   - increment_ai_operations(user_id, amount)
 *   - get_ai_credit_status(user_id)
 *
 * Plan Limits (stored in profiles.ai_operations_limit):
 *   Trial  →  50 operations/month
 *   Basic  →  200 operations/month
 *   Pro    →  1000 operations/month
 *
 * Usage:
 *   const canProceed = await creditService.checkAndConsume(userId, 3);
 *   if (!canProceed.allowed) { throw new Error(canProceed.message); }
 */

import { supabase } from './supabaseClient';
import { Plan } from '../types';

// ------------------------------------------------
// Types
// ------------------------------------------------

export interface CreditStatus {
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
  reset_at: string;
  is_over_limit: boolean;
}

export interface ConsumeResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  message?: string;
}

// ------------------------------------------------
// Plan Limits (source of truth — mirrors the migration)
// ------------------------------------------------

export const PLAN_LIMITS: Record<Plan, number> = {
  [Plan.Trial]: 50,
  [Plan.Basic]: 200,
  [Plan.Pro]: 1000,
};

/**
 * Cost (in AI operations) for each generation action.
 * Each "operation" roughly corresponds to one LLM call.
 * A full course generation costs ~8-12 operations per module.
 */
export const OPERATION_COSTS = {
  generate_module_context: 1,   // Lightweight structural blueprint
  generate_workbook: 2,          // Large document, 1 main call
  generate_manual: 2,            // Large document, 1 main call
  generate_slides: 0,            // Cost-zero deterministic generator
  generate_exercises: 1,
  generate_video_script: 2,
  generate_lesson_content: 1,    // Per-lesson granular generation
  backfill_key_takeaways: 1,     // Backfill AI per lesson
} as const;

export type OperationType = keyof typeof OPERATION_COSTS;

// ------------------------------------------------
// Service
// ------------------------------------------------

class CreditService {
  /**
   * Get the current credit status for a user (read-only).
   * Useful for displaying the credit gauge in the UI.
   */
  async getStatus(userId: string): Promise<CreditStatus | null> {
    const { data, error } = await supabase.rpc('get_ai_credit_status', {
      p_user_id: userId,
    });

    if (error) {
      console.error('[creditService] getStatus error:', error);
      return null;
    }

    return data as CreditStatus;
  }

  /**
   * Attempt to consume `amount` AI operations for `userId`.
   * Returns { allowed: true } if within limit, { allowed: false, message } if over.
   *
   * NOTE: We increment BEFORE checking to maintain accurate accounting.
   * If over limit, the increment still happens (tracks actual usage for billing).
   */
  async checkAndConsume(
    userId: string,
    amount: number = 1
  ): Promise<ConsumeResult> {
    const { data, error } = await supabase.rpc('increment_ai_operations', {
      p_user_id: userId,
      p_amount: amount,
    });

    if (error) {
      console.error('[creditService] checkAndConsume error:', error);
      // Fail open — don't block generation if credit system has an error
      return { allowed: true, used: 0, limit: 0, remaining: 0 };
    }

    const result = data as { allowed: boolean; used: number; limit: number; reset_at: string; error?: string };

    if (result.error) {
      console.warn('[creditService] DB returned error:', result.error);
      return { allowed: true, used: 0, limit: 0, remaining: 0 };
    }

    const remaining = Math.max(0, result.limit - result.used);

    if (!result.allowed) {
      return {
        allowed: false,
        used: result.used,
        limit: result.limit,
        remaining,
        message: `Ai atins limita lunară de ${result.limit} operații AI pentru planul tău. Rămase: ${remaining}. Upgradează planul pentru mai mult acces.`,
      };
    }

    return {
      allowed: true,
      used: result.used,
      limit: result.limit,
      remaining,
    };
  }

  /**
   * Convenience: consume operations for a specific action type.
   * Returns false if not allowed (caller should abort generation).
   */
  async consumeForAction(
    userId: string,
    action: OperationType
  ): Promise<ConsumeResult> {
    const cost = OPERATION_COSTS[action];
    if (cost === 0) {
      // Cost-zero action — no DB call needed
      return { allowed: true, used: 0, limit: 0, remaining: 0 };
    }
    return this.checkAndConsume(userId, cost);
  }

  /**
   * Get formatted display string for the credit gauge.
   * Example: "42/200 operații AI utilizate (21%)"
   */
  formatStatus(status: CreditStatus): string {
    return `${status.used}/${status.limit} operații AI utilizate (${status.percentage}%)`;
  }

  /**
   * Returns the color for the credit gauge based on usage percentage.
   */
  getGaugeColor(status: CreditStatus): 'green' | 'yellow' | 'red' {
    if (status.percentage >= 90) return 'red';
    if (status.percentage >= 70) return 'yellow';
    return 'green';
  }

  /**
   * Set the limit for a user based on their plan.
   * Called when the user upgrades/downgrades their plan.
   */
  async syncLimitForPlan(userId: string, plan: Plan): Promise<void> {
    const limit = PLAN_LIMITS[plan];
    const { error } = await supabase
      .from('profiles')
      .update({ ai_operations_limit: limit })
      .eq('id', userId);

    if (error) {
      console.error('[creditService] syncLimitForPlan error:', error);
    } else {
      console.info(`[creditService] Set limit to ${limit} for user ${userId} (plan: ${plan})`);
    }
  }
}

// Singleton export
export const creditService = new CreditService();
