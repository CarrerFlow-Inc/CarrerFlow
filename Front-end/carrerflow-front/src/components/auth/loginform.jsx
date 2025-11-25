import React, { useState } from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      const user = api.login(email, password);
      login(user);
      navigate("/");
    } catch (error) {
      setErr(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {err && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {err}
        </div>
      )}
      
      <Input 
        label="E-mail" 
        type="email"
        placeholder="seu.email@exemplo.com"
        value={email} 
        onChange={e => setEmail(e.target.value)}
        required
      />
      
      <Input 
        label="Senha" 
        type="password"
        placeholder="••••••••"
        value={password} 
        onChange={e => setPassword(e.target.value)}
        required
      />
      
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">Lembrar de mim</span>
        </label>
        <a href="/forgot" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Esqueceu a senha?
        </a>
      </div>
      
      <div className="flex justify-center">
        <Button type="submit" variant="charcoal" className="w-full [&>span]:justify-center" aria-label="Entrar">
          Entrar
        </Button>
      </div>

      {/* Social login directly below primary submit for tighter grouping */}
      <div className="space-y-2">
        <div className="flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
          <span className="px-2 type-caption text-gray-500">ou</span>
          <div className="w-full border-t border-gray-200" />
        </div>
        <button
          type="button"
          aria-label="Entrar com Google"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 active:scale-[.985] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 btn-hover"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          <span className="font-medium text-gray-700">Entrar com Google</span>
        </button>
      </div>
    </form>
  );
}
