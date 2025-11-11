import React, { useState } from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    
    if (password !== confirmPassword) {
      setErr("As senhas não coincidem");
      return;
    }
    
    if (password.length < 6) {
      setErr("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    try {
      api.registerUser({ name, email, password });
      navigate("/login");
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
        label="Nome completo" 
        placeholder="João Silva"
        value={name} 
        onChange={e => setName(e.target.value)}
        required
      />
      
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
        placeholder="Mínimo 6 caracteres"
        value={password} 
        onChange={e => setPassword(e.target.value)}
        required
      />
      
      <Input 
        label="Confirmar senha" 
        type="password"
        placeholder="Digite a senha novamente"
        value={confirmPassword} 
        onChange={e => setConfirmPassword(e.target.value)}
        required
      />
      
      <Button type="submit" variant="charcoal" className="w-full mt-6">
        Criar conta
      </Button>
      
      <div className="mt-4">
        <button type="button" className="w-full border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="w-5 h-5"/>
          <span className="font-medium text-gray-700">Cadastrar com Google</span>
        </button>
      </div>
    </form>
  );
}
