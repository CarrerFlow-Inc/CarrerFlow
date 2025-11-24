import React, { useState } from 'react';
import AuthLayout from '../components/auth/authlayout';
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import { api } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Informe um e-mail');
      return;
    }
    // Mock: apenas valida existência e mostra mensagem
    try {
      const dbUser = (function(){
        try { return api.login(email, '___wrong___'); } catch { return null; }})();
      if (!dbUser) {
        setError('E-mail não encontrado');
        return;
      }
      setSent(true);
      window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'success', message: 'Instruções enviadas (simulação)' } }));
    } catch {
      setError('Falha ao processar. Tente novamente');
    }
  }

  return (
    <AuthLayout title="Recuperar Senha" subtitle="Digite seu e-mail para receber instruções.">
      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulário de recuperação de senha">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm" role="alert">{error}</div>}
        {sent && <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm" role="status">Se este e-mail existir, enviaremos instruções.</div>}
        <Input label="E-mail" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu.email@exemplo.com" />
        <Button type="submit" variant="charcoal" disabled={!email.trim()} aria-label="Enviar instruções" className="w-full [&>span]:justify-center">Enviar</Button>
      </form>
    </AuthLayout>
  );
}