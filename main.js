async function loadCards() {
  const response = await fetch('data.json');
  const data = await response.json();

  // Ordenar alfabéticamente por título
  data.sort((a, b) => a.title.localeCompare(b.title));

  const container = document.getElementById('cardContainer');
  container.innerHTML = ''; // limpiar contenido anterior

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img class="bg" src="${item.image}" alt="${item.title}">
      <div class="info">
        <h2>${item.title}</h2>
        <p>${item.date}</p>
        <a href="${item.download}">DOWNLOAD</a>
      </div>
      <div class="decor">
        <img src="${item.decor}" alt="${item.title} decor">
      </div>
      <div class="card-buttons">
        <button class="status-btn ${item.status}" title="${item.status.toUpperCase()}">
          ${item.status === 'updated' ? '✔' : '✖'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  // Agregar evento click SOLO a .decor para toggle 'active'
  document.querySelectorAll('.card .decor').forEach(decor => {
    decor.addEventListener('click', e => {
      e.stopPropagation(); // evita que se propague el click a la tarjeta
      decor.classList.toggle('active');
    });
  });
}

// Búsqueda dinámica
function setupSearch() {
  const searchInputs = [document.getElementById('searchInputDesktop'), document.getElementById('searchInputMobile')];

  searchInputs.forEach(input => {
    input?.addEventListener('input', function () {
      const query = this.value.toLowerCase();
      const cards = document.querySelectorAll('#cardContainer .card');

      cards.forEach(card => {
        const title = card.querySelector('h2').textContent.toLowerCase();
        card.style.display = title.includes(query) ? 'block' : 'none';
      });
    });
  });
}

// Iniciar todo al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
  loadCards();
  setupSearch();
});
