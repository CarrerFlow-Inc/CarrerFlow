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
