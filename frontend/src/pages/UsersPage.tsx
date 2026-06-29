import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DataTable } from "../components/DataTable";
import { userSchema } from "../schemas/forms";
import { api } from "../services/api";

type User = { id: string; name: string; email: string; role: string; active: boolean };
type FormData = z.infer<typeof userSchema>;

export function UsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const { register, handleSubmit, reset } = useForm<FormData>({ resolver: zodResolver(userSchema), defaultValues: { role: "EMPLOYEE", active: true } });

  async function load() {
    const response = await api.get("/users");
    setItems(response.data);
  }

  useEffect(() => { load(); }, []);

  async function onSubmit(data: any) {
    await api.post("/users", data);
    reset({ role: "EMPLOYEE", active: true });
    load();
  }

  async function toggle(user: User) {
    await api.put(`/users/${user.id}`, { active: !user.active });
    load();
  }

  async function remove(id: string) {
    await api.delete(`/users/${id}`);
    load();
  }

  return (
    <section className="page">
      <h1>Usuarios</h1>
      <form className="formGrid compact" onSubmit={handleSubmit(onSubmit)}>
        <label>Nome<input {...register("name")} /></label>
        <label>E-mail<input {...register("email")} /></label>
        <label>Senha<input type="password" {...register("password")} /></label>
        <label>Perfil<select {...register("role")}><option value="EMPLOYEE">Funcionario</option><option value="ADMIN">Administrador</option></select></label>
        <label className="check"><input type="checkbox" {...register("active")} /> Ativo</label>
        <button>Cadastrar</button>
      </form>
      <DataTable headers={["Nome", "E-mail", "Perfil", "Ativo", "Acoes"]}>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.role}</td>
            <td>{item.active ? "Sim" : "Nao"}</td>
            <td className="actions">
              <button className="ghost" onClick={() => toggle(item)}>{item.active ? "Desativar" : "Ativar"}</button>
              <button className="danger" onClick={() => remove(item.id)}>Excluir</button>
            </td>
          </tr>
        ))}
      </DataTable>
    </section>
  );
}
