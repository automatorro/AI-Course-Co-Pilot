import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { uploadEditorImageToSupabase } from '../../lib/editorImageUpload';
import { useAuth } from '../../contexts/AuthContext';

export type TinyEditorProps = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
};

const TINY_API_KEY: string = (import.meta as any).env?.VITE_TINYMCE_API_KEY || '';

const TinyEditor: React.FC<TinyEditorProps> = ({ value, onChange, disabled }) => {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState<number>(520);
  useEffect(() => {
    const calc = () => {
      const top = containerRef.current?.getBoundingClientRect().top ?? 0;
      const actions = document.getElementById('workspace-actions') || document.getElementById('mobile-actions-bar');
      const actionsH = actions ? actions.getBoundingClientRect().height : 0;
      const available = Math.max(320, Math.floor(window.innerHeight - top - actionsH - 24));
      setEditorHeight(available);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return (
    <div ref={containerRef}>
    <Editor
      apiKey={TINY_API_KEY}
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        menubar: false,
        plugins: [
          'lists',
          'link',
          'image',
          'paste',
        ],
        toolbar:
          'undo redo | bold italic underline | blocks | bullist numlist | link image',
        block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2',
        branding: false,
        statusbar: true,
        height: editorHeight,
        resize: true,
        toolbar_sticky: true,
        toolbar_sticky_offset: 64,
        content_style: 'body{padding-bottom:240px;}',
        paste_data_images: true,
        images_upload_handler: async (blobInfo) => {
          try {
            const file = new File([blobInfo.blob()], blobInfo.filename(), { type: blobInfo.blob().type });
            const url = await uploadEditorImageToSupabase(file, user?.id);
            return url;
          } catch (err: any) {
            // TinyMCE will show a notification when the promise rejects
            throw new Error(err?.message || 'Image upload failed');
          }
        },
        readonly: !!disabled,
      }}
    />
    </div>
  );
};

export default TinyEditor;