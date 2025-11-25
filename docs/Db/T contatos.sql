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
