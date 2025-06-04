
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TemplateCardProps {
  template: {
    id: number;
    name: string;
    category: string;
    description: string;
    image: string;
    badge: string | null;
    badgeColor: string;
  };
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  const { t } = useLanguage();

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group dark:bg-gray-800">
      <div className="relative">
        <img 
          src={template.image} 
          alt={t(template.name)}
          className="w-full h-48 object-cover"
        />
        {template.badge && (
          <Badge className={`absolute top-4 ${template.badgeColor} ${
            document.documentElement.dir === 'rtl' ? 'left-4' : 'right-4'
          }`}>
            {t(template.badge)}
          </Badge>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button size="sm" variant="secondary" className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Eye className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {t('preview')}
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t(template.name)}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1 rtl:mr-1 rtl:ml-0">4.8</span>
          </div>
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{t(template.category)}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{t(template.description)}</p>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          {t('spinUpTemplate')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
