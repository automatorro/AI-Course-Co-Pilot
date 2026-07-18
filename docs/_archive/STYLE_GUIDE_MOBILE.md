# Ghid de Stil Mobil – AI Course Co‑Pilot

Acest ghid descrie regulile și bunele practici pentru o experiență mobilă clară și utilizabilă în spațiul de lucru al cursurilor.

## Tipografie
- Body: `text-sm` pe mobil, `text-base` pe ecrane ≥ sm.
- Titluri secțiuni: `text-lg` pe mobil, `text-2xl` pe ecrane ≥ sm.
- Linie text: folosește `leading-relaxed` pentru lizibilitate în editor.
- Markdown: `prose-sm sm:prose` pentru scalare în previzualizare.

## Spacing
- Header: `p-4 sm:p-6`.
- Editor textarea: `p-4 sm:p-5`.
- Folosește `gap-2`/`gap-3` pentru grupuri de butoane pe mobil.

## Layout
- Container principal: `flex flex-col lg:flex-row` și `h-[calc(100vh-4rem)]`.
- Evită scroll orizontal la nivel de pagină: `overflow-x-hidden` pe container.
- Sidebar desktop: vizibil doar pe ≥ lg (`hidden lg:block`).
- Sidebar mobil: overlay `fixed inset-0`, panou `left-0 h-full w-5/6 max-w-xs`.

## Media și conținut bogat
- Imagini: `max-w-full h-auto` în markdown; evită lățimi fixe.
- Tabele: înveliți în container cu `overflow-x-auto` și `w-full`.
- Blocuri de cod: `overflow-x-auto` pentru linii lungi.
- Textarea editorului: `break-words` pentru prevenirea overflow-ului.

## Interacțiuni
- Buton toggle pași în header (mobil): afișat doar pe `lg:hidden`.
- Închiderea overlay-ului pe mobil: tap pe backdrop sau buton `X`.
- Navigarea între pași din overlay: la selectare, închide overlay și setează pasul activ.
- Grupuri de acțiuni (Generare, Rafinează, Descarcă): `flex-wrap` pentru a evita suprapunerile.

## Accesibilitate
- Contrast: menține culori `text-gray-700`/`dark:text-gray-200` pentru text secundar.
- Hit targets: butoane minim `p-2` pe mobil.
- Focus styles: păstrează stiluri implicite ale browserului, nu le suprascrie.

## Pattern-uri de clasă Tailwind
- Container pagină: `flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-x-hidden`.
- Header: `p-4 sm:p-6 text-lg sm:text-2xl`.
- Sidebar desktop: `hidden lg:block w-1/4 max-w-sm p-6`.
- Overlay mobil: `fixed inset-0 z-50` + backdrop `bg-black/40` + panou `bg-white dark:bg-gray-800`.
- Editor: `text-sm sm:text-base leading-relaxed break-words`.
- Markdown preview: `prose-sm sm:prose p-4 sm:p-6`.
- Media: imagini `max-w-full h-auto`, tabele/cod `overflow-x-auto`.

## Testare pe mobil
- Verifică viewport-uri: 320px, 375px, 414px, 768px.
- Confirmă că: nu există scroll orizontal, textul este lizibil, butoanele sunt accesibile, overlay-ul se deschide/închide corect.

## Extensii posibile
- Lazy-loading imagini în markdown (ex. `loading="lazy"`).
- Bară de acțiuni sticky pe mobil pentru butoanele principale.
- Reducerea densității icon-urilor în toolbar pe ecrane < 360px.

Acest ghid trebuie menținut sincron cu modificările de UI. La adăugarea de componente noi, respectă principiile de mai sus pentru consistență pe mobil.