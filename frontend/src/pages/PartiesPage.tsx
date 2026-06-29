import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DataTable } from "../components/DataTable";
import { partySchema } from "../schemas/forms";
import { api } from "../services/api";

type Party = { id: string; name: string; document: string; email?: string; phone?: string };
type Props = { type: "creditors" | "debtors"; title: string };

export function PartiesPage({ type, title }: Props) {
  const [items, setItems] = useState<Party[]>([]);
  const [search, setSearch] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(partySchema) });

  async function load() {
    const response = await api.get(`/${type}`, { params: { search } });
    setItems(response.data);
  }

  useEffect(() => { load(); }, [type]);

  async function onSubmit(data: any) {
    await api.post(`/${type}`, data);
    reset();
    load();
  }

  async function remove(id: string) {
    await api.delete(`/${type}/${id}`);
    load();
  }

  return (
    <section className="page">
      <h1>{title}</h1>
      <div className="toolbar">
        <input placeholder="Pesquisar por nome ou documento" value={search} onChange={(event) => setSearch(event.target.value)} />
        <button onClick={load}>Pesquisar</button>
      </div>
      <form className="formGrid" onSubmit={handleSubmit(onSubmit)}>
        <label>Nome<input {...register("name")} /></label>
        <label>CPF/CNPJ<input {...register("document")} /></label>
        <label>E-mail<input {...register("email")} /></label>
        <label>Telefone<input {...register("phone")} /></label>
        <label>Endereco<input {...register("address")} /></label>
        <label>Cidade<input {...register("city")} /></label>
        <label>UF<input {...register("state")} maxLength={2} /></label>
        <label>CEP<input {...register("zipCode")} /></label>
        <button>Cadastrar</button>
      </form>
      {Object.values(errors).length > 0 && <p className="error">Verifique os campos obrigatorios.</p>}
      <DataTable headers={["Nome", "Documento", "E-mail", "Telefone", "Acoes"]}>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.document}</td>
            <td>{item.email}</td>
            <td>{item.phone}</td>
            <td><button className="danger" onClick={() => remove(item.id)}>Excluir</button></td>
          </tr>
        ))}
      </DataTable>
    </section>
  );
}
