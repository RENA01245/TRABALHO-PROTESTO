import { useEffect, useState } from "react";
import { api } from "../services/api";

type Dashboard = {
  totalTitles: number;
  totalCreditors: number;
  totalDebtors: number;
  totalAmount: number;
  byStatus: Array<{ status: string; _count: { _all: number } }>;
  recent: Array<{ id: string; protocol: string; status: string; creditor: { name: string }; debtor: { name: string } }>;
};

export function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    api.get("/dashboard").then((response) => setData(response.data));
  }, []);

  return (
    <section className="page">
      <h1>Dashboard</h1>
      <div className="stats">
        <article><span>Titulos</span><strong>{data?.totalTitles ?? 0}</strong></article>
        <article><span>Credores</span><strong>{data?.totalCreditors ?? 0}</strong></article>
        <article><span>Devedores</span><strong>{data?.totalDebtors ?? 0}</strong></article>
        <article><span>Valor total</span><strong>R$ {Number(data?.totalAmount ?? 0).toFixed(2)}</strong></article>
      </div>
      <div className="grid2">
        <section className="panel">
          <h2>Status</h2>
          {data?.byStatus.map((item) => <p key={item.status}>{item.status}: {item._count._all}</p>)}
        </section>
        <section className="panel">
          <h2>Ultimos titulos</h2>
          {data?.recent.map((item) => <p key={item.id}>{item.protocol} - {item.creditor.name} x {item.debtor.name}</p>)}
        </section>
      </div>
    </section>
  );
}
