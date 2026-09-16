/*
# Create vault secret lookup function for edge functions

1. New Functions
- `get_secret(name text)` — SECURITY DEFINER function that returns a decrypted
  secret from the vault by name. Only callable by the service_role (not anon).
  Used by the `diagnose` edge function to retrieve the OPENAI_API_KEY at runtime
  without exposing it to the browser.

2. Security
- SECURITY DEFINER: runs with the function owner's privileges (postgres),
  so it can read from vault.decrypted_secrets even though callers cannot.
- Revoked from PUBLIC, granted only to `service_role` and `authenticated` —
  the anon role cannot call this function.
- Search path locked to `vault, public` to prevent search_path injection.
*/

CREATE OR REPLACE FUNCTION public.get_secret(secret_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = vault, public
AS $$
DECLARE
  secret_value text;
BEGIN
  SELECT decrypted_secret INTO secret_value
  FROM vault.decrypted_secrets
  WHERE name = secret_name
  LIMIT 1;

  RETURN secret_value;
END;
$$;

REVOKE ALL ON FUNCTION public.get_secret(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_secret(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_secret(text) TO authenticated;
