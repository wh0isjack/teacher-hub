export function matchFormFieldsWithAula(formFields, aulaRow) {
  const result = {};

  const WEEKLY_LABELS = [
    "DATA DA AULA DA SEMANA",
    "CONTEÚDOS/OBJETOS DE CONHECIMENTO",
    'UNIDADE TEMÁTICA',
    "HABILIDADES",
    "NÚMERO DE AULA PREVISTA"
  ];

  formFields.forEach((field) => {
    const label = normalize(field.label);
    const type = field.type;

    let matched = false;

    for (const [column, value] of Object.entries(aulaRow)) {
      const normalizedColumn = normalize(column);
      const normalizedValue = normalize(value);

      if (label.includes(normalizedColumn)) {
        result[field.id] = value;
        matched = true;
        break;
      }

      if (type === "checkbox" && typeof value === "string" && label.includes(normalizedValue)) {
        result[field.id] = value;
        matched = true;
        break;
      }
    }

    // Fallback: force-set empty string for weekly fields to ensure visibility in the UI
    if (!matched && WEEKLY_LABELS.includes(field.label.trim().toUpperCase())) {
      result[field.id] = aulaRow[field.label] || "";
    }
  });

  return result;
}

function normalize(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9]/g, " ")
    .toLowerCase()
    .trim();
}


