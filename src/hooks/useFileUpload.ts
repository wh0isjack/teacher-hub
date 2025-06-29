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
    
    console.log('🔍 [DEBUG] Starting file processing...');
    console.log('📁 File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified)
    });
    
    try {
      const buffer = await file.arrayBuffer();
      console.log('📊 Buffer size:', buffer.byteLength);
      
      const workbook = XLSX.read(buffer, { type: 'array' });
      const names = workbook.SheetNames;
      
      console.log('📋 Sheet names found:', names);
      console.log('📋 Total sheets:', names.length);
      
      setSheetNames(names);
      return names;
    } catch (error) {
      console.error('❌ [ERROR] File processing failed:', error);
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
    
    console.log('🔍 [DEBUG] Starting sheet data processing...');
    console.log('📋 Selected sheet:', sheetName);
    
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      if (!workbook.SheetNames.includes(sheetName)) {
        console.error('❌ Sheet not found:', sheetName);
        console.log('📋 Available sheets:', workbook.SheetNames);
        throw new AppError({
          message: 'Aba não encontrada no arquivo',
          code: 'SHEET_NOT_FOUND'
        });
      }

      const worksheet = workbook.Sheets[sheetName];
      console.log('📊 Worksheet object:', worksheet);
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
      
      console.log('📊 Raw JSON data (first 5 rows):', jsonData.slice(0, 5));
      console.log('📊 Total rows in sheet:', jsonData.length);
      
      if (jsonData.length < 2) {
        console.error('❌ Insufficient data - only', jsonData.length, 'rows found');
        throw new AppError({
          message: 'Arquivo não contém dados suficientes',
          code: 'INSUFFICIENT_DATA'
        });
      }

      const headers = jsonData[0];
      const rows = jsonData.slice(1);

      console.log('📋 Headers found:', headers);
      console.log('📋 Number of headers:', headers.length);
      console.log('📊 Data rows count:', rows.length);
      console.log('📊 Sample data rows (first 3):', rows.slice(0, 3));

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

      console.log('📊 Structured data sample (first 3 items):', structuredData.slice(0, 3));
      console.log('📊 Total structured records:', structuredData.length);
      console.log('📊 Records with AULA field:', structuredData.filter(r => r['AULA'] != null).length);

      // Generate filter options
      const filters: FilterOptions = {
        anosSerie: [...new Set(structuredData.map(r => r['ANO/SÉRIE']))].filter(Boolean),
        bimestres: [...new Set(structuredData.map(r => r['BIMESTRE']))].filter(Boolean),
        aulas: [...new Set(structuredData.map(r => String(r['AULA'])))].filter(Boolean),
        semanas: [] // Will be populated dynamically based on bimestre selection
      };

      console.log('🔍 Generated filters:', filters);
      console.log('📊 Filter breakdown:');
      console.log('  - Anos/Série:', filters.anosSerie);
      console.log('  - Bimestres:', filters.bimestres);
      console.log('  - Aulas:', filters.aulas);
      
      // Debug: Check for common column name variations
      const allColumns = Object.keys(structuredData[0] || {});
      console.log('📋 All column names found:', allColumns);
      
      // Check for potential issues
      const emptyAulaRecords = structuredData.filter(r => !r['AULA']);
      if (emptyAulaRecords.length > 0) {
        console.warn('⚠️ Records without AULA field:', emptyAulaRecords.length);
        console.log('📊 Sample records without AULA:', emptyAulaRecords.slice(0, 2));
      }
      
      setSelectedSheet(sheetName);
      console.log('✅ Sheet processing completed successfully');
      return { data: structuredData, filters };
    } catch (error) {
      console.error('❌ [ERROR] Sheet processing failed:', error);
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