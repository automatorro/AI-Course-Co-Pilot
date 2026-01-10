import React, { useEffect, useMemo, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { uploadEditorImageToSupabase } from '../../lib/editorImageUpload';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export type TinyEditorProps = {
  value: string;
  onChange: (html: string) => void;
  refreshSignal?: number;
  onSelectionChange?: (text: string) => void;
};



const TinyEditor: React.FC<TinyEditorProps> = ({ value, onChange, refreshSignal, onSelectionChange }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const isLocalChangeRef = useRef<boolean>(false);

  const initConfig = useMemo(() => ({
    menubar: false,
    base_url: '/tinymce',
    suffix: '.min',
    promotion: false,
    skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
    content_css: theme === 'dark' ? 'dark' : 'default',
    plugins: [
      'lists',
      'link',
      'image',
      'quickbars'
    ],
    toolbar:
      'undo redo | blocks | bold italic underline | bullist numlist | link image',
    block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3',
    branding: false,
    statusbar: false,
    resize: false,
    height: '100%',
    toolbar_sticky: true,
    toolbar_sticky_offset: 0,
    toolbar_mode: 'sliding',
    // Allow custom XML tags for Slides so they aren't stripped
    extended_valid_elements: 'SLIDE_BEGIN[id],SLIDE_START[id],SLIDE_END[id],SLIDE_STOP[id],TITLE,VISUAL,CONTENT,NOTES',
    custom_elements: 'SLIDE_BEGIN,SLIDE_START,SLIDE_END,SLIDE_STOP,TITLE,VISUAL,CONTENT,NOTES',
    content_style: `
      body { 
        font-family: 'Inter', system-ui, -apple-system, sans-serif; 
        font-size: 16px; 
        line-height: 1.7; 
        color: ${theme === 'dark' ? '#e5e7eb' : '#374151'}; 
        padding: 2rem; 
        max-width: 850px; 
        margin: 0 auto; 
        background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
      } 
      
      /* Slide Structure Visualization */
      SLIDE_BEGIN, SLIDE_START { 
        display: block; 
        margin-top: 2rem; 
        padding-top: 0.5rem;
        border-top: 2px solid ${theme === 'dark' ? '#3b82f6' : '#2563eb'};
        color: ${theme === 'dark' ? '#60a5fa' : '#2563eb'};
        font-weight: bold;
        font-family: monospace;
      }
      SLIDE_END, SLIDE_STOP { 
        display: block; 
        margin-bottom: 2rem; 
        padding-bottom: 0.5rem;
        border-bottom: 2px solid ${theme === 'dark' ? '#ef4444' : '#dc2626'};
        color: ${theme === 'dark' ? '#f87171' : '#dc2626'};
        font-family: monospace;
        font-size: 0.8em;
      }
      TITLE { 
        display: block; 
        font-size: 1.25em; 
        font-weight: bold; 
        margin: 0.5rem 0; 
      }
      TITLE::before { content: 'Title: '; color: #9ca3af; font-size: 0.7em; font-weight: normal; vertical-align: middle; }
      
      VISUAL { 
        display: block; 
        font-style: italic; 
        background: ${theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : '#f3f4f6'}; 
        padding: 0.5rem; 
        margin: 0.5rem 0; 
        border-left: 3px solid #8b5cf6; 
      }
      VISUAL::before { content: 'Visual: '; font-weight: bold; color: #8b5cf6; margin-right: 0.5rem; }
      
      CONTENT { display: block; margin: 0.5rem 0; }
      /* CONTENT::before { content: 'Content: '; display: block; font-weight: bold; color: #6b7280; font-size: 0.8em; } */
      
      NOTES { 
        display: block; 
        background: ${theme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb'}; 
        padding: 0.5rem; 
        border-left: 3px solid #f59e0b; 
        font-size: 0.9em;
      }
      NOTES::before { content: 'Speaker Notes: '; font-weight: bold; color: #f59e0b; display: block; margin-bottom: 0.25rem; }

      @media (max-width: 640px) {
        body {
          padding: 1rem;
        }
      }
      h1, h2, h3 { color: ${theme === 'dark' ? '#f3f4f6' : '#111827'}; font-weight: 700; }
      a { color: ${theme === 'dark' ? '#60a5fa' : '#2563eb'}; }
      img { max-width: 100%; height: auto; border-radius: 0.5rem; }
      html { scroll-padding-top: 100px; background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'}; }
    `,
    paste_data_images: true,
    images_upload_handler: async (blobInfo: any) => {
      try {
        const file = new File([blobInfo.blob()], blobInfo.filename(), { type: blobInfo.blob().type });
        const url = await uploadEditorImageToSupabase(file, user?.id);
        return url;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(err.message || 'Image upload failed');
        }
        throw new Error('Image upload failed');
      }
    },
    setup: (editor: any) => {
      editor.on('SelectionChange', () => {
        const text = editor.selection?.getContent({ format: 'text' }) || '';
        onSelectionChange?.(text);
      });
      editor.on('MouseUp', () => {
        const text = editor.selection?.getContent({ format: 'text' }) || '';
        onSelectionChange?.(text);
      });
      editor.on('KeyUp', () => {
        const text = editor.selection?.getContent({ format: 'text' }) || '';
        onSelectionChange?.(text);
      });
    },
  }), [user?.id, theme]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const nextHtml = value || '';
    const current = editor.getContent({ format: 'html' }) || '';
    if (nextHtml !== current) {
      editor.setContent(nextHtml || '');
      try {
        editor.selection?.setCursorLocation();
        editor.selection?.collapse(false);
      } catch { }
    }
    isLocalChangeRef.current = false;
  }, [value]);

  useEffect(() => {
    if (!editorRef.current) return;
    const isHtml = /<[a-z][\s\S]*>/i.test(value || '');
    const nextHtml = isHtml ? (value || '') : (value || '');
    editorRef.current.setContent(nextHtml || '');
    try {
      editorRef.current.selection?.setCursorLocation();
      editorRef.current.selection?.collapse(false);
    } catch { }
    isLocalChangeRef.current = false;
  }, [refreshSignal]);

  // Use local self-hosted script to avoid API key requirements and warnings
  const scriptSrc = '/tinymce/tinymce.min.js';

  return (
    <div ref={containerRef} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Editor
        tinymceScriptSrc={scriptSrc}
        value={value}
        onInit={(_evt, editor) => { editorRef.current = editor; editor.setContent(value || ''); try { editor.selection?.setCursorLocation(); editor.selection?.collapse(false); } catch { } }}
        onEditorChange={(content) => {
          isLocalChangeRef.current = true;
          onChange(content || '');
        }}
        init={initConfig as any}
      />
    </div>
  );
};

export default TinyEditor;
