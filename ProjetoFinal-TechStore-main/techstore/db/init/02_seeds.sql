-- 02_seeds.sql

-- =========================
-- CATEGORIAS
-- =========================
INSERT INTO categorias (nome, descricao) VALUES
('Notebooks', 'Notebooks para uso pessoal e profissional'),
('Periféricos', 'Teclados, mouses, headsets e outros periféricos'),
('Monitores', 'Monitores de diversas polegadas e resoluções'),
('Armazenamento', 'HDs, SSDs e soluções de armazenamento');


-- =========================
-- PRODUTOS
-- =========================
INSERT INTO produtos
    (categoria_id, nome, descricao, marca, especificacoes_tecnicas, preco, quantidade_estoque, imagem_url, ativo)
VALUES
    (1,
     'Notebook TechStore Pro 15',
     'Notebook para uso profissional, ideal para desenvolvimento e produtividade.',
     'TechStore',
     'Intel Core i7, 16GB RAM, 512GB SSD, Tela 15,6" Full HD, Windows 11',
     6499.90,
     10,
     'https://exemplo.com/imagens/notebook-pro-15.png',
     TRUE),

    (1,
     'Notebook TechStore Slim 14',
     'Notebook leve e compacto para uso no dia a dia.',
     'TechStore',
     'Intel Core i5, 8GB RAM, 256GB SSD, Tela 14" Full HD, Windows 11',
     4299.90,
     15,
     'https://exemplo.com/imagens/notebook-slim-14.png',
     TRUE),

    (2,
     'Mouse Gamer RGB',
     'Mouse gamer com DPI ajustável e iluminação RGB.',
     'HyperClick',
     'Sensor óptico 16000 DPI, 6 botões programáveis, RGB',
     199.90,
     50,
     'https://exemplo.com/imagens/mouse-gamer-rgb.png',
     TRUE),

    (2,
     'Teclado Mecânico ABNT2',
     'Teclado mecânico com layout ABNT2 e switches blue.',
     'KeyMaster',
     'Switch Blue, ABNT2, retroiluminação branca',
     349.90,
     30,
     'https://exemplo.com/imagens/teclado-mecanico-abnt2.png',
     TRUE),

    (3,
     'Monitor 27" IPS 144Hz',
     'Monitor gamer com alta taxa de atualização e painel IPS.',
     'VisionX',
     '27", IPS, 144Hz, 1ms, HDMI/DisplayPort',
     1799.90,
     20,
     'https://exemplo.com/imagens/monitor-27-ips-144hz.png',
     TRUE),

    (4,
     'SSD NVMe 1TB',
     'SSD NVMe de alta performance para desktops e notebooks.',
     'SpeedStorage',
     '1TB NVMe, leitura 3500MB/s, gravação 3000MB/s',
     599.90,
     40,
     'https://exemplo.com/imagens/ssd-nvme-1tb.png',
     TRUE);


-- =========================
-- CLIENTE DE TESTE
-- (ATENÇÃO: senha_hash aqui é apenas um texto provisório)
-- =========================
INSERT INTO clientes
    (nome_completo, email, cpf, telefone, nome_usuario, senha_hash)
VALUES
    ('Cliente Teste', 'cliente.teste@techstore.com', '12345678901', '61999990000', 'clienteteste', 'HASH_DA_SENHA_AQUI');


-- =========================
-- ENDEREÇO DO CLIENTE DE TESTE
-- =========================
INSERT INTO enderecos
    (cliente_id, apelido, cep, rua, numero, complemento, bairro, cidade, estado, principal)
VALUES
    (1, 'Casa', '70000000', 'Rua Exemplo', '123', 'Apto 101', 'Bairro Central', 'Brasília', 'DF', TRUE);
