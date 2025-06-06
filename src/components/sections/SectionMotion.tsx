
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionMotionProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionMotion({ children, className }: SectionMotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
