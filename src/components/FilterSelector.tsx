import React from 'react';
import { MultiSelect } from './ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { FilterOptions, SelectedFilters } from '../types';
import { getSemanaOptions } from '../utils/semanaMapping';
import { getLessonsForWeek } from '../utils/lessonDistribution';

interface FilterSelectorProps {
  selectedFilters: SelectedFilters;
  options: FilterOptions;
  onFiltersChange: (key: keyof SelectedFilters, values: string[]) => void;
  onSingleFilterChange: (key: keyof SelectedFilters, value: string) => void;
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({
  selectedFilters,
  options,
  onFiltersChange,
  onSingleFilterChange
}) => {
  const semanaOptions = selectedFilters.bimestre ? getSemanaOptions(selectedFilters.bimestre) : [];
  
  // Calculate total lessons for selected filters
  const totalLessonsInBimester = React.useMemo(() => {
    if (!selectedFilters.bimestre || selectedFilters.anosSerie.length === 0) return 0;
    
    // Count lessons that match the selected ano/serie and bimestre
    // This would typically come from your data, but for now we'll use the available aulas
    return options.aulas.length;
  }, [selectedFilters.bimestre, selectedFilters.anosSerie, options.aulas]);
  
  // Auto-select lessons when semana changes
  React.useEffect(() => {
    if (selectedFilters.bimestre && selectedFilters.semana && totalLessonsInBimester > 0) {
      const lessonsForWeek = getLessonsForWeek(
        selectedFilters.bimestre,
        selectedFilters.semana,
        totalLessonsInBimester
      );
      
      // Convert lesson numbers to strings and filter by available options
      const availableLessons = lessonsForWeek
        .map(String)
        .filter(lesson => options.aulas.includes(lesson));
      
      onFiltersChange('aulas', availableLessons);
    }
  }, [selectedFilters.bimestre, selectedFilters.semana, totalLessonsInBimester, options.aulas, onFiltersChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="space-y-2">
        <Label htmlFor="anos-serie-filter">Ano/Série</Label>
        <MultiSelect
          options={options.anosSerie.map(value => ({ label: value, value }))}
          selected={selectedFilters.anosSerie}
          onChange={(values) => onFiltersChange('anosSerie', values)}
          placeholder="Selecione ano(s)..."
        />
        {selectedFilters.anosSerie.length > 0 && (
          <p className="text-xs text-gray-500">
            {selectedFilters.anosSerie.length} selecionado(s)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bimestre-filter">Bimestre</Label>
        <Select 
          value={selectedFilters.bimestre} 
          onValueChange={(value) => {
            onSingleFilterChange('bimestre', value);
            // Reset semana when bimestre changes
            onSingleFilterChange('semana', '');
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um bimestre..." />
          </SelectTrigger>
          <SelectContent>
            {options.bimestres.map((bimestre) => (
              <SelectItem key={bimestre} value={bimestre}>
                {bimestre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedFilters.bimestre && (
          <p className="text-xs text-gray-500">
            Selecionado: {selectedFilters.bimestre}
          </p>
        )}
      </div>

      {selectedFilters.bimestre && (
        <div className="space-y-2">
          <Label htmlFor="semana-filter">Semana</Label>
          <Select 
            value={selectedFilters.semana} 
            onValueChange={(value) => {
              onSingleFilterChange('semana', value);
              // Don't clear aulas here - let the useEffect handle auto-selection
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma semana..." />
            </SelectTrigger>
            <SelectContent>
              {semanaOptions.map((semana) => (
                <SelectItem key={semana.value} value={semana.value}>
                  {semana.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedFilters.semana && (
            <p className="text-xs text-gray-500">
              Selecionado: {selectedFilters.semana}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="aulas-filter">Aulas</Label>
        {selectedFilters.semana && totalLessonsInBimester > 0 && (
          <div className="text-xs text-blue-600 mb-1">
            Aulas distribuídas automaticamente para {selectedFilters.semana}
          </div>
        )}
        <MultiSelect
          options={options.aulas.map(value => ({ label: value, value }))}
          selected={selectedFilters.aulas}
          onChange={(values) => onFiltersChange('aulas', values)}
          placeholder={
            selectedFilters.semana 
              ? "Aulas selecionadas automaticamente..." 
              : "Selecione aula(s)..."
          }
        />
        {selectedFilters.aulas.length > 0 && (
          <p className="text-xs text-gray-500">
            {selectedFilters.aulas.length} selecionado(s)
            {selectedFilters.semana && totalLessonsInBimester > 0 && (
              <span className="text-blue-600">
                {' '}(distribuição automática)
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};
