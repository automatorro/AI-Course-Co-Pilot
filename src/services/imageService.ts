import { supabase } from './supabaseClient';

// Normalize common broken image markdown: URL on next line
export const normalizeMarkdownImages = (md: string): string =>
  md.replace(/!\[([^\]]*)\]\s*\n\s*\(([^)]+)\)/g, '![$1]($2)');

// Upload a blob to Supabase Storage and return public URL
export const uploadBlobToStorage = async (
  blob: Blob,
  userId: string | null,
  courseId: string | null,
  fileNameHint?: string
): Promise<string> => {
  const BUCKET = 'course-assets';
  const mime = blob.type || 'image/png';
  const ext = mime.split('/')[1] || 'png';
  const hint = (fileNameHint || 'img').toString().toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 24) || 'img';
  const uniqueName = `${hint}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const path = `${userId || 'anonymous'}/${courseId || 'course'}/${uniqueName}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: mime, upsert: false });
  if (error) throw new Error(error.message || 'Upload image failed');
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

// Replace blob: URLs in markdown with public URLs (uploads blobs)
export const replaceBlobUrlsWithPublic = async (
  md: string,
  userId: string | null,
  courseId: string | null
): Promise<string> => {
  const normalized = normalizeMarkdownImages(md);
  const matches = [...normalized.matchAll(/!\[[^\]]*\]\((blob:[^)]+)\)/g)];
  if (matches.length === 0) return normalized;
  let updated = normalized;
  const uniqueBlobUrls = Array.from(new Set(matches.map(m => m[1])));
  for (const blobUrl of uniqueBlobUrls) {
    try {
      const res = await fetch(blobUrl);
      if (!res.ok) continue;
      const blob = await res.blob();
      const publicUrl = await uploadBlobToStorage(blob, userId, courseId);
      updated = updated.split(`(${blobUrl})`).join(`(${publicUrl})`);
    } catch {
      // leave as-is on failure
    }
  }
  return updated;
};

// Convert blob: URLs to data URLs for export-only scenarios
export const replaceBlobUrlsWithData = async (md: string): Promise<string> => {
  const normalized = normalizeMarkdownImages(md);
  const matches = [...normalized.matchAll(/!\[[^\]]*\]\((blob:[^)]+)\)/g)];
  if (matches.length === 0) return normalized;
  let updated = normalized;
  const uniqueBlobUrls = Array.from(new Set(matches.map(m => m[1])));
  for (const blobUrl of uniqueBlobUrls) {
    try {
      const res = await fetch(blobUrl);
      if (!res.ok) continue;
      const blob = await res.blob();
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      updated = updated.split(`(${blobUrl})`).join(`(${dataUrl})`);
    } catch {
      // leave as-is on failure
    }
  }
  return updated;
};