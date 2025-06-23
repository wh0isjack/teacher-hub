import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function DynamicFormEditor({ fields, initialValues = {}, weeklyValues = {} }) {
  const [formData, setFormData] = useState(() => {
    return Object.fromEntries(
      fields.map(field => [field.id, initialValues[field.id] || ""])
    )
  })

  const handleChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const isWeeklyField = label =>
    [
      "DATA DA AULA DA SEMANA",
      "CONTEÚDOS/OBJETOS DE CONHECIMENTO",
      "HABILIDADES",
      "NÚMERO DE AULA PREVISTA"
    ].includes(label.trim().toUpperCase())

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-xl">4. Editor de Respostas</h2>

      {/* Global (non-weekly) fields */}
      {fields
        .filter(field => !isWeeklyField(field.label))
        .map(field => (
          <div key={field.id} className="grid gap-1">
            <Label>{field.label}</Label>

            {field.type === "textarea" ? (
              <Textarea
                value={formData[field.id]}
                onChange={e => handleChange(field.id, e.target.value)}
              />
            ) : field.type === "checkbox" ? (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  disabled
                  checked={Boolean(formData[field.id])}
                />
                <span className="text-sm text-gray-800">
                  {formData[field.id] || "Não preenchido"}
                </span>
              </div>
            ) : (
              <Input
                value={formData[field.id]}
                onChange={e => handleChange(field.id, e.target.value)}
              />
            )}
          </div>
        ))}

      {/* Weekly repeated fields for SEMANA 1 to 4 */}
      {[1, 2, 3, 4].map((week) => (
        <div key={week} className="pt-6 border-t border-gray-300">
          <h3 className="font-semibold text-lg mb-2">SEMANA {week}</h3>

          {fields
            .filter(field => isWeeklyField(field.label))
            .map(field => (
              <div key={field.id} className="grid gap-1">
                <Label>{field.label}</Label>
                <Input
                  value={weeklyValues?.[`SEMANA ${week}`]?.[field.id] || ""}
                  onChange={() => {}}
                  disabled
                />
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
