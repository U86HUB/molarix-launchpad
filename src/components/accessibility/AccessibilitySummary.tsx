
import * as axe from 'axe-core';

interface AccessibilitySummaryProps {
  auditResults: axe.AxeResults;
}

const AccessibilitySummary = ({ auditResults }: AccessibilitySummaryProps) => {
  const getCriticalIssuesCount = () => {
    return auditResults.violations.filter(v => v.impact === 'critical' || v.impact === 'serious').length;
  };

  return (
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
  );
};

export default AccessibilitySummary;
