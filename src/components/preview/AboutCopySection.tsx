
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopySection from "./CopySection";
import CopyItem from "./CopyItem";

interface Value {
  name: string;
  description: string;
}

interface AboutCopyData {
  title: string;
  intro: string;
  mission: string;
  values: Value[];
}

interface AboutCopySectionProps {
  data: AboutCopyData;
}

const AboutCopySection = ({ data }: AboutCopySectionProps) => {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(label));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(label);
          return newSet;
        });
      }, 2000);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <CopySection 
      title="About Copy" 
      description="About section content and practice values"
    >
      <CopyItem label="About Title" content={data.title}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {data.title}
        </h2>
      </CopyItem>

      <CopyItem label="About Intro" content={data.intro}>
        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {data.intro}
        </p>
      </CopyItem>

      <CopyItem label="Mission" content={data.mission}>
        <p className="text-lg italic leading-relaxed text-gray-800 dark:text-gray-200">
          {data.mission}
        </p>
      </CopyItem>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Core Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.values.map((value, index) => (
            <div key={index} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {value.name}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`${value.name}: ${value.description}`, `Value ${index + 1}`)}
                >
                  {copiedItems.has(`Value ${index + 1}`) ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </CopySection>
  );
};

export default AboutCopySection;
