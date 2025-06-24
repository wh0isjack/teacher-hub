import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Filter } from 'lucide-react';
import { FilterSelector } from './FilterSelector';
import { StepFiltersProps } from '../types';

export const StepFilters: React.FC<StepFiltersProps> = ({
  filters,
  options,
  onFiltersChange
}) => {
  const hasOptions = options.anosSerie.length > 0 || 
                   options.bimestres.length > 0 || 
                   options.aulas.length > 0;

  if (!hasOptions) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          2. Escolha os Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FilterSelector
          selectedFilters={filters}
          options={options}
          onFiltersChange={onFiltersChange}
        />
      </CardContent>
    </Card>
  );
};