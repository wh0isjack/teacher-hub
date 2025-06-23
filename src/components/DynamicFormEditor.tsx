import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { Textarea } from "@/components/ui/textarea"

export default function DynamicFormEditor({ fields, initialValues = {}, weeklyValues = {} }) {

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(id);
      setTimeout(() => setCopiedField(null), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

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
      "NÚMERO DE AULA PREVISTA",
      "DESENVOLVIMENTO DA AULA (ESTRATÉGIAS E RECURSOS PEDAGÓGICOS)",
      "QUAL PEDAGOGIA ATIVA SERÁ UTILIZADA?",
      "AVALIAÇÃO"
    ].includes(label.trim().toUpperCase())

  return (
    <div className="space-y-8">
      <h2 className="font-bold text-2xl text-gray-900">4. Editor de Respostas</h2>

      {/* Global Fields */}
      <div className="grid gap-6 bg-white p-6 rounded-2xl shadow border">
        {fields
          .filter(field => !isWeeklyField(field.label))
          .map(field => (
            <div key={field.id} className="grid gap-1">
              <Label className="font-semibold text-gray-800">{field.label}</Label>

              {field.type === "textarea" ? (
                <Textarea
                  className="bg-gray-50 border rounded-lg px-3 py-2"
                  value={formData[field.id]}
                  onChange={e => handleChange(field.id, e.target.value)}
                />
              ) : field.type === "checkbox" ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={Boolean(formData[field.id])}
                    readOnly
                  />
                  <span className="text-sm text-gray-800">
                    {formData[field.id] || "Não preenchido"}
                  </span>
                </div>
              ) : (
                <Input
                  className="bg-gray-50"
                  value={formData[field.id]}
                  onChange={e => handleChange(field.id, e.target.value)}
                />
              )}
            </div>
          ))}
      </div>

    {/* Weekly Sections */}
    {[1, 2, 3, 4].map((week) => (
      <div
        key={week}
        className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm space-y-4"
      >
        <h3 className="font-semibold text-lg text-blue-900">SEMANA {week}</h3>

        {fields
          .filter(field => isWeeklyField(field.label))
          .map(field => (
            <div key={`SEMANA${week}-${field.id}`} className="grid gap-1 relative">
            <Label className="text-sm font-medium text-gray-700">{field.label}</Label>

            <div className="relative">
              <Textarea
                className="bg-white border rounded-md px-3 py-2 text-sm text-gray-900"
                value={weeklyValues?.[`SEMANA ${week}`]?.[field.id] || ""}
                readOnly
              />

              <button
                type="button"
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() =>
                  copyToClipboard(weeklyValues?.[`SEMANA ${week}`]?.[field.id] || "", `SEMANA${week}-${field.id}`)
                }
              >
                📋
              </button>

              {copiedField === `SEMANA${week}-${field.id}` && (
                <span className="absolute -top-6 right-0 text-xs text-green-600 transition-opacity duration-300">
                  Texto copiado para area de transferencia
                </span>
              )}
            </div>
          </div>

          ))}
      </div>
    ))}
  </div>
);

}
