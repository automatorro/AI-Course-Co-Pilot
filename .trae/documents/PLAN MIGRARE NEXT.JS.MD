# Plan Migrare Next.js (Abordare Hibridă)

Acest document urmărește progresul migrării aplicației Course Copilot către o arhitectură hibridă Next.js + React SPA.

## Status Curent: ✅ FINALIZAT
Toate fazele au fost implementate și verificate. Aplicația este gata de deployment.

---

## Faza 1: Pregătire și Siguranță ✅
- [x] Instalare pachete Next.js (`npm install next@latest react-dom@latest react@latest`)
- [x] Configurare `next.config.mjs`
- [x] Actualizare `package.json` cu scripturi `dev:next`, `build:next`
- [x] Configurare Tailwind pentru a include folderul `pages`
- [x] Configurare SSR pentru Context Providers (`I18nContext`, `ThemeContext`)

## Faza 2: Implementarea Landing Page-ului (SEO) ✅
- [x] Creare `pages/_app.tsx` (App Shell Hibrid)
- [x] Adaptare componente `HeaderNext`, `FooterNext`, `PricingTableNext` pentru Next.js (folosind `next/link`, `next/router`)
- [x] Creare `pages/index.tsx`
  - [x] Migrare conținut vizual din `HomePage.tsx`
  - [x] Configurare `Head` pentru meta-taguri SEO
  - [x] Optimizare imagini și link-uri

## Faza 3: Integrarea Aplicației Existente ✅
- [x] Refactorizare `src/App.tsx` pentru a exporta `AppContent`
- [x] Creare `pages/[...all].tsx` (Catch-all route)
  - [x] Configurare `BrowserRouter` în interiorul rutei Next.js
  - [x] Dezactivare SSR pentru rutele aplicației (Client-side only)
  - [x] Integrare `AppContent` pentru a menține funcționalitatea Dashboard/Editor

## Faza 4: Verificare și Corecții ✅
- [x] Rezolvare conflicte CSS globale (`sticky-editor.css`, `highlight.js`)
- [x] Rezolvare erori TypeScript în `PricingTableNext`
- [x] Verificare Build (`npm run build:next`) -> **SUCCES**
  - Route `/` (Static/SEO) -> Generat corect
  - Route `/[...all]` (App) -> Generat corect
- [x] Validare navigare hibridă (Home -> Dashboard)

---

## Instrucțiuni pentru Deployment (Vercel)

Deoarece proiectul este acum configurat hibrid, Vercel va detecta automat Next.js.
Nu sunt necesare configurări speciale, dar asigură-te că variabilele de mediu (Environment Variables) din Vercel sunt setate corect (cele din `.env`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_URL` (pentru compatibilitate inversă, opțional)
- `VITE_SUPABASE_ANON_KEY` (pentru compatibilitate inversă, opțional)

## Rulare Locală
- Pentru a testa versiunea Next.js (SEO + App): `npm run dev:next`
- Pentru a testa versiunea veche Vite (doar App): `npm run dev`
