# CourseCopilot — docs

Această mapă e minimalistă intenționat. Refactor-ul din iulie 2026 a arhivat
~70 de documente contradictorii de plan și analiză (`docs/_archive/`); ele
rămân pentru referință istorică, dar nu ghidează munca curentă.

## Documente active

| Fișier | Rol |
|---|---|
| [`AUDIT-CourseCopilot-2026-07-18.md`](./AUDIT-CourseCopilot-2026-07-18.md) | Diagnosticul tehnic + pedagogic, cu referințe fișier:linie. Sursa pentru „ce reparăm". |
| [`CURATENIE-SI-MODERNIZARE-CourseCopilot.md`](./CURATENIE-SI-MODERNIZARE-CourseCopilot.md) | Planul de implementare v2.0 (11 faze, borne, DoD, protocol pentru Claude Code). Sursa pentru „cum reparăm". |
| [`../IMPLEMENTATION_STATUS.md`](../IMPLEMENTATION_STATUS.md) | Sursa unică de adevăr a progresului: borne M0–M10, status per task, secțiunea Descoperiri. |
| [`QUALITY_RUBRIC.md`](./QUALITY_RUBRIC.md) | Rubrica 1–10 care definește măsurabil „materialele dorite". Poarta blocantă M6. |
| [`golden-references/`](./golden-references/) | Materialele owner-ului deja considerate bune. Etalon vizual pentru nota 5 din rubrică. |
| [`baseline/`](./baseline/) | Output-uri brute pe cursul-etalon rulate pe arhitectura ACTUALĂ (comparație „before" pentru F6). |

## Documente arhivate (istoric)

- [`_archive/`](./_archive/) — planuri, analize, retrospective anterioare. NU sunt sursă
  pentru munca curentă. Se consultă doar când auditul le referențiază explicit.

## Ordinea de lectură pentru un colaborator nou

1. `CURATENIE-SI-MODERNIZARE-CourseCopilot.md` (începe cu Cap. 1 — protocolul de lucru)
2. `AUDIT-CourseCopilot-2026-07-18.md` (contextul: ce e stricat și de ce)
3. `IMPLEMENTATION_STATUS.md` (unde suntem)
4. `QUALITY_RUBRIC.md` (unde vrem să ajungem — măsurabil)
