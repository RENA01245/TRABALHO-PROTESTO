import { useEffect, useState } from "react";
import { api } from "../services/api";

type ImportBatch = {
  id: string;
  fileName: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  status: string;
  createdAt: string;
};

export function ReportsPage() {
  const [imports, setImports] = useState<ImportBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/imports").then((response) => setImports(response.data)).finally(() => setLoading(false));
  }, []);

  return (
    <section className="page">
      <div className="pageHeader">
        <div>
          <h1>Relatorios</h1>
          <p>Resumo de importacoes e processamento de protestos.</p>
        </div>
      </div>
      <section className="panel">
        <h2>Lotes de importacao</h2>
        {loading && <p>Carregando relatorios...</p>}
        {!loading && imports.map((item) => (
          <div className="reportLine" key={item.id}>
            <strong>{item.fileName}</strong>
            <span>{item.status}</span>
            <span>Total: {item.totalRecords}</span>
            <span>Validos: {item.validRecords}</span>
            <span>Invalidos: {item.invalidRecords}</span>
            <span>{new Date(item.createdAt).toLocaleString("pt-BR")}</span>
          </div>
        ))}
      </section>
    </section>
  );
}
