
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

interface TiptapEditorProps {
  initialContent: any;
  onUpdate: (contentJSON: any) => void;
}

export function TiptapEditor({ initialContent, onUpdate }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || '',
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
    },
  });

  return (
    <div className="prose max-w-full">
      <EditorContent editor={editor} />
    </div>
  );
}
