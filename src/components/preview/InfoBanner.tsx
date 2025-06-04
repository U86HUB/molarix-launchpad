
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface InfoBannerProps {
  message: string;
  show: boolean;
}

const InfoBanner = ({ message, show }: InfoBannerProps) => {
  if (!show) return null;

  return (
    <Alert className="mb-6">
      <Info className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default InfoBanner;
