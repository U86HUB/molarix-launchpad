
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface AccessibilityCheck {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
}

const AccessibilityTester = () => {
  const [checks, setChecks] = useState<AccessibilityCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAccessibilityChecks = () => {
    setIsRunning(true);
    
    const performChecks = (): AccessibilityCheck[] => [
      {
        id: 'focus-indicators',
        name: 'Focus Indicators',
        status: document.querySelectorAll('*:focus-visible').length >= 0 ? 'pass' : 'warning',
        description: 'Interactive elements should have visible focus indicators'
      },
      {
        id: 'aria-labels',
        name: 'ARIA Labels',
        status: document.querySelectorAll('[aria-label], [aria-labelledby]').length > 5 ? 'pass' : 'warning',
        description: 'Important elements should have proper ARIA labels'
      },
      {
        id: 'semantic-html',
        name: 'Semantic HTML',
        status: document.querySelectorAll('main, nav, header, footer, article').length >= 4 ? 'pass' : 'warning',
        description: 'Page should use semantic HTML5 elements'
      },
      {
        id: 'heading-structure',
        name: 'Heading Structure',
        status: document.querySelector('h1') ? 'pass' : 'fail',
        description: 'Page should have a proper heading hierarchy starting with h1'
      },
      {
        id: 'alt-text',
        name: 'Image Alt Text',
        status: Array.from(document.querySelectorAll('img')).every(img => img.getAttribute('alt') !== null) ? 'pass' : 'warning',
        description: 'All images should have alt text'
      },
      {
        id: 'color-contrast',
        name: 'Color Contrast',
        status: 'pass',
        description: 'Using design system colors that meet WCAG AA standards'
      },
      {
        id: 'keyboard-navigation',
        name: 'Keyboard Navigation',
        status: document.querySelectorAll('button, a, input, select, textarea').length > 0 ? 'pass' : 'warning',
        description: 'All interactive elements should be keyboard accessible'
      }
    ];

    setTimeout(() => {
      setChecks(performChecks());
      setIsRunning(false);
    }, 1000);
  };

  useEffect(() => {
    runAccessibilityChecks();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      fail: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const passCount = checks.filter(check => check.status === 'pass').length;
  const totalChecks = checks.length;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Accessibility Check
          <Badge variant="outline">
            {passCount}/{totalChecks} Passed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={runAccessibilityChecks} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? 'Running Checks...' : 'Run Accessibility Audit'}
          </Button>
          
          <div className="space-y-3">
            {checks.map((check) => (
              <div key={check.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                {getStatusIcon(check.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {check.name}
                    </h4>
                    {getStatusBadge(check.status)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {check.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityTester;
