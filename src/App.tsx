import { useState, useEffect } from "react";
import StepUpload from "./components/StepUpload";
import StepFilters from "./components/StepFilters";
import StepPreview from "./components/StepPreview";
import { matchFormFieldsWithAula } from "./utils/matchForm";
import DynamicFormEditor from "./components/DynamicFormEditor";

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

  const [formFields, setFormFields] = useState([]);
  const [formUrl, setFormUrl] = useState(
    "https://docs.google.com/forms/d/e/1FAIpQLScqw6mOlnekxeqrgnVdd308OvH8py-7R84BcMhlvv9W1pS_Kw/viewform"
  );

  const onFiltersChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchFormFields = async () => {
      const res = await fetch(`http://localhost:3001/parse-form?url=${formUrl}`);
      const json = await res.json();
      setFormFields(json);
    };

    if (formUrl) fetchFormFields();
  }, [formUrl]);

  const filteredRows = fileData.filter(
    row =>
      selectedFilters.anosSerie.includes(row['ANO/SÉRIE']) &&
      selectedFilters.bimestres.includes(row['BIMESTRE']) &&
      selectedFilters.aulas.includes(String(row['AULA']))
  );

  const WEEKLY_LABELS = [
    "DATA DA AULA DA SEMANA",
    "CONTEÚDOS/OBJETOS DE CONHECIMENTO",
    "HABILIDADES",
    "NÚMERO DE AULA PREVISTA"
  ];

  const weeklyFieldIds = formFields
    .filter(f => WEEKLY_LABELS.includes(f.label.trim().toUpperCase()))
    .map(f => f.id);

  // Compute initial values (non-weekly only)
  const formInitialValues = {};
  if (filteredRows.length > 0) {
    const allMatches = matchFormFieldsWithAula(formFields, filteredRows[0]);

    for (const key in allMatches) {
      if (!weeklyFieldIds.includes(key)) {
        formInitialValues[key] = allMatches[key];
      }
    }
  }

  // Compute weekly values
  const weeklyValues = {};
  filteredRows.forEach((row, index) => {
    const allMatches = matchFormFieldsWithAula(formFields, row);

    const filteredWeekly = {};
    for (const id of weeklyFieldIds) {
      filteredWeekly[id] = allMatches[id] || "";
    }

    weeklyValues[index] = filteredWeekly; // use numeric keys (0–3)
  });

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

      {filteredRows.length > 0 && <StepPreview rows={filteredRows} />}

      {filteredRows.length > 0 && formFields.length > 0 && (
        <DynamicFormEditor
          fields={formFields}
          initialValues={formInitialValues}
          weeklyValues={weeklyValues}
        />
      )}
    </div>
  );
}
