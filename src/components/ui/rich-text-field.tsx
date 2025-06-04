
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Link as LinkIcon,
  List,
  ListOrdered
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextFieldProps {
  defaultContent?: string;
  onChange?: (content: string) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
}

const RichTextField = ({ 
  defaultContent = '', 
  onChange, 
  onBlur,
  className,
  placeholder = 'Start typing...'
}: RichTextFieldProps) => {
  const [linkUrl, setLinkUrl] = React.useState('');
  const [showLinkInput, setShowLinkInput] = React.useState(false);

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

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const setHeading2 = () => editor?.chain().focus().toggleHeading({ level: 2 }).run();
  const setHeading3 = () => editor?.chain().focus().toggleHeading({ level: 3 }).run();

  const setLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const unsetLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('border rounded-lg', className)}>
      {/* Toolbar */}
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
          onClick={() => setShowLinkInput(!showLinkInput)}
          type="button"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        {editor.isActive('link') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={unsetLink}
            type="button"
          >
            Remove Link
          </Button>
        )}
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="flex gap-2 p-2 border-b bg-gray-50 dark:bg-gray-800">
          <Input
            placeholder="Enter URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && setLink()}
            className="flex-1"
          />
          <Button size="sm" onClick={setLink} type="button">
            Add Link
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setShowLinkInput(false)}
            type="button"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Editor */}
      <div className="min-h-[200px]">
        <EditorContent 
          editor={editor}
          className="prose prose-sm max-w-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:outline-none"
        />
      </div>
    </div>
  );
};

export default RichTextField;
