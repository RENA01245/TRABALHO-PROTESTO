import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DataTable } from "../components/DataTable";
import { titleSchema } from "../schemas/forms";
import { api } from "../services/api";

type Party = { id: string; name: string; document: string };
type Title = {
  id: string;
  protocol: string;
  amount: number;
  dueDate: string;
  status: string;
  creditor: Party;
  debtor: Party;
};

const statuses = [
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
  const [filters, setFilters] = useState({ protocol: "", document: "", name: "", status: "" });
  const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(titleSchema) });

  async function load() {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const response = await api.get("/titles", { params });
    setItems(response.data.items);
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
    await api.post("/titles", data);
    reset();
    load();
  }

  async function changeStatus(id: string, status: string) {
    await api.patch(`/titles/${id}/status`, { status, note: "Alteracao realizada pelo painel web" });
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
    load();
  }

  return (
    <section className="page">
      <h1>Protestos</h1>
      <div className="toolbar wrap">
        <input placeholder="Protocolo" value={filters.protocol} onChange={(event) => setFilters({ ...filters, protocol: event.target.value })} />
        <input placeholder="CPF/CNPJ" value={filters.document} onChange={(event) => setFilters({ ...filters, document: event.target.value })} />
        <input placeholder="Nome" value={filters.name} onChange={(event) => setFilters({ ...filters, name: event.target.value })} />
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          <option value="">Todos</option>
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <button onClick={load}>Pesquisar</button>
      </div>
      <form className="formGrid" onSubmit={handleSubmit(onSubmit)}>
        <label>Credor<select {...register("creditorId")}><option value="">Selecione</option>{creditors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Devedor<select {...register("debtorId")}><option value="">Selecione</option>{debtors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Valor<input type="number" step="0.01" {...register("amount")} /></label>
        <label>Emissao<input type="date" {...register("issueDate")} /></label>
        <label>Vencimento<input type="date" {...register("dueDate")} /></label>
        <label>Descricao<input {...register("description")} /></label>
        <button>Cadastrar protesto</button>
      </form>
      <DataTable headers={["Protocolo", "Credor", "Devedor", "Valor", "Vencimento", "Status", "Acoes"]}>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.protocol}</td>
            <td>{item.creditor.name}</td>
            <td>{item.debtor.name}</td>
            <td>R$ {Number(item.amount).toFixed(2)}</td>
            <td>{new Date(item.dueDate).toLocaleDateString("pt-BR")}</td>
            <td>
              <select value={item.status} onChange={(event) => changeStatus(item.id, event.target.value)}>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </td>
            <td className="actions">
              <button className="ghost" onClick={() => receipt(item.id, item.protocol)}>PDF</button>
              <button className="danger" onClick={() => remove(item.id)}>Excluir</button>
            </td>
          </tr>
        ))}
      </DataTable>
    </section>
  );
}
