
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RichTextField from "@/components/ui/rich-text-field";

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  isEditing: boolean;
  type?: 'input' | 'textarea' | 'richtext';
  rows?: number;
  placeholder?: string;
  renderDisplay?: (value: string) => React.ReactNode;
}

const EditableField = ({
  label,
  value,
  onChange,
  onBlur,
  isEditing,
  type = 'input',
  rows = 2,
  placeholder,
  renderDisplay
}: EditableFieldProps) => {
  // Create a unique ID for the field based on label
  const fieldId = `editable-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const descriptionId = `${fieldId}-description`;

  if (isEditing) {
    const commonProps = {
      id: fieldId,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
      onBlur,
      placeholder: placeholder || `Enter ${label.toLowerCase()}`,
      'aria-describedby': descriptionId,
      autoComplete: 'off' as const
    };

    return (
      <div className="space-y-2">
        <label htmlFor={fieldId} className="text-sm font-medium">
          {label}
        </label>
        {type === 'richtext' ? (
          <RichTextField
            defaultContent={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          />
        ) : type === 'textarea' ? (
          <Textarea {...commonProps} rows={rows} />
        ) : (
          <Input {...commonProps} />
        )}
        <p id={descriptionId} className="text-xs text-muted-foreground sr-only">
          {type === 'richtext' ? 'Rich text editor for ' : 'Edit field for '}{label.toLowerCase()}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {renderDisplay ? renderDisplay(value) : (
          <div 
            className="text-gray-800 dark:text-gray-200 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        )}
      </div>
    </div>
  );
};

export default EditableField;
