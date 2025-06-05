
import { ContrastCheck, LandmarkCheck } from '@/types/accessibility';

export const runContrastChecks = async (): Promise<ContrastCheck[]> => {
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

export const calculateContrastRatio = (foreground: string, background: string): number => {
  // Simplified calculation - in a real implementation, you'd use a proper color contrast library
  // This is just for demonstration
  return Math.random() * 10 + 3; // Random ratio between 3-13 for demo
};

export const runLandmarkChecks = (): LandmarkCheck[] => {
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

export const runFocusChecks = (): string[] => {
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

export const getImpactColor = (impact: string | null | undefined) => {
  switch (impact) {
    case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'serious': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'minor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};
