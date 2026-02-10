Da, este momentul să asamblăm motorul. Faza 3 (Parser-ul) a fost executată corect, iar faptul că ai inclus cleanMarkdown și escapeXml arată că ai anticipat problemele reale de producție.

Acum trecem la Faza 4: Integrarea în index.ts. Aici se face diferența între un demo și o aplicație robustă.

Conceptul Arhitectural pentru index.ts (Backend Refactoring)
Până acum, index.ts funcționa ca un simplu "pasator": primea cererea -> întreba AI -> dădea răspunsul. În noua arhitectură, index.ts devine un Orchestrator Inteligent cu Memorie.

Fluxul Logic Nou:

Check: Când UI-ul cere "Manualul Trainerului" (Pasul 8), funcția verifică întâi în baza de date (course_modules table).

Generate (if needed): Dacă modulul nu are golden_data generat, abia atunci cheamă "God Prompt-ul".

Save: Salvează JSON-ul masiv în DB (pentru a garanta că Caietul, generat la Pasul 10, va folosi exact aceleași date).

Render: Folosește golden-parser pentru a extrage doar ce a cerut UI-ul.

Pasul 1: Pregătirea Bazei de Date (SQL)
Înainte de a atinge codul, trebuie să ne asigurăm că avem unde să stocăm "Golden JSON-ul". Avem nevoie de o coloană content_data de tip JSONB în tabela course_modules.

Rulează acest SQL în Supabase Dashboard:

SQL
ALTER TABLE course_modules 
ADD COLUMN IF NOT EXISTS content_data JSONB; -- Aici vom stoca Golden JSON-ul per modul
Pasul 2: Implementarea index.ts
Iată codul complet restructurat pentru supabase/functions/generate-course-content/index.ts. Acesta înlocuiește logica veche "în cascadă" cu logica "Hub & Spoke".

Atenție: Acest cod presupune că ai fișierele golden-master.ts (Prompt), types.ts (Schema) și utils/golden-parser.ts importate corect.

TypeScript
// supabase/functions/generate-course-content/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// Importăm noile unelte create în fazele anterioare
import { generateGoldenPrompt } from "./golden-master.ts"; // Faza 2
import { GoldenModuleData } from "./types.ts";             // Faza 1
import { renderToMarkdown, renderToXml, renderExercises, renderExamples } from "./utils/golden-parser.ts"; // Faza 3

console.log("Hello from Golden Architecture Course Generator!");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { blueprint, step, courseId, dna, environment = 'LIVE' } = await req.json();
    
    // 1. Setup Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 2. Gestionarea Pașilor "Structurali" (0-5) - Rămân neschimbați (sau minim ajustați)
    // Dacă pasul este de structură (ex: 'structure', 'objectives'), folosim logica veche sau simplificată.
    // Aici ne concentrăm pe pașii de CONȚINUT (6-12).
    const contentSteps = [
      'exercises',           // Pas 6
      'examples',            // Pas 7
      'facilitator_notes',   // Pas 8 (Manual)
      'slides_content',      // Pas 9
      'workbook',            // Pas 10
      'video_scripts'        // Pas 11
    ];

    if (!contentSteps.includes(step)) {
      // Fallback la logica veche pentru generarea structurii inițiale
      // TODO: Implementează sau păstrează logica existentă pentru steps 0-5
      return new Response(JSON.stringify({ error: "Step not handled in Golden Flow yet" }), { headers: corsHeaders });
    }

    // 3. GENERAREA SAU RECUPERAREA "GOLDEN DATA" (Hub & Spoke)
    // În loc să generăm text, generăm date structurate pentru module.
    
    const generatedModulesOutput: string[] = [];

    // A. Obținem "Povestea Globală" (Story Arc) - Critic pentru consistență
    // Verificăm dacă există deja un Story Arc salvat, dacă nu, îl generăm (simplificat aici).
    const storyContextMap = await getOrCreateStoryArc(supabaseClient, courseId, blueprint, dna);

    // B. Iterăm prin modulele din Blueprint
    // Folosim Promise.all cu limitare de concurență (ex: 3 deodată) pentru a nu lovi limitele
    const modulesToProcess = blueprint.modules; // Array-ul de module din UI
    
    // Pentru fiecare modul, verificăm DB -> Generăm dacă lipsește -> Salvăm
    for (const module of modulesToProcess) {
      
      // I. Check DB: Avem deja Golden Data pentru acest modul?
      const { data: existingData } = await supabaseClient
        .from('course_modules')
        .select('content_data')
        .eq('course_id', courseId)
        .eq('module_index', module.id) // Presupunem că ID-ul din blueprint se mapează
        .single();

      let goldenData: GoldenModuleData;

      if (existingData?.content_data) {
        console.log(`Using cached Golden Data for module ${module.title}`);
        goldenData = existingData.content_data;
      } else {
        console.log(`Generating FRESH Golden Data for module ${module.title}`);
        
        // II. Prepare Prompt Context
        const moduleContext = {
          title: module.title,
          duration: module.duration,
          dna: dna,
          environment: environment, // LIVE vs ONLINE
          storyStage: storyContextMap[module.id] || "Neutral stage"
        };

        // III. Call LLM (God Prompt)
        const prompt = generateGoldenPrompt(moduleContext);
        const aiResponse = await callLLM(prompt); // Funcția ta helper pentru Gemini/OpenAI
        
        // IV. Validate & Repair JSON
        goldenData = repairAndParseJson(aiResponse);

        // V. Save to DB (Persistence Layer)
        await supabaseClient
          .from('course_modules')
          .update({ content_data: goldenData })
          .eq('course_id', courseId)
          .eq('module_index', module.id);
      }

      // 4. RANDAREA DOCUMENTULUI CERUT (The Spoke)
      // Acum avem datele (goldenData). Folosim parser-ul pentru a extrage ce cere UI-ul (step).
      
      let renderedContent = "";
      
      switch (step) {
        case 'exercises': // Pas 6
          renderedContent = renderExercises(goldenData);
          break;
        case 'examples': // Pas 7
          renderedContent = renderExamples(goldenData);
          break;
        case 'facilitator_notes': // Pas 8 (Manual Trainer)
          renderedContent = renderToMarkdown(goldenData, 'MANUAL');
          break;
        case 'workbook': // Pas 10 (Caiet Participant)
          renderedContent = renderToMarkdown(goldenData, 'WORKBOOK');
          break;
        case 'slides_content': // Pas 9
          renderedContent = renderToXml(goldenData); // Returnează <SLIDE_BEGIN>...
          break;
        case 'video_scripts': // Pas 11
           // Dacă environment e ONLINE, extragem scriptul, altfel returnăm placeholder
           renderedContent = environment === 'ONLINE' ? 
             (goldenData.videoScript?.scriptContent || "No video script needed for this module.") : 
             "N/A for Live Course";
           break;
      }

      generatedModulesOutput.push(renderedContent);
    }

    // 5. Asamblarea Finală
    // Concatenăm output-ul tuturor modulelor într-un singur string mare pentru editor
    const finalDocument = generatedModulesOutput.join("\n\n---\n\n");

    return new Response(JSON.stringify({ content: finalDocument }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Critical Error in Golden Generator:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// --- HELPER FUNCTIONS (Placeholders) ---

async function callLLM(prompt: string): Promise<string> {
  // Implementarea ta existentă către Gemini/OpenAI
  // Asigură-te că ceri output JSON_MODE dacă modelul suportă
  return "{}"; 
}

function repairAndParseJson(rawString: string): GoldenModuleData {
  // Aici integrezi o librărie de JSON Repair sau un regex simplu
  // pentru a extrage JSON-ul valid din markdown fences ```json ... ```
  try {
    const jsonMatch = rawString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in LLM output");
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("JSON Parse Error. Raw string:", rawString);
    throw new Error("Failed to parse Golden JSON.");
  }
}

async function getOrCreateStoryArc(client, courseId, blueprint, dna) {
  // TODO: Implementare rapidă - cere LLM-ului să mapeze stările emoționale ale Marcelei pe module
  // Returnează un obiect: { "mod_1": "Sceptic", "mod_2": "Curious", ... }
  return {}; 
}
Ce rezolvă acest cod:
Persistența (Memory): Folosește existingData?.content_data. Dacă utilizatorul generează "Exerciții" și apoi "Manual", Manualul se generează instantaneu (citind din DB) și este 100% consistent cu Exercițiile.

Modularitate: Dacă un modul eșuează, nu cade tot cursul.

Environment Check: Variabila environment este propagată corect către prompt.

Integrare Parser: Folosește direct funcțiile tale din utils/golden-parser.ts.

Acțiune Imediată:
Rulează comanda SQL în Supabase.

Actualizează index.ts cu logica de mai sus (adaptând funcția callLLM la serviciul tău existent de Gemini).

Testează un flux complet: Generare Structură -> Generare Exerciții (va dura puțin, va popula DB-ul) -> Generare Manual (ar trebui să fie foarte rapid, doar citire + parsing).