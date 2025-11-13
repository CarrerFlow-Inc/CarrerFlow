import React from "react";
import Card from "../components/ui/card";
import SectionHeader from "../components/ui/sectionheader";
import FormField from "../components/ui/formfield";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = React.useState({ name: user?.name || "", email: user?.email || "" });
  const [saving, setSaving] = React.useState(false);
  const [pw, setPw] = React.useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    setForm({ name: user.name || "", email: user.email || "" });
  }, [user]);

  function toast(type, message) {
    window.dispatchEvent(new CustomEvent('toast:show', { detail: { type, message } }));
  }

  const initials = React.useMemo(() => {
    const n = String(user?.name || "").trim();
    if (!n) return "";
    const parts = n.split(/\s+/).slice(0,2);
    return parts.map(p => p[0]?.toUpperCase() || '').join('');
  }, [user]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!user) return;
    try {
      setSaving(true);
  api.updateUser(user.id, { name: form.name, email: form.email });
      toast('success', 'Perfil atualizado com sucesso');
      // Optionally, you could update auth context here if needed
    } catch (err) {
      toast('error', err.message || 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!user) return;
    if (!pw.next || pw.next.length < 6) {
      toast('error', 'A nova senha deve ter ao menos 6 caracteres');
      return;
    }
    if (pw.next !== pw.confirm) {
      toast('error', 'As senhas não coincidem');
      return;
    }
    try {
      setPwSaving(true);
      await api.changePassword(user.id, pw.current, pw.next);
      toast('success', 'Senha alterada com sucesso');
      setPw({ current: "", next: "", confirm: "" });
    } catch (err) {
      toast('error', err.message || 'Erro ao alterar senha');
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Perfil"
        subtitle="Gerencie suas informações pessoais e de acesso"
      />

      <Card>
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-[120px,1fr] gap-6 items-start">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="w-20 h-20 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-semibold">
              {initials || 'US'}
            </div>
            <div className="type-caption text-gray-500">Foto de perfil</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nome">
              <Input
                type="text"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Seu nome"
                required
              />
            </FormField>
            <FormField label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="voce@exemplo.com"
                required
              />
            </FormField>
            <div className="md:col-span-2 flex items-center justify-end gap-2 mt-2">
              <Button variant="outline" type="button" onClick={() => setForm({ name: user?.name || '', email: user?.email || '' })}>Cancelar</Button>
              <Button variant="primary" type="submit" loading={saving}>Salvar alterações</Button>
            </div>
          </div>
        </form>
      </Card>

      <Card title="Segurança">
        <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Senha atual">
            <Input type="password" value={pw.current} onChange={(e) => setPw(p => ({ ...p, current: e.target.value }))} placeholder="••••••" required />
          </FormField>
          <FormField label="Nova senha">
            <Input type="password" value={pw.next} onChange={(e) => setPw(p => ({ ...p, next: e.target.value }))} placeholder="Mín. 6 caracteres" required />
          </FormField>
          <FormField label="Confirmar nova senha">
            <Input type="password" value={pw.confirm} onChange={(e) => setPw(p => ({ ...p, confirm: e.target.value }))} placeholder="Repita a nova senha" required />
          </FormField>
          <div className="md:col-span-3 flex items-center justify-end gap-2">
            <Button variant="primary" type="submit" loading={pwSaving}>Alterar senha</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
