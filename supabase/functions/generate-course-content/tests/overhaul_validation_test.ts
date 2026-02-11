import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { repairAndParseJson } from "../utils/json-repair.ts";
import { getStyleBlock, AudienceLevel } from "../prompts/style-blocks.ts";

Deno.test("Silent Operator: Extracts JSON from <content_block>", () => {
  const llmOutput = `
  <meta>
  Thinking process...
  </meta>
  <content_block>
  {
    "title": "Test Module"
  }
  </content_block>
  `;
  
  const result = repairAndParseJson<{title: string}>(llmOutput);
  assertEquals(result.title, "Test Module");
});

Deno.test("Silent Operator: Handles Garbage Text outside XML", () => {
  const llmOutput = `
  Sure, here is your JSON!
  <content_block>
  { "success": true }
  </content_block>
  Hope this helps!
  `;
  
  const result = repairAndParseJson<{success: boolean}>(llmOutput);
  assertEquals(result.success, true);
});

Deno.test("Style Blocks: Detects Blue Collar Audience", () => {
  const style = getStyleBlock("Blue collar workers in a factory");
  assertEquals(style.includes("LEVEL 1 (OPERATIONAL"), true);
});

Deno.test("Style Blocks: Detects Strategic Audience", () => {
  const style = getStyleBlock("Senior Executives and CEOs");
  assertEquals(style.includes("LEVEL 3 (STRATEGIC"), true);
});
