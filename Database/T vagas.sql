-- Script antigo em MySQL
/*
CREATE TABLE vagas (
    id_vaga INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    nome_da_empresa VARCHAR(255),
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    localizacao VARCHAR(100),
    fonte VARCHAR(255),
    tipo_contrato VARCHAR(50),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);
*/
-- Script convertido para SQLite
CREATE TABLE vagas (
    id_vaga INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    nome_da_empresa TEXT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    localizacao TEXT,
    fonte TEXT,
    tipo_contrato TEXT,
    data_criacao DATETIME DEFAULT (CURRENT_TIMESTAMP),
    data_atualizacao DATETIME DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);
-- Trigger para atualizar data_atualizacao ao atualizar a linha
CREATE TRIGGER IF NOT EXISTS trg_vagas_update_timestamp
AFTER UPDATE ON vagas
FOR EACH ROW
BEGIN
    UPDATE vagas
    SET data_atualizacao = CURRENT_TIMESTAMP
    WHERE id_vaga = OLD.id_vaga;
END;