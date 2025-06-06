import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface RenderEvent {
  timestamp: number;
  location: string;
  renderCount: number;
}

// Hook to monitor and guard against suspicious re-renders that might cause duplicates
export const usePageRenderGuard = (pageName: string) => {
  const location = useLocation();
  const renderTracker = useRef<{
    renderCount: number;
    lastRender: number;
    history: RenderEvent[];
  }>({
    renderCount: 0,
    lastRender: 0,
    history: []
  });

  useEffect(() => {
    const now = Date.now();
    renderTracker.current.renderCount += 1;
    
    const timeSinceLastRender = now - renderTracker.current.lastRender;
    renderTracker.current.lastRender = now;

    const renderEvent: RenderEvent = {
      timestamp: now,
      location: location.pathname,
      renderCount: renderTracker.current.renderCount
    };

    renderTracker.current.history.push(renderEvent);

    // Keep only last 10 renders
    if (renderTracker.current.history.length > 10) {
      renderTracker.current.history.shift();
    }

    console.log(`🔍 [${pageName}] Render #${renderTracker.current.renderCount}`);
    console.log(`🔍 [${pageName}] Location: ${location.pathname}`);
    console.log(`🔍 [${pageName}] Time since last render: ${timeSinceLastRender}ms`);

    // Warn about suspicious rapid renders
    if (timeSinceLastRender < 100 && renderTracker.current.renderCount > 1) {
      console.warn(`⚠️ [${pageName}] Rapid re-render detected! This might cause duplicate operations.`);
    }

    // Warn about excessive renders
    if (renderTracker.current.renderCount > 5) {
      console.warn(`⚠️ [${pageName}] High render count (${renderTracker.current.renderCount}). Check for infinite render loops.`);
      console.log(`🔍 [${pageName}] Render history:`, renderTracker.current.history);
    }
  }, [location.pathname, pageName]);

  return {
    renderCount: renderTracker.current.renderCount,
    getRenderHistory: () => renderTracker.current.history,
    isRapidRender: () => {
      const now = Date.now();
      return (now - renderTracker.current.lastRender) < 100;
    }
  };
};
