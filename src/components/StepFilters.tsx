import FilterSelector from "./FilterSelector";

export default function StepFilters({ filters, options, onFiltersChange }) {
  return (
    <div className="space-y-2">
      <h2 className="font-bold text-xl">2. Escolha os Filtros</h2>
      <FilterSelector
        anosSerieOptions={options.anosSerie}
        bimestreOptions={options.bimestres}
        aulaOptions={options.aulas}
        selectedFilters={filters}
        onFiltersChange={onFiltersChange}
      />
    </div>
  );
}
