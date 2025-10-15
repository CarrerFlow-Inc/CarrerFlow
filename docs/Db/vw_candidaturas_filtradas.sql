CREATE OR REPLACE VIEW vw_candidaturas_filtradas AS
SELECT 
    c.id_candidatura,
    v.id_usuario AS id_usuario,
    v.nome_da_empresa AS empresa,
    v.titulo AS vaga,
    v.fonte,
    c.status,
    c.data_criacao AS data_candidatura,
    c.data_atualizacao
FROM candidaturas c
JOIN vagas v ON c.id_vaga = v.id_vaga;