-- 01_schema.sql

DROP TABLE IF EXISTS pagamentos CASCADE;
DROP TABLE IF EXISTS itens_pedido CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS enderecos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;

-- =========================
-- TABELA: clientes
-- =========================
CREATE TABLE clientes (
    id              SERIAL PRIMARY KEY,
    nome_completo   VARCHAR(140) NOT NULL,
    email           VARCHAR(120) NOT NULL UNIQUE,
    cpf             VARCHAR(11) NOT NULL UNIQUE,
    telefone        VARCHAR(20),
    nome_usuario    VARCHAR(50) NOT NULL UNIQUE,
    senha_hash      TEXT NOT NULL,
    criado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- TABELA: enderecos
-- =========================
CREATE TABLE enderecos (
    id              SERIAL PRIMARY KEY,
    cliente_id      INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    apelido         VARCHAR(50),
    cep             VARCHAR(8) NOT NULL,
    rua             VARCHAR(120) NOT NULL,
    numero          VARCHAR(20) NOT NULL,
    complemento     VARCHAR(120),
    bairro          VARCHAR(120) NOT NULL,
    cidade          VARCHAR(120) NOT NULL,
    estado          VARCHAR(2) NOT NULL,
    principal       BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_enderecos_cliente
    ON enderecos (cliente_id);

-- =========================
-- TABELA: categorias
-- =========================
CREATE TABLE categorias (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    descricao   VARCHAR(255)
);

CREATE UNIQUE INDEX uq_categorias_nome
    ON categorias (nome);

-- =========================
-- TABELA: produtos
-- =========================
CREATE TABLE produtos (
    id                      SERIAL PRIMARY KEY,
    categoria_id            INT NOT NULL REFERENCES categorias(id),
    nome                    VARCHAR(200) NOT NULL,
    descricao               TEXT NOT NULL,
    marca                   VARCHAR(100),
    especificacoes_tecnicas TEXT,
    preco                   NUMERIC(10,2) NOT NULL,
    quantidade_estoque      INT NOT NULL DEFAULT 0,
    imagem_url              VARCHAR(500),
    ativo                   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_produtos_categoria
    ON produtos (categoria_id);

CREATE INDEX idx_produtos_nome
    ON produtos (nome);

-- =========================
-- TABELA: pedidos
-- =========================
CREATE TABLE pedidos (
    id                      SERIAL PRIMARY KEY,
    cliente_id              INT NOT NULL REFERENCES clientes(id),
    endereco_entrega_id     INT NOT NULL REFERENCES enderecos(id),
    criado_em               TIMESTAMP NOT NULL DEFAULT NOW(),
    status                  VARCHAR(30) NOT NULL, -- ex: Criado, AguardandoPagamento, Pago, Cancelado, Enviado
    valor_total             NUMERIC(10,2) NOT NULL,
    metodo_pagamento        VARCHAR(20) NOT NULL, -- CARTAO, PIX, BOLETO
    codigo_transacao        VARCHAR(50),
    pagamento_confirmado    BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_pedidos_cliente
    ON pedidos (cliente_id);

CREATE INDEX idx_pedidos_status
    ON pedidos (status);

-- =========================
-- TABELA: itens_pedido
-- =========================
CREATE TABLE itens_pedido (
    id              SERIAL PRIMARY KEY,
    pedido_id       INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id      INT NOT NULL REFERENCES produtos(id),
    quantidade      INT NOT NULL,
    preco_unitario  NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_itens_pedido_pedido
    ON itens_pedido (pedido_id);

-- =========================
-- TABELA: pagamentos
-- =========================
CREATE TABLE pagamentos (
    id              SERIAL PRIMARY KEY,
    pedido_id       INT NOT NULL REFERENCES pedidos(id) UNIQUE,
    status          VARCHAR(20) NOT NULL,  -- ex: PENDENTE, APROVADO, NEGADO
    metodo          VARCHAR(20) NOT NULL,  -- CARTAO, PIX, BOLETO
    codigo_gateway  VARCHAR(50),
    criado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);
