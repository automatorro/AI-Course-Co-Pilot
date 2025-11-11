# AI Course Co‑Pilot – Release v0.2.0

Data: 2025‑11‑11

## Overview
Acest release introduce un redesign vibrant și dinamic al interfeței, cu accentul cromatic mutat de la aur spre verde‑lime, micro‑interacțiuni rafinate, și coerență premium în toate componentele. Tipografiile rămân neschimbate pentru a menține identitatea vizuală.

## Highlights
- Paletă „accent” actualizată la verde‑lime (`#32CD32`) cu tonuri pentru hover/active.
- Texturi premium și hero vibrant cu blending între `accent` lime și `secondary` teal.
- CTA‑uri și carduri premium aliniate vizual pe Home, Dashboard, Auth, Pricing.
- Animații subtile cu respect pentru `prefers‑reduced‑motion`.
- Config Tailwind convertit la CJS și safelist adăugat pentru utilități.

## Changes (tehnic și UI)
- `tailwind.config.cjs`
  - Convertit la CommonJS (`module.exports`).
  - Paletă `accent` înlocuită cu lime (500 `#32CD32`, 600 `#2eb82e`, 700 `#238f23`).
  - Adăugat paletă `secondary` (teal) pentru accente complementare.
  - Adăugat `safelist` pentru utilități `ink`, `accent`, `secondary` (text/bg/border).

- `src/index.css`
  - Variabile CSS pentru lime: `--accent-500/600/700` și valori RGB.
  - Texturi premium (`--premium-bg-light/dark`) actualizate la lime.
  - `btn-premium`, `btn-premium--secondary/ghost`, `input-premium`, `card-premium`, `separator-premium`, `interactive-soft` consolidat.
  - Fundal hero: `.bg-hero-vibrant` cu lime + teal (light/dark).
  - Animații: `animate-fade-in-up`, `animate-soft-float`, utilitare de întârziere, fallback pentru `prefers‑reduced‑motion`.
  - Shimmer ajustat spre ton verde pal.

- `src/App.tsx`
  - `premium-texture` pe wrapperul aplicației.
  - Fundal/text cu paleta `ink` pentru lizibilitate sporită.

- `src/pages/HomePage.tsx`
  - Hero vibrant cu „blobs” animate și CTA `btn-premium`.
  - Carduri secțiuni convertite la `card-premium` și text `ink`.
  - Linie centrală și titluri adaptate pentru contrast în light/dark.

- `src/pages/DashboardPage.tsx`
  - CTA „Create New Course” migrat la `btn-premium`.
  - Cardurile cursurilor adoptă `card-premium`.

- `src/pages/AuthPage.tsx`
  - Buton submit migrat la `btn-premium` (hover/active accesibile).

- `src/components/PricingTable.tsx`
  - CTA principal migrat la `btn-premium` pentru consistență.

- `src/components/Header.tsx`, `Footer.tsx`, `NewCourseModal.tsx`, `pages/CourseWorkspacePage.tsx`
  - Integrarea paletei `ink`, `accent` lime și stilurilor premium.

## Accesibilitate (WCAG)
- CTA‑uri pe `accent-600/700` cu `text-white` păstrează contrast AA.
- Texte folosesc `ink` (`700/900` pe light, `200/100` pe dark) pentru lizibilitate pe carduri și fundaluri.
- Focus ring coerent (`primary-400/600`), vizibil atât în light cât și în dark.
- Animațiile sunt scurte și dezactivate când utilizatorul preferă mișcare redusă.

## Performanță
- Texturi și effecte CSS‑only (fără imagini externe), impact minim pe încărcare.
- Utilizări discrete de blur și shadow; niciun script suplimentar pentru animații.

## Breaking Changes
- `tailwind.config.js` a fost înlocuit cu `tailwind.config.cjs`. Dacă tooling‑ul depinde explicit de numele fișierului JS, actualizați referințele.

## Upgrade Notes
1. Asigurați‑vă că porniți dev serverul cu Vite 5+ (`npm run dev`).
2. Dacă observați utilități lipsă, rulați un clean build; safelistul este deja configurat.

## Known Issues
- Nicio problemă cunoscută în acest moment. Raportați vizual eventuale contraste insuficiente în contexte atipice.

## QA & Testare
- Verificată manual în light/dark pe viewport‑uri mici și mari.
- Tipografii și spațiere păstrate conform identității vizuale.

## Commit & Tag
- Commit: `9182332` pe `main` – „UI vibrant: accent lime…”.
- Propus: `v0.2.0` pentru acest release.

## Next
- Opțional: integrare ilustrații SVG optimizate și badge „Recomandat” în Pricing.
- Extinderea stilurilor premium la `BillingPage` și `ProfilePage` dacă este dorit.