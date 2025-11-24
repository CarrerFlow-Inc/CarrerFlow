-- Script antigo em MySQL
/*
CREATE TABLE contatos (
    id_contato INT AUTO_INCREMENT PRIMARY KEY,
    id_vaga INT NOT NULL,
    nome_do_contato VARCHAR(150) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(150),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vaga) REFERENCES vagas(id_vaga) ON DELETE CASCADE
);
*/
-- Script convertido para SQLite
CREATE TABLE contatos (
    id_contato INTEGER PRIMARY KEY AUTOINCREMENT,
    id_vaga INTEGER NOT NULL,
    nome_do_contato TEXT NOT NULL,
    telefone TEXT,
    email TEXT,
    data_criacao DATETIME DEFAULT (CURRENT_TIMESTAMP),
    data_atualizacao DATETIME DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY (id_vaga) REFERENCES vagas(id_vaga) ON DELETE CASCADE
);
-- Trigger para atualizar data_atualizacao ao atualizar a linha
CREATE TRIGGER IF NOT EXISTS trg_contatos_update_timestamp
AFTER UPDATE ON contatos
FOR EACH ROW
BEGIN
    UPDATE contatos
    SET data_atualizacao = CURRENT_TIMESTAMP
    WHERE id_contato = OLD.id_contato;
END;