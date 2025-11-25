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

### 1️⃣ Subir o Banco de Dados

O arquivo está dentro da pasta **frontend**:

```bash
cd frontend
docker compose up -d
Isso inicia:

PostgreSQL (5432)

Adminer (8080)

2️⃣ Iniciar a API
bash
Copiar código
cd ../backend/TechStore.AuthApi
dotnet run
API em:

arduino
Copiar código
http://localhost:5159
3️⃣ Fluxo de Autenticação
Registro
arduino
Copiar código
POST /api/auth/register
Login
bash
Copiar código
POST /api/auth/login
Retorno esperado:

json
Copiar código
{
  "token": "xxxxx.yyyyy.zzzzz",
  "nomeCompleto": "...",
  "email": "..."
}
4️⃣ Executar o Frontend
Abra:

frontend/index.html

frontend/login.html

frontend/register.html

frontend/checkout.html

Ou use Live Server no VS Code.

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
