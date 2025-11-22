export function formatRelative(ptDate) {
  const date = typeof ptDate === "string" ? new Date(ptDate) : ptDate;
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `Há ${diff} segundo${diff === 1 ? "" : "s"}`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `Há ${m} minuto${m === 1 ? "" : "s"}`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Há ${h} hora${h === 1 ? "" : "s"}`;
  const d = Math.floor(h / 24);
  if (d < 7) return `Há ${d} dia${d === 1 ? "" : "s"}`;
  return `${date.toLocaleDateString("pt-BR")} às ${date.toLocaleTimeString(
    "pt-BR",
    { hour: "2-digit", minute: "2-digit" }
  )}`;
}
