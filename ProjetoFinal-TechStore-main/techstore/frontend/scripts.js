let textoPesquisa = ""
let categoriaAtual = "all"
let produtos = [
  {
    id: 1,
    nome: "iPhone 15 Pro",
    categoria: "smartphones",
    preco: 7999,
    precoOriginal: 8999,
    desconto: 11,
    imagem: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
    descricao: "Smartphone Apple com câmera avançada"
  },
  {
    id: 2,
    nome: "MacBook Air M2",
    categoria: "laptops",
    preco: 8999,
    precoOriginal: 10999,
    desconto: 18,
    imagem: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    descricao: "Notebook Apple ultrafino e potente"
  },
  {
    id: 3,
    nome: "AirPods Pro",
    categoria: "headphones",
    preco: 1899,
    precoOriginal: 2299,
    desconto: 17,
    imagem: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400",
    descricao: "Fones sem fio com cancelamento de ruído"
  },
  {
    id: 4,
    nome: "Samsung Galaxy S24",
    categoria: "smartphones",
    preco: 5499,
    precoOriginal: 6299,
    desconto: 13,
    imagem: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
    descricao: "Smartphone Samsung com tela AMOLED"
  },
  {
    id: 5,
    nome: "Apple Watch Series 9",
    categoria: "smartwatch",
    preco: 3299,
    precoOriginal: 3799,
    desconto: 13,
    imagem: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
    descricao: "Relógio inteligente com monitoramento"
  },
  {
    id: 6,
    nome: "Teclado Mecânico",
    categoria: "accessories",
    preco: 499,
    precoOriginal: null,
    desconto: null,
    imagem: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
    descricao: "Teclado mecânico RGB para gamers"
  },
  {
    id: 7,
    nome: "Sony WH-1000XM5",
    categoria: "headphones",
    preco: 2499,
    precoOriginal: 2999,
    desconto: 17,
    imagem: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
    descricao: "Fone com cancelamento de ruído"
  },
  {
    id: 8,
    nome: "Dell XPS 13",
    categoria: "laptops",
    preco: 7999,
    precoOriginal: null,
    desconto: null,
    imagem: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400",
    descricao: "Notebook Windows premium"
  }
];

let containerProdutos = document.querySelector(".products-container")
let input = document.querySelector(".search-input")
let todosBotoes = document.querySelectorAll(".category-btn")



function mostrarProdutos() {
  let htmlProdutos = ""

  let produtosFiltrados = produtos.filter(prd => {

    let passouCategoria = (categoriaAtual === "all" || prd.categoria === categoriaAtual)


    let passouPesquisa = prd.nome.toLowerCase().includes(textoPesquisa.toLowerCase())

    return passouPesquisa && passouCategoria
  })


  produtosFiltrados.forEach(prd => {
    htmlProdutos = htmlProdutos + `
    <div class="products-card">
      <img class="products-img" src="${prd.imagem}" alt="${prd.nome}">
      <div class="products-info">
        <h3 class="products-name">${prd.nome}</h3>
        <p class="products-description">${prd.descricao}</p>
        <p class="products-price">
          <del style="opacity:.6" hidden="${!prd.precoOriginal}">R$ ${money(prd.precoOriginal || 0)}</del>
          <strong>R$ ${money(prd.preco)}</strong>
        </p>


        <div class="products-actions">
          <button class="products-button" data-id="${prd.id}" data-action="details">
            Ver Detalhes
          </button>
          <button class="icon-cart-btn btn-add-cart" title="Adicionar ao carrinho" aria-label="Adicionar ao carrinho" data-id="${prd.id}">
            <i class="fa-solid fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  });



  containerProdutos.innerHTML = htmlProdutos

}




containerProdutos.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-add-cart");
  if (!btn) return;
  const id = Number(btn.getAttribute("data-id"));
  addToCart(id, 1);
});




function pesquisar() {
  textoPesquisa = input.value

  mostrarProdutos()
}

function trocarCategoria(categoria) {
  categoriaAtual = categoria

  todosBotoes.forEach(botao => {
    botao.classList.remove("active")

    if (botao.getAttribute("data-category") === categoria) {
      botao.classList.add("active")
    }
  })

  mostrarProdutos()
}

window.addEventListener('DOMContentLoaded', () => {


  mostrarProdutos()


  input.addEventListener('input', pesquisar)


  todosBotoes.forEach(botao => {
    botao.addEventListener('click', () => {
      let categoria = botao.getAttribute("data-category")


      trocarCategoria(categoria)
    })
  })
})

document.addEventListener("DOMContentLoaded", () => {
  renderUserArea();
  renderCartBadge();
});


function renderUserArea() {
  const container = document.getElementById("user-area");
  if (!container) return;

  const token = localStorage.getItem("authToken");
  const fullName = localStorage.getItem("userName");
  const username = localStorage.getItem("userUsername");
  const email = localStorage.getItem("userEmail");

  if (token && isTokenExpired(token)) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userUsername");
  }

  if (isLogged() && (username || fullName)) {
    container.innerHTML = `
      <button class="cart-btn" id="btnCart" aria-label="Carrinho">
        <i class="fa-solid fa-cart-shopping"></i>
        <span class="cart-badge" id="cartQty" hidden>0</span>
      </button>
      <button type="button" class="user-menu-btn" id="btnUserMenu" aria-haspopup="dialog" aria-expanded="false">
        <i class="fa-solid fa-user"></i>
      </button>
    `;
    ensureUserSheet({ fullName, username, email }); // jÃ¡ existia
    ensureCartSheet(); // prepara o painel do carrinho
    document.getElementById("btnUserMenu")?.addEventListener("click", openUserSheet);
    document.getElementById("btnCart")?.addEventListener("click", openCartOrRedirect);
    renderCartBadge();
  } else {
    container.innerHTML = `
      <button class="cart-btn" id="btnCart" aria-label="Carrinho">
        <i class="fa-solid fa-cart-shopping"></i>
      </button>
      <a class="btn-login" href="login.html">Entrar</a>
    `;
    document.getElementById("btnCart")?.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
}


function ensureUserSheet({ fullName, username, email }) {
  if (document.getElementById("sheetOverlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "sheet-overlay";
  overlay.id = "sheetOverlay";

  const sheet = document.createElement("div");
  sheet.className = "sheet";
  sheet.id = "userSheet";
  sheet.setAttribute("role", "dialog");
  sheet.setAttribute("aria-modal", "true");
  sheet.setAttribute("aria-labelledby", "sheetTitle");

  const displayUser = username ? `@${username}` : (fullName || "");
  const firstName = (fullName || "").trim().split(" ")[0] || "Cliente";

  sheet.innerHTML = `
  <div class="sheet-grip"></div>
  <div class="sheet-header">
    <div class="sheet-title" id="sheetTitle">Olá¡, ${firstName}</div>
    <button class="sheet-close" id="closeSheet" aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button>
  </div>

  <div class="sheet-body">
    <div class="sheet-tabs" role="tablist" aria-label="Área do usuário">
      <button class="sheet-tab" role="tab" aria-selected="true" aria-controls="tab-perfil" id="tabbtn-perfil">
        <i class="fa-solid fa-id-card"></i> Perfil
      </button>
      <button class="sheet-tab" role="tab" aria-selected="false" aria-controls="tab-pedidos" id="tabbtn-pedidos">
        <i class="fa-solid fa-bag-shopping"></i> Pedidos
      </button>
      <button class="sheet-tab" role="tab" aria-selected="false" aria-controls="tab-enderecos" id="tabbtn-enderecos">
        <i class="fa-solid fa-location-dot"></i> Endereços
      </button>
      <button class="sheet-tab" role="tab" aria-selected="false" aria-controls="tab-seguranca" id="tabbtn-seguranca">
        <i class="fa-solid fa-shield-halved"></i> Segurança
      </button>
    </div>

    <!-- Paineis -->
    <section id="tab-perfil" class="sheet-panel" role="tabpanel" aria-labelledby="tabbtn-perfil">
      <div class="profile-box">
        <div class="profile-line"><span class="profile-key">Nome</span><span class="profile-val">${fullName || "-"}</span></div>
        <div class="profile-line"><span class="profile-key">Usuário</span><span class="profile-val">${displayUser || "-"}</span></div>
        <div class="profile-line"><span class="profile-key">E-mail</span><span class="profile-val">${email || "-"}</span></div>
      </div>
    </section>

    <section id="tab-pedidos" class="sheet-panel is-hidden" role="tabpanel" aria-labelledby="tabbtn-pedidos">
      <div id="pedidosList" class="list"></div>
    </section>

    <section id="tab-enderecos" class="sheet-panel is-hidden" role="tabpanel" aria-labelledby="tabbtn-enderecos">
      <div id="enderecosList" class="list"></div>
    </section>

    <section id="tab-seguranca" class="sheet-panel is-hidden" role="tabpanel" aria-labelledby="tabbtn-seguranca">
      <div class="item"><strong>Alterar senha</strong><p class="muted">Gancho preparado. Exponha <code>PATCH /api/conta/senha</code>.</p></div>
      <div class="item"><strong>SessÃµes ativas</strong><p class="muted">Gancho <code>GET/DELETE /api/sessoes</code>.</p></div>
    </section>
  </div>

  <footer class="sheet-footer">
    <button class="logout-danger" id="doLogout">
      <i class="fa-solid fa-right-from-bracket"></i> Sair da conta
    </button>
  </footer>
`;


  document.body.appendChild(overlay);
  document.body.appendChild(sheet);


  overlay.addEventListener("click", closeUserSheet);
  document.getElementById("closeSheet")?.addEventListener("click", closeUserSheet);
  document.getElementById("doLogout")?.addEventListener("click", () => {
    if (window.Auth?.logout) { Auth.logout(); } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userUsername");
    }
    window.location.href = "login.html";
  });


  const tabButtons = Array.from(sheet.querySelectorAll('[role="tab"]'));
  const tabPanels = Array.from(sheet.querySelectorAll('[role="tabpanel"]'));
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.setAttribute("aria-selected", b === btn ? "true" : "false"));
      tabPanels.forEach(p => p.classList.toggle("is-hidden", p.id !== btn.getAttribute("aria-controls")));
    });
  });


  renderPedidosEmpty();
  initEnderecosTab();
  initSecurityTab();


  enableDragToClose(sheet, overlay);
}

function openUserSheet() {
  document.getElementById("sheetOverlay")?.classList.add("open");
  document.getElementById("userSheet")?.classList.add("open");
  const btn = document.getElementById("btnUserMenu");
  if (btn) btn.setAttribute("aria-expanded", "true");
}
function closeUserSheet() {
  document.getElementById("sheetOverlay")?.classList.remove("open");
  document.getElementById("userSheet")?.classList.remove("open");
  const btn = document.getElementById("btnUserMenu");
  if (btn) btn.setAttribute("aria-expanded", "false");
}


function renderPedidosEmpty() {
  const el = document.getElementById("pedidosList");
  if (!el) return;
  el.innerHTML = `
    <div class="empty">
      <strong>Nenhum pedido ainda.</strong><br/>
      Quando vocÃª expor <code>GET /api/pedidos?meus</code>, eu listo aqui (nÂº, status, total, data) e permito abrir o detalhamento.
    </div>
  `;
}

function renderEnderecosEmpty() {
  const el = document.getElementById("enderecosList");
  if (!el) return;
  el.innerHTML = `
    <div class="empty">
      <strong>Nenhum endereÃ§o cadastrado.</strong><br/>
      Assim que houver <code>GET/POST/PUT/DELETE /api/enderecos</code>, eu renderizo cards para adicionar/editar/remover.
    </div>
  `;
}


// ======= Config/Helpers de API (scripts.js) =======
const API_BASE = "http://localhost:5159"; // mantenha igual ao Auth.init
function authHeaders() {
  const t = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(t ? { Authorization: `Bearer ${t}` } : {})
  };
}

// ======= SeguranÃ§a: Alterar senha =======
function initSecurityTab() {
  const panel = document.getElementById("tab-seguranca");
  if (!panel) return;
  panel.innerHTML = `
    <div class="item">
      <strong>Alterar senha</strong>
      <form id="formSenha" class="grid" style="margin-top:.5rem;">
        <div class="auth-field">
          <label>Senha atual</label>
          <input id="pwAtual" type="password" required />
        </div>
        <div class="auth-field">
          <label>Nova senha</label>
          <input id="pwNova" type="password" required
                 pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$"
                 title="MÃ­n. 8, maiÃºscula, minÃºscula e nÃºmero" />
        </div>
        <div class="auth-actions full">
          <button class="auth-btn" type="submit">Salvar</button>
        </div>
        <div id="pwMsg" class="muted" style="margin-top:.5rem;"></div>
      </form>
    </div>
  `;

  panel.querySelector("#formSenha").addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      senhaAtual: panel.querySelector("#pwAtual").value || "",
      novaSenha: panel.querySelector("#pwNova").value || ""
    };
    const msg = panel.querySelector("#pwMsg");
    msg.textContent = "Salvando...";

    const resp = await fetch(`${API_BASE}/api/conta/senha`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(body)
    });

    if (resp.ok) {
      msg.textContent = "Senha alterada com sucesso.";
      panel.querySelector("#formSenha").reset();
    } else {
      const txt = await resp.text().catch(() => "");
      msg.textContent = txt || "Não foi possível alterar a senha.";
    }
  });
}

// ======= EndereÃ§os: CRUD =======
function initEnderecosTab() {
  const list = document.getElementById("enderecosList");
  if (!list) return;

  async function load() {
    list.innerHTML = `<div class="empty">Carregando endereços...</div>`;
    const resp = await fetch(`${API_BASE}/api/enderecos`, { headers: authHeaders() });
    if (!resp.ok) { list.innerHTML = `<div class="empty">Falha ao carregar.</div>`; return; }
    const data = await resp.json().catch(() => []);
    renderList(data);
  }

  function renderList(items) {
    const cards = items.map(it => `
      <div class="item" data-id="${it.id}">
        <div>
          <strong>${it.apelido || "Endereço"}</strong>
          ${it.principal ? `<span class="tag" style="margin-left:.5rem;">Principal</span>` : ""}
          <p class="muted">${it.logradouro}, ${it.numero}${it.complemento ? " - " + it.complemento : ""}</p>
          <p class="muted">${it.bairro} - ${it.cidade}/${it.estado} • CEP ${it.cep}</p>
        </div>
        <div style="display:flex; gap:.5rem;">
          <button class="auth-btn" data-act="edit" style="width:auto;">Editar</button>
          <button class="logout-danger" data-act="del" style="width:auto;">Excluir</button>
        </div>
      </div>
    `).join("");

    list.innerHTML = `
      <div class="item">
        <form id="formNovo" class="grid">
          <div class="auth-field"><label>Apelido</label><input id="ap" placeholder="Casa/Trabalho"/></div>
          <div class="auth-field"><label>CEP</label><input id="cep" required inputmode="numeric" /></div>
          <div class="auth-field full"><label>Logradouro</label><input id="logr" required /></div>
          <div class="auth-field"><label>Número</label><input id="num" required /></div>
          <div class="auth-field"><label>Compl.</label><input id="comp" /></div>
          <div class="auth-field"><label>Bairro</label><input id="bairro" required /></div>
          <div class="auth-field"><label>Cidade</label><input id="cidade" required /></div>
          <div class="auth-field"><label>UF</label><input id="uf" maxlength="2" required /></div>
          <label style="display:flex; gap:.5rem; align-items:center;">
            <input type="checkbox" id="principal"/> Definir como principal
          </label>
          <div class="auth-actions full"><button class="auth-btn" type="submit">Adicionar endereço</button></div>
          <div id="addrMsg" class="muted full"></div>
        </form>
      </div>
      ${cards || `<div class="empty">Nenhum endereço cadastrado.</div>`}
    `;

    list.querySelector("#formNovo").addEventListener("submit", submitNovo);
    list.querySelectorAll("[data-act]").forEach(btn => btn.addEventListener("click", onAction));
  }

  async function submitNovo(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const body = {
      apelido: (f.querySelector("#ap").value || "").trim(),
      cep: (f.querySelector("#cep").value || "").replace(/\D/g, ""),
      logradouro: (f.querySelector("#logr").value || "").trim(),
      numero: (f.querySelector("#num").value || "").trim(),
      complemento: (f.querySelector("#comp").value || "").trim(),
      bairro: (f.querySelector("#bairro").value || "").trim(),
      cidade: (f.querySelector("#cidade").value || "").trim(),
      estado: (f.querySelector("#uf").value || "").trim(),
      principal: !!f.querySelector("#principal").checked
    };
    const msg = f.querySelector("#addrMsg");
    msg.textContent = "Salvando...";

    const resp = await fetch(`${API_BASE}/api/enderecos`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body)
    });
    if (resp.ok) { await load(); }
    else { msg.textContent = await resp.text().catch(() => "Erro ao salvar."); }
  }

  async function onAction(e) {
    const btn = e.currentTarget;
    const card = btn.closest(".item");
    const id = Number(card?.getAttribute("data-id"));
    const act = btn.getAttribute("data-act");

    if (act === "del") {
      if (!confirm("Remover este endereço?")) return;
      const r = await fetch(`${API_BASE}/api/enderecos/${id}`, { method: "DELETE", headers: authHeaders() });
      if (r.ok) { card.remove(); } else { alert("Não foi possÃ­vel remover."); }
    }

    if (act === "edit") {
      // ediÃ§Ã£o inline simples: transforma em formulÃ¡rio
      const name = card.querySelector("strong")?.textContent || "";
      const lines = card.querySelectorAll("p");
      const linha1 = lines[0]?.textContent || "";
      const linha2 = lines[1]?.textContent || "";

      card.innerHTML = `
        <form class="grid" id="formEdit">
          <div class="auth-field"><label>Apelido</label><input id="ap" value="${name}"/></div>
          <div class="auth-field"><label>CEP</label><input id="cep" required inputmode="numeric"/></div>
          <div class="auth-field full"><label>Logradouro</label><input id="logr" required /></div>
          <div class="auth-field"><label>NÃºmero</label><input id="num" required /></div>
          <div class="auth-field"><label>Compl.</label><input id="comp" /></div>
          <div class="auth-field"><label>Bairro</label><input id="bairro" required /></div>
          <div class="auth-field"><label>Cidade</label><input id="cidade" required /></div>
          <div class="auth-field"><label>UF</label><input id="uf" maxlength="2" required /></div>
          <label style="display:flex; gap:.5rem; align-items:center;">
            <input type="checkbox" id="principal"/> Definir como principal
          </label>
          <div class="auth-actions full" style="display:flex; gap:.5rem;">
            <button class="auth-btn" type="submit" style="width:auto;">Salvar</button>
            <button type="button" id="cancelEdit" class="logout-danger" style="width:auto;">Cancelar</button>
          </div>
        </form>
      `;

      card.querySelector("#cancelEdit").addEventListener("click", load);
      card.querySelector("#formEdit").addEventListener("submit", async (ev) => {
        ev.preventDefault();
        const f = ev.currentTarget;
        const body = {
          apelido: (f.querySelector("#ap").value || "").trim(),
          cep: (f.querySelector("#cep").value || "").replace(/\D/g, ""),
          logradouro: (f.querySelector("#logr").value || "").trim(),
          numero: (f.querySelector("#num").value || "").trim(),
          complemento: (f.querySelector("#comp").value || "").trim(),
          bairro: (f.querySelector("#bairro").value || "").trim(),
          cidade: (f.querySelector("#cidade").value || "").trim(),
          estado: (f.querySelector("#uf").value || "").trim(),
          principal: !!f.querySelector("#principal").checked
        };
        const r = await fetch(`${API_BASE}/api/enderecos/${id}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(body)
        });
        if (r.ok) { await load(); }
        else { alert(await r.text().catch(() => "Erro ao salvar.")); }
      });
    }
  }

  load();
}


function enableDragToClose(sheet, overlay) {
  let startY = 0, currentY = 0, dragging = false;

  const onStart = (e) => {
    dragging = true;
    startY = (e.touches ? e.touches[0].clientY : e.clientY);
    sheet.style.transition = "none";
  };
  const onMove = (e) => {
    if (!dragging) return;
    currentY = (e.touches ? e.touches[0].clientY : e.clientY);
    const dy = Math.max(0, currentY - startY);
    sheet.style.transform = `translateY(${dy}px)`;
    overlay.style.opacity = Math.max(0, 1 - dy / 300);
  };
  const onEnd = () => {
    if (!dragging) return;
    dragging = false;
    sheet.style.transition = "";
    sheet.style.transform = "";
    overlay.style.opacity = "";
    if (currentY - startY > 120) { closeUserSheet(); }
  };

  sheet.addEventListener("pointerdown", onStart);
  sheet.addEventListener("pointermove", onMove);
  sheet.addEventListener("pointerup", onEnd);
  sheet.addEventListener("pointercancel", onEnd);
}



function isTokenExpired(token) {
  try {
    const base64 = token.split(".")[1];
    const payload = JSON.parse(atob(base64));
    const now = Math.floor(Date.now() / 1000);
    return typeof payload.exp === "number" && payload.exp <= now;
  } catch {
    return true;
  }
}


function parseJwt(token) {
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
}
function isLogged() {
  const t = localStorage.getItem('authToken');
  return !!t && !isTokenExpired(t);
}
function getCartKey() {
  const t = localStorage.getItem("authToken");
  if (!t || isTokenExpired(t)) return null;
  const p = parseJwt(t);
  const userId = p?.sub || p?.email || "anon";
  return `cart:${userId}`;
}
function getCart() {
  const key = getCartKey();
  if (!key) return [];
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}
function saveCart(items) {
  const key = getCartKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(items));
}
function renderCartBadge() {
  const badge = document.getElementById("cartQty");
  if (!badge) return;
  const total = getCart().reduce((s, i) => s + (i.qty || 0), 0);
  if (total > 0) { badge.hidden = false; badge.textContent = total; }
  else { badge.hidden = true; badge.textContent = "0"; }
}
function money(n) {
  try { return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  catch { return n; }
}

function ensureCartSheet() {
  if (document.getElementById("cartSheet")) return;

  const overlay = document.createElement("div");
  overlay.className = "sheet-overlay";
  overlay.id = "cartOverlay";

  const sheet = document.createElement("div");
  sheet.className = "sheet";
  sheet.id = "cartSheet";
  sheet.setAttribute("role", "dialog");
  sheet.setAttribute("aria-modal", "true");

  sheet.innerHTML = `
    <div class="sheet-header">
      <div class="sheet-title">Meu Carrinho</div>
      <button class="sheet-close" id="closeCart" aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="sheet-body">
      <div id="cartList" class="list"></div>
    </div>
    <footer class="sheet-footer">
      <div class="cart-summary">
        <strong>Total: R$ <span id="cartTotal">0,00</span></strong>
        <div style="display:flex; gap:.5rem;">
          <button id="btnClearCart" class="logout-danger" style="background:#9aa0a6;">Esvaziar</button>
          <button id="btnCheckout" class="auth-btn" style="width:auto;">Finalizar</button>
        </div>
      </div>
    </footer>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(sheet);

  overlay.addEventListener("click", closeCartSheet);
  document.getElementById("closeCart")?.addEventListener("click", closeCartSheet);
  document.getElementById("btnClearCart")?.addEventListener("click", () => { saveCart([]); renderCartItems(); renderCartBadge(); });
  document.getElementById("btnCheckout")?.addEventListener("click", () => {
    // se não estiver logado, manda pro login
    if (!isLogged()) { window.location.href = "login.html"; return; }

    // se o carrinho estiver vazio, evita ir pro checkout
    if (getCart().length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    // fecha a sheet (opcional, só pra UX) e navega
    closeCartSheet();
    window.location.href = "checkout.html";
  });


  renderCartItems();
}
function openCartSheet() {
  document.getElementById("cartOverlay")?.classList.add("open");
  document.getElementById("cartSheet")?.classList.add("open");
}
function closeCartSheet() {
  document.getElementById("cartOverlay")?.classList.remove("open");
  document.getElementById("cartSheet")?.classList.remove("open");
}
function openCartOrRedirect() {
  if (!isLogged()) { window.location.href = "login.html"; return; }
  ensureCartSheet();
  renderCartItems();
  openCartSheet();
}
function renderCartItems() {
  const list = document.getElementById("cartList");
  const totalEl = document.getElementById("cartTotal");
  if (!list || !totalEl) return;

  const items = getCart();
  if (items.length === 0) {
    list.innerHTML = `<div class="empty">Seu carrinho está vazio.</div>`;
    totalEl.textContent = "0,00";
    return;
  }

  let total = 0;
  list.innerHTML = items.map(it => {
    const sub = (it.price || 0) * (it.qty || 0);
    total += sub;
    return `
      <div class="cart-item" data-id="${it.id}">
        <img src="${it.image}" alt="${it.name}">
        <div>
          <div class="name">${it.name}</div>
          <div class="muted">R$ ${money(it.price)} • Subtotal: R$ ${money(sub)}</div>
          <div class="cart-qty" aria-label="Quantidade">
            <button data-act="dec" title="Diminuir">-</button>
            <span>${it.qty}</span>
            <button data-act="inc" title="Aumentar">+</button>
            <button data-act="rm" class="btn-trash" title="Remover" aria-label="Remover">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
        <div></div>
      </div>
    `;
  }).join("");

  totalEl.textContent = money(total);
  const btnCheckout = document.getElementById("btnCheckout");
  if (btnCheckout) btnCheckout.disabled = (items.length === 0);



  list.querySelectorAll(".cart-item button").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".cart-item");
      const id = Number(card?.getAttribute("data-id"));
      const act = btn.getAttribute("data-act");
      let items = getCart();
      const i = items.findIndex(x => x.id === id);
      if (i === -1) return;

      if (act === "inc") items[i].qty += 1;
      if (act === "dec") items[i].qty = Math.max(1, items[i].qty - 1);
      if (act === "rm") items.splice(i, 1);

      saveCart(items);
      renderCartItems();
      renderCartBadge();
    });
  });
}
// scripts.js
function addToCart(productId, qty = 1) {
  if (!isLogged()) { window.location.href = "login.html"; return; }
  const p = produtos.find(x => x.id === productId);
  if (!p) return;

  let items = getCart();
  const found = items.find(i => i.id === p.id);
  if (found) found.qty += qty;
  else items.push({ id: p.id, name: p.nome, price: p.preco, image: p.imagem, qty });

  saveCart(items);
  renderCartBadge();
  renderCartItems();
  ensureCartSheet();
  renderCartItems();
  openCartSheet();
}
