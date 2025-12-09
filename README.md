# 🛒 TechStore – Projeto Full Stack 

**PROJETO TECHSTORE**  
**Integrantes:** Arthur de Sousa e Bhrenno Borges  
**Disciplina:** Desenvolvimento de Sistemas  
**Data:** 25/11/2025  

Plataforma completa de e-commerce com **backend em .NET 9**, **banco PostgreSQL em Docker** e **frontend em HTML/CSS/JS** comunicando-se via API REST.  
Todo o projeto foi revisado conforme o **BRD**, **ERS** e o documento de evidências incluído na entrega.

## 📂 Estrutura Geral do Repositório


ProjetoFinal-TechStore-main/

│
├── backend/  
│   └── TechStore.AuthApi/  
│       ├── Program.cs  
│       ├── models.cs  
│       ├── appsettings.json  
│       ├── TechStore.AuthApi.csproj  
│       └── ...  
│
├── frontend/  
│   ├── index.html  
│   ├── login.html  
│   ├── register.html  
│   ├── checkout.html  
│   ├── scripts.js  
│   ├── style.css  
│   ├── docker-compose.yml ← docker está aqui  
│   └── ...  
│
├── db/  
│   ├── 01_schema.sql  
│   ├── 02_seeds.sql  
│   └── init/  
│
├── techstore.sln  
└── README.md  

---


## 🚀 Funcionalidades Implementadas

### 🔧 Backend – ASP.NET Core 9

- API REST estruturada conforme o **ERS**.
- Entidades revisadas:  
  **Cliente**, **Endereço**, **Autenticação**, **DTOs**.
- Autenticação via **JWT Bearer**.
- Seeds SQL para categorias e produtos.
- CRUD completo:
  - `/api/auth/*` (registro, login)
  - `/api/clientes`
  - `/api/enderecos`
- Tratamento de erros:
  - CPF inválido
  - JSON inválido
  - 401 sem token
- Interface via Swagger:
http://localhost:5159/swagger



---

### 🗄 Banco de Dados – PostgreSQL (Docker)

- Estrutura padronizada em **snake_case**.
- Migração inicial via `01_schema.sql`.
- Seeds via `02_seeds.sql`.
- Adminer disponível para consulta:  
  http://localhost:8080

Credenciais padrão:
- **User:** techstore  
- **Password:** techstore_pwd  
- **Database:** techstore_db  

---

### 🎨 Frontend – HTML, CSS e JS

Telas implementadas:

- **index.html** – listagem de produtos e filtros por categoria.  
- **login.html** – autenticação com validação.  
- **register.html** – cadastro completo com máscaras e validações.  
- **checkout.html** – protegido por token, exibe carrinho e endereço.

Integração com API utilizando `fetch()` + JWT armazenado no `localStorage`.

---

## ▶️ Como Executar o Projeto

### 📋 Comandos para Rodar no Dia da Apresentação

#### 1️⃣ Navegue até o diretório do projeto:
```powershell
cd "c:\Users\Bhrenno Borges\testDia08\ProjetoFinal-DesenvolvimentoDeSistemas\ProjetoFinal-TechStore-main\techstore"
```

#### 2️⃣ Inicie o Docker (banco de dados):
```powershell
docker-compose up -d
```
Espere a mensagem confirmando que os containers iniciaram.

#### 3️⃣ Verifique se o Docker está rodando:
```powershell
docker ps
```
Deve aparecer:
- `techstore-db` (PostgreSQL)
- `techstore-adminer` (Interface do banco)

#### 4️⃣ Abra novo terminal e navegue até o backend:
```powershell
cd "c:\Users\Bhrenno Borges\testDia08\ProjetoFinal-DesenvolvimentoDeSistemas\ProjetoFinal-TechStore-main\techstore\backend\TechStore.AuthApi"
```

#### 5️⃣ Inicie a aplicação .NET:
```powershell
dotnet run
```

Espere aparecer:
```
Now listening on: http://localhost:5159
Application started. Press Ctrl+C to shut down.
```

---

### ✅ Pronto! Você terá acesso a:

| Serviço | URL | Uso |
|---------|-----|-----|
| **Swagger** | http://localhost:5159/swagger | Testar APIs |
| **Adminer** | http://localhost:8080 | Visualizar banco de dados |
| **Frontend** | frontend/index.html | Abrir no navegador |

### 🔐 Credenciais do Adminer:
- **Sistema:** PostgreSQL
- **Servidor:** 172.18.0.2 ou localhost ou techstore-db
- **Usuário:** techstore
- **Senha:** techstore_pwd
- **Base de dados:** techstore_db

---

### 🧪 Fluxo de Testes:

#### Via Swagger:
1. **POST /api/auth/register** – Cadastre um novo usuário
2. **POST /api/auth/login** – Faça login e copie o token
3. **Clique em "Authorize"** – Cole: `Bearer {seu_token}`
4. **GET /api/enderecos** – Acesse recurso protegido

#### Via Frontend:
1. Abra `register.html` → Cadastre usuário
2. Abra `login.html` → Faça login
3. Veja o token salvo em: F12 → Application → Local Storage

#### Via Adminer:
1. Acesse http://localhost:8080
2. Login com credenciais acima
3. Veja as tabelas `clientes` e `enderecos` populadas

---

### 🛑 Para parar tudo:
```powershell
# Terminal do backend: Ctrl+C
# Terminal do Docker:
docker-compose down
```

🧪 Evidências da Aplicação
As evidências demonstram:

Registro e login funcionando

CRUD completo

Endereços funcionando

Erros tratados

Banco estruturado e populado

Arquivo incluso na entrega:
TechStore_Evidencias_Frontend.pdf

📚 Requisitos Atendidos (BRD & ERS)
✔ Fluxo de autenticação
✔ Cadastro de clientes
✔ Endereços
✔ Catálogo de produtos
✔ Checkout
✔ Banco Dockerizado
✔ JWT funcionando
✔ Frontend integrado
✔ Evidências conforme solicitado
