
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RichTextField from "@/components/ui/rich-text-field";

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
  isEditing,
  type = 'input',
  rows = 2,
  placeholder,
  renderDisplay
}: EditableFieldProps) => {
  if (isEditing) {
    const commonProps = {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
      placeholder: placeholder || `Enter ${label.toLowerCase()}`
    };

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        {type === 'richtext' ? (
          <RichTextField
            defaultContent={value}
            onChange={onChange}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          />
        ) : type === 'textarea' ? (
          <Textarea {...commonProps} rows={rows} />
        ) : (
          <Input {...commonProps} />
        )}
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
