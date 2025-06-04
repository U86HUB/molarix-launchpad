
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  icon?: LucideIcon;
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actions?: EmptyStateAction[];
  suggestions?: string[];
  className?: string;
}

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actions = [], 
  suggestions = [],
  className = '' 
}: EmptyStateProps) => {
  return (
    <Card className={`text-center py-12 shadow-sm border-border bg-white dark:bg-gray-800 ${className}`}>
      <CardHeader>
        {Icon && (
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      
      {(actions.length > 0 || suggestions.length > 0) && (
        <CardContent className="space-y-6">
          {actions.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant || 'default'}
                  className="flex items-center gap-2"
                >
                  {action.icon && <action.icon className="h-4 w-4" />}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          
          {suggestions.length > 0 && (
            <div className="text-left max-w-md mx-auto">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Try these suggestions:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default EmptyState;
