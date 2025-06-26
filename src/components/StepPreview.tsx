import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Eye, EyeOff, FileText } from 'lucide-react';
import { StepPreviewProps } from '../types';

export const StepPreview: React.FC<StepPreviewProps> = ({ rows }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (rows.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            3. Pré-visualização dos Dados
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Ocultar
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Expandir
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{rows.length} registro(s) encontrado(s)</span>
            <span>
              Colunas: {Object.keys(rows[0] || {}).length}
            </span>
          </div>

          {isExpanded ? (
            <ScrollArea className="h-96 w-full">
              <div className="space-y-4">
                {rows.map((row, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="font-medium text-gray-900 mb-2">
                      Registro {index + 1}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {Object.entries(row).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="font-medium text-gray-700">
                            {key}:
                          </span>
                          <span className="text-gray-600 break-words">
                            {String(value || '-')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                Clique em "Expandir" para visualizar os dados detalhados
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};