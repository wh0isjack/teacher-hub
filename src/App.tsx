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

    // Only fetch fields from first page
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

    const HARDCODED_SEMANA_FIELDS = [
        {
            id: "entry.data_aula",
            label: "DATA DA AULA DA SEMANA",
            type: "text",
        },
        {
            id: "entry.conteudos",
            label: "CONTEÚDOS/OBJETOS DE CONHECIMENTO",
            type: "text",
        },
        {
            id: "entry.habilidades",
            label: "HABILIDADES",
            type: "text",
        },
        {
            id: "entry.desenvolvimento",
            label: "DESENVOLVIMENTO DA AULA (Estratégias e Recursos Pedagógicos)",
            type: "textarea",
        },
        {
            id: "entry.pedagogia",
            label: "QUAL PEDAGOGIA ATIVA SERÁ UTILIZADA?",
            type: "textarea",
        },
        {
            id: "entry.avaliacao",
            label: "AVALIAÇÃO",
            type: "textarea",
        }
    ];

    // Compute non-weekly values
    const formInitialValues = {};
    if (filteredRows.length > 0) {
        const allMatches = matchFormFieldsWithAula(formFields, filteredRows[0]);
        for (const key in allMatches) {
            formInitialValues[key] = allMatches[key];
        }
    }

    // Compute weekly values using hardcoded SEMANA fields - TODO
    const weeklyValues = {};
    filteredRows.forEach((row, index) => {
        const semanaKey = `SEMANA ${index + 1}`;

        weeklyValues[semanaKey] = {
            "entry.data_aula": "",
            "entry.conteudos": `${row["OBJETOS DO CONHECIMENTO"] || ""} — ${row["CONTEÚDO"] || ""}`,
            "entry.habilidades": row["HABILIDADE"] || "",
            "entry.numero_aula": String(row["AULA"] || ""),
            "entry.desenvolvimento": "Preenchido manualmente",
            "entry.pedagogia": "Preenchido manualmente",
            "entry.avaliacao": "Preenchido manualmente"
        };
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

            {filteredRows.length > 0 && (
                <DynamicFormEditor
                    fields={[...formFields, ...HARDCODED_SEMANA_FIELDS]}
                    initialValues={formInitialValues}
                    weeklyValues={weeklyValues}
                />
            )}
        </div>
    );
}
