import { useState } from "react";
import StepUpload from "./components/StepUpload";
import StepFilters from "./components/StepFilters";
import StepPreview from "./components/StepPreview";

 export function App() {
  const [sheetOptions, setSheetOptions] = useState([]);
  const [file, setFile] = useState(null);
  const [sheetName, setSheetName] = useState("");
  const [fileData, setFileData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    anosSerie: [], bimestres: [], aulas: []
  });
  const [selectedFilters, setSelectedFilters] = useState({
    anosSerie: [], bimestres: [], aulas: []
  });

  const onFiltersChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredRows = fileData.filter(
    row =>
      selectedFilters.anosSerie.includes(row['ANO/SÉRIE']) &&
      selectedFilters.bimestres.includes(row['BIMESTRE']) &&
      selectedFilters.aulas.includes(String(row['AULA']))
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
    <StepUpload
      setFile={setFile}
      sheetOptions={sheetOptions}
      setSheetOptions={setSheetOptions}
      setSheetName={setSheetName}
      setFileData={setFileData}
      setFilterOptions={setFilterOptions}
    />

      {file && sheetName && (
        <StepFilters
          filters={selectedFilters}
          options={filterOptions}
          onFiltersChange={onFiltersChange}
        />
      )}

      {filteredRows.length > 0 && (
        <StepPreview rows={filteredRows} />
      )}
    </div>
  );
}
