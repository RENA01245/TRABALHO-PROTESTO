import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import { formatDate } from "../utils/date";
import { statuses } from "./TitlesPage";

type Protest = {
  id: string;
  protocol: string;
  titleNumber: string;
  amount: number;
  dueDate: string;
  presentationDate: string;
  status: string;
  paymentStatus: string;
  hasBoleto: boolean;
  boletoDueDate?: string;
  boletoAmount?: number;
  notes?: string;
  debtor: { name: string; document: string; documentType: string; address?: string; city?: string; state?: string; zipCode?: string };
  creditor: { name: string; document: string; documentType: string };
  attachments: Array<{ id: string; fileName: string; fileUrl: string; attachmentType: string; createdAt: string }>;
  payments: Array<{ id: string; amount: number; status: string; paymentDate?: string; paymentMethod?: string; notes?: string; createdAt: string }>;
  histories: Array<{ id: string; action: string; oldValue?: string; newValue?: string; description?: string; createdAt: string; user: { name: string } }>;
};

export function ProtestDetailPage() {
  const { id } = useParams();
  const [protest, setProtest] = useState<Protest | null>(null);
  const [status, setStatus] = useState("IMPORTADO");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [boletoFile, setBoletoFile] = useState<File | null>(null);
  const [boletoAmount, setBoletoAmount] = useState("");
  const [boletoDueDate, setBoletoDueDate] = useState("");
  const [payment, setPayment] = useState({ amount: "", paymentDate: "", paymentMethod: "", status: "INFORMADO", notes: "" });

  async function load() {
    setLoading(true);
    const response = await api.get(`/titles/${id}`);
    setProtest(response.data);
    setStatus(response.data.status);
    setBoletoAmount(response.data.boletoAmount ? String(response.data.boletoAmount) : "");
    setBoletoDueDate(response.data.boletoDueDate ? response.data.boletoDueDate.slice(0, 10) : "");
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function changeStatus() {
    setMessage("");
    setError("");
    try {
      await api.patch(`/titles/${id}/status`, { status, note });
      setMessage("Status atualizado com sucesso.");
      setNote("");
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erro ao alterar status.");
    }
  }

  async function saveBoleto() {
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      if (boletoFile) formData.append("file", boletoFile);
      formData.append("attachmentType", "BOLETO");
      if (boletoAmount) formData.append("boletoAmount", boletoAmount);
      if (boletoDueDate) formData.append("boletoDueDate", boletoDueDate);
      formData.append("notes", note || "Boleto anexado ou atualizado.");
      await api.post(`/titles/${id}/attachments`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage("Boleto salvo com sucesso.");
      setBoletoFile(null);
      setNote("");
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erro ao salvar boleto.");
    }
  }

  async function savePayment() {
    setMessage("");
    setError("");
    try {
      await api.post(`/titles/${id}/payments`, {
        amount: Number(payment.amount),
        paymentDate: payment.paymentDate || undefined,
        paymentMethod: payment.paymentMethod || undefined,
        status: payment.status,
        notes: payment.notes || undefined
      });
      setMessage("Pagamento registrado com sucesso.");
      setPayment({ amount: "", paymentDate: "", paymentMethod: "", status: "INFORMADO", notes: "" });
      load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erro ao registrar pagamento.");
    }
  }

  function receipt() {
    api.get(`/titles/${id}/receipt`, { responseType: "blob" }).then((response) => {
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${protest?.protocol ?? "protesto"}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  if (loading) return <section className="page"><p>Carregando detalhes...</p></section>;
  if (!protest) return <section className="page"><p>Protesto nao encontrado.</p></section>;

  return (
    <section className="page">
      <div className="pageHeader">
        <div>
          <Link to="/protestos">Voltar para protestos</Link>
          <h1>{protest.protocol}</h1>
          <p>{protest.titleNumber} - {protest.debtor.name}</p>
        </div>
        <button onClick={receipt}>Baixar PDF</button>
      </div>
      {message && <div className="alert successBox">{message}</div>}
      {error && <div className="alert errorBox">{error}</div>}

      <div className="detailGrid">
        <section className="panel">
          <h2>Dados do protesto</h2>
          <p><strong>Valor:</strong> R$ {Number(protest.amount).toFixed(2)}</p>
          <p><strong>Vencimento:</strong> {formatDate(protest.dueDate)}</p>
          <p><strong>Apresentacao:</strong> {formatDate(protest.presentationDate)}</p>
          <p><strong>Status:</strong> <span className={`badge ${protest.status}`}>{protest.status}</span></p>
          <p><strong>Pagamento:</strong> <span className={`badge ${protest.paymentStatus}`}>{protest.paymentStatus}</span></p>
          <p><strong>Observacoes:</strong> {protest.notes || "Sem observacoes"}</p>
        </section>
        <section className="panel">
          <h2>Devedor</h2>
          <p><strong>{protest.debtor.name}</strong></p>
          <p>{protest.debtor.documentType}: {protest.debtor.document}</p>
          <p>{[protest.debtor.address, protest.debtor.city, protest.debtor.state, protest.debtor.zipCode].filter(Boolean).join(" - ")}</p>
          <h2>Credor</h2>
          <p><strong>{protest.creditor.name}</strong></p>
          <p>{protest.creditor.documentType}: {protest.creditor.document}</p>
        </section>
      </div>

      <div className="detailGrid">
        <section className="panel formPanel">
          <h2>Alterar status / pendencia</h2>
          <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Observacao<input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Motivo, pendencia ou observacao" /></label>
          <button onClick={changeStatus}>Salvar status</button>
        </section>
        <section className="panel formPanel">
          <h2>Boleto</h2>
          <label>Arquivo<input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(event) => setBoletoFile(event.target.files?.[0] ?? null)} /></label>
          <label>Valor do boleto<input type="number" step="0.01" value={boletoAmount} onChange={(event) => setBoletoAmount(event.target.value)} /></label>
          <label>Vencimento do boleto<input type="date" value={boletoDueDate} onChange={(event) => setBoletoDueDate(event.target.value)} /></label>
          <button onClick={saveBoleto}>Salvar boleto</button>
          {protest.attachments.map((item) => <p key={item.id}>{item.attachmentType}: {item.fileName}</p>)}
        </section>
      </div>

      <div className="detailGrid">
        <section className="panel formPanel">
          <h2>Registrar pagamento</h2>
          <label>Valor pago<input type="number" step="0.01" value={payment.amount} onChange={(event) => setPayment({ ...payment, amount: event.target.value })} /></label>
          <label>Data<input type="date" value={payment.paymentDate} onChange={(event) => setPayment({ ...payment, paymentDate: event.target.value })} /></label>
          <label>Forma<input value={payment.paymentMethod} onChange={(event) => setPayment({ ...payment, paymentMethod: event.target.value })} /></label>
          <label>Status<select value={payment.status} onChange={(event) => setPayment({ ...payment, status: event.target.value })}><option>PENDENTE</option><option>INFORMADO</option><option>CONFIRMADO</option><option>CANCELADO</option></select></label>
          <label>Observacao<input value={payment.notes} onChange={(event) => setPayment({ ...payment, notes: event.target.value })} /></label>
          <button onClick={savePayment}>Registrar pagamento</button>
        </section>
        <section className="panel">
          <h2>Historico</h2>
          {protest.histories.map((item) => (
            <div className="historyLine" key={item.id}>
              <strong>{item.action}</strong>
              <span>{item.user.name} - {new Date(item.createdAt).toLocaleString("pt-BR")}</span>
              <p>{item.description}</p>
              {(item.oldValue || item.newValue) && <small>{item.oldValue || "-"} {"->"} {item.newValue || "-"}</small>}
            </div>
          ))}
        </section>
      </div>
    </section>
  );
}
