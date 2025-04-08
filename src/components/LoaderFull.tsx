
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderFullProps {
  message?: string;
  debug?: string;
}

export const LoaderFull: React.FC<LoaderFullProps> = ({ 
  message = 'Carregando...', 
  debug 
}) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
        {debug && <p className="text-xs text-gray-500 mt-2">{debug}</p>}
      </div>
    </div>
  );
};
