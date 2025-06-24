// // utils/matchForm.js

// export function matchFormFieldsWithAula(aulaRow, numAulasPorSemana = 2) {
//   const conhecimento = [
//     aulaRow["OBJETOS DE CONHECIMENTO"],
//     aulaRow["CONTEÚDO"]
//   ].filter(Boolean).join(";\n");

//   const habilidade = aulaRow["HABILIDADE"] || "";

//   const pages = Array.from({ length: 4 }, (_, i) => ({
//     "SEMANA": `SEMANA ${i + 1}`,
//     "DATA DA AULA DA SEMANA": "",
//     "CONTEÚDOS/OBJETOS DE CONHECIMENTO": conhecimento,
//     "HABILIDADES": habilidade,
//     "DESENVOLVIMENTO DA AULA (ESTRATÉGIAS E RECURSOS PEDAGÓGICOS)": "",
//     "QUAL PEDAGOGIA ATIVA SERÁ UTILIZADA?": "",
//     "AVALIAÇÃO": "",
//     "NÚMERO DE AULA PREVISTA": String(numAulasPorSemana)
//   }));

//   return pages;
// }

// // To use if we go back with the dynamic matching field strategy

// export function dynamicLabelMatch(formFields, aulaRow) {
//   const result = {};

//   formFields.forEach((field) => {
//     const label = normalize(field.label);
//     const type = field.type;

//     for (const [column, value] of Object.entries(aulaRow)) {
//       const normalizedColumn = normalize(column);
//       const normalizedValue = normalize(value);

//       if (label.includes(normalizedColumn)) {
//         result[field.id] = value;
//         break;
//       }

//       if (type === "checkbox" && typeof value === "string" && label.includes(normalizedValue)) {
//         result[field.id] = value;
//         break;
//       }
//     }
//   });

//   return result;
// }

// function normalize(str) {
//   if (!str || typeof str !== "string") return "";
//   return str
//     .normalize("NFD")
//     .replace(/\p{Diacritic}/gu, "")
//     .replace(/[^a-zA-Z0-9]/g, " ")
//     .toLowerCase()
//     .trim();
// }


// export function matchFormFieldsWithAula(formFields, aulaRow, semanaIndex, numeroDeAulas) {
//   const result = {};

//   formFields.forEach((field) => {
//     const label = normalize(field.label);
//     const type = field.type;

//     // 1. DATA DA AULA DA SEMANA → will be filled later by the app
//     if (label === "data da aula da semana") {
//       result[field.id] = ""; // leave blank for now
//       return;
//     }

//     // 2. CONTEÚDOS/OBJETOS DE CONHECIMENTO → OBJETOS DO CONHECIMENTO + CONTEÚDO
//     if (label === "conteúdos objetos de conhecimento") {
//       const obj = aulaRow["OBJETOS DO CONHECIMENTO"] || "";
//       const conteudo = aulaRow["CONTEÚDO"] || "";
//       result[field.id] = `${obj}\n${conteudo}`.trim();
//       return;
//     }

//     // 3. HABILIDADES → HABILIDADE
//     if (label === "habilidades") {
//       result[field.id] = aulaRow["HABILIDADE"] || "";
//       return;
//     }

//     // 4. NÚMERO DE AULA PREVISTA → passed in (same for all weeks in a month)
//     if (label === "número de aula prevista") {
//       result[field.id] = numeroDeAulas || "";
//       return;
//     }

//     // 5. Skip: DESENVOLVIMENTO DA AULA, PEDAGOGIA, AVALIAÇÃO → left for manual input
//     const skipLabels = [
//       "desenvolvimento da aula estratégias e recursos pedagógicos",
//       "qual pedagogia ativa será utilizada?",
//       "avaliação",
//     ];
//     if (skipLabels.includes(label)) return;

//     // 6. Generic fallback — preserve the original logic
//     for (const [column, value] of Object.entries(aulaRow)) {
//       const normalizedColumn = normalize(column);
//       const normalizedValue = normalize(value);

//       // Match by label–column similarity
//       if (label.includes(normalizedColumn)) {
//         result[field.id] = value;
//         break;
//       }

//       // Match by value content (mainly for checkboxes)
//       if (type === "checkbox" && typeof value === "string" && label.includes(normalizedValue)) {
//         result[field.id] = value;
//         break;
//       }
//     }
//   });

//   return result;
// }

// function normalize(str) {
//   if (!str || typeof str !== "string") return "";
//   return str
//     .normalize("NFD")
//     .replace(/\p{Diacritic}/gu, "")
//     .replace(/[^a-zA-Z0-9]/g, " ")
//     .toLowerCase()
//     .trim();
// }

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


