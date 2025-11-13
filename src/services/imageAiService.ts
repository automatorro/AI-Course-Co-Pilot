// Minimal AI image generator using Pollinations API (no API key required)
// It returns a Blob for the generated image which can be uploaded to Storage.

export type GenerateImageOptions = {
  size?: number; // square dimension: 512, 768, 1024
};

export const generateImage = async (
  prompt: string,
  options: GenerateImageOptions = {}
): Promise<{ blob: Blob }> => {
  const size = options.size || 768;
  const encodedPrompt = encodeURIComponent(prompt.trim());
  // Pollinations supports returning an image from prompt; disable caching for freshness
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?size=${size}x${size}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Image generation failed (${res.status}).`);
  }
  const blob = await res.blob();
  return { blob };
};