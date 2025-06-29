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
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    anosSerie: [],
    bimestres: [],
    aulas: []
  });
  
  // Filter state
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    anosSerie: [],
    bimestre: '',
    aulas: [],
    semana: ''
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
  const handleFileProcessed = useCallback((data: AulaData[], filters: FilterOptions, sheetName?: string) => {
    console.log('🔍 [DEBUG] App received processed data:');
    console.log('📊 Data records:', data.length);
    console.log('📊 Sample data:', data.slice(0, 2));
    console.log('🔍 Filters received:', filters);
    console.log('📋 Sheet name:', sheetName);
    
    setFileData(data);
    setFilterOptions(filters);
    if (sheetName) {
      setSelectedSheet(sheetName);
    }
    setAppError(null);
    
    // Reset filters to empty state
    setSelectedFilters({
      anosSerie: [],
      bimestre: '',
      aulas: [],
      semana: ''
    });
  }, []);

  const handleError = useCallback((error: AppError) => {
    setAppError(error);
  }, []);

  const handleFiltersChange = useCallback((key: keyof SelectedFilters, values: string[]) => {
    if (key === 'bimestre' || key === 'semana') {
      // For single selections, take the first value
      setSelectedFilters(prev => ({ ...prev, [key]: values[0] || '' }));
    } else {
      // For multi selections, use the array
      setSelectedFilters(prev => ({ ...prev, [key]: values }));
    }
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
    const filtered = fileData.filter(row =>
      selectedFilters.anosSerie.includes(row['ANO/SÉRIE']) &&
      (selectedFilters.bimestre === '' || selectedFilters.bimestre === row['BIMESTRE']) &&
      selectedFilters.aulas.includes(String(row['AULA']))
    );
    
    console.log('🔍 [DEBUG] Filtering data:');
    console.log('📊 Total data records:', fileData.length);
    console.log('🔍 Selected filters:', selectedFilters);
    console.log('📊 Filtered results:', filtered.length);
    console.log('📊 Sample filtered data:', filtered.slice(0, 2));
    
    // Debug filter matching
    if (filtered.length === 0 && fileData.length > 0) {
      console.warn('⚠️ No records match current filters');
      console.log('🔍 Debugging filter matches:');
      
      fileData.forEach((row, index) => {
        if (index < 3) { // Only log first 3 for brevity
          console.log(`Record ${index + 1}:`, {
            'ANO/SÉRIE': row['ANO/SÉRIE'],
            'BIMESTRE': row['BIMESTRE'],
            'AULA': row['AULA'],
            'matches_anosSerie': selectedFilters.anosSerie.includes(row['ANO/SÉRIE']),
            'matches_bimestre': selectedFilters.bimestre === '' || selectedFilters.bimestre === row['BIMESTRE'],
            'matches_aulas': selectedFilters.aulas.includes(String(row['AULA']))
          });
        }
      });
    }
    
    return filtered;
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
  const hasFilteredData = filteredRows.length > 0 && (
    selectedFilters.anosSerie.length > 0 || 
    selectedFilters.bimestre !== '' || 
    selectedFilters.aulas.length > 0
  );

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
              fileData={fileData}
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
              formUrl={formUrl}
              onFormUrlChange={handleFormUrlChange}
              onRefreshFields={handleRefreshFields}
              isLoadingFields={isLoadingFields}
              selectedSheet={selectedSheet}
              selectedFilters={selectedFilters}
              filteredRows={filteredRows}
            />
          )}

          {/* Footer */}
          <footer className="text-center py-8 text-gray-500 text-sm">
            <p>Teacher Hub - Desenvolvido com ❤️</p>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}