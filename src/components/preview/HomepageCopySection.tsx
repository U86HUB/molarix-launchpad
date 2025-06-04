
import { Button } from "@/components/ui/button";
import CopySection from "./CopySection";
import CopyItem from "./CopyItem";

interface HomepageCopyData {
  headline: string;
  subheadline: string;
  welcomeMessage: string;
  ctaText: string;
}

interface HomepageCopySectionProps {
  data: HomepageCopyData;
}

const HomepageCopySection = ({ data }: HomepageCopySectionProps) => {
  return (
    <CopySection 
      title="Homepage Copy" 
      description="Main homepage content and hero section"
    >
      <CopyItem label="Headline" content={data.headline}>
        <h2 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
          {data.headline}
        </h2>
      </CopyItem>

      <CopyItem label="Subheadline" content={data.subheadline}>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          {data.subheadline}
        </p>
      </CopyItem>

      <CopyItem label="Welcome Message" content={data.welcomeMessage}>
        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {data.welcomeMessage}
        </p>
      </CopyItem>

      <CopyItem label="CTA Text" content={data.ctaText}>
        <Button size="lg" className="font-semibold text-lg px-8 py-3">
          {data.ctaText}
        </Button>
      </CopyItem>
    </CopySection>
  );
};

export default HomepageCopySection;
