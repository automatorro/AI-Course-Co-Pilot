import React, { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css';

interface MarkdownPreviewProps {
  content: string;
}

// Normalize common broken Markdown image syntaxes
// Example: "![Alt]\n(data:...)" -> "![Alt](data:...)"
const normalizeMarkdownImages = (md: string): string => {
  try {
    const joined = md.replace(/!\[([^\]]*)\]\s*\n\s*\(([^)]+)\)/g, '![$1]($2)');
    return joined;
  } catch {
    return md;
  }
};

const ResolvedImage: React.FC<{ src?: string; alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>> = ({ src, alt, ...rest }) => {
  const [resolvedSrc, setResolvedSrc] = useState<string | undefined>(src);
  useEffect(() => {
    let cancelled = false;
    const convert = async () => {
      if (!src || !src.startsWith('blob:')) {
        setResolvedSrc(src);
        return;
      }
      try {
        const res = await fetch(src);
        if (!res.ok) { setResolvedSrc(src); return; }
        const blob = await res.blob();
        const dataUrl: string = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        if (!cancelled) setResolvedSrc(dataUrl);
      } catch {
        if (!cancelled) setResolvedSrc(src);
      }
    };
    convert();
    return () => { cancelled = true; };
  }, [src]);
  return <img loading="lazy" className="max-w-full h-auto rounded" src={resolvedSrc} alt={alt} {...rest} />;
};

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  const normalized = useMemo(() => normalizeMarkdownImages(content), [content]);
  const [resolved, setResolved] = useState(normalized);

  useEffect(() => {
    let cancelled = false;
    const blobMatches = [...normalized.matchAll(/!\[[^\]]*\]\((blob:[^)]+)\)/g)];
    if (blobMatches.length === 0) {
      setResolved(normalized);
      return;
    }
    const uniqueBlobUrls = Array.from(new Set(blobMatches.map(m => m[1])));
    Promise.all(uniqueBlobUrls.map(async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return { url, dataUrl: null };
        const blob = await res.blob();
        const dataUrl: string = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        return { url, dataUrl };
      } catch {
        return { url, dataUrl: null };
      }
    })).then(results => {
      if (cancelled) return;
      let updated = normalized;
      results.forEach(({ url, dataUrl }) => {
        if (dataUrl) {
          // Replace all occurrences in a TS-target-safe way
          updated = updated.split(`(${url})`).join(`(${dataUrl})`);
        }
      });
      setResolved(updated);
    });
    return () => { cancelled = true; };
  }, [normalized]);
  return (
    <div className="prose-sm sm:prose dark:prose-invert max-w-none p-4 sm:p-6 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw as any, rehypeHighlight]}
        components={{
          table: ({ node, ...props }) => (
            <div className="w-full overflow-x-auto">
              <table className="table-auto border-collapse w-full" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border px-3 py-2 bg-gray-50 dark:bg-gray-700" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border px-3 py-2" {...props} />
          ),
          img: ({ node, ...props }) => (
            <ResolvedImage {...(props as any)} />
          ),
          pre: ({ node, ...props }) => (
            <pre className="overflow-x-auto" {...props} />
          )
        }}
      >
        {resolved}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;