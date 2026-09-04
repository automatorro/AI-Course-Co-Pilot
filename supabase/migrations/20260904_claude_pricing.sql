-- 20260904_claude_pricing.sql
-- Migrare provider LLM: Google Gemini -> Anthropic Claude (Claude Sonnet 5).
-- Adaugă un branch de preț pentru modelele Claude în view-ul usage_logs_with_cost.
-- NU atinge branch-urile Gemini/Moonshot existente — datele istorice din user_usage
-- (generate cu providerii vechi) trebuie să rămână corect calculate retroactiv.

create or replace view public.usage_logs_with_cost as
select
  id,
  user_id,
  model,
  input_tokens,
  output_tokens,
  total_tokens,
  action,
  created_at,
  case
    -- Gemini Flash & Flash Lite models (~$0.075 input / $0.30 output per 1M) — istoric, provider înlocuit
    when model like 'gemini-1.5-flash%' or
         model like 'gemini-2.0-flash%' or
         model like 'gemini-2.5-flash%' or
         model like 'gemini-3.5-flash%' or
         model like 'gemini-2.0-flash-lite%' or
         model like 'gemini-2.5-flash-lite%' or
         model like 'gemini-3.1-flash-lite%' then
      (input_tokens * 0.000000075) + (output_tokens * 0.00000030)

    -- Gemini Pro models (~$3.50 input / $10.50 output per 1M) — istoric, provider înlocuit
    when model like 'gemini-1.5-pro%' or
         model like 'gemini-2.0-pro%' or
         model like 'gemini-2.5-pro%' or
         model like 'gemini-3.1-pro%' or
         model like 'gemini-3.5-pro%' then
      (input_tokens * 0.00000350) + (output_tokens * 0.00001050)

    -- Moonshot / Kimi (~$1.70 input / $1.70 output per 1M - aprox 12 RMB) — istoric, provider eliminat
    when model like 'moonshot%' or model like 'kimi%' then
      (input_tokens * 0.00000170) + (output_tokens * 0.00000170)

    -- Claude Sonnet 5 ($2 input / $10 output per 1M) — providerul curent al aplicației
    when model like 'claude-sonnet-5%' then
      (input_tokens * 0.00000200) + (output_tokens * 0.00001000)

    -- Alte modele Claude (Opus/Haiku etc.), dacă vor fi folosite vreodată —
    -- preț Sonnet 5 ca aproximare rezonabilă până se adaugă un branch dedicat
    when model like 'claude-%' then
      (input_tokens * 0.00000200) + (output_tokens * 0.00001000)

    -- Default fallback (model necunoscut) — preț Flash ca plasă de siguranță
    else
      (input_tokens * 0.00000010) + (output_tokens * 0.00000040)
  end as cost_usd
from public.user_usage;
