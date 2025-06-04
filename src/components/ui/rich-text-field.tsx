
import React from 'react';
import { cn } from '@/lib/utils';
import { useRichTextEditor } from '@/hooks/useRichTextEditor';
import RichTextToolbar from './rich-text/RichTextToolbar';
import LinkInput from './rich-text/LinkInput';
import RichTextEditor from './rich-text/RichTextEditor';

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

  const editor = useRichTextEditor({
    defaultContent,
    onChange,
    onBlur,
  });

  const setLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const unsetLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  const toggleLinkInput = () => {
    setShowLinkInput(!showLinkInput);
  };

  const cancelLinkInput = () => {
    setShowLinkInput(false);
    setLinkUrl('');
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('border rounded-lg', className)}>
      <RichTextToolbar
        editor={editor}
        onToggleLinkInput={toggleLinkInput}
        onUnsetLink={unsetLink}
        showLinkInput={showLinkInput}
      />

      {showLinkInput && (
        <LinkInput
          linkUrl={linkUrl}
          onLinkUrlChange={setLinkUrl}
          onSetLink={setLink}
          onCancel={cancelLinkInput}
        />
      )}

      <RichTextEditor editor={editor} />
    </div>
  );
};

export default RichTextField;
