import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Copy, Check, Edit3, RefreshCw, ExternalLink } from 'lucide-react';
import { DynamicFormEditorProps } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorAlert } from './ErrorAlert';
import { SEMANA_MAPPING } from '../utils/semanaMapping';

export const DynamicFormEditor: React.FC<DynamicFormEditorProps> = ({
  fields,
  initialValues,
  filteredRows,
  formUrl,
  onFormUrlChange,
  onRefreshFields,
  isLoadingFields,
  selectedSheet,
  selectedFilters
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initialData = Object.fromEntries(
      fields.map(field => [field.id, initialValues[field.id] || ''])
    );
    
    // Auto-populate DISCIPLINA with selected sheet name
    const disciplinaField = fields.find(f => 
      f.label.toUpperCase().includes('DISCIPLINA')
    );
    if (disciplinaField && selectedSheet) {
      initialData[disciplinaField.id] = selectedSheet;
    }
    
    return initialData;
  });
  
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Helper function to get shortened date range
  const getShortenedDateRange = useCallback((semana: string, bimestre: string): string => {
    const bimestreNumber = bimestre.split('º')[0];
    const semanas = SEMANA_MAPPING[bimestreNumber] || {};
    const fullDateRange = semanas[semana];
    
    if (!fullDateRange) return '';
    
    // Convert "03/02/2025 - 07/02/2025" to "03/02 - 07/02"
    const dates = fullDateRange.split(' - ');
    if (dates.length === 2) {
      const startDate = dates[0].substring(0, 5); // Get DD/MM part
      const endDate = dates[1].substring(0, 5);   // Get DD/MM part
      return `${startDate} - ${endDate}`;
    }
    
    return fullDateRange;
  }, []);
  const handleChange = useCallback((id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  }, []);

  const copyToClipboard = useCallback(async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, []);

  const isWeeklyField = useCallback((label: string): boolean => {
    const weeklyLabels = [
      'DATA DA AULA DA SEMANA',
      'CONTEÚDOS/OBJETOS DE CONHECIMENTO',
      'HABILIDADES',
      'UNIDADE TEMÁTICA',
      'NÚMERO DE AULA PREVISTA',
      'DESENVOLVIMENTO DA AULA (ESTRATÉGIAS E RECURSOS PEDAGÓGICOS)',
      'QUAL PEDAGOGIA ATIVA SERÁ UTILIZADA?',
      'AVALIAÇÃO'
    ];
    return weeklyLabels.includes(label.trim().toUpperCase());
  }, []);

  // Filter out PROFESSOR and TURMA fields from global fields
  const globalFields = fields.filter(field => {
    const label = field.label.toUpperCase();
    const isWeekly = isWeeklyField(field.label);
    const isExcluded = label.includes('PROFESSOR') || label.includes('TURMA');
    return !isWeekly && !isExcluded;
  });
  
  const weeklyFields = fields.filter(field => isWeeklyField(field.label));

  const renderField = useCallback((field: any, value: string, onChange?: (value: string) => void) => {
    const isReadOnly = !onChange;
    
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            readOnly={isReadOnly}
            className={`min-h-[80px] ${isReadOnly ? 'bg-gray-50' : 'bg-white'}`}
            placeholder={isReadOnly ? 'Dados da planilha' : 'Digite aqui...'}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={onChange ? (e) => onChange(e.target.checked ? 'true' : '') : undefined}
              disabled={isReadOnly}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">
              {value || 'Não preenchido'}
            </span>
          </div>
        );
      
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            readOnly={isReadOnly}
            className={isReadOnly ? 'bg-gray-50' : 'bg-white'}
            placeholder={isReadOnly ? 'Dados da planilha' : 'Digite aqui...'}
          />
        );
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            4. Editor de Respostas do Formulário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="form-url">URL do Google Forms</Label>
            <div className="flex gap-2">
              <Input
                id="form-url"
                type="url"
                value={formUrl}
                onChange={(e) => onFormUrlChange(e.target.value)}
                placeholder="https://docs.google.com/forms/d/..."
                className="flex-1"
              />
              <Button
                onClick={onRefreshFields}
                disabled={isLoadingFields}
                variant="outline"
                size="sm"
              >
                {isLoadingFields ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
              {formUrl && (
                <Button
                  onClick={() => window.open(formUrl, '_blank')}
                  variant="outline"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {isLoadingFields && (
            <LoadingSpinner text="Carregando campos do formulário..." />
          )}
        </CardContent>
      </Card>

      {/* Global Fields */}
      {globalFields.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Campos Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {globalFields.map(field => (
                <div key={field.id} className="space-y-2">
                  <Label className="font-medium text-gray-800">
                    {field.label}
                  </Label>
                  {renderField(
                    field,
                    formData[field.id] || '',
                    (value) => handleChange(field.id, value)
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Sections */}
      {weeklyFields.length > 0 && selectedFilters?.semana && filteredRows.length > 0 && (
        <div className="space-y-4">
          <Card className="w-full border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">
                {selectedFilters.semana}
                {selectedFilters.bimestre && selectedFilters.semana && (
                  <span className="text-sm font-normal text-blue-700 ml-2">
                    ({getShortenedDateRange(selectedFilters.semana, selectedFilters.bimestre)})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {filteredRows.map((aulaRow, index) => (
                <div key={`aula-${aulaRow.AULA}`} className="bg-white p-4 rounded-lg border border-blue-100">
                  <h3 className="text-md font-semibold text-blue-800 mb-4">
                    AULA {aulaRow.AULA}
                  </h3>
                  <div className="grid gap-4">
                    {weeklyFields.map(field => {
                      const fieldKey = `${selectedFilters.semana}-aula-${aulaRow.AULA}-${field.id}`;
                      let fieldValue = '';
                      
                      // Special handling for DATA DA AULA DA SEMANA
                      if (field.label.toUpperCase().includes('DATA DA AULA DA SEMANA')) {
                        if (selectedFilters?.semana && selectedFilters?.bimestre) {
                          fieldValue = getShortenedDateRange(selectedFilters.semana, selectedFilters.bimestre);
                        }
                      } 
                      // Special handling for CONTEÚDOS/OBJETOS DE CONHECIMENTO
                      else if (field.label.toUpperCase().includes('CONTEÚDOS') || field.label.toUpperCase().includes('OBJETOS DE CONHECIMENTO')) {
                        const objetos = aulaRow['OBJETOS DO CONHECIMENTO'] || '';
                        const conteudo = aulaRow['CONTEÚDO'] || '';
                        fieldValue = `${objetos}${objetos && conteudo ? ' — ' : ''}${conteudo}`;
                      }
                      // Special handling for HABILIDADES
                      else if (field.label.toUpperCase().includes('HABILIDADES')) {
                        fieldValue = aulaRow['HABILIDADE'] || '';
                      }
                      // Default to empty for manual fields
                      else {
                        fieldValue = '';
                      }

                      return (
                        <div key={fieldKey} className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            {field.label}
                          </Label>
                          <div className="relative">
                            {renderField(field, fieldValue)}
                            {fieldValue && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 h-6 w-6 p-0"
                                onClick={() => copyToClipboard(fieldValue, fieldKey)}
                              >
                                {copiedField === fieldKey ? (
                                  <Check className="w-3 h-3 text-green-600" />
                                ) : (
                                  <Copy className="w-3 h-3 text-gray-400" />
                                )}
                              </Button>
                            )}
                            {copiedField === fieldKey && (
                              <div className="absolute -top-8 right-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded shadow-sm">
                                Copiado!
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {fields.length === 0 && !isLoadingFields && (
        <Card className="w-full">
          <CardContent className="py-8">
            <div className="text-center text-gray-500">
              <Edit3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum campo de formulário encontrado.</p>
              <p className="text-sm">Verifique a URL do Google Forms e tente novamente.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};