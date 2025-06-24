import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { AppError } from '../types';

interface ErrorAlertProps {
  error: AppError;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  onDismiss, 
  className = '' 
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Erro
          </h3>
          <p className="mt-1 text-sm text-red-700">
            {error.message}
          </p>
          {error.details && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-red-600 hover:text-red-800">
                Ver detalhes
              </summary>
              <pre className="mt-1 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
                {error.details}
              </pre>
            </details>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 text-red-400 hover:text-red-600 transition-colors"
            aria-label="Fechar erro"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};