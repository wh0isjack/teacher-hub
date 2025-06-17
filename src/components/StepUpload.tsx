"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

type Props = {
  setFile: (file: File) => void
  sheetOptions: string[]
  setSheetOptions: (options: string[]) => void
  setSheetName: (name: string) => void
  setFileData: (data: any[]) => void
  setFilterOptions: (filters: any) => void
}

export default function StepUpload({
  setFile,
  sheetOptions,
  setSheetOptions,
  setSheetName,
  setFileData,
  setFilterOptions
}: Props) {
  const [localFile, setLocalFile] = useState<File | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLocalFile(file)
    setFile(file)

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("http://localhost:3001/upload-sheets", {
      method: "POST",
      body: formData
    })
    const json = await res.json()
    setSheetOptions(json.sheetNames)
  }

  const handleSheetSelect = async (sheet: string) => {
    setSheetName(sheet)
    const formData = new FormData()
    if (localFile) {
      formData.append("file", localFile)
      formData.append("sheetName", sheet)

      const res = await fetch("http://localhost:3001/upload-with-filters", {
        method: "POST",
        body: formData
      })

      const json = await res.json()
      if (json.success) {
        setFileData(json.data)
        setFilterOptions(json.filters)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">1. Upload da Planilha</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="file">Escolha o arquivo (.xlsx)</Label>
          <Input id="file" type="file" accept=".xlsx" onChange={handleFileChange} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="sheet">Selecione a aba</Label>
          <Select onValueChange={handleSheetSelect}>
            <SelectTrigger id="sheet">
              <SelectValue placeholder="Selecione uma aba" />
            </SelectTrigger>
            <SelectContent>
              {sheetOptions?.map((sheet) => (
                <SelectItem key={sheet} value={sheet}>
                  {sheet}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
