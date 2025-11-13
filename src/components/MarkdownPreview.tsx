import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return (
    <div className="prose-sm sm:prose dark:prose-invert max-w-none p-4 sm:p-6 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
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
            <img loading="lazy" className="max-w-full h-auto rounded" {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre className="overflow-x-auto" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;