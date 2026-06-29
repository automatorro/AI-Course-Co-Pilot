-- ============================================================
-- MIGRATION: AI Operations Credit System
-- Adds per-user AI operation tracking to prevent runaway costs.
-- Plan limits:
--   Trial  →  50 operations
--   Basic  →  200 operations
--   Pro    →  1000 operations  (effectively unlimited for normal use)
-- ============================================================

-- 1. Add credit columns to profiles table (if it exists)
--    Falls back gracefully if profiles table doesn't exist.
DO $$
BEGIN
  -- Add ai_operations_used (counter, resets monthly)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'ai_operations_used'
  ) THEN
    ALTER TABLE profiles ADD COLUMN ai_operations_used INTEGER NOT NULL DEFAULT 0;
    COMMENT ON COLUMN profiles.ai_operations_used IS
      'Number of AI operations consumed this billing period. Resets on monthly reset.';
  END IF;

  -- Add ai_operations_limit (based on plan, overridable by admin)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'ai_operations_limit'
  ) THEN
    ALTER TABLE profiles ADD COLUMN ai_operations_limit INTEGER NOT NULL DEFAULT 50;
    COMMENT ON COLUMN profiles.ai_operations_limit IS
      'Max AI operations allowed per billing period. Defaults: Trial=50, Basic=200, Pro=1000.';
  END IF;

  -- Add plan_reset_at (timestamp of last monthly reset)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'plan_reset_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN plan_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    COMMENT ON COLUMN profiles.plan_reset_at IS
      'When the AI operation counter was last reset (monthly billing cycle anchor).';
  END IF;
END $$;

-- 2. Set default limits based on existing plan column (if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'plan'
  ) THEN
    -- Set limits based on current plan
    UPDATE profiles SET ai_operations_limit = 50   WHERE plan = 'Trial'  AND ai_operations_limit = 50;
    UPDATE profiles SET ai_operations_limit = 200  WHERE plan = 'Basic';
    UPDATE profiles SET ai_operations_limit = 1000 WHERE plan = 'Pro';
  END IF;
END $$;

-- 3. Function: increment_ai_operations(user_id UUID, amount INT)
--    Atomically increments counter and returns { allowed: boolean, used: int, limit: int }
--    Also auto-resets counter if plan_reset_at > 30 days ago.
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
  v_allowed BOOLEAN;
BEGIN
  -- Auto-reset if more than 30 days since last reset
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
  RETURNING ai_operations_used, ai_operations_limit, plan_reset_at
  INTO v_used, v_limit, v_reset;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'allowed', false,
      'used', 0,
      'limit', 0,
      'error', 'User profile not found'
    );
  END IF;

  -- Check if over limit (we already incremented — if over, we still track but flag it)
  v_allowed := v_used <= v_limit;

  RETURN json_build_object(
    'allowed', v_allowed,
    'used', v_used,
    'limit', v_limit,
    'reset_at', v_reset
  );
END;
$$;

-- 4. Function: get_ai_credit_status(user_id UUID)
--    Returns current credit status without modifying counter.
CREATE OR REPLACE FUNCTION get_ai_credit_status(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_used    INTEGER;
  v_limit   INTEGER;
  v_reset   TIMESTAMPTZ;
BEGIN
  SELECT ai_operations_used, ai_operations_limit, plan_reset_at
  INTO v_used, v_limit, v_reset
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
    'is_over_limit', v_used > v_limit
  );
END;
$$;

-- 5. RLS: Users can only see their own credit status
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy already exists from auth setup, but ensure read access to new columns
DO $$
BEGIN
  -- The existing RLS policies already cover SELECT/UPDATE on profiles.
  -- No additional policies needed for the new columns.
  NULL;
END $$;

-- 6. Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_profiles_plan_reset_at
  ON profiles (plan_reset_at)
  WHERE ai_operations_used > 0;
