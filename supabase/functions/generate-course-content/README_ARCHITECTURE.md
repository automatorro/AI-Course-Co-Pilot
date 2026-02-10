# Arhitectura Modulară AI Service (v3.0)

Acest document descrie noua arhitectură implementată pentru funcția `generate-course-content`.

## 1. Privire de Ansamblu

Noua arhitectură transformă funcția dintr-un script monolitic într-un sistem modular, orientat pe obiecte, cu responsabilități clar separate. Scopul este de a crește robustețea, testabilitatea și ușurința de întreținere.

### Componente Principale

1.  **Config**: Gestionarea centralizată a variabilelor de mediu și a secretelor (API Keys).
2.  **Logger**: Sistem unificat de logging cu prefixe de versiune și nivele (INFO, WARN, ERROR).
3.  **IAIProvider (Interface)**: Contract standard pentru toți furnizorii de AI.
4.  **Providers**: Implementări specifice pentru Gemini (`GeminiProvider`) și Moonshot (`MoonshotProvider`).
5.  **AIOrchestrator**: Gestionează strategia de apelare, fallback-ul între provideri și agregarea erorilor.
6.  **Resilient Fetch**: Wrapper peste `fetch` care adaugă automat retry (exponential backoff) și rate limiting handling.

## 2. Detalii Tehnice

### 2.1 Configurare (`Config`)
-   Citește variabilele din `Deno.env`.
-   **Sanitizare**: Elimină automat spațiile și ghilimelele care pot apărea la copierea cheilor.
-   **Securitate**: Cheile nu sunt logate niciodată în clar.

### 2.2 AI Service Layer

#### `fetchWithRetry`
Un utilitar puternic care "îmbracă" orice apel de rețea:
-   **Retry Logic**: 3 încercări implicite.
-   **Exponential Backoff**: Așteaptă 1s, 2s, 4s între încercări.
-   **Rate Limiting**: Respectă header-ul `Retry-After` de la API (429).
-   **Erori 5xx**: Reîncearcă automat erorile de server temporare.

#### `GeminiProvider`
-   Folosește modelul `gemini-1.5-pro` ca principal.
-   Fallback automat pe `gemini-pro` (legacy) în caz de erori specifice (404 Model Not Found, 503 Overloaded).
-   Validare strictă a răspunsului JSON.

#### `MoonshotProvider`
-   Implementare standard OpenAI-compatible.
-   Folosește modelul `moonshot-v1-8k`.

#### `AIOrchestrator`
-   Iterează prin lista de provideri configurați.
-   Dacă Gemini cade (după retries interne), trece automat la Moonshot.
-   Dacă toți cad, aruncă o eroare agregată detaliată `[v3.0-MODULAR] AI_ERROR`.

## 3. Testare

### Endpoint `test_connection`
Funcția expune o acțiune specială pentru verificarea sănătății sistemului:
```json
{ "action": "test_connection" }
```
Aceasta instanțiază providerii și încearcă un apel "Hi" către fiecare, returnând statusul individual.

## 4. Ghid de Extindere

Pentru a adăuga un nou provider (ex. OpenAI):
1.  Adăugați cheia în `Config`.
2.  Creați clasa `OpenAIProvider` care implementează `IAIProvider`.
3.  Adăugați instanța în lista din constructorul `AIOrchestrator`.

---
*Versiune: v3.0-MODULAR*
*Data: 2026-01-30*
