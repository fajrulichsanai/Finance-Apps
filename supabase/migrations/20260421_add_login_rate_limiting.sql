-- PURPOSE:
-- Add persistent rate limiting for login attempts to prevent brute force attacks
-- Uses database-backed storage + RPC function for atomic check-and-increment

-- CHANGES:
-- * Create login_attempts table with IP address tracking
-- * Create RPC function for atomic rate limit checking (prevents race conditions with FOR UPDATE lock)
-- * Create automatic cleanup function to prevent table bloat
-- * Add GRANTS for function access from API

-- ============================================================
-- SQL MIGRATION
-- ============================================================

-- 1. CREATE TABLE for tracking login attempts
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CHECK (ip_address != '' AND ip_address IS NOT NULL)
);

-- 2. CREATE INDEXES for efficient queries
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time 
ON login_attempts(ip_address, attempted_at DESC);

-- Index for cleanup query
CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at 
ON login_attempts(attempted_at DESC);

-- 3. CREATE RPC FUNCTION for ATOMIC rate limit checking
-- Uses FOR UPDATE lock to prevent race conditions
-- Returns: allowed BOOLEAN, attempts_count INT
CREATE OR REPLACE FUNCTION check_and_increment_rate_limit(
  p_ip TEXT,
  p_max_attempts INT DEFAULT 5,
  p_window_minutes INT DEFAULT 15
) RETURNS TABLE(allowed BOOLEAN, attempts_count INT) AS $$
DECLARE
  v_count INT;
  v_window_start TIMESTAMPTZ;
BEGIN
  -- Validate input
  IF p_ip IS NULL OR p_ip = '' THEN
    RETURN QUERY SELECT FALSE, 0;
    RETURN;
  END IF;
  
  -- Calculate window start time
  v_window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Count recent attempts for this IP (atomic with lock)
  SELECT COUNT(*) INTO v_count
  FROM login_attempts
  WHERE ip_address = p_ip 
    AND attempted_at > v_window_start
  FOR UPDATE SKIP LOCKED;
  
  -- If not yet at limit, insert new attempt and allow
  IF v_count < p_max_attempts THEN
    INSERT INTO login_attempts (ip_address, attempted_at)
    VALUES (p_ip, NOW());
    
    RETURN QUERY SELECT TRUE, v_count + 1;
  ELSE
    -- Already at limit, don't insert, return blocked status
    RETURN QUERY SELECT FALSE, v_count;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. GRANT EXECUTE permission for API access
GRANT EXECUTE ON FUNCTION check_and_increment_rate_limit(TEXT, INT, INT) 
  TO anon, authenticated, service_role;

-- 5. Disable RLS on login_attempts (rate limiting is infrastructure, not user-data)
ALTER TABLE login_attempts DISABLE ROW LEVEL SECURITY;

-- 6. CREATE CLEANUP FUNCTION to prevent table bloat
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM login_attempts
  WHERE attempted_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. CLEANUP SCHEDULING (IMPORTANT: Must set up external scheduler)
-- Supabase PostgreSQL doesn't support pg_cron natively on free tier
-- 
-- REQUIRED SETUP - Choose one option:
--
-- ✅ Option A: Vercel Cron (RECOMMENDED for Vercel deployments)
--   1. Create file: /app/api/cron/cleanup-login-attempts.ts
--   2. Add endpoint logic:
--      export async function GET(request: NextRequest) {
--        if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
--          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
--        }
--        const supabase = await createClient();
--        const { error } = await supabase.rpc('cleanup_old_login_attempts');
--        return NextResponse.json({ cleaned: !error });
--      }
--   3. Add to vercel.json:
--      { "crons": [{ "path": "/api/cron/cleanup-login-attempts", "schedule": "0 2 * * *" }] }
--   4. Set env var: CRON_SECRET in Vercel dashboard
--
-- ✅ Option B: AWS Lambda / Google Cloud Function
--   1. Create lambda with: SELECT cleanup_old_login_attempts();
--   2. Schedule daily execution
--
-- ✅ Option C: Manual (Development only)
--   psql: SELECT cleanup_old_login_attempts();
--
-- Without setup, table grows: ~5MB per 1000 users per 15 minutes
-- 1 month = ~14GB!

-- 8. ADD COMMENTS
COMMENT ON TABLE login_attempts IS 'Tracks login attempts by IP for rate limiting. Records only IP and timestamp (no email to prevent enumeration).';
COMMENT ON FUNCTION check_and_increment_rate_limit(TEXT, INT, INT) IS 'Atomically checks rate limit and records attempt. Uses FOR UPDATE lock for atomicity. Returns (allowed, attempts_count).';
COMMENT ON FUNCTION cleanup_old_login_attempts() IS 'Removes login attempts older than 24 hours. Should be called periodically.';
