Exemplos de Uso da view e procedure

VIEW: vw_candidaturas_filtradas

Exemplo 1 — Listar todas as candidaturas
SELECT * FROM vw_candidaturas_filtradas;

Exemplo 2 — Filtrar candidaturas ativas
SELECT * FROM vw_candidaturas_filtradas WHERE status = 'ativa';

Exemplo 3 — Filtrar candidaturas entre duas datas
SELECT * FROM vw_candidaturas_filtradas WHERE data_criacao BETWEEN '2025-01-01' AND '2025-12-31';

Exemplo 4 — Filtrar candidaturas ativas criadas em 2025
SELECT * FROM vw_candidaturas_filtradas WHERE status = 'ativa' AND YEAR(data_criacao) = 2025;


PROCEDURE: filtrar_candidaturas

A procedure permite filtrar dinamicamente por parâmetros:
- Nome da empresa
- Título da vaga
- Status
- Intervalo de datas
- Data de modificacao mais recente

Exemplo 1 — Todas as candidaturas
CALL filtrar_candidaturas(
    p_nome_da_empresa := NULL
    p_titulo := NULL,
    p_status := NULL,
    p_data_inicio := NULL,
    p_data_fim := NULL,
    p_data_atualizacao:= NULL
);

Exemplo 2 — Candidaturas de um usuário com status "ativa"
CALL sp_filtrar_candidaturas(
    p_nome_da_empresa := NULL
    p_titulo := NULL,
    p_status := 'ativa',
    p_data_inicio := NULL,
    p_data_fim := NULL,
    p_data_atualizacao:= NULL
);

Exemplo 3 — Candidaturas em um intervalo de datas
CALL sp_filtrar_candidaturas(
    p_nome_da_empresa := NULL
    p_titulo := NULL,
    p_status := NULL,
    p_data_inicio := '2025-01-01',
    p_data_fim := '2025-06-30',
    p_data_atualizacao:= NULL
);

Exemplo 4 — Candidaturas filtradas por título da vaga
CALL sp_filtrar_candidaturas(
    p_nome_da_empresa := NULL
    p_titulo := 'Analista',
    p_status := NULL,
    p_data_inicio := NULL,
    p_data_fim := NULL,
    p_data_atualizacao:= NULL
);

Exemplo 5 — Combinação de filtros
Buscar candidaturas com status ativa,
entre janeiro e junho de 2025 e que contenham
a palavra "Analista" no título da vaga:

CALL sp_filtrar_candidaturas(
    p_nome_da_empresa := NULL
    p_titulo := 'Analista',
    p_status := 'ativa',
    p_data_inicio := '2025-01-01',
    p_data_fim := '2025-06-30',
    p_data_atualizacao:= NULL
);
