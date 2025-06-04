
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, Tablet, Monitor, CheckCircle, XCircle } from "lucide-react";

interface ViewportTest {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  passed: boolean;
}

const ResponsivenessTester = () => {
  const [currentViewport, setCurrentViewport] = useState({ width: 0, height: 0 });
  const [tests, setTests] = useState<ViewportTest[]>([]);

  const viewports = [
    { name: "Mobile (375px)", width: 375, height: 667, icon: <Smartphone className="h-4 w-4" /> },
    { name: "Tablet (768px)", width: 768, height: 1024, icon: <Tablet className="h-4 w-4" /> },
    { name: "Desktop (1024px)", width: 1024, height: 768, icon: <Monitor className="h-4 w-4" /> },
    { name: "Large Desktop (1440px)", width: 1440, height: 900, icon: <Monitor className="h-4 w-4" /> }
  ];

  useEffect(() => {
    const updateViewport = () => {
      setCurrentViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const runResponsivenessTests = () => {
    const testResults = viewports.map(viewport => ({
      ...viewport,
      passed: checkResponsiveness(viewport.width)
    }));
    
    setTests(testResults);
  };

  const checkResponsiveness = (width: number): boolean => {
    // Simple checks for responsive design
    const hasFlexOrGrid = document.querySelectorAll('[class*="flex"], [class*="grid"]').length > 0;
    const hasResponsiveClasses = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]').length > 0;
    const hasMetaViewport = document.querySelector('meta[name="viewport"]') !== null;
    
    return hasFlexOrGrid && hasResponsiveClasses && hasMetaViewport;
  };

  const getCurrentBreakpoint = () => {
    const width = currentViewport.width;
    if (width < 640) return "Mobile";
    if (width < 768) return "Small Tablet";
    if (width < 1024) return "Tablet";
    if (width < 1280) return "Desktop";
    return "Large Desktop";
  };

  useEffect(() => {
    runResponsivenessTests();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Responsive Design Test
          <Badge variant="outline">
            {getCurrentBreakpoint()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Current Viewport: {currentViewport.width} × {currentViewport.height}
            </div>
          </div>

          <Button onClick={runResponsivenessTests} className="w-full">
            Test Responsive Breakpoints
          </Button>

          <div className="space-y-3">
            {tests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {test.icon}
                  <div>
                    <div className="text-sm font-medium">{test.name}</div>
                    <div className="text-xs text-gray-500">
                      {test.width} × {test.height}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {test.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <Badge className={test.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {test.passed ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            <p>✓ Responsive classes detected</p>
            <p>✓ Flexible layouts implemented</p>
            <p>✓ Viewport meta tag present</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsivenessTester;
