import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { loginSchema } from "../schemas/forms";
import { useAuth } from "../services/auth";

type FormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, user } = useAuth();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(loginSchema) });
  if (user) return <Navigate to="/" replace />;

  async function onSubmit(data: FormData) {
    setError("");
    try {
      await login(data.email, data.password);
    } catch {
      setError("Credenciais invalidas");
    }
  }

  return (
    <div className="loginPage">
      <form className="loginPanel" onSubmit={handleSubmit(onSubmit)}>
        <h1>Sistema de Protesto</h1>
        <label>E-mail<input {...register("email")} /></label>
        {errors.email && <small className="error">{errors.email.message}</small>}
        <label>Senha<input type="password" {...register("password")} /></label>
        {errors.password && <small className="error">{errors.password.message}</small>}
        {error && <p className="error">{error}</p>}
        <button disabled={isSubmitting}>{isSubmitting ? "Entrando..." : "Entrar"}</button>
      </form>
    </div>
  );
}
