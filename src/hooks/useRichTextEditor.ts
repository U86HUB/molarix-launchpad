
import { useEffect } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

interface UseRichTextEditorProps {
  defaultContent: string;
  onChange?: (content: string) => void;
  onBlur?: () => void;
}

export const useRichTextEditor = ({ 
  defaultContent, 
  onChange, 
  onBlur 
}: UseRichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Underline,
    ],
    content: defaultContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    onBlur: () => {
      onBlur?.();
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-3',
      },
    },
  });

  useEffect(() => {
    if (editor && defaultContent !== editor.getHTML()) {
      editor.commands.setContent(defaultContent);
    }
  }, [defaultContent, editor]);

  return editor;
};
