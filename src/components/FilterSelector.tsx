import React from 'react';
import { MultiSelect } from './ui/multi-select';
import { Label } from './ui/label';
import { FilterOptions, SelectedFilters } from '../types';

interface FilterSelectorProps {
  selectedFilters: SelectedFilters;
  options: FilterOptions;
  onFiltersChange: (key: keyof SelectedFilters, values: string[]) => void;
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({
  selectedFilters,
  options,
  onFiltersChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <MultiSelect
          options={options.bimestres.map(value => ({ label: value, value }))}
          selected={selectedFilters.bimestres}
          onChange={(values) => onFiltersChange('bimestres', values)}
          placeholder="Selecione bimestre(s)..."
        />
        {selectedFilters.bimestres.length > 0 && (
          <p className="text-xs text-gray-500">
            {selectedFilters.bimestres.length} selecionado(s)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="aulas-filter">Aulas</Label>
        <MultiSelect
          options={options.aulas.map(value => ({ label: value, value }))}
          selected={selectedFilters.aulas}
          onChange={(values) => onFiltersChange('aulas', values)}
          placeholder="Selecione aula(s)..."
        />
        {selectedFilters.aulas.length > 0 && (
          <p className="text-xs text-gray-500">
            {selectedFilters.aulas.length} selecionado(s)
          </p>
        )}
      </div>
    </div>
  );
};