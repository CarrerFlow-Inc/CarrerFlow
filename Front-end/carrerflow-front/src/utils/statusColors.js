const STATUS_DEFINITIONS = [
  {
    key: "aplicada",
    label: "Aplicada",
    hex: "#2196F3",
    aliases: ["aplicada"],
  },
  {
    key: "em-analise",
    label: "Em Análise",
    hex: "#FF9800",
    aliases: ["em analise", "em análise", "analise", "análise"],
  },
  {
    key: "entrevista-rh",
    label: "Entrevista RH",
    hex: "#9C27B0",
    aliases: ["entrevista rh", "rh"],
  },
  {
    key: "entrevista-tecnica",
    label: "Entrevista Técnica",
    hex: "#3F51B5",
    aliases: ["entrevista tecnica", "tecnica"],
  },
  {
    key: "entrevista-agendada",
    label: "Entrevista Agendada",
    hex: "#00BCD4",
    aliases: [
      "entrevista agendada",
      "agendada",
      "entrevista marcada",
      "marcada",
    ],
  },
  {
    key: "entrevista-com-gestor",
    label: "Entrevista com Gestor",
    hex: "#8BC34A",
    aliases: ["entrevista com gestor", "gestor"],
  },
  {
    key: "oferta-recebida",
    label: "Oferta Recebida",
    hex: "#4CAF50",
    aliases: ["oferta recebida", "oferta", "proposta"],
  },
  {
    key: "aceita",
    label: "Aceita",
    hex: "#388E3C",
    aliases: ["aceita", "aceito"],
  },
  {
    key: "recusada",
    label: "Recusada",
    hex: "#757575",
    aliases: ["recusada", "rejeitada", "recusado"],
  },
  {
    key: "nao-selecionado",
    label: "Não Selecionado",
    hex: "#F44336",
    aliases: [
      "não selecionado",
      "nao selecionado",
      "nao-selecionado",
      "nao_selecionado",
    ],
  },
];

const STATUS_BY_CANON = new Map();

const canonicalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_\s-]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");

STATUS_DEFINITIONS.forEach((status) => {
  const tokens = new Set([
    status.key,
    status.label,
    ...(status.aliases || []),
    status.label.replace(/\s+/g, "-"),
    status.label.replace(/\s+/g, "_"),
  ]);

  tokens.forEach((token) => {
    const canon = canonicalize(token);
    if (!STATUS_BY_CANON.has(canon)) {
      STATUS_BY_CANON.set(canon, status);
    }
  });
});

const hexToRgb = (hex) => {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) return null;
  const bigint = parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};

const buildTone = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb;
  return {
    text: hex,
    background: `rgba(${r}, ${g}, ${b}, 0.14)`,
    border: `rgba(${r}, ${g}, ${b}, 0.28)`,
  };
};

const DEFAULT_TONE = buildTone("#9CA3AF");

const resolveStatus = (status) => {
  if (!status) return null;
  const canon = canonicalize(status);
  if (!canon) return null;
  return STATUS_BY_CANON.get(canon) || null;
};

export const STATUS_OPTIONS = STATUS_DEFINITIONS.map(({ key, label }) => ({
  key,
  label,
}));

export const STATUS_LABELS = STATUS_DEFINITIONS.map(({ label }) => label);

export function getStatusMeta(status) {
  return resolveStatus(status) || null;
}

export function getStatusLabel(status) {
  const meta = resolveStatus(status);
  if (meta) return meta.label;
  return typeof status === "string" && status.trim() ? status : "";
}

export function getStatusTone(status) {
  const meta = resolveStatus(status);
  const tone = meta ? buildTone(meta.hex) : DEFAULT_TONE;
  return tone || DEFAULT_TONE;
}

export function getStatusHex(status) {
  const meta = resolveStatus(status);
  return meta ? meta.hex : DEFAULT_TONE.text;
}

export function listStatuses() {
  return STATUS_DEFINITIONS.map((meta) => ({ ...meta }));
}
