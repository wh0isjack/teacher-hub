import { useState, useEffect, useCallback } from 'react';
import { FormField, AppError } from '../types';

// Mock form fields for development (since we can't access localhost:3001)
const MOCK_FORM_FIELDS: FormField[] = [
  { id: 'entry.1234567890', label: 'PROFESSOR(A)', type: 'text' },
  { id: 'entry.2345678901', label: 'DISCIPLINA', type: 'text' },
  { id: 'entry.3456789012', label: 'ANO/SÉRIE', type: 'select' },
  { id: 'entry.4567890123', label: 'TURMA', type: 'text' },
  { id: 'entry.5678901234', label: 'BIMESTRE', type: 'select' },
  { id: 'entry.6789012345', label: 'MÊS', type: 'select' },
];

export const useFormFields = (formUrl: string) => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const fetchFormFields = useCallback(async () => {
    if (!formUrl || !formUrl.includes('docs.google.com/forms/')) {
      setError({ message: 'URL inválida de Google Forms' });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real environment, this would call the backend
      // For now, we'll use mock data with a delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFields(MOCK_FORM_FIELDS);
    } catch (err) {
      const error: AppError = {
        message: err instanceof Error ? err.message : 'Erro desconhecido ao buscar campos do formulário',
        code: 'FETCH_FORM_FIELDS_ERROR'
      };
      setError(error);
      console.error('Error fetching form fields:', err);
    } finally {
      setIsLoading(false);
    }
  }, [formUrl]);

  useEffect(() => {
    if (formUrl) {
      fetchFormFields();
    }
  }, [fetchFormFields]);

  return {
    fields,
    isLoading,
    error,
    refetch: fetchFormFields
  };
};