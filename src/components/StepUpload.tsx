import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';
import { StepUploadProps } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorAlert } from './ErrorAlert';

export const StepUpload: React.FC<StepUploadProps> = ({
  onFileProcessed,
  onError,
  isLoading: externalLoading
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    isLoading, 
    sheetNames, 
    processFile, 
    processSheetData,
    getMockData 
  } = useFileUpload();

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSelectedFile(file);

    try {
      await processFile(file);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar arquivo';
      setError(errorMessage);
      onError({ message: errorMessage });
    }
  }, [processFile, onError]);

  const handleSheetSelect = useCallback(async (sheetName: string) => {
    if (!selectedFile) return;

    setError(null);

    try {
      const { data, filters } = await processSheetData(selectedFile, sheetName);
      onFileProcessed(data, filters, sheetName);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar planilha';
      setError(errorMessage);
      onError({ message: errorMessage });
    }
  }, [selectedFile, processSheetData, onFileProcessed, onError]);

  const handleUseMockData = useCallback(() => {
    const { data, filters } = getMockData();
    onFileProcessed(data, filters, 'Matemática');
  }, [getMockData, onFileProcessed]);

  const isProcessing = isLoading || externalLoading;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          1. Upload da Planilha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <ErrorAlert 
            error={{ message: error }} 
            onDismiss={() => setError(null)}
          />
        )}

        <div className="space-y-2">
          <Label htmlFor="file-upload">
            Escolha o arquivo (.xlsx)
          </Label>
          <div className="relative">
            <Input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={isProcessing}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {isProcessing && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
          {selectedFile && (
            <p className="text-sm text-gray-600">
              Arquivo selecionado: {selectedFile.name}
            </p>
          )}
        </div>

        {sheetNames.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="sheet-select">
              Selecione a aba da planilha
            </Label>
            <Select onValueChange={handleSheetSelect} disabled={isProcessing}>
              <SelectTrigger id="sheet-select">
                <SelectValue placeholder="Escolha uma aba..." />
              </SelectTrigger>
              <SelectContent>
                {sheetNames.map((sheet) => (
                  <SelectItem key={sheet} value={sheet}>
                    {sheet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Modo de desenvolvimento</h4>
              <p className="text-sm text-gray-600">
                Use dados de exemplo para testar a aplicação
              </p>
            </div>
            <Button
              onClick={handleUseMockData}
              variant="outline"
              disabled={isProcessing}
            >
              <Upload className="w-4 h-4 mr-2" />
              Usar dados de exemplo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};