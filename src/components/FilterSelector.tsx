// import React from 'react';
// import { MultiSelect } from './ui/multi-select';
// import { Label } from './ui/label';
// import { FilterOptions, SelectedFilters } from '../types';

// interface FilterSelectorProps {
//   selectedFilters: SelectedFilters;
//   options: FilterOptions;
//   onFiltersChange: (key: keyof SelectedFilters, values: string[]) => void;
// }

// export const FilterSelector: React.FC<FilterSelectorProps> = ({
//   selectedFilters,
//   options,
//   onFiltersChange
// }) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       <div className="space-y-2">
//         <Label htmlFor="anos-serie-filter">Ano/Série</Label>
//         <MultiSelect
//           options={options.anosSerie.map(value => ({ label: value, value }))}
//           selected={selectedFilters.anosSerie}
//           onChange={(values) => onFiltersChange('anosSerie', values)}
//           placeholder="Selecione ano(s)..."
//         />
//         {selectedFilters.anosSerie.length > 0 && (
//           <p className="text-xs text-gray-500">
//             {selectedFilters.anosSerie.length} selecionado(s)
//           </p>
//         )}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="bimestre-filter">Bimestre</Label>
//         <MultiSelect
//           options={options.bimestres.map(value => ({ label: value, value }))}
//           selected={selectedFilters.bimestres}
//           onChange={(values) => onFiltersChange('bimestres', values)}
//           placeholder="Selecione bimestre(s)..."
//         />
//         {selectedFilters.bimestres.length > 0 && (
//           <p className="text-xs text-gray-500">
//             {selectedFilters.bimestres.length} selecionado(s)
//           </p>
//         )}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="aulas-filter">Aulas</Label>
//         <MultiSelect
//           options={options.aulas.map(value => ({ label: value, value }))}
//           selected={selectedFilters.aulas}
//           onChange={(values) => onFiltersChange('aulas', values)}
//           placeholder="Selecione aula(s)..."
//         />
//         {selectedFilters.aulas.length > 0 && (
//           <p className="text-xs text-gray-500">
//             {selectedFilters.aulas.length} selecionado(s)
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };


import React, { useMemo } from 'react';
import { MultiSelect } from './ui/multi-select';
import { Label } from './ui/label';
import { FilterOptions, SelectedFilters } from '../types';
import weekMapping from '../data/bimestre_week_mapping.json'; // 👈 load the JSON you downloaded

interface FilterSelectorProps {
  selectedFilters: SelectedFilters;
  options: FilterOptions;
  onFiltersChange: (key: keyof SelectedFilters, values: string[]) => void;
  onSemanaChange?: (weekLabel: string, dateRange: string) => void;
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({
  selectedFilters,
  options,
  onFiltersChange,
  onSemanaChange
}) => {
  const selectedBimestre = selectedFilters.bimestres[0]; // Only use first selected bimestre for now

  const availableSemanas = useMemo(() => {
    if (!selectedBimestre || !(selectedBimestre in weekMapping)) return [];
    return Object.entries(weekMapping[selectedBimestre]).map(([semana, range]) => ({
      label: `${semana} (${range})`,
      value: semana,
    }));
  }, [selectedBimestre]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Ano/Série */}
      <div className="space-y-2">
        <Label htmlFor="anos-serie-filter">Ano/Série</Label>
        <MultiSelect
          options={options.anosSerie.map(value => ({ label: value, value }))}
          selected={selectedFilters.anosSerie}
          onChange={(values) => onFiltersChange('anosSerie', values)}
          placeholder="Selecione ano(s)..."
        />
      </div>

      {/* Bimestre */}
      <div className="space-y-2">
        <Label htmlFor="bimestre-filter">Bimestre</Label>
        <MultiSelect
          options={options.bimestres.map(value => ({ label: value, value }))}
          selected={selectedFilters.bimestres}
          onChange={(values) => onFiltersChange('bimestres', values)}
          placeholder="Selecione bimestre(s)..."
        />
      </div>

      {/* Aulas */}
      <div className="space-y-2">
        <Label htmlFor="aulas-filter">Aulas</Label>
        <MultiSelect
          options={options.aulas.map(value => ({ label: value, value }))}
          selected={selectedFilters.aulas}
          onChange={(values) => onFiltersChange('aulas', values)}
          placeholder="Selecione aula(s)..."
        />
      </div>

      {/* Semana */}
      {selectedBimestre && (
        <div className="space-y-2">
          <Label htmlFor="semana-filter">Semana</Label>
          <MultiSelect
            options={availableSemanas}
            selected={selectedFilters.semanas ?? []}
            onChange={(values) => {
              onFiltersChange('semanas' as keyof SelectedFilters, values);
              if (onSemanaChange && values.length === 1) {
                const label = values[0];
                const range = weekMapping[selectedBimestre][label];
                onSemanaChange(label, range);
              }
            }}
            placeholder="Selecione semana..."
          />
        </div>
      )}
    </div>
  );
};
