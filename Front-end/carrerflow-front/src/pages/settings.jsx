import React from "react";
import Card from "../components/ui/card";
import SectionHeader from "../components/ui/sectionheader";
import FormField from "../components/ui/formfield";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import Skeleton from "../components/ui/skeleton";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    language: "pt-BR",
    timeZone: "America/Sao_Paulo",
    theme: "light",
    notifications: { email: true, push: false, reminders: true },
  });

  function toast(type, message) {
    window.dispatchEvent(new CustomEvent('toast:show', { detail: { type, message } }));
  }

  React.useEffect(() => {
    if (!user) return;
    try {
      const s = api.getSettings(user.id);
      setForm(s);
    } catch {
      toast('error', 'Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;
    try {
      setSaving(true);
      api.updateSettings(user.id, form);
      toast('success', 'Configurações salvas');
    } catch {
      toast('error', 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Configurações"
        subtitle="Preferências da conta e do aplicativo"
      />
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Preferências de Conta">
            <div className="grid grid-cols-1 gap-4">
              <FormField label="Idioma">
                <select
                  className="w-full border rounded-lg px-4 py-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={form.language}
                  onChange={(e) => setForm(f => ({ ...f, language: e.target.value }))}
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                </select>
              </FormField>
              <FormField label="Fuso horário">
                <Input
                  type="text"
                  value={form.timeZone}
                  onChange={(e) => setForm(f => ({ ...f, timeZone: e.target.value }))}
                  placeholder="America/Sao_Paulo"
                />
              </FormField>
              <FormField label="Tema">
                <select
                  className="w-full border rounded-lg px-4 py-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={form.theme}
                  onChange={(e) => setForm(f => ({ ...f, theme: e.target.value }))}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="system">Sistema</option>
                </select>
              </FormField>
            </div>
          </Card>
          <Card title="Notificações">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" checked={!!form.notifications.email} onChange={(e) => setForm(f => ({ ...f, notifications: { ...f.notifications, email: e.target.checked } }))} />
                <span className="type-body-sm">Receber por e-mail</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" checked={!!form.notifications.push} onChange={(e) => setForm(f => ({ ...f, notifications: { ...f.notifications, push: e.target.checked } }))} />
                <span className="type-body-sm">Notificações push</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" checked={!!form.notifications.reminders} onChange={(e) => setForm(f => ({ ...f, notifications: { ...f.notifications, reminders: e.target.checked } }))} />
                <span className="type-body-sm">Lembretes de atividades</span>
              </label>
            </div>
          </Card>
          <div className="md:col-span-2 flex items-center justify-end">
            <Button variant="primary" type="submit" loading={saving}>Salvar configurações</Button>
          </div>
        </form>
      )}
    </div>
  );
}
