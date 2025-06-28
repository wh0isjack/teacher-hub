// Core data types
export interface AulaData {
  'ANO/SÉRIE': string;
  BIMESTRE: string;
  AULA: number;
  'OBJETOS DO CONHECIMENTO': string;
  CONTEÚDO: string;
  HABILIDADE: string;
  'COMPONENTE CURRICULAR': string;
  [key: string]: string | number;
}

export interface FilterOptions {
  anosSerie: string[];
  bimestres: string[];
  aulas: string[];
  semanas: string[];
}

export interface SelectedFilters {
  anosSerie: string[];
  bimestre: string; // Changed to single selection
  aulas: string[];
  semana: string; // Single selection
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
export class AppError extends Error {
  code?: string;
  details?: string;
  constructor({
    message,
    code,
    details,
  }: {
    message: string;
    code?: string;
    details?: string;
  }) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'AppError';
  }
}

// Component props types
export interface StepUploadProps {
  onFileProcessed: (data: AulaData[], filters: FilterOptions, sheetName?: string) => void;
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
  selectedSheet?: string;
  selectedFilters?: SelectedFilters;
}
