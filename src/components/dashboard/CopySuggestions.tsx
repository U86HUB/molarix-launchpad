
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Lightbulb, ArrowRight } from "lucide-react";
import { useCopySuggestions } from "@/hooks/useCopySuggestions";
import { GeneratedCopy } from "@/types/copy";

interface CopySuggestionsProps {
  copy: GeneratedCopy | null;
  sessionId: string;
  onEditClick?: () => void;
}

const CopySuggestions = ({ copy, sessionId, onEditClick }: CopySuggestionsProps) => {
  const { suggestions, loading, getSuggestionsByPriority, getTotalSuggestions } = useCopySuggestions({
    copy,
    sessionId
  });

  if (loading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lightbulb className="h-4 w-4 animate-pulse" />
            Analyzing your content...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (getTotalSuggestions() === 0) {
    return (
      <Card className="mt-4 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Your content looks complete!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const highPriority = getSuggestionsByPriority('high');
  const mediumPriority = getSuggestionsByPriority('medium');
  const lowPriority = getSuggestionsByPriority('low');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-3 w-3" />;
      case 'medium': return <Lightbulb className="h-3 w-3" />;
      case 'low': return <Lightbulb className="h-3 w-3" />;
      default: return <Lightbulb className="h-3 w-3" />;
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            AI Suggestions ({getTotalSuggestions()})
          </CardTitle>
          {onEditClick && (
            <Button size="sm" variant="outline" onClick={onEditClick} className="text-xs">
              <ArrowRight className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* High Priority Suggestions */}
          {highPriority.map((suggestion) => (
            <div key={suggestion.id} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
              <div className="flex-shrink-0 mt-0.5">
                {getPriorityIcon(suggestion.priority)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getPriorityColor(suggestion.priority)} variant="secondary">
                    {suggestion.priority}
                  </Badge>
                  <span className="text-xs text-gray-500">{suggestion.section}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion.message}</p>
              </div>
            </div>
          ))}

          {/* Medium Priority Suggestions */}
          {mediumPriority.map((suggestion) => (
            <div key={suggestion.id} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
              <div className="flex-shrink-0 mt-0.5">
                {getPriorityIcon(suggestion.priority)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getPriorityColor(suggestion.priority)} variant="secondary">
                    {suggestion.priority}
                  </Badge>
                  <span className="text-xs text-gray-500">{suggestion.section}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion.message}</p>
              </div>
            </div>
          ))}

          {/* Low Priority Suggestions */}
          {lowPriority.map((suggestion) => (
            <div key={suggestion.id} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <div className="flex-shrink-0 mt-0.5">
                {getPriorityIcon(suggestion.priority)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getPriorityColor(suggestion.priority)} variant="secondary">
                    {suggestion.priority}
                  </Badge>
                  <span className="text-xs text-gray-500">{suggestion.section}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CopySuggestions;
