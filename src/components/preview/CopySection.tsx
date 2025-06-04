
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CopySectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const CopySection = ({ title, description, children }: CopySectionProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </div>
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
  );
};

export default CopySection;
