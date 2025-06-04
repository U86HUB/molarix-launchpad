
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Link as LinkIcon,
  List,
  ListOrdered
} from 'lucide-react';

interface RichTextToolbarProps {
  editor: Editor;
  onToggleLinkInput: () => void;
  onUnsetLink: () => void;
  showLinkInput: boolean;
}

const RichTextToolbar = ({ 
  editor, 
  onToggleLinkInput, 
  onUnsetLink, 
  showLinkInput 
}: RichTextToolbarProps) => {
  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const setHeading2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const setHeading3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run();

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 dark:bg-gray-800">
      {/* Text Formatting */}
      <Button
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        size="sm"
        onClick={toggleBold}
        type="button"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        size="sm"
        onClick={toggleItalic}
        type="button"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('underline') ? 'default' : 'ghost'}
        size="sm"
        onClick={toggleUnderline}
        type="button"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Headings */}
      <Button
        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
        size="sm"
        onClick={setHeading2}
        type="button"
      >
        H2
      </Button>
      
      <Button
        variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
        size="sm"
        onClick={setHeading3}
        type="button"
      >
        H3
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Lists */}
      <Button
        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
        size="sm"
        onClick={toggleBulletList}
        type="button"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
        size="sm"
        onClick={toggleOrderedList}
        type="button"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Link */}
      <Button
        variant={editor.isActive('link') ? 'default' : 'ghost'}
        size="sm"
        onClick={onToggleLinkInput}
        type="button"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>

      {editor.isActive('link') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onUnsetLink}
          type="button"
        >
          Remove Link
        </Button>
      )}
    </div>
  );
};

export default RichTextToolbar;
