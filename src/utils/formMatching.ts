import { FormField, AulaData } from '../types';

/**
 * Normalizes a string for comparison by removing accents, special characters,
 * and converting to lowercase
 */
function normalize(str: string | undefined | null): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .toLowerCase()
    .trim();
}

/**
 * Matches form fields with aula data based on label similarity
 */
export function matchFormFieldsWithAula(
  formFields: FormField[], 
  aulaRow: AulaData
): Record<string, string> {
  const result: Record<string, string> = {};

  const WEEKLY_LABELS = [
    'DATA DA AULA DA SEMANA',
    'CONTEÚDOS/OBJETOS DE CONHECIMENTO',
    'HABILIDADES',
    'NÚMERO DE AULA PREVISTA',
    'UNIDADE TEMÁTICA'
  ];

  formFields.forEach((field) => {
    const normalizedLabel = normalize(field.label);
    const fieldType = field.type;
    let matched = false;

    // Try to match with data columns
    for (const [column, value] of Object.entries(aulaRow)) {
      const normalizedColumn = normalize(column);
      const normalizedValue = normalize(String(value));

      // Match by label-column similarity
      if (normalizedLabel.includes(normalizedColumn) || normalizedColumn.includes(normalizedLabel)) {
        result[field.id] = String(value || '');
        matched = true;
        break;
      }

      // Match by value content (mainly for checkboxes)
      if (fieldType === 'checkbox' && normalizedLabel.includes(normalizedValue)) {
        result[field.id] = String(value || '');
        matched = true;
        break;
      }
    }

    // Fallback: set empty string for weekly fields to ensure visibility in UI
    if (!matched && WEEKLY_LABELS.some(label => 
      normalize(label) === normalizedLabel
    )) {
      result[field.id] = '';
    }
  });

  return result;
}

/**
 * Generates weekly values for form fields based on filtered data
 */
export function generateWeeklyValues(
  filteredRows: AulaData[]
): Record<string, Record<string, string>> {
  const weeklyValues: Record<string, Record<string, string>> = {};

  filteredRows.forEach((row, index) => {
    const semanaKey = `SEMANA ${index + 1}`;
    
    weeklyValues[semanaKey] = {
      'entry.data_aula': '',
      'entry.conteudos': `${row['OBJETOS DO CONHECIMENTO'] || ''} — ${row['CONTEÚDO'] || ''}`,
      'entry.habilidades': row['HABILIDADE'] || '',
      'entry.numero_aula': String(row['AULA'] || ''),
      'entry.desenvolvimento': 'Preenchido manualmente',
      'entry.tematica': row['UNIDADE TEMÁTICA' || ''],
      'entry.pedagogia': 'Preenchido manualmente',
      'entry.avaliacao': 'Preenchido manualmente'
    };
  });

  return weeklyValues;
}