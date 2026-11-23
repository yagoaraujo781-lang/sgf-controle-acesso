PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS CANTEIRO_OBRA (
    id_canteiro TEXT PRIMARY KEY,
    nome_obra TEXT NOT NULL,
    endereco TEXT NOT NULL,
    status_obra TEXT CHECK(status_obra IN ('ATIVA', 'PAUSADA', 'CONCLUIDA')) DEFAULT 'ATIVA'
);

CREATE TABLE IF NOT EXISTS FUNCIONARIO (
    codigo_cracha TEXT PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    cargo TEXT NOT NULL,
    status_permissao TEXT CHECK(status_permissao IN ('ATIVO', 'SUSPENSO', 'INATIVO')) NOT NULL,
    id_canteiro_alocado TEXT NOT NULL,
    FOREIGN KEY (id_canteiro_alocado) REFERENCES CANTEIRO_OBRA(id_canteiro)
);

CREATE TABLE IF NOT EXISTS REGISTRO_ACESSO (
    id_registro INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_cracha_lido TEXT NOT NULL,
    id_canteiro TEXT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    resultado TEXT CHECK(resultado IN ('AUTORIZADO', 'NEGADO')) NOT NULL,
    motivo_ocorrencia TEXT,
    FOREIGN KEY (id_canteiro) REFERENCES CANTEIRO_OBRA(id_canteiro)
);

INSERT OR IGNORE INTO CANTEIRO_OBRA VALUES ('OBRA-01', 'Residencial Bahia Norte', 'Av. Paralela, Salvador - BA', 'ATIVA');
INSERT OR IGNORE INTO FUNCIONARIO VALUES ('FUNC001', 'João Silva', 'Engenheiro Civil', 'ATIVO', 'OBRA-01');
INSERT OR IGNORE INTO FUNCIONARIO VALUES ('FUNC002', 'Maria Souza', 'Mestre de Obras', 'ATIVO', 'OBRA-01');
INSERT OR IGNORE INTO FUNCIONARIO VALUES ('FUNC003', 'Carlos Lima', 'Eletricista', 'SUSPENSO', 'OBRA-01');
