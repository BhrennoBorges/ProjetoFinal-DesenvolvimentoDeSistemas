// auth.js
// Módulo de autenticação para TechStore
// - Guarda token + perfil (nome, email, nomeUsuario) no localStorage
// - Funciona com respostas que tragam { token, user } ou só { token } ou só 201 sem token
// - Rotas configuráveis via Auth.init({ apiBase, routes })

(function (global) {
  const LS = {
    token: "authToken",
    name: "userName",
    email: "userEmail",
    username: "userUsername",
  };

  let API_BASE = "";
  let ROUTES = {
    login: "/auth/login",
    register: "/usuarios",
    me: "/auth/me",
  };

  function init({ apiBase = "", routes = {} } = {}) {
    API_BASE = apiBase;
    ROUTES = { ...ROUTES, ...routes };
  }

  // --- Helpers --------------------------------------------------------------
  function pickToken(obj) {
    return obj?.token || obj?.accessToken || obj?.jwt || obj?.id_token || null;
  }

  function decodeJwt(token) {
    try {
      const base64 = token.split(".")[1];
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  function saveProfile({ fullName, email, username } = {}) {
    if (fullName) localStorage.setItem(LS.name, fullName);
    if (email) localStorage.setItem(LS.email, email);
    if (username) localStorage.setItem(LS.username, username);
  }

  function saveProfileFromSources({ token, data = {}, fallbackBody = {} } = {}) {
    const jwt = token ? decodeJwt(token) : null;

    const fullName =
      data.nomeCompleto || data.name || data.fullname ||
      jwt?.nomeCompleto || jwt?.name ||
      fallbackBody.nomeCompleto || null;

    const email =
      data.email || jwt?.email || fallbackBody.email || null;

    const username =
      data.nomeUsuario || data.username ||
      jwt?.nomeUsuario || jwt?.username ||
      fallbackBody.nomeUsuario || fallbackBody.username || null;

    saveProfile({ fullName, email, username });
  }

  // --- API calls ------------------------------------------------------------
  async function login(email, senha) {
    const resp = await fetch(`${API_BASE}${ROUTES.login}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (!resp.ok) return false;

    const data = await resp.json().catch(() => ({}));
    const token = pickToken(data);
    if (!token) return false;

    localStorage.setItem(LS.token, token);
    // algumas APIs devolvem { user } junto; se não vier, tentamos decodificar o JWT
    saveProfileFromSources({ token, data: data.user || data });

    return true;
  }

  async function register(body) {
    const resp = await fetch(`${API_BASE}${ROUTES.register}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!resp.ok) return false;

    const data = await resp.json().catch(() => ({}));
    const token = pickToken(data);

    if (token) {
      localStorage.setItem(LS.token, token);
      saveProfileFromSources({ token, data: data.user || data, fallbackBody: body });
    } else {
      // cadastro sem token na resposta: guarda infos básicas do body
      saveProfile({
        fullName: body.nomeCompleto,
        email: body.email,
        username: body.nomeUsuario || body.username,
      });
    }
    return true;
  }

  function logout() {
    localStorage.removeItem(LS.token);
    localStorage.removeItem(LS.name);
    localStorage.removeItem(LS.email);
    localStorage.removeItem(LS.username);
  }

  function token() { return localStorage.getItem(LS.token); }


  // Exposição pública
  global.Auth = { init, login, register, logout, token };
})(window);



