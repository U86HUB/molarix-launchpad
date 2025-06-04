
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CopySection from "./CopySection";
import CopyItem from "./CopyItem";

interface Service {
  name: string;
  description: string;
}

interface ServicesCopyData {
  title: string;
  intro: string;
  services: Service[];
}

interface ServicesCopySectionProps {
  data: ServicesCopyData;
}

const ServicesCopySection = ({ data }: ServicesCopySectionProps) => {
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
      title="Services Copy" 
      description="Services section content and offerings"
    >
      <CopyItem label="Services Title" content={data.title}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {data.title}
        </h2>
      </CopyItem>

      <CopyItem label="Services Intro" content={data.intro}>
        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {data.intro}
        </p>
      </CopyItem>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.services.map((service, index) => (
            <div key={index} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {service.name}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`${service.name}: ${service.description}`, `Service ${index + 1}`)}
                >
                  {copiedItems.has(`Service ${index + 1}`) ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </CopySection>
  );
};

export default ServicesCopySection;
