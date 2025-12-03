import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
}

const Toast = ({ message, type = 'info', isVisible }: ToastProps) => {
  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={cn(
        'px-4 py-3 rounded-lg shadow-lg text-white',
        typeStyles[type]
      )}>
        {message}
      </div>
    </div>
  );
};

export { Toast };