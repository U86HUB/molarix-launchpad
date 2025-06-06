
import { Template } from '@/types/website';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TemplateCardProps {
  template: Template;
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  const navigate = useNavigate();

  const handleSelectTemplate = () => {
    navigate(`/onboarding?templateId=${template.id}`);
  };

  // Map badge colors based on badge text
  const getBadgeColor = (badge?: string) => {
    if (!badge) return '';
    
    const colorMap: Record<string, string> = {
      'new': 'bg-green-500 hover:bg-green-600',
      'popular': 'bg-blue-500 hover:bg-blue-600',
      'featured': 'bg-purple-500 hover:bg-purple-600',
      'premium': 'bg-amber-500 hover:bg-amber-600'
    };
    
    return colorMap[badge.toLowerCase()] || 'bg-gray-500 hover:bg-gray-600';
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-transform hover:scale-[1.01] hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={template.preview_image_url || '/placeholder.svg'} 
          alt={template.name} 
          className="w-full h-full object-cover"
        />
        {template.badge && (
          <Badge 
            className={`absolute top-2 right-2 ${template.badge_color || getBadgeColor(template.badge)}`}
          >
            {template.badge}
          </Badge>
        )}
        {template.category && (
          <Badge 
            variant="outline" 
            className="absolute bottom-2 left-2 bg-white/80 dark:bg-black/50 text-xs"
          >
            {template.category}
          </Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        {/* Add any additional template info here */}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button onClick={handleSelectTemplate}>
          Select Template
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
