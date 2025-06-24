import { MultiSelect } from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";

interface FilterSelectorProps {
  selectedFilters: {
    anosSerie: string[]; // Changed from Array<string> | undefined to string[]
    bimestres: string[]; // Changed from string[] | undefined to string[]
    aulas: string[]; // Changed from string[] | undefined to string[]
  };
  onFiltersChange: (key: string, vals: string[]) => void;
}

const FilterSelector = ({ selectedFilters, onFiltersChange }: FilterSelectorProps) => {
  const anosSerieOptions = ["1º Ano", "2º Ano", "3º Ano"]; // Example options
  const bimestreOptions = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"];
  const aulaOptions = [1, 2, 3, 4, 5];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white rounded-xl shadow">
      <div>
        <Label className="mb-1 block">Ano/Série</Label>
        <MultiSelect
          options={anosSerieOptions.map(v => ({ label: v, value: v }))}
          selected={selectedFilters.anosSerie || []} // Fallback to empty array
          onChange={(vals) => onFiltersChange("anosSerie", vals)}
          placeholder="Selecione ano(s)"
        />
      </div>

      <div>
        <Label className="mb-1 block">Bimestre</Label>
        <MultiSelect
          options={bimestreOptions.map(v => ({ label: v, value: v }))}
          selected={selectedFilters.bimestres || []} // Fallback to empty array
          onChange={(vals) => onFiltersChange("bimestres", vals)}
          placeholder="Selecione bimestre(s)"
        />
      </div>

      <div>
        <Label className="mb-1 block">Aulas</Label>
        <MultiSelect
          options={aulaOptions.map(v => ({ label: String(v), value: String(v) }))}
          selected={selectedFilters.aulas || []} // Fallback to empty array
          onChange={(vals) => onFiltersChange("aulas", vals)}
          placeholder="Selecione aula(s)"
        />
      </div>
    </div>
  );
};

export default FilterSelector;