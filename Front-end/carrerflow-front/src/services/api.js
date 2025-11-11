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

    // ordenação
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
      // recent (default): createdAt desc
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
      createdAt: new Date().toISOString(),
    };
    db.candidaturas.push(newItem);
    _writeDb(db);
    return newItem;
  },

  updateCandidatura(id, patch) {
    const db = _readDb();
    const idx = db.candidaturas.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Não encontrado");
    db.candidaturas[idx] = { ...db.candidaturas[idx], ...patch };
    _writeDb(db);
    return db.candidaturas[idx];
  },

  deleteCandidatura(id) {
    const db = _readDb();
    db.candidaturas = db.candidaturas.filter((c) => c.id !== id);
    _writeDb(db);
    return true;
  },
};
