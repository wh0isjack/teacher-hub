import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { AulaData, FilterOptions, AppError, UploadSheetsResponse, UploadWithFiltersResponse } from '../types';

// Mock data for development
const MOCK_AULA_DATA: AulaData[] = [
  {
    'ANO/SÉRIE': '1º Ano',
    'BIMESTRE': '1º Bimestre',
    'AULA': 1,
    'OBJETOS DO CONHECIMENTO': 'Números e operações',
    'CONTEÚDO': 'Adição e subtração',
    'HABILIDADE': 'EF01MA06',
    'COMPONENTE CURRICULAR': 'Matemática'
  },
  {
    'ANO/SÉRIE': '1º Ano',
    'BIMESTRE': '1º Bimestre',
    'AULA': 2,
    'OBJETOS DO CONHECIMENTO': 'Números e operações',
    'CONTEÚDO': 'Multiplicação básica',
    'HABILIDADE': 'EF01MA07',
    'COMPONENTE CURRICULAR': 'Matemática'
  },
  {
    'ANO/SÉRIE': '2º Ano',
    'BIMESTRE': '2º Bimestre',
    'AULA': 1,
    'OBJETOS DO CONHECIMENTO': 'Geometria',
    'CONTEÚDO': 'Formas geométricas',
    'HABILIDADE': 'EF02MA14',
    'COMPONENTE CURRICULAR': 'Matemática'
  }
];

export const useFileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');

  const processFile = useCallback(async (file: File): Promise<string[]> => {
    setIsLoading(true);
    
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const names = workbook.SheetNames;
      
      setSheetNames(names);
      return names;
    } catch (error) {
      throw new AppError({
        message: 'Erro ao processar o arquivo Excel',
        code: 'FILE_PROCESSING_ERROR',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processSheetData = useCallback(async (
    file: File, 
    sheetName: string
  ): Promise<{ data: AulaData[], filters: FilterOptions }> => {
    setIsLoading(true);
    
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      if (!workbook.SheetNames.includes(sheetName)) {
        throw new AppError({
          message: 'Aba não encontrada no arquivo',
          code: 'SHEET_NOT_FOUND'
        });
      }

      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
      
      if (jsonData.length < 2) {
        throw new AppError({
          message: 'Arquivo não contém dados suficientes',
          code: 'INSUFFICIENT_DATA'
        });
      }

      const headers = jsonData[0];
      const rows = jsonData.slice(1);

      // Convert to structured data
      const structuredData: AulaData[] = rows
        .map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header?.trim()] = row[index];
          });
          return obj;
        })
        .filter(row => row['AULA'] != null)
        .map(row => ({
          ...row,
          'COMPONENTE CURRICULAR': row['COMPONENTE CURRICULAR']?.trim() || sheetName
        }));

      // Generate filter options
      const filters: FilterOptions = {
        anosSerie: [...new Set(structuredData.map(r => r['ANO/SÉRIE']))].filter(Boolean),
        bimestres: [...new Set(structuredData.map(r => r['BIMESTRE']))].filter(Boolean),
        aulas: [...new Set(structuredData.map(r => String(r['AULA'])))].filter(Boolean),
        semanas: [] // Will be populated dynamically based on bimestre selection
      };

      setSelectedSheet(sheetName);
      return { data: structuredData, filters };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        message: 'Erro ao processar dados da planilha',
        code: 'SHEET_PROCESSING_ERROR',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // For development, return mock data
  const getMockData = useCallback((): { data: AulaData[], filters: FilterOptions } => {
    const filters: FilterOptions = {
      anosSerie: [...new Set(MOCK_AULA_DATA.map(r => r['ANO/SÉRIE']))],
      bimestres: [...new Set(MOCK_AULA_DATA.map(r => r['BIMESTRE']))],
      aulas: [...new Set(MOCK_AULA_DATA.map(r => String(r['AULA'])))],
      semanas: []
    };

    return { data: MOCK_AULA_DATA, filters };
  }, []);

  return {
    isLoading,
    sheetNames,
    selectedSheet,
    processFile,
    processSheetData,
    getMockData
  };
};