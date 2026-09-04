// ==========================================
// EDGE FUNCTION: analyze-slide
// VERSION: v3.0-CLAUDE
// ==========================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Anthropic from "npm:@anthropic-ai/sdk";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();

    if (!content) {
      return new Response(JSON.stringify({ error: 'Content is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const client = new Anthropic({ apiKey });
    const model = "claude-sonnet-5";

    const systemPrompt = `
      You are an expert instructional designer and presentation architect.
      Analyze the following slide content (Markdown) and decide on the best visual layout.

      You MUST return a VALID JSON object with this exact structure:
      {
        "layout": "HERO" | "SPLIT_LEFT" | "SPLIT_RIGHT" | "BIG_STAT" | "COMPARISON" | "QUOTATION" | "TRIAD" | "TIMELINE" | "DEFAULT",
        "title": "Refined Title (short)",
        "content": ["Bullet 1", "Bullet 2"],
        "imagePrompt": "A detailed visual description for Unsplash search",
        "accentColor": "#HexColor"
      }

      Layout Logic:
      - HERO: Start of section, big concept.
      - SPLIT_LEFT/RIGHT: Standard content + image.
      - BIG_STAT: If there is a key number/percentage.
      - COMPARISON: If comparing 2 things.
      - QUOTATION: If it's a quote.
      - TRIAD: If there are exactly 3 key points.
      - TIMELINE: If there is a sequence or process.
      - DEFAULT: Fallback.

      Keep content concise. "imagePrompt" should be visual and descriptive, suitable for finding high-quality stock photos (e.g., "office meeting, modern style, bright lighting").
    `;

    const prompt = `${systemPrompt}\n\nSlide Content:\n${content}`;

    let responseText = "";
    let success = false;
    let lastError: any = null;

    try {
      console.log(`[analyze-slide] Calling Claude model: ${model}...`);
      const result = await client.messages.create({
        model,
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }]
      });

      for (const block of result.content) {
        if (block.type === "text") {
          responseText += block.text;
        }
      }
      success = !!responseText;
    } catch (err: any) {
      lastError = err;
      console.warn(`[analyze-slide] Claude call failed (${err.message}).`);
    }

    if (!success) {
      throw new Error(`Slide analysis failed. Last error: ${lastError?.message}`);
    }

    // Clean up markdown code blocks if present
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    let jsonResponse;
    try {
        jsonResponse = JSON.parse(cleanedText);
    } catch (e) {
        // Fallback if JSON parsing fails
        jsonResponse = {
            layout: "DEFAULT",
            title: "Error Parsing AI Response",
            content: [content],
            imagePrompt: "business abstract",
            error: "Failed to parse JSON"
        };
    }

    return new Response(JSON.stringify(jsonResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
