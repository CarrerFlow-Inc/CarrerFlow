const KEY = "carrerflow_db_v1";

function _readDb() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const seed = {
      users: [
        {
          id: "u1",
          name: "Fulano Silva",
          email: "fulano@exemplo.com",
          password: "123456",
        },
      ],
      candidaturas: [
        {
          id: "c1",
          userId: "u1",
          title: "Desenvolvedor Back-End",
          company: "CarrerFlow Inc",
          location: "Manaus, AM",
          status: "Em Análise",
          createdAt: "2025-09-19T12:00:00Z",
        },
        {
          id: "c2",
          userId: "u1",
          title: "Desenvolvedor Java",
          company: "Startup Inovadora",
          location: "São Paulo, SP",
          status: "Entrevista Técnica",
          createdAt: "2025-08-18T10:00:00Z",
        },
        {
          id: "c3",
          userId: "u1",
          title: "Desenvolvedor .NET",
          company: "Banco Laranjinha",
          location: "Remoto",
          status: "Aplicada",
          createdAt: "2025-09-20T09:00:00Z",
        },
      ],
      settings: [
        {
          userId: "u1",
          language: "pt-BR",
          timeZone: "America/Sao_Paulo",
          theme: "light",
          notifications: {
            email: true,
            push: false,
            reminders: true,
          },
        },
      ],
    };
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw);
}

function _writeDb(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export const api = {
  registerUser(user) {
    const db = _readDb();
    if (db.users.find((u) => u.email === user.email)) {
      throw new Error("Email já cadastrado");
    }
    const newUser = { ...user, id: Date.now().toString() };
    db.users.push(newUser);
    _writeDb(db);
    return {
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    };
  },

  login(email, password) {
    const db = _readDb();
    const user = db.users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error("Credenciais inválidas");
    return { id: user.id, name: user.name, email: user.email };
  },

  getUser(userId) {
    const db = _readDb();
    const u = db.users.find((x) => x.id === userId);
    if (!u) return null;
    const { password: PASSWORD_OMIT, ...safe } = u;
    return safe;
  },

  updateUser(userId, { name, email }) {
    const db = _readDb();
    const idx = db.users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error("Usuário não encontrado");
    if (email && db.users.some((u, i) => i !== idx && u.email === email)) {
      throw new Error("Email já cadastrado");
    }
    const current = db.users[idx];
    const next = {
      ...current,
      name: name ?? current.name,
      email: email ?? current.email,
    };
    db.users[idx] = next;
    _writeDb(db);
    const { password: PASSWORD_OMIT2, ...safe } = next;
    return safe;
  },

  changePassword(userId, currentPassword, newPassword) {
    const db = _readDb();
    const idx = db.users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error("Usuário não encontrado");
    const user = db.users[idx];
    if (String(user.password) !== String(currentPassword)) {
      throw new Error("Senha atual incorreta");
    }
    db.users[idx] = { ...user, password: String(newPassword || "") };
    _writeDb(db);
    return true;
  },

  getCandidaturas(
    userId,
    { page = 1, perPage = 6, status = null, q = null, sort = "recent" } = {}
  ) {
    let db = _readDb();
    let items = db.candidaturas.filter((c) => c.userId === userId);

    if (status) {
      items = items.filter(
        (i) => String(i.status).toLowerCase() === String(status).toLowerCase()
      );
    }

    if (q) {
      const query = q.toLowerCase();
      items = items.filter(
        (i) =>
          (i.title || "").toLowerCase().includes(query) ||
          (i.company || "").toLowerCase().includes(query)
      );
    }

    if (sort === "oldest") {
      items = items.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (sort === "company") {
      items = items.sort((a, b) =>
        String(a.company || "").localeCompare(String(b.company || ""))
      );
    } else if (sort === "status") {
      items = items.sort((a, b) =>
        String(a.status || "").localeCompare(String(b.status || ""))
      );
    } else {
      items = items.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    const total = items.length;
    const start = (page - 1) * perPage;
    const paged = items.slice(start, start + perPage);

    return {
      items: paged,
      meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
    };
  },

  getCandidatura(id) {
    const db = _readDb();
    return db.candidaturas.find((c) => c.id === id) || null;
  },

  createCandidatura(userId, candidatura) {
    const db = _readDb();
    const newItem = {
      ...candidatura,
      id: Date.now().toString(),
      userId,
      createdAt: candidatura.createdAt
        ? candidatura.createdAt
        : new Date().toISOString(),
    };
    db.candidaturas.push(newItem);
    _writeDb(db);
    try {
      window.dispatchEvent(
        new CustomEvent("candidaturas:changed", {
          detail: { type: "create", id: newItem.id },
        })
      );
      window.dispatchEvent(
        new CustomEvent("candidatura:updated", { detail: { id: newItem.id } })
      );
    } catch {
      /* evento ignorado */
    }
    return newItem;
  },

  updateCandidatura(id, patch) {
    const db = _readDb();
    const idx = db.candidaturas.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Não encontrado");
    db.candidaturas[idx] = { ...db.candidaturas[idx], ...patch };
    _writeDb(db);
    try {
      window.dispatchEvent(
        new CustomEvent("candidaturas:changed", {
          detail: { type: "update", id },
        })
      );
      window.dispatchEvent(
        new CustomEvent("candidatura:updated", { detail: { id } })
      );
    } catch {
      /* evento ignorado */
    }
    return db.candidaturas[idx];
  },

  deleteCandidatura(id) {
    const db = _readDb();
    db.candidaturas = db.candidaturas.filter((c) => c.id !== id);
    _writeDb(db);
    try {
      window.dispatchEvent(
        new CustomEvent("candidaturas:changed", {
          detail: { type: "delete", id },
        })
      );
      window.dispatchEvent(
        new CustomEvent("candidatura:deleted", { detail: { id } })
      );
    } catch {
      /* evento ignorado */
    }
    return true;
  },

  getSettings(userId) {
    const db = _readDb();
    let s = db.settings && db.settings.find((x) => x.userId === userId);
    if (!s) {
      s = {
        userId,
        language: "pt-BR",
        timeZone:
          Intl.DateTimeFormat().resolvedOptions().timeZone ||
          "America/Sao_Paulo",
        theme: "light",
        notifications: { email: true, push: false, reminders: true },
      };
      db.settings = Array.isArray(db.settings) ? db.settings : [];
      db.settings.push(s);
      _writeDb(db);
    }
    return { ...s };
  },

  updateSettings(userId, patch) {
    const db = _readDb();
    const idx = (db.settings || []).findIndex((x) => x.userId === userId);
    if (idx === -1) throw new Error("Configurações não encontradas");
    const current = db.settings[idx];
    const next = {
      ...current,
      ...patch,
      notifications: {
        ...current.notifications,
        ...(patch.notifications || {}),
      },
    };
    db.settings[idx] = next;
    _writeDb(db);
    return { ...next };
  },

  getAnalytics(
    userId,
    { range = "30d", company = null, location = null } = {}
  ) {
    const db = _readDb();
    const allItems = db.candidaturas.filter((c) => c.userId === userId);

    const now = new Date();
    const rangeDays = range === "12m" ? 365 : range === "90d" ? 90 : 30;
    const startDate = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000);
    const prevStart = new Date(
      startDate.getTime() - rangeDays * 24 * 60 * 60 * 1000
    );
    const prevEnd = startDate;

    function matchesFilters(c) {
      if (company && String(c.company) !== String(company)) return false;
      if (location && String(c.location) !== String(location)) return false;
      return true;
    }

    const currentPeriod = allItems.filter(
      (c) =>
        matchesFilters(c) &&
        new Date(c.createdAt) >= startDate &&
        new Date(c.createdAt) <= now
    );
    const previousPeriod = allItems.filter(
      (c) =>
        matchesFilters(c) &&
        new Date(c.createdAt) >= prevStart &&
        new Date(c.createdAt) < prevEnd
    );

    function isOferta(status) {
      const s = String(status || "").toLowerCase();
      return (
        s.includes("oferta") || s.includes("proposta") || s.includes("aceita")
      );
    }
    function isEntrevista(status) {
      const s = String(status || "").toLowerCase();
      return s.includes("entrevista");
    }
    function isAnalise(status) {
      const s = String(status || "").toLowerCase();
      return s.includes("anal");
    }

    const total = currentPeriod.length;
    const emAnalise = currentPeriod.filter((c) => isAnalise(c.status)).length;
    const entrevistas = currentPeriod.filter((c) =>
      isEntrevista(c.status)
    ).length;
    const ofertas = currentPeriod.filter((c) => isOferta(c.status)).length;
    const conversionRate = total
      ? Math.round((ofertas / total) * 1000) / 10
      : 0;

    const prevTotals = {
      total: previousPeriod.length,
      emAnalise: previousPeriod.filter((c) => isAnalise(c.status)).length,
      entrevistas: previousPeriod.filter((c) => isEntrevista(c.status)).length,
      ofertas: previousPeriod.filter((c) => isOferta(c.status)).length,
    };
    prevTotals.conversionRate = prevTotals.total
      ? Math.round((prevTotals.ofertas / prevTotals.total) * 1000) / 10
      : 0;

    function delta(curr, prev) {
      if (!prev) return null;
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 1000) / 10;
    }

    const deltas = {
      total: delta(total, prevTotals.total),
      emAnalise: delta(emAnalise, prevTotals.emAnalise),
      entrevistas: delta(entrevistas, prevTotals.entrevistas),
      ofertas: delta(ofertas, prevTotals.ofertas),
      conversionRate: delta(conversionRate, prevTotals.conversionRate),
    };

    const byStatus = currentPeriod.reduce((acc, it) => {
      const key = it.status || "";
      acc.set(key, (acc.get(key) || 0) + 1);
      return acc;
    }, new Map());
    const summary = Array.from(byStatus.entries()).map(([label, count]) => ({
      label,
      count,
    }));

    const byCompany = currentPeriod.reduce((acc, it) => {
      const key = it.company || "(Sem empresa)";
      acc.set(key, (acc.get(key) || 0) + 1);
      return acc;
    }, new Map());
    const companies = Array.from(byCompany.entries())
      .map(([companyName, count]) => ({
        company: companyName,
        count,
        share: total ? Math.round((count / total) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    let timeline = [];
    if (range === "12m") {
      const monthMap = new Map();
      currentPeriod.forEach((c) => {
        const d = new Date(c.createdAt);
        const label = d.toLocaleDateString("pt-BR", { month: "short" });
        const entry = monthMap.get(label) || { label, total: 0, ofertas: 0 };
        entry.total += 1;
        if (isOferta(c.status)) entry.ofertas += 1;
        monthMap.set(label, entry);
      });
      timeline = Array.from(monthMap.values()).map((e) => ({
        ...e,
        conversionRate: e.total
          ? Math.round((e.ofertas / e.total) * 1000) / 10
          : 0,
      }));
    } else if (range === "90d") {
      const weekMap = new Map();
      currentPeriod.forEach((c) => {
        const d = new Date(c.createdAt);
        const weekNum = Math.floor((now - d) / (7 * 24 * 60 * 60 * 1000));
        const label = `S-${weekNum}`;
        const entry = weekMap.get(label) || { label, total: 0, ofertas: 0 };
        entry.total += 1;
        if (isOferta(c.status)) entry.ofertas += 1;
        weekMap.set(label, entry);
      });
      timeline = Array.from(weekMap.values()).map((e) => ({
        ...e,
        conversionRate: e.total
          ? Math.round((e.ofertas / e.total) * 1000) / 10
          : 0,
      }));
    } else {
      const dayMap = new Map();
      currentPeriod.forEach((c) => {
        const d = new Date(c.createdAt);
        const label = d.toISOString().slice(0, 10);
        const entry = dayMap.get(label) || { label, total: 0, ofertas: 0 };
        entry.total += 1;
        if (isOferta(c.status)) entry.ofertas += 1;
        dayMap.set(label, entry);
      });
      timeline = Array.from(dayMap.values()).map((e) => ({
        ...e,
        conversionRate: e.total
          ? Math.round((e.ofertas / e.total) * 1000) / 10
          : 0,
      }));
    }

    const heatWeeks = [];
    const dayMs = 24 * 60 * 60 * 1000;
    for (let w = 0; w < Math.ceil(rangeDays / 7); w++) {
      const weekStart = new Date(startDate.getTime() + w * 7 * dayMs);
      const days = [];
      for (let dIdx = 0; dIdx < 7; dIdx++) {
        const dayDate = new Date(weekStart.getTime() + dIdx * dayMs);
        if (dayDate > now) {
          days.push({ date: dayDate.toISOString().slice(0, 10), count: 0 });
          continue;
        }
        const count = currentPeriod.filter((c) => {
          const cd = new Date(c.createdAt);
          return (
            cd.toISOString().slice(0, 10) === dayDate.toISOString().slice(0, 10)
          );
        }).length;
        days.push({ date: dayDate.toISOString().slice(0, 10), count });
      }
      heatWeeks.push({ weekIndex: w, days });
    }

    return {
      totals: { total, emAnalise, entrevistas, ofertas, conversionRate },
      previousTotals: prevTotals,
      deltas,
      summary,
      companies,
      timeline,
      heatmap: heatWeeks,
      range,
      filters: {
        company,
        location,
        availableCompanies: Array.from(
          new Set(allItems.map((i) => i.company).filter(Boolean))
        ),
        availableLocations: Array.from(
          new Set(allItems.map((i) => i.location).filter(Boolean))
        ),
      },
    };
  },
};
