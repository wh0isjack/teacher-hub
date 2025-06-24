// Core data types
export interface AulaData {
  'ANO/SÉRIE': string;
  'BIMESTRE': string;
  'AULA': number;
  'OBJETOS DO CONHECIMENTO': string;
  'CONTEÚDO': string;
  'HABILIDADE': string;
  'COMPONENTE CURRICULAR': string;
  [key: string]: string | number;
}

export interface FilterOptions {
  anosSerie: string[];
  bimestres: string[];
  aulas: string[];
}

export interface SelectedFilters {
  anosSerie: string[];
  bimestres: string[];
  aulas: string[];
}

// Form field types
export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'checkbox' | 'select';
}

export interface WeeklyValues {
  [semana: string]: {
    [fieldId: string]: string;
  };
}

// API response types
export interface UploadSheetsResponse {
  sheetNames: string[];
}

export interface UploadWithFiltersResponse {
  success: boolean;
  filters: FilterOptions;
  data: AulaData[];
  message?: string;
}

export interface ParseFormResponse {
  id: string;
  label: string;
  type: string;
}

// Error types
export interface AppError {
  message: string;
  code?: string;
  details?: string;
}

// Component props types
export interface StepUploadProps {
  onFileProcessed: (data: AulaData[], filters: FilterOptions) => void;
  onError: (error: AppError) => void;
  isLoading: boolean;
}

export interface StepFiltersProps {
  filters: SelectedFilters;
  options: FilterOptions;
  onFiltersChange: (key: keyof SelectedFilters, values: string[]) => void;
}

export interface StepPreviewProps {
  rows: AulaData[];
}

export interface DynamicFormEditorProps {
  fields: FormField[];
  initialValues: Record<string, string>;
  weeklyValues: WeeklyValues;
  formUrl: string;
  onFormUrlChange: (url: string) => void;
  onRefreshFields: () => void;
  isLoadingFields: boolean;
}