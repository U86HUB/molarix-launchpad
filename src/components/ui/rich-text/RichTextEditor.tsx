
import React from 'react';
import { EditorContent, Editor } from '@tiptap/react';

interface RichTextEditorProps {
  editor: Editor;
}

const RichTextEditor = ({ editor }: RichTextEditorProps) => {
  return (
    <div className="min-h-[200px]">
      <EditorContent 
        editor={editor}
        className="prose prose-sm max-w-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:outline-none"
      />
    </div>
  );
};

export default RichTextEditor;
