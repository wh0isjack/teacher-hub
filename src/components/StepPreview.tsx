export default function StepPreview({ rows }) {
  return (
    <div className="space-y-2">
      <h2 className="font-bold text-xl">3. Pré-visualização</h2>
      <pre className="bg-gray-100 p-4 rounded max-h-96 overflow-auto text-sm">
        {JSON.stringify(rows, null, 2)}
      </pre>
    </div>
  );
}
