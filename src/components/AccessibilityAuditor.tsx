
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye } from "lucide-react";
import * as axe from 'axe-core';
import { ContrastCheck, LandmarkCheck } from '@/types/accessibility';
import { runContrastChecks, runLandmarkChecks, runFocusChecks } from '@/utils/accessibilityChecks';
import AccessibilitySummary from './accessibility/AccessibilitySummary';
import AccessibilityTabs from './accessibility/AccessibilityTabs';

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

  const getOverallScore = () => {
    if (!auditResults) return 0;
    const totalChecks = auditResults.violations.length + auditResults.passes.length;
    if (totalChecks === 0) return 100;
    return Math.round((auditResults.passes.length / totalChecks) * 100);
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
            <AccessibilitySummary auditResults={auditResults} />
          )}

          {/* Detailed Results */}
          {auditResults && (
            <AccessibilityTabs 
              auditResults={auditResults}
              contrastResults={contrastResults}
              landmarkResults={landmarkResults}
              focusResults={focusResults}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityAuditor;
