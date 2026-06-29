import { useEffect, useState } from "react";
import { api } from "../services/api";

type Dashboard = {
  totalTitles: number;
  totalCreditors: number;
  totalDebtors: number;
  totalBatches: number;
  totalAmount: number;
  byStatus: Array<{ status: string; _count: { _all: number } }>;
  byPaymentStatus: Array<{ paymentStatus: string; _count: { _all: number } }>;
  recent: Array<{ id: string; protocol: string; status: string; creditor: { name: string }; debtor: { name: string } }>;
};

export function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    api.get("/dashboard").then((response) => setData(response.data));
  }, []);

  const statusCount = (status: string) => data?.byStatus.find((item) => item.status === status)?._count._all ?? 0;

  return (
    <section className="page">
      <div className="pageHeader">
        <div>
          <h1>Dashboard</h1>
          <p>Acompanhe importacoes, pendencias e status dos protestos.</p>
        </div>
      </div>
      <div className="stats">
        <article><span>Protestos</span><strong>{data?.totalTitles ?? 0}</strong></article>
        <article><span>Importacoes</span><strong>{data?.totalBatches ?? 0}</strong></article>
        <article><span>Credores</span><strong>{data?.totalCreditors ?? 0}</strong></article>
        <article><span>Devedores</span><strong>{data?.totalDebtors ?? 0}</strong></article>
        <article><span>Valor total</span><strong>R$ {Number(data?.totalAmount ?? 0).toFixed(2)}</strong></article>
      </div>
      <div className="stats">
        <article className="metric blue"><span>Importados</span><strong>{statusCount("IMPORTADO")}</strong></article>
        <article className="metric orange"><span>Aguardando pagamento</span><strong>{statusCount("AGUARDANDO_PAGAMENTO")}</strong></article>
        <article className="metric orange"><span>Pendente boleto</span><strong>{statusCount("PENDENTE_BOLETO")}</strong></article>
        <article className="metric orange"><span>Pendente pagamento</span><strong>{statusCount("PENDENTE_PAGAMENTO")}</strong></article>
        <article className="metric green"><span>Pagos</span><strong>{statusCount("PAGO")}</strong></article>
        <article className="metric red"><span>Protestados</span><strong>{statusCount("PROTESTADO")}</strong></article>
        <article className="metric gray"><span>Cancelados</span><strong>{statusCount("CANCELADO")}</strong></article>
        <article className="metric gray"><span>Devolvidos</span><strong>{statusCount("DEVOLVIDO")}</strong></article>
      </div>
      <div className="grid2">
        <section className="panel">
          <h2>Status</h2>
          {data?.byStatus.map((item) => <p key={item.status}>{item.status}: {item._count._all}</p>)}
        </section>
        <section className="panel">
          <h2>Ultimos protestos</h2>
          {data?.recent.map((item) => <p key={item.id}>{item.protocol} - {item.creditor.name} x {item.debtor.name}</p>)}
        </section>
      </div>
    </section>
  );
}
