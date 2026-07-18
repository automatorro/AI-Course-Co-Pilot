import { supabase } from './supabaseClient';

const DEMO_SESSION_KEY = 'coursecopilot.demoSessionId';

export interface WaitlistLeadInput {
  email: string;
  role?: string;
  locale?: string;
  source?: string;
}

export const submitWaitlistLead = async (input: WaitlistLeadInput): Promise<{ ok: true } | { ok: false; error: string }> => {
  const email = input.email.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'invalid_email' };
  }
  const { error } = await supabase.from('waitlist_leads').insert({
    email,
    role: input.role?.trim() || null,
    locale: input.locale || null,
    source: input.source || 'landing',
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
};

export const startDemoSession = async (): Promise<string | null> => {
  const cached = getStoredDemoSessionId();
  if (cached) return cached;
  const { data, error } = await supabase
    .from('demo_sessions')
    .insert({})
    .select('id')
    .single();
  if (error || !data?.id) return null;
  try { localStorage.setItem(DEMO_SESSION_KEY, data.id); } catch {}
  return data.id;
};

export const getStoredDemoSessionId = (): string | null => {
  try { return localStorage.getItem(DEMO_SESSION_KEY); } catch { return null; }
};

export const clearStoredDemoSessionId = (): void => {
  try { localStorage.removeItem(DEMO_SESSION_KEY); } catch {}
};

// Best-effort. Fires after signup; never blocks the auth flow.
export const markDemoSessionConverted = async (userId: string): Promise<void> => {
  const sessionId = getStoredDemoSessionId();
  if (!sessionId) return;
  try {
    await supabase
      .from('demo_sessions')
      .update({
        converted_to_signup: true,
        converted_at: new Date().toISOString(),
        converted_user_id: userId,
      })
      .eq('id', sessionId);
  } catch {
    // Non-blocking. If it fails, the row just stays converted=false.
  } finally {
    clearStoredDemoSessionId();
  }
};
