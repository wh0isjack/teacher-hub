// Static mapping of Bimestre to Semana options
export const SEMANA_MAPPING: Record<string, Record<string, string>> = {
  "1": {
    "SEMANA 1": "03/02/2025 - 07/02/2025",
    "SEMANA 2": "10/02/2025 - 14/02/2025",
    "SEMANA 3": "17/02/2025 - 21/02/2025",
    "SEMANA 4": "24/02/2025 - 28/02/2025",
    "SEMANA 5": "03/03/2025 - 07/03/2025",
    "SEMANA 6": "10/03/2025 - 14/03/2025",
    "SEMANA 7": "17/03/2025 - 21/03/2025",
    "SEMANA 8": "24/03/2025 - 28/03/2025",
    "SEMANA 9": "31/03/2025 - 04/04/2025",
    "SEMANA 10": "07/04/2025 - 11/04/2025",
    "SEMANA 11": "14/04/2025 - 18/04/2025"
  },
  "2": {
    "SEMANA 1": "21/04/2025 - 25/04/2025",
    "SEMANA 2": "28/04/2025 - 02/05/2025",
    "SEMANA 3": "05/05/2025 - 09/05/2025",
    "SEMANA 4": "12/05/2025 - 16/05/2025",
    "SEMANA 5": "19/05/2025 - 23/05/2025",
    "SEMANA 6": "26/05/2025 - 30/05/2025",
    "SEMANA 7": "02/06/2025 - 06/06/2025",
    "SEMANA 8": "09/06/2025 - 13/06/2025",
    "SEMANA 9": "16/06/2025 - 20/06/2025",
    "SEMANA 10": "23/06/2025 - 27/06/2025",
    "SEMANA 11": "30/06/2025 - 04/07/2025"
  },
  "3": {
    "SEMANA 1": "07/07/2025 - 11/07/2025",
    "SEMANA 2": "14/07/2025 - 18/07/2025",
    "SEMANA 3": "21/07/2025 - 25/07/2025",
    "SEMANA 4": "28/07/2025 - 01/08/2025",
    "SEMANA 5": "04/08/2025 - 08/08/2025",
    "SEMANA 6": "11/08/2025 - 15/08/2025",
    "SEMANA 7": "18/08/2025 - 22/08/2025",
    "SEMANA 8": "25/08/2025 - 29/08/2025",
    "SEMANA 9": "01/09/2025 - 05/09/2025",
    "SEMANA 10": "08/09/2025 - 12/09/2025"
  },
  "4": {
    "SEMANA 1": "15/09/2025 - 19/09/2025",
    "SEMANA 2": "22/09/2025 - 26/09/2025",
    "SEMANA 3": "29/09/2025 - 03/10/2025",
    "SEMANA 4": "06/10/2025 - 10/10/2025",
    "SEMANA 5": "13/10/2025 - 17/10/2025",
    "SEMANA 6": "20/10/2025 - 24/10/2025",
    "SEMANA 7": "27/10/2025 - 31/10/2025",
    "SEMANA 8": "03/11/2025 - 07/11/2025",
    "SEMANA 9": "10/11/2025 - 14/11/2025",
    "SEMANA 10": "17/11/2025 - 21/11/2025",
    "SEMANA 11": "24/11/2025 - 28/11/2025"
  }
};

export function getSemanaOptions(bimestre: string): Array<{ label: string; value: string }> {
  const bimestreNumber = bimestre.split('º')[0];
  const semanas = SEMANA_MAPPING[bimestreNumber] || {};

  const result = Object.entries(semanas).map(([semana, dateRange]) => ({
    label: `${semana} (${dateRange})`,
    value: semana
  }));
  return result
}