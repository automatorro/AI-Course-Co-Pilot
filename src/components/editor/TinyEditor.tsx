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
