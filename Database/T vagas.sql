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
