
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Contrast,
  MapPin,
  Keyboard
} from "lucide-react";
import * as axe from 'axe-core';
import { ContrastCheck, LandmarkCheck } from '@/types/accessibility';
import { getImpactColor } from '@/utils/accessibilityChecks';

interface AccessibilityTabsProps {
  auditResults: axe.AxeResults;
  contrastResults: ContrastCheck[];
  landmarkResults: LandmarkCheck[];
  focusResults: string[];
}

const AccessibilityTabs = ({ 
  auditResults, 
  contrastResults, 
  landmarkResults, 
  focusResults 
}: AccessibilityTabsProps) => {
  return (
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
  );
};

export default AccessibilityTabs;
