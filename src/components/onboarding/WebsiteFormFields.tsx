
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WebsiteFormFieldsProps {
  name: string;
  primaryColor: string;
  fontStyle: string;
  onNameChange: (value: string) => void;
  onPrimaryColorChange: (value: string) => void;
  onFontStyleChange: (value: string) => void;
}

const WebsiteFormFields = ({
  name,
  primaryColor,
  fontStyle,
  onNameChange,
  onPrimaryColorChange,
  onFontStyleChange
}: WebsiteFormFieldsProps) => {
  const fontOptions = [
    { value: 'default', label: 'Default (Inter)' },
    { value: 'serif', label: 'Serif (Times New Roman)' },
    { value: 'mono', label: 'Monospace (Courier)' },
    { value: 'sans', label: 'Sans-serif (Arial)' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="website-name" className="text-sm font-medium">
          Website Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="website-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter your website name"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="primary-color" className="text-sm font-medium">
            Primary Color
          </Label>
          <div className="flex items-center gap-2">
            <input
              id="primary-color"
              type="color"
              value={primaryColor}
              onChange={(e) => onPrimaryColorChange(e.target.value)}
              className="w-12 h-10 rounded border border-gray-300"
            />
            <Input
              value={primaryColor}
              onChange={(e) => onPrimaryColorChange(e.target.value)}
              placeholder="#4f46e5"
              className="flex-1"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="font-style" className="text-sm font-medium">
            Font Style
          </Label>
          <select
            id="font-style"
            value={fontStyle}
            onChange={(e) => onFontStyleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fontOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default WebsiteFormFields;
