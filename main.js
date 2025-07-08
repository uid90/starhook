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
        <a href="${item.download}" target="_blank" rel="noopener noreferrer">DOWNLOAD</a>
      </div>
      <div class="decor" title="Ver imagen en grande">
        <img src="${item.decor}" alt="${item.title} decor">
      </div>
      <div class="card-buttons">
        <button class="status-btn ${item.status}" title="${item.status.toUpperCase()}">
          ${item.status === 'updated' ? '✔' : '✖'}
        </button>
      </div>
    `;

    // Evento para abrir modal con la imagen grande al clicar en .decor
    const decor = card.querySelector('.decor');
    decor.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(item.decor);
    });

    container.appendChild(card);
  });
}

// Función para abrir modal y mostrar imagen
function openModal(imgSrc) {
  const modal = document.getElementById('modalOverlay');
  const modalImg = document.getElementById('modalImage');

  modalImg.src = imgSrc;
  modal.style.display = 'flex';
  // Forzar reflow para activar la transición si la usas en CSS:
  modal.offsetHeight; 
  modal.classList.add('active');
}

// Función para cerrar modal
function closeModal() {
  const modal = document.getElementById('modalOverlay');
  modal.classList.remove('active');
  // Espera la transición y luego oculta el modal para evitar parpadeos
  setTimeout(() => {
    modal.style.display = 'none';
    document.getElementById('modalImage').src = ''; // limpiar src por si acaso
  }, 300);
}

// Configura eventos de búsqueda y modal
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

document.addEventListener('DOMContentLoaded', () => {
  loadCards();
  setupSearch();

  // Evento para cerrar modal al pulsar la X
  document.getElementById('modalClose').addEventListener('click', closeModal);

  // También cerrar modal si haces click fuera de la imagen
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
      closeModal();
    }
  });

  // Opcional: cerrar modal con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('modalOverlay');
      if (modal.classList.contains('active')) {
        closeModal();
      }
    }
  });
});
