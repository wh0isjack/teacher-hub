import { MultiSelect } from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";

export default function FilterSelector({
  anosSerieOptions = [],
  bimestreOptions = [],
  aulaOptions = [],
  selectedFilters = [],
  onFiltersChange = [],
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white rounded-xl shadow">
      <div>
        <Label className="mb-1 block">Ano/Série</Label>
        <MultiSelect
          options={anosSerieOptions.map(v => ({ label: v, value: v }))}
          selected={selectedFilters.anosSerie}
          onChange={(vals) => onFiltersChange("anosSerie", vals)}
          placeholder="Selecione ano(s)"
        />
      </div>

      <div>
        <Label className="mb-1 block">Bimestre</Label>
        <MultiSelect
          options={bimestreOptions.map(v => ({ label: v, value: v }))}
          selected={selectedFilters.bimestres}
          onChange={(vals) => onFiltersChange("bimestres", vals)}
          placeholder="Selecione bimestre(s)"
        />
      </div>

      <div>
        <Label className="mb-1 block">Aulas</Label>
        <MultiSelect
          options={aulaOptions.map(v => ({ label: String(v), value: String(v) }))}
          selected={selectedFilters.aulas}
          onChange={(vals) => onFiltersChange("aulas", vals)}
          placeholder="Selecione aula(s)"
        />
      </div>
    </div>
  );
}
