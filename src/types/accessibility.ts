
export interface AccessibilityResult {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical' | null;
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  nodes: any[];
}

export interface ContrastCheck {
  element: string;
  foreground: string;
  background: string;
  ratio: number;
  passed: boolean;
  level: 'AA' | 'AAA';
}

export interface LandmarkCheck {
  type: string;
  count: number;
  required: boolean;
  passed: boolean;
  description: string;
}
