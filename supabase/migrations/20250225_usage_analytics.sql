-- 20250225_usage_analytics.sql

-- 1. View pentru calculul costurilor per request (în USD)
-- Prețurile sunt estimate per 1 milion de tokeni.
-- Poți ajusta valorile din CASE statements când se modifică prețurile API.

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
    -- Gemini 1.5 Flash & 2.0 Flash (~$0.075 input / $0.30 output per 1M)
    when model like 'gemini-1.5-flash%' or model like 'gemini-2.0-flash%' then
      (input_tokens * 0.000000075) + (output_tokens * 0.00000030)
    
    -- Gemini 1.5 Pro (~$3.50 input / $10.50 output per 1M)
    when model like 'gemini-1.5-pro%' then
      (input_tokens * 0.00000350) + (output_tokens * 0.00001050)
      
    -- Moonshot / Kimi (~$1.70 input / $1.70 output per 1M - aprox 12 RMB)
    when model like 'moonshot%' or model like 'kimi%' then
      (input_tokens * 0.00000170) + (output_tokens * 0.00000170)
      
    -- Default fallback (use Flash price as safety net)
    else
      (input_tokens * 0.00000010) + (output_tokens * 0.00000040)
  end as cost_usd
from public.user_usage;

-- 2. Raport Săptămânal (Weekly Report)
create or replace view public.weekly_cost_report as
select
  user_id,
  date_trunc('week', created_at) as saptamana,
  count(*) as numar_cereri,
  sum(total_tokens) as total_tokeni,
  sum(cost_usd) as cost_total_usd
from public.usage_logs_with_cost
group by user_id, date_trunc('week', created_at)
order by saptamana desc;

-- 3. Raport Lunar (Monthly Report)
create or replace view public.monthly_cost_report as
select
  user_id,
  date_trunc('month', created_at) as luna,
  count(*) as numar_cereri,
  sum(total_tokens) as total_tokeni,
  sum(cost_usd) as cost_total_usd
from public.usage_logs_with_cost
group by user_id, date_trunc('month', created_at)
order by luna desc;
