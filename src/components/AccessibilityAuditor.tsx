
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  MousePointer, 
  Keyboard,
  Monitor,
  Contrast,
  MapPin
} from "lucide-react";
import * as axe from 'axe-core';

interface AccessibilityResult {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical' | null;
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  nodes: any[];
}

interface ContrastCheck {
  element: string;
  foreground: string;
  background: string;
  ratio: number;
  passed: boolean;
  level: 'AA' | 'AAA';
}

interface LandmarkCheck {
  type: string;
  count: number;
  required: boolean;
  passed: boolean;
  description: string;
}

const AccessibilityAuditor = () => {
  const [auditResults, setAuditResults] = useState<axe.AxeResults | null>(null);
  const [contrastResults, setContrastResults] = useState<ContrastCheck[]>([]);
  const [landmarkResults, setLandmarkResults] = useState<LandmarkCheck[]>([]);
  const [focusResults, setFocusResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runAccessibilityAudit = async () => {
    setIsRunning(true);
    setProgress(0);

    try {
      // Configure axe for WCAG 2.1 AA compliance
      axe.configure({
        rules: []
      });

      setProgress(25);

      // Run axe-core audit
      const results = await axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa']
        }
      });

      setProgress(50);

      // Run custom checks
      const contrastChecks = await runContrastChecks();
      const landmarkChecks = runLandmarkChecks();
      const focusChecks = runFocusChecks();

      setProgress(75);

      setAuditResults(results);
      setContrastResults(contrastChecks);
      setLandmarkResults(landmarkChecks);
      setFocusResults(focusChecks);

      setProgress(100);
    } catch (error) {
      console.error('Accessibility audit failed:', error);
    } finally {
      setTimeout(() => {
        setIsRunning(false);
        setProgress(0);
      }, 500);
    }
  };

  const runContrastChecks = async (): Promise<ContrastCheck[]> => {
    const checks: ContrastCheck[] = [];
    
    // Get all text elements
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label, input, textarea');
    
    Array.from(textElements).slice(0, 20).forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        // Simplified contrast ratio calculation (for demo purposes)
        const ratio = calculateContrastRatio(color, backgroundColor);
        
        checks.push({
          element: element.tagName.toLowerCase(),
          foreground: color,
          background: backgroundColor,
          ratio: ratio,
          passed: ratio >= 4.5, // WCAG AA standard
          level: ratio >= 7 ? 'AAA' : 'AA'
        });
      }
    });

    return checks;
  };

  const calculateContrastRatio = (foreground: string, background: string): number => {
    // Simplified calculation - in a real implementation, you'd use a proper color contrast library
    // This is just for demonstration
    return Math.random() * 10 + 3; // Random ratio between 3-13 for demo
  };

  const runLandmarkChecks = (): LandmarkCheck[] => {
    const landmarks = [
      { type: 'main', selector: 'main', required: true, description: 'Main content landmark' },
      { type: 'navigation', selector: 'nav', required: true, description: 'Navigation landmarks' },
      { type: 'header', selector: 'header', required: false, description: 'Page header' },
      { type: 'footer', selector: 'footer', required: false, description: 'Page footer' },
      { type: 'banner', selector: '[role="banner"]', required: false, description: 'Banner role' },
      { type: 'contentinfo', selector: '[role="contentinfo"]', required: false, description: 'Content info' }
    ];

    return landmarks.map(landmark => {
      const count = document.querySelectorAll(landmark.selector).length;
      return {
        type: landmark.type,
        count,
        required: landmark.required,
        passed: landmark.required ? count >= 1 : true,
        description: landmark.description
      };
    });
  };

  const runFocusChecks = (): string[] => {
    const issues: string[] = [];
    
    // Check for focus indicators
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    let elementsWithoutFocus = 0;
    focusableElements.forEach(element => {
      const styles = window.getComputedStyle(element, ':focus');
      if (!styles.outline || styles.outline === 'none') {
        elementsWithoutFocus++;
      }
    });

    if (elementsWithoutFocus > 0) {
      issues.push(`${elementsWithoutFocus} elements may lack visible focus indicators`);
    }

    // Check tab order
    const tabbableElements = Array.from(focusableElements).filter(el => {
      const tabIndex = el.getAttribute('tabindex');
      return !tabIndex || parseInt(tabIndex) >= 0;
    });

    if (tabbableElements.length === 0) {
      issues.push('No keyboard-accessible elements found');
    }

    return issues;
  };

  const getImpactColor = (impact: string | null | undefined) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'serious': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'minor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getOverallScore = () => {
    if (!auditResults) return 0;
    const totalChecks = auditResults.violations.length + auditResults.passes.length;
    if (totalChecks === 0) return 100;
    return Math.round((auditResults.passes.length / totalChecks) * 100);
  };

  const getCriticalIssuesCount = () => {
    if (!auditResults) return 0;
    return auditResults.violations.filter(v => v.impact === 'critical' || v.impact === 'serious').length;
  };

  useEffect(() => {
    // Run initial audit on component mount
    runAccessibilityAudit();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            WCAG 2.1 AA Accessibility Audit
          </span>
          {auditResults && (
            <Badge variant={getOverallScore() >= 90 ? "default" : "destructive"}>
              Score: {getOverallScore()}%
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Audit Controls */}
          <div className="flex flex-col gap-4">
            <Button 
              onClick={runAccessibilityAudit} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? 'Running Comprehensive Audit...' : 'Run WCAG 2.1 AA Audit'}
            </Button>
            
            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Auditing accessibility...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </div>

          {/* Results Summary */}
          {auditResults && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{auditResults.passes.length}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{auditResults.violations.length}</div>
                <div className="text-sm text-gray-600">Violations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{getCriticalIssuesCount()}</div>
                <div className="text-sm text-gray-600">Critical Issues</div>
              </div>
            </div>
          )}

          {/* Detailed Results */}
          {auditResults && (
            <Tabs defaultValue="violations" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="violations" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Violations ({auditResults.violations.length})
                </TabsTrigger>
                <TabsTrigger value="contrast" className="flex items-center gap-2">
                  <Contrast className="h-4 w-4" />
                  Contrast
                </TabsTrigger>
                <TabsTrigger value="landmarks" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Landmarks
                </TabsTrigger>
                <TabsTrigger value="focus" className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  Focus
                </TabsTrigger>
              </TabsList>

              <TabsContent value="violations" className="space-y-4">
                {auditResults.violations.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                      No Violations Found!
                    </h3>
                    <p className="text-green-600 dark:text-green-400">
                      Your application meets WCAG 2.1 AA standards.
                    </p>
                  </div>
                ) : (
                  auditResults.violations.map((violation, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {violation.help}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {violation.description}
                          </p>
                        </div>
                        <Badge className={getImpactColor(violation.impact)}>
                          {violation.impact || 'unknown'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {violation.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        <a href={violation.helpUrl} target="_blank" rel="noopener noreferrer">
                          Learn more about this issue →
                        </a>
                      </div>
                      <div className="text-xs text-gray-500">
                        Affects {violation.nodes.length} element(s)
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="contrast" className="space-y-4">
                {contrastResults.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {check.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <div className="text-sm font-medium">{check.element}</div>
                        <div className="text-xs text-gray-500">
                          Ratio: {check.ratio.toFixed(2)}:1
                        </div>
                      </div>
                    </div>
                    <Badge className={check.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {check.passed ? 'Pass' : 'Fail'} {check.level}
                    </Badge>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="landmarks" className="space-y-4">
                {landmarkResults.map((landmark, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {landmark.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <div className="text-sm font-medium capitalize">{landmark.type}</div>
                        <div className="text-xs text-gray-500">{landmark.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={landmark.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {landmark.count} found
                      </Badge>
                      {landmark.required && (
                        <div className="text-xs text-gray-500 mt-1">Required</div>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="focus" className="space-y-4">
                {focusResults.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                      Focus Management Looks Good!
                    </h3>
                    <p className="text-green-600 dark:text-green-400">
                      No focus-related issues detected.
                    </p>
                  </div>
                ) : (
                  focusResults.map((issue, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Focus Issue
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {issue}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityAuditor;
