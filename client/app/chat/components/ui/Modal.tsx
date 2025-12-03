import * as React from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-md w-full mx-4 p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            {title}
          </h3>
        )}
        
        {children}
      </div>
    </div>
  );
};

interface ModalFooterProps {
  children: React.ReactNode;
}

const ModalFooter = ({ children }: ModalFooterProps) => (
  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
    {children}
  </div>
);

export { Modal, ModalFooter };