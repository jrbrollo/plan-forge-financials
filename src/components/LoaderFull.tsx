
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderFullProps {
  message?: string;
  debug?: string;
}

export const LoaderFull: React.FC<LoaderFullProps> = ({ 
  message = 'Carregando...', 
  debug 
}) => {
  const [showDebugDetails, setShowDebugDetails] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Add a timer to help with debugging long loading states
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Auto-show debug info after 5 seconds of loading
  useEffect(() => {
    if (elapsedTime >= 5) {
      setShowDebugDetails(true);
    }
  }, [elapsedTime]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
        
        {debug && showDebugDetails && (
          <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-md w-full text-left">
            <p className="text-xs font-medium mb-1">Informações de depuração:</p>
            <p className="text-xs text-gray-500 break-words">{debug}</p>
            <p className="text-xs text-gray-400 mt-2">Tempo carregando: {elapsedTime}s</p>
          </div>
        )}
        
        {!debug && elapsedTime > 10 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-md">
            <p className="text-xs text-yellow-700 dark:text-yellow-400">
              O carregamento está demorando mais do que o esperado. 
              Tente atualizar a página se continuar assim.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
