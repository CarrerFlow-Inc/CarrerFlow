-- Script antigo em MySQL
/*
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
*/
-- Script convertido para SQLite
CREATE TABLE usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    data_criacao DATETIME DEFAULT (CURRENT_TIMESTAMP),
    data_atualizacao DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

-- Trigger para atualizar data_atualizacao ao atualizar a linha
CREATE TRIGGER IF NOT EXISTS trg_usuarios_update_timestamp
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN
    UPDATE usuarios
    SET data_atualizacao = CURRENT_TIMESTAMP
    WHERE id_usuario = OLD.id_usuario;
END;