
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, Plus, RefreshCw } from 'lucide-react';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  icon?: LucideIcon;
  loading?: boolean;
}

interface EnhancedEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actions?: EmptyStateAction[];
  suggestions?: string[];
  className?: string;
  illustration?: 'default' | 'search' | 'create' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

const illustrations = {
  default: '📋',
  search: '🔍',
  create: '✨',
  error: '⚠️'
};

const sizes = {
  sm: { card: 'py-8', icon: 'h-8 w-8', title: 'text-lg', description: 'text-sm' },
  md: { card: 'py-12', icon: 'h-12 w-12', title: 'text-xl', description: 'text-base' },
  lg: { card: 'py-16', icon: 'h-16 w-16', title: 'text-2xl', description: 'text-lg' }
};

export const EnhancedEmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actions = [], 
  suggestions = [],
  className = '',
  illustration = 'default',
  size = 'md'
}: EnhancedEmptyStateProps) => {
  const sizeClasses = sizes[size];

  return (
    <Card className={`text-center ${sizeClasses.card} shadow-sm border-border bg-white dark:bg-gray-800 ${className}`}>
      <CardHeader>
        <div className="mx-auto mb-4 flex items-center justify-center">
          {Icon ? (
            <div className={`flex ${sizeClasses.icon} items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700`}>
              <Icon className="h-6 w-6 text-gray-400" />
            </div>
          ) : (
            <span className="text-4xl">{illustrations[illustration]}</span>
          )}
        </div>
        <CardTitle className={sizeClasses.title}>{title}</CardTitle>
        <CardDescription className={sizeClasses.description}>{description}</CardDescription>
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
                  disabled={action.loading}
                >
                  {action.loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : action.icon ? (
                    <action.icon className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          
          {suggestions.length > 0 && (
            <div className="text-left max-w-md mx-auto">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Suggestions:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
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
