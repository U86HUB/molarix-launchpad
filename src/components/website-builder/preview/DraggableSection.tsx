
import { useRef, useEffect } from 'react';
import { Section } from '@/types/website';
import { cn } from '@/lib/utils';

interface DraggableSectionProps {
  section: Section;
  isActive: boolean;
  isVisible: boolean;
  children: React.ReactNode;
  onRegister: (sectionId: string, element: HTMLElement | null) => void;
  onReorder: (draggedId: string, targetId: string, position: 'before' | 'after') => void;
}

const DraggableSection = ({
  section,
  isActive,
  isVisible,
  children,
  onRegister,
  onReorder,
}: DraggableSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onRegister(section.id, sectionRef.current);
    return () => onRegister(section.id, null);
  }, [section.id, onRegister]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', section.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    
    if (draggedId === section.id) return;

    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;

    const midPoint = rect.top + rect.height / 2;
    const position = e.clientY < midPoint ? 'before' : 'after';
    
    onReorder(draggedId, section.id, position);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={sectionRef}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'transition-all duration-200 relative group',
        isActive && 'ring-2 ring-blue-500 ring-opacity-50',
        'hover:ring-1 hover:ring-gray-300'
      )}
    >
      {/* Drag indicator */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-8 bg-blue-500 rounded-full cursor-grab active:cursor-grabbing" />
      </div>
      
      {/* Active section indicator */}
      {isActive && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Active
        </div>
      )}
      
      {children}
    </div>
  );
};

export default DraggableSection;
