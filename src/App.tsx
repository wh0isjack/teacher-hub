import React, { useState, useCallback, useMemo } from 'react';
import { StepUpload } from './components/StepUpload';
import { StepFilters } from './components/StepFilters';
import { StepPreview } from './components/StepPreview';
import { DynamicFormEditor } from './components/DynamicFormEditor';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorAlert } from './components/ErrorAlert';
import { useFormFields } from './hooks/useFormFields';
import { matchFormFieldsWithAula, generateWeeklyValues } from './utils/formMatching';
import { 
  AulaData, 
  FilterOptions, 
  SelectedFilters, 
  AppError,
  FormField 
} from './types';

// Hardcoded weekly fields for the form editor
const HARDCODED_WEEKLY_FIELDS: FormField[] = [
  {
    id: 'entry.data_aula',
    label: 'DATA DA AULA DA SEMANA',
    type: 'text',
  },
  {
    id: 'entry.conteudos',
    label: 'CONTEÚDOS/OBJETOS DE CONHECIMENTO',
    type: 'text',
  },
  {
    id: 'entry.habilidades',
    label: 'HABILIDADES',
    type: 'text',
  },
  {
    id: 'entry.desenvolvimento',
    label: 'DESENVOLVIMENTO DA AULA (Estratégias e Recursos Pedagógicos)',
    type: 'textarea',
  },
  {
    id: 'entry.pedagogia',
    label: 'QUAL PEDAGOGIA ATIVA SERÁ UTILIZADA?',
    type: 'textarea',
  },
  {
    id: 'entry.avaliacao',
    label: 'AVALIAÇÃO',
    type: 'textarea',
  }
];

export function App() {
  // Data state
  const [fileData, setFileData] = useState<AulaData[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    anosSerie: [],
    bimestres: [],
    aulas: []
  });
  
  // Filter state
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    anosSerie: [],
    bimestres: [],
    aulas: []
  });

  // Form state
  const [formUrl, setFormUrl] = useState<string>(
    'https://docs.google.com/forms/d/e/1FAIpQLScqw6mOlnekxeqrgnVdd308OvH8py-7R84BcMhlvv9W1pS_Kw/viewform'
  );

  // Error state
  const [appError, setAppError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields hook
  const { fields: formFields, isLoading: isLoadingFields, error: formError, refetch } = useFormFields(formUrl);

  // Handlers
  const handleFileProcessed = useCallback((data: AulaData[], filters: FilterOptions) => {
    setFileData(data);
    setFilterOptions(filters);
    setAppError(null);
    
    // Auto-select all available options
    setSelectedFilters({
      anosSerie: filters.anosSerie,
      bimestres: filters.bimestres,
      aulas: filters.aulas
    });
  }, []);

  const handleError = useCallback((error: AppError) => {
    setAppError(error);
  }, []);

  const handleFiltersChange = useCallback((key: keyof SelectedFilters, values: string[]) => {
    setSelectedFilters(prev => ({ ...prev, [key]: values }));
  }, []);

  const handleFormUrlChange = useCallback((url: string) => {
    setFormUrl(url);
    setAppError(null);
  }, []);

  const handleRefreshFields = useCallback(() => {
    setAppError(null);
    refetch();
  }, [refetch]);

  // Computed values
  const filteredRows = useMemo(() => {
    return fileData.filter(row =>
      selectedFilters.anosSerie.includes(row['ANO/SÉRIE']) &&
      selectedFilters.bimestres.includes(row['BIMESTRE']) &&
      selectedFilters.aulas.includes(String(row['AULA']))
    );
  }, [fileData, selectedFilters]);

  const allFormFields = useMemo(() => {
    return [...formFields, ...HARDCODED_WEEKLY_FIELDS];
  }, [formFields]);

  const formInitialValues = useMemo(() => {
    if (filteredRows.length === 0) return {};
    return matchFormFieldsWithAula(formFields, filteredRows[0]);
  }, [formFields, filteredRows]);

  const weeklyValues = useMemo(() => {
    return generateWeeklyValues(filteredRows);
  }, [filteredRows]);

  const hasData = fileData.length > 0;
  const hasFilters = hasData && (
    filterOptions.anosSerie.length > 0 || 
    filterOptions.bimestres.length > 0 || 
    filterOptions.aulas.length > 0
  );
  const hasFilteredData = filteredRows.length > 0;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Header */}
          <header className="text-center py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Teacher Hub
            </h1>
            <p className="text-gray-600">
              Ferramenta para processamento de planilhas e preenchimento de formulários educacionais
            </p>
          </header>

          {/* Global Error */}
          {appError && (
            <ErrorAlert 
              error={appError} 
              onDismiss={() => setAppError(null)}
            />
          )}

          {/* Form Error */}
          {formError && (
            <ErrorAlert 
              error={formError} 
              onDismiss={() => setAppError(null)}
            />
          )}

          {/* Step 1: Upload */}
          <StepUpload
            onFileProcessed={handleFileProcessed}
            onError={handleError}
            isLoading={isLoading}
          />

          {/* Step 2: Filters */}
          {hasFilters && (
            <StepFilters
              filters={selectedFilters}
              options={filterOptions}
              onFiltersChange={handleFiltersChange}
            />
          )}

          {/* Step 3: Preview */}
          {hasFilteredData && (
            <StepPreview rows={filteredRows} />
          )}

          {/* Step 4: Form Editor */}
          {hasFilteredData && (
            <DynamicFormEditor
              fields={allFormFields}
              initialValues={formInitialValues}
              weeklyValues={weeklyValues}
              formUrl={formUrl}
              onFormUrlChange={handleFormUrlChange}
              onRefreshFields={handleRefreshFields}
              isLoadingFields={isLoadingFields}
            />
          )}

          {/* Footer */}
          <footer className="text-center py-8 text-gray-500 text-sm">
            <p>Teacher Hub - Desenvolvido para facilitar o trabalho educacional</p>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}