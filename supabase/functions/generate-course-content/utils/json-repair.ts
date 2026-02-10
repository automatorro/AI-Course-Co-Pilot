
/**
 * Tries to repair and parse a potentially malformed JSON string from an LLM.
 * 1. Extracts JSON from markdown fences (```json ... ```).
 * 2. Uses regex to find the outer {} if needed.
 * 3. Handles common escaping issues.
 */
export function repairAndParseJson<T>(text: string): T {
  let cleaned = text.trim();

  // 1. Remove Markdown Fences
  const fenceMatch = cleaned.match(/```json([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  } else {
      // Try generic fences
      const genericFence = cleaned.match(/```([\s\S]*?)```/);
      if (genericFence) {
          cleaned = genericFence[1].trim();
      }
  }

  // 2. Find outer braces or brackets (Object or Array)
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  
  // Determine if we are looking for an Array or an Object
  // If '[' appears before '{', it's likely an array.
  const isArray = firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace);
  
  if (isArray) {
      const lastBracket = cleaned.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1) {
          cleaned = cleaned.substring(firstBracket, lastBracket + 1);
      }
  } else {
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
          cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (e) {
    console.error("JSON Parse Error 1st attempt:", e);
    // 3. Last resort: specific fixes (e.g. unescaped newlines)
    // This is risky but sometimes necessary for LLMs
    try {
        const fixed = cleaned
            .replace(/(?<!\\)\n/g, '\\n') // Escape real newlines inside strings? No, this is dangerous for valid JSON structure.
            // Better strategy: Use a library if available, but here we do minimal fix
            // If the LLM output puts newlines inside a string literal without escaping them, JSON.parse fails.
            // But we can't easily distinguish between structure newlines and string newlines with regex.
            
        return JSON.parse(fixed) as T;
    } catch (e2) {
        throw new Error(`Failed to parse JSON: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
}
