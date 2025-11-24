--Script antigo em MySQL
/*
CREATE TABLE candidaturas (
    id_candidatura INT PRIMARY KEY AUTO_INCREMENT,
    id_vaga INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Enviado',
    link_curriculo VARCHAR(500),
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- serve como data da candidatura
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vaga) REFERENCES vagas(id_vaga) ON DELETE CASCADE
);
*/
-- Script convertido para SQLite
CREATE TABLE candidaturas (
    id_candidatura INTEGER PRIMARY KEY AUTOINCREMENT,
    id_vaga INTEGER NOT NULL,
    status TEXT DEFAULT 'Enviado',
    link_curriculo TEXT,
    observacoes TEXT,
    data_criacao DATETIME DEFAULT (CURRENT_TIMESTAMP),  -- serve como data da candidatura
    data_atualizacao DATETIME DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY (id_vaga) REFERENCES vagas(id_vaga) ON DELETE CASCADE
);
-- Trigger para atualizar data_atualizacao ao atualizar a linha
CREATE TRIGGER IF NOT EXISTS trg_candidaturas_update_timestamp
AFTER UPDATE ON candidaturas
FOR EACH ROW
BEGIN
    UPDATE candidaturas
    SET data_atualizacao = CURRENT_TIMESTAMP
    WHERE id_candidatura = OLD.id_candidatura;
END;