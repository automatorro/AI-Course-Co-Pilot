-- 20260905_admin_unlimited_ai_credits.sql
-- Cerință owner: administratorul (profiles.role = 'admin') are operații AI nelimitate,
-- plafonate DOAR de facturarea reală Anthropic — nu de gate-ul intern al aplicației.
-- Restul utilizatorilor (Trial/Basic/Pro) rămân neatinși: comportamentul lor e identic
-- cu înainte (v_role = 'admin' e fals pentru ei, deci condiția se reduce exact la
-- verificarea existentă v_used <= v_limit).

CREATE OR REPLACE FUNCTION increment_ai_operations(
  p_user_id UUID,
  p_amount INTEGER DEFAULT 1
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_used    INTEGER;
  v_limit   INTEGER;
  v_reset   TIMESTAMPTZ;
  v_role    TEXT;
  v_allowed BOOLEAN;
BEGIN
  -- Auto-reset if more than 30 days since last reset (comportament neschimbat)
  UPDATE profiles
  SET
    ai_operations_used = CASE
      WHEN plan_reset_at < NOW() - INTERVAL '30 days' THEN p_amount
      ELSE ai_operations_used + p_amount
    END,
    plan_reset_at = CASE
      WHEN plan_reset_at < NOW() - INTERVAL '30 days' THEN NOW()
      ELSE plan_reset_at
    END
  WHERE id = p_user_id
  RETURNING ai_operations_used, ai_operations_limit, plan_reset_at, role::text
  INTO v_used, v_limit, v_reset, v_role;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'allowed', false,
      'used', 0,
      'limit', 0,
      'error', 'User profile not found'
    );
  END IF;

  -- Adminii sunt mereu "allowed" (contorul tot se incrementează mai sus, pentru
  -- vizibilitate proprie asupra consumului) — restul utilizatorilor, neschimbat.
  v_allowed := (v_role = 'admin') OR (v_used <= v_limit);

  RETURN json_build_object(
    'allowed', v_allowed,
    'used', v_used,
    'limit', v_limit,
    'reset_at', v_reset
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_ai_credit_status(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_used    INTEGER;
  v_limit   INTEGER;
  v_reset   TIMESTAMPTZ;
  v_role    TEXT;
BEGIN
  SELECT ai_operations_used, ai_operations_limit, plan_reset_at, role::text
  INTO v_used, v_limit, v_reset, v_role
  FROM profiles
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'User profile not found');
  END IF;

  RETURN json_build_object(
    'used', v_used,
    'limit', v_limit,
    'remaining', GREATEST(0, v_limit - v_used),
    'percentage', ROUND((v_used::NUMERIC / NULLIF(v_limit, 0)) * 100),
    'reset_at', v_reset,
    'is_over_limit', CASE WHEN v_role = 'admin' THEN false ELSE v_used > v_limit END
  );
END;
$$;
