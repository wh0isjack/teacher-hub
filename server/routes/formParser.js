import express from 'express'
import axios from 'axios'
import * as cheerio from 'cheerio'

const router = express.Router()

router.get('/parse-form', async (req, res) => {
  const { url } = req.query

  if (!url || typeof url !== 'string' || !url.startsWith('https://docs.google.com/forms/')) {
    return res.status(400).json({ error: 'URL inválida de Google Forms' })
  }

  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const result = []

    $('form [data-params]').each((_, el) => {
      const titleEl = $(el).find('[role="heading"]').first()
      const labelRaw = titleEl.text().trim()
      const label = labelRaw.replace('*', '').trim()

      const listItem = $(el).closest('[role="listitem"]')

      // Search for sentinels/checkboxes
      const sentinel = listItem.find('input[type="hidden"][name$="_sentinel"]').first()
      let id = sentinel.attr('name')?.replace('_sentinel', '')
      let type = 'text'

      // If sentinel assumes there is a checkbox
      if (sentinel.length) {
        type = 'checkbox'
      } else {
        const input = listItem.find('input[name^="entry."], textarea[name^="entry."], select[name^="entry."]').first()
        id = input.attr('name')?.replace('_sentinel', '')
        const tag = input[0]?.tagName
        const inputType = input.attr('type')

        if (tag === 'textarea') type = 'textarea'
        else if (tag === 'select') type = 'select'
        else if (inputType === 'checkbox') type = 'checkbox'
        else type = 'text'
      }

      if (id && label) {
        result.push({ id, label, type })
      }
    })

    res.json(result)
  } catch (err) {
    console.error('Erro ao coletar campos:', err)
    res.status(500).json({ error: 'Erro ao processar o Google Form', detail: err.message })
  }
})

export default router
