import express from 'express'
import multer from 'multer'
import xlsx from 'xlsx'
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload-sheets', upload.single('file'), (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    res.json({ sheetNames });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao processar o arquivo.' });
  }
});

router.post('/upload-with-filters', upload.single('file'), (req, res) => {
  try {
    const { sheetName } = req.body;
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

    if (!workbook.SheetNames.includes(sheetName)) {
      return res.status(400).json({ success: false, message: 'Aba não encontrada.' });
    }

    const rawSheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(rawSheet, { header: 1 });
    const headers = jsonData[0];
    const rows = jsonData.slice(1);

    // First build raw row objects
    const structured = rows.map(row =>
      Object.fromEntries(headers.map((h, i) => [h?.trim(), row[i]]))
    ).filter(r => r['AULA'] != null);

    // Inject COMPONENTE CURRICULAR from sheet name
    const enrichedData = structured.map(row => ({
      ...row,
      "COMPONENTE CURRICULAR": row["COMPONENTE CURRICULAR"]?.trim() || sheetName
    }));

    const anos = [...new Set(enrichedData.map(r => r['ANO/SÉRIE']))];
    const bimestres = [...new Set(enrichedData.map(r => r['BIMESTRE']))];
    const aulas = [...new Set(enrichedData.map(r => r['AULA']))];

    res.json({
      success: true,
      filters: {
        anosSerie: anos,
        bimestres,
        aulas: aulas.sort((a, b) => parseInt(a) - parseInt(b)),
      },
      data: enrichedData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao processar o arquivo.' });
  }
});


export default router;

