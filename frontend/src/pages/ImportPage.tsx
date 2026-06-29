import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

type ImportResult = {
  message: string;
  batch: {
    id: string;
    fileName: string;
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    status: string;
    errors?: Array<{ id: string; lineNumber: number; field?: string; message: string }>;
  };
};

const acceptedExtensions = [".csv", ".txt", ".json"];

export function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);

  function validateFile(selected: File | null) {
    if (!selected) return "Selecione um arquivo para importar.";
    const lower = selected.name.toLowerCase();
    if (!acceptedExtensions.some((extension) => lower.endsWith(extension))) return "Formato invalido. Use CSV, TXT ou JSON.";
    if (selected.size > 5 * 1024 * 1024) return "Arquivo muito grande. Limite maximo: 5MB.";
    return "";
  }

  function onSelect(selected: File | null) {
    setFile(selected);
    setResult(null);
    setMessage("");
    setError(validateFile(selected));
  }

  async function importFile() {
    const validation = validateFile(file);
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file!);
      const response = await api.post("/imports", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(response.data);
      setMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erro ao importar arquivo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <div className="pageHeader">
        <div>
          <h1>Importar Arquivo de Protesto</h1>
          <p>Selecione o arquivo gerado pelo sistema externo para importar automaticamente os dados dos protestos.</p>
        </div>
      </div>

      <div className="uploadCard">
        <div className="uploadIcon">CSV</div>
        <div>
          <h2>Arquivo de importacao</h2>
          <p>Formatos aceitos: CSV, TXT ou JSON. O formato SIMPROT/CRA permanece (A DEFINIR).</p>
        </div>
        <label className="fileDrop">
          <input type="file" accept=".csv,.txt,.json" onChange={(event) => onSelect(event.target.files?.[0] ?? null)} />
          <span>{file ? file.name : "Arraste ou selecione um arquivo"}</span>
        </label>
        <button onClick={importFile} disabled={loading}>{loading ? "Importando..." : "Importar Arquivo"}</button>
      </div>

      {error && <div className="alert errorBox">{error}</div>}
      {message && <div className="alert successBox">{message}</div>}

      {result && (
        <section className="panel resultPanel">
          <h2>Resultado da importacao</h2>
          <div className="stats mini">
            <article><span>Arquivo</span><strong>{result.batch.fileName}</strong></article>
            <article><span>Total</span><strong>{result.batch.totalRecords}</strong></article>
            <article><span>Validos</span><strong>{result.batch.validRecords}</strong></article>
            <article><span>Invalidos</span><strong>{result.batch.invalidRecords}</strong></article>
            <article><span>Status</span><strong>{result.batch.status}</strong></article>
          </div>
          {result.batch.errors && result.batch.errors.length > 0 && (
            <div className="errorsList">
              {result.batch.errors.map((item) => (
                <p key={item.id}>Linha {item.lineNumber} {item.field ? `(${item.field})` : ""}: {item.message}</p>
              ))}
            </div>
          )}
          <Link className="buttonLink" to="/protestos">Ver protestos importados</Link>
        </section>
      )}
    </section>
  );
}
