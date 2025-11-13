import React, { useState, useEffect } from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import { STATUS_LABELS } from "../../utils/statusColors";

const STATUS_OPTIONS = STATUS_LABELS;

export default function CandidaturaForm({ initial = {}, onCancel, onSave }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [source, setSource] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [errors, setErrors] = useState({ link: "" });
  const [original, setOriginal] = useState({});

  useEffect(() => {
    if (initial && initial.id) {
      setTitle(initial.title || "");
      setCompany(initial.company || "");
      setLocation(initial.location || "");
      setDate((initial.createdAt && initial.createdAt.slice(0,10)) || "");
      setSource(initial.source || "");
      setLink(initial.link || "");
      setStatus(initial.status || STATUS_OPTIONS[0]);
      setOriginal({
        title: initial.title || "",
        company: initial.company || "",
        location: initial.location || "",
        date: (initial.createdAt && initial.createdAt.slice(0,10)) || "",
        source: initial.source || "",
        link: initial.link || "",
        status: initial.status || STATUS_OPTIONS[0],
      });
    } else {
      setTitle("");
      setCompany("");
      setLocation("");
      setDate("");
      setSource("");
      setLink("");
      setStatus(STATUS_OPTIONS[0]);
      setOriginal({ title: "", company: "", location: "", date: "", source: "", link: "", status: STATUS_OPTIONS[0] });
    }
  }, [initial]);

  function validateLink(v) {
    if (!v) return "";
    try { new URL(v); return ""; } catch { return "Informe uma URL válida (ex.: https://...)"; }
  }

  useEffect(() => {
    setErrors((prev) => ({ ...prev, link: validateLink(link) }));
  }, [link]);

  const isDirty = () => (
    title !== original.title ||
    company !== original.company ||
    location !== original.location ||
    date !== original.date ||
    source !== original.source ||
    link !== original.link ||
    status !== original.status
  );

  function handleSubmit(e) {
    e.preventDefault();
    const linkError = validateLink(link);
    if (linkError) {
      setErrors((prev) => ({ ...prev, link: linkError }));
      return;
    }
    const payload = { title, company, location, status };
    if (date) payload.createdAt = new Date(date).toISOString();
    if (source) payload.source = source;
    if (link) payload.link = link;
    onSave && onSave(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Vaga *" value={title} onChange={e => setTitle(e.target.value)} required autoFocus />
      <Input label="Empresa *" value={company} onChange={e => setCompany(e.target.value)} required />
      <Input label="Local" value={location} onChange={e => setLocation(e.target.value)} />
      <label className="block text-sm">
        <span className="block type-subtle mb-1">Data da Candidatura</span>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" />
      </label>
      <Input label="Fonte" value={source} onChange={e => setSource(e.target.value)} placeholder="LinkedIn, Indeed, Site da Empresa" />
      <Input label="Link da Vaga" value={link} onChange={e => setLink(e.target.value)} type="url" placeholder="https://..." error={errors.link} />
      <label className="block text-sm">
  <span className="block type-subtle mb-1">Status</span>
        <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={() => { if (!isDirty() || window.confirm('Descartar alterações?')) onCancel && onCancel(); }} className="px-4 py-2 border rounded-md">Cancelar</button>
        <Button type="submit" variant="charcoal">Salvar</Button>
      </div>
    </form>
  );
}
