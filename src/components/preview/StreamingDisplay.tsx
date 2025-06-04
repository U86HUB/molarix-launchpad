
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import TypingAnimation from "@/components/TypingAnimation";

interface StreamingDisplayProps {
  streamingContent: string;
}

const StreamingDisplay = ({ streamingContent }: StreamingDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          AI is generating your copy...
          <Loader2 className="h-4 w-4 animate-spin" />
        </CardTitle>
        <CardDescription>
          Watch as your personalized content is created in real-time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
            <TypingAnimation 
              text={streamingContent} 
              speed={20}
              className="text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamingDisplay;
