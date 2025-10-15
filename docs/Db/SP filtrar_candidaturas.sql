DELIMITER $$

CREATE PROCEDURE filtrar_candidaturas(
	IN p_nome_da_empresa VARCHAR(255),
	IN p_titulo VARCHAR(255),
    IN p_status VARCHAR(50),
    IN p_data_inicio DATE,
    IN p_data_fim DATE,
    IN p_data_atualizacao DATE
)
BEGIN
    SELECT 
		v.nome_da_empresa as empresa,
        v.titulo AS vaga,
        v.fonte,
        c.status,
        c.data_criacao AS data_candidatura,
        c.data_atualizacao
    FROM candidaturas c
    JOIN vagas v ON c.id_vaga = v.id_vaga
    WHERE (p_nome_da_empresa IS NULL OR v.nome_da_empresa LIKE CONCAT('%', p_nome_da_empresa, '%'))
	  AND (p_titulo IS NULL OR v.titulo LIKE CONCAT('%', p_titulo, '%'))
      AND (p_status IS NULL OR c.status = p_status)
      AND (p_data_inicio IS NULL OR c.data_criacao >= p_data_inicio)
      AND (p_data_fim IS NULL OR c.data_criacao <= p_data_fim)
      AND (p_data_atualizacao IS NULL OR c.data_atualizacao >= p_data_atualizacao);
END$$

DELIMITER ;