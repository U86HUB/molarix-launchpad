
import { SectionMotion } from './SectionMotion';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export interface ChatWidgetProps {
  tidioKey?: string;
  widgetPosition?: 'left' | 'right';
  primaryColor?: string;
}

export function ChatWidget({
  tidioKey = '',
  widgetPosition = 'right',
  primaryColor = '#0066cc'
}: ChatWidgetProps) {
  const hasTidioKey = !!tidioKey;

  // Load Tidio script when component mounts
  useEffect(() => {
    if (!hasTidioKey) return;

    // Add Tidio script
    const script = document.createElement('script');
    script.src = `//code.tidio.co/${tidioKey}.js`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up by removing the script if component unmounts
      const tidioScript = document.querySelector(`script[src*="${tidioKey}.js"]`);
      if (tidioScript && tidioScript.parentNode) {
        tidioScript.parentNode.removeChild(tidioScript);
      }
    };
  }, [tidioKey, hasTidioKey]);

  // Function to handle fallback chat button click when Tidio is not available
  const handleFallbackChatClick = () => {
    window.location.href = '#contact';
  };

  if (!hasTidioKey) {
    return (
      <div className={`fixed bottom-6 ${widgetPosition === 'right' ? 'right-6' : 'left-6'} z-50`}>
        <SectionMotion>
          <Button 
            onClick={handleFallbackChatClick}
            className="flex items-center gap-2 rounded-full shadow-md"
            style={{ backgroundColor: primaryColor }}
            size="lg"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Chat with us</span>
          </Button>
        </SectionMotion>
      </div>
    );
  }

  // If Tidio is configured, it will inject its own chat widget so we don't need to render anything here
  return null;
}
