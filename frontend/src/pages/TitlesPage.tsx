import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { DataTable } from "../components/DataTable";
import { titleSchema } from "../schemas/forms";
import { api } from "../services/api";
import { formatDate } from "../utils/date";

type Party = { id: string; name: string; document: string; documentType?: string };
type Title = {
  id: string;
  protocol: string;
  titleNumber: string;
  amount: number;
  dueDate: string;
  status: string;
  paymentStatus: string;
  hasBoleto: boolean;
  creditor: Party;
  debtor: Party;
};

export const statuses = [
  "IMPORTADO",
  "AGUARDANDO_ANALISE",
  "ENVIADO_CARTORIO",
  "INTIMADO",
  "AGUARDANDO_PAGAMENTO",
  "PAGO",
  "PROTESTADO",
  "SUSTADO",
  "RETIRADO",
  "CANCELADO",
  "DEVOLVIDO",
  "PENDENTE_BOLETO",
  "PENDENTE_PAGAMENTO",
  "PENDENTE_RETORNO",
  "ERRO_IMPORTACAO"
];

export function TitlesPage() {
  const [items, setItems] = useState<Title[]>([]);
  const [creditors, setCreditors] = useState<Party[]>([]);
  const [debtors, setDebtors] = useState<Party[]>([]);
  const [filters, setFilters] = useState({ protocol: "", document: "", name: "", status: "", startDate: "", endDate: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(titleSchema) });

  async function load() {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const response = await api.get("/titles", { params });
    setItems(response.data.items);
    setLoading(false);
  }

  async function loadParties() {
    const [creditorResponse, debtorResponse] = await Promise.all([api.get("/creditors"), api.get("/debtors")]);
    setCreditors(creditorResponse.data);
    setDebtors(debtorResponse.data);
  }

  useEffect(() => {
    load();
    loadParties();
  }, []);

  async function onSubmit(data: any) {
    setMessage("");
    setError("");
    try {
      await api.post("/titles", data);
      reset();
      setMessage("Protesto cadastrado com sucesso.");
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erro ao cadastrar protesto.");
    }
  }

  async function changeStatus(id: string, status: string) {
    await api.patch(`/titles/${id}/status`, { status, note: "Alteracao realizada pela listagem" });
    load();
  }

  async function receipt(id: string, protocol: string) {
    const response = await api.get(`/titles/${id}/receipt`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${protocol}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function remove(id: string) {
    await api.delete(`/titles/${id}`);
    setMessage("Protesto excluido.");
    load();
  }

  function clearFilters() {
    setFilters({ protocol: "", document: "", name: "", status: "", startDate: "", endDate: "" });
    setTimeout(load, 0);
  }

  return (
    <section className="page">
      <div className="pageHeader">
        <div>
          <h1>Protestos</h1>
          <p>Consulte protestos importados, filtre registros, altere status e acesse detalhes.</p>
        </div>
        <Link className="buttonLink" to="/importar">Importar arquivo</Link>
      </div>
      {message && <div className="alert successBox">{message}</div>}
      {error && <div className="alert errorBox">{error}</div>}

      <section className="filterPanel">
        <input placeholder="Protocolo" value={filters.protocol} onChange={(event) => setFilters({ ...filters, protocol: event.target.value })} />
        <input placeholder="CPF/CNPJ" value={filters.document} onChange={(event) => setFilters({ ...filters, document: event.target.value })} />
        <input placeholder="Nome do devedor" value={filters.name} onChange={(event) => setFilters({ ...filters, name: event.target.value })} />
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          <option value="">Todos os status</option>
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <label>Data inicial<input type="date" value={filters.startDate} onChange={(event) => setFilters({ ...filters, startDate: event.target.value })} /></label>
        <label>Data final<input type="date" value={filters.endDate} onChange={(event) => setFilters({ ...filters, endDate: event.target.value })} /></label>
        <button onClick={load}>Pesquisar</button>
        <button className="ghost" onClick={clearFilters}>Limpar filtros</button>
      </section>

      <form className="formGrid" onSubmit={handleSubmit(onSubmit)}>
        <label>Credor<select {...register("creditorId")}><option value="">Selecione</option>{creditors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Devedor<select {...register("debtorId")}><option value="">Selecione</option>{debtors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Valor<input type="number" step="0.01" {...register("amount")} /></label>
        <label>Apresentacao<input type="date" {...register("issueDate")} /></label>
        <label>Vencimento<input type="date" {...register("dueDate")} /></label>
        <label>Descricao<input {...register("description")} /></label>
        <button>Cadastrar protesto</button>
      </form>

      {loading ? <p>Carregando protestos...</p> : (
        <DataTable headers={["Protocolo", "Titulo", "Devedor", "CPF/CNPJ", "Credor", "Valor", "Vencimento", "Status", "Pagamento", "Boleto", "Acoes"]}>
          {items.length === 0 && <tr><td colSpan={11}>Nenhum protesto encontrado.</td></tr>}
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.protocol}</td>
              <td>{item.titleNumber}</td>
              <td>{item.debtor.name}</td>
              <td>{item.debtor.document}</td>
              <td>{item.creditor.name}</td>
              <td>R$ {Number(item.amount).toFixed(2)}</td>
              <td>{formatDate(item.dueDate)}</td>
              <td><span className={`badge ${item.status}`}>{item.status}</span></td>
              <td><span className={`badge ${item.paymentStatus}`}>{item.paymentStatus}</span></td>
              <td>{item.hasBoleto ? "Sim" : "Nao"}</td>
              <td className="actions">
                <select value={item.status} onChange={(event) => changeStatus(item.id, event.target.value)}>
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <Link className="buttonLink subtle" to={`/protestos/${item.id}`}>Detalhes</Link>
                <button className="ghost" onClick={() => receipt(item.id, item.protocol)}>PDF</button>
                <button className="danger" onClick={() => remove(item.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </section>
  );
}
