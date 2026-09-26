/**
 * DULCE AURA • ALTA REPOSTERÍA CASERA DE AUTOR
 * Lógica Reactiva, Accesible (WCAG 2.2 AA) y de Deseo Culinario
 */

document.addEventListener('DOMContentLoaded', () => {
  initSensoryReveal();
  initDateInputMin();
});

/* ==========================================================================
   1. MOMENTO FIRMA 1: EL CORTE SENSORIAL INTERACTIVO
   ========================================================================== */
let currentSplit = 50;

function initSensoryReveal() {
  const container = document.getElementById('revealContainer');
  const handle = document.getElementById('revealHandle');
  const outsideLayer = document.getElementById('revealOutsideLayer');
  if (!container || !handle || !outsideLayer) return;

  let isDragging = false;

  function updatePosition(clientX) {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setRevealSplit(percent, false);
  }

  // Eventos de Puntero / Touch / Mouse
  handle.addEventListener('pointerdown', (e) => {
    isDragging = true;
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  container.addEventListener('pointermove', (e) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  });

  handle.addEventListener('pointerup', (e) => {
    if (isDragging) {
      isDragging = false;
      try { handle.releasePointerCapture(e.pointerId); } catch (err) {}
      announceAccessibility(`Divisor colocado al ${currentSplit} por ciento.`);
    }
  });

  handle.addEventListener('pointercancel', () => {
    isDragging = false;
  });

  // Clic directo en el contenedor para saltar
  container.addEventListener('click', (e) => {
    if (e.target !== handle && !handle.contains(e.target)) {
      updatePosition(e.clientX);
    }
  });

  // Accesibilidad por Teclado: Flechas Izquierda / Derecha / Inicio / Fin
  handle.addEventListener('keydown', (e) => {
    let step = 5;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setRevealSplit(Math.max(0, currentSplit - step));
      announceAccessibility(`Capas internas reveladas al ${100 - currentSplit} por ciento.`);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setRevealSplit(Math.min(100, currentSplit + step));
      announceAccessibility(`Capas internas reveladas al ${100 - currentSplit} por ciento.`);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setRevealSplit(0);
      announceAccessibility('Mostrando el interior y capas al 100 por ciento.');
    } else if (e.key === 'End') {
      e.preventDefault();
      setRevealSplit(100);
      announceAccessibility('Mostrando el exterior decorado al 100 por ciento.');
    }
  });
}

/**
 * Ajusta la división del corte sensorial
 * @param {number} percent - Porcentaje de 0 a 100
 * @param {boolean} updateButtons - Si debe actualizar el estado visual de los botones
 */
function setRevealSplit(percent, updateButtons = true) {
  currentSplit = percent;
  const outsideLayer = document.getElementById('revealOutsideLayer');
  const handle = document.getElementById('revealHandle');

  if (outsideLayer) {
    outsideLayer.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
  }
  if (handle) {
    handle.style.left = `${percent}%`;
    handle.setAttribute('aria-valuenow', percent);
  }

  if (updateButtons) {
    const btnCut = document.getElementById('btnViewCut');
    const btnSplit = document.getElementById('btnViewSplit');
    const btnFull = document.getElementById('btnViewFull');

    if (btnCut && btnSplit && btnFull) {
      btnCut.classList.toggle('active', percent <= 5);
      btnCut.setAttribute('aria-pressed', percent <= 5);

      btnSplit.classList.toggle('active', percent > 5 && percent < 95);
      btnSplit.setAttribute('aria-pressed', percent > 5 && percent < 95);

      btnFull.classList.toggle('active', percent >= 95);
      btnFull.setAttribute('aria-pressed', percent >= 95);
    }
  }
}

/* ==========================================================================
   2. MOMENTO FIRMA 2: SELECTOR REACTIVO DE PORCIONES Y PRECIOS
   ========================================================================== */
const cardProductNames = {
  flora: 'Pastel Flora y Frambuesa',
  galette: 'Galette Rústica Silvestre',
  cupcakes: 'Royal Cupcakes de Autor',
  bento: 'Bento Cake Personalizado'
};

function updateCardPortion(cardId, price, portionName) {
  // 1. Actualizar el precio visible
  const priceElem = document.getElementById(`price-${cardId}`);
  if (priceElem) {
    priceElem.textContent = `$${price}`;
  }

  // 2. Actualizar el botón y enlace de WhatsApp con el mensaje exacto
  const orderBtn = document.getElementById(`btn-order-card-${cardId}`) || document.getElementById(`btn-order-${cardId}`);
  const productName = cardProductNames[cardId] || 'Pastel de Autor';

  if (orderBtn) {
    const message = `¡Hola Dulce Aura! Quiero apartar el *${productName}* en tamaño *${portionName}* por *$${price} MXN*. ¿Tienen cupo para agendar mi fecha?`;
    orderBtn.href = `https://wa.me/5215512345678?text=${encodeURIComponent(message)}`;
    orderBtn.setAttribute('aria-label', `Apartar ${productName} tamaño ${portionName} por ${price} pesos mexicanos en WhatsApp`);
  }

  // 3. Anuncio a lectores de pantalla
  announceAccessibility(`Tamaño seleccionado para ${productName}: ${portionName}. Precio actualizado a ${price} pesos mexicanos.`);
}

/* ==========================================================================
   3. MOMENTO FIRMA 3: HORNO DE AUTOR Y VERIFICADOR DE CUPOS
   ========================================================================== */
function initDateInputMin() {
  const dateInput = document.getElementById('eventDate');
  if (dateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Mínimo mañana
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    
    // Sugerir sábado próximo por defecto
    const nextSat = new Date();
    nextSat.setDate(nextSat.getDate() + ((6 - nextSat.getDay() + 7) % 7 || 7));
    const sY = nextSat.getFullYear();
    const sM = String(nextSat.getMonth() + 1).padStart(2, '0');
    const sD = String(nextSat.getDate()).padStart(2, '0');
    dateInput.value = `${sY}-${sM}-${sD}`;
  }
}

function handleAccessibleCheck(event) {
  event.preventDefault();
  const dateInput = document.getElementById('eventDate');
  const occasionSelect = document.getElementById('eventOccasion');
  const resultBox = document.getElementById('checkerResult');
  const resultBadgeText = document.getElementById('resultBadgeText');
  const resultMessageText = document.getElementById('resultMessageText');
  const resultWhatsappBtn = document.getElementById('resultWhatsappBtn');

  if (!dateInput || !resultBox) return;

  const selectedDateVal = dateInput.value;
  if (!selectedDateVal) {
    dateInput.focus();
    return;
  }

  const occasionVal = occasionSelect ? occasionSelect.value : 'Celebración Especial';

  // Formatear fecha legible
  const parts = selectedDateVal.split('-');
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  const formattedDate = dateObj.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Simulación de cupo artesanal honesto (máx 6 al día)
  const dayOfWeek = dateObj.getDay();
  let availableSlots = (dayOfWeek === 6 || dayOfWeek === 0) ? 2 : 4; // Fines de semana más demandados

  resultBox.style.display = 'block';
  resultBadgeText.textContent = `¡Cupo Disponible! (${availableSlots} de 6 lugares)`;
  resultMessageText.innerHTML = `Para el <strong>${formattedDate}</strong> tenemos <strong>${availableSlots} lugares disponibles</strong> en el horno para tu ocasión de <strong>${occasionVal}</strong>.`;

  // Construir mensaje estructurado para WhatsApp
  const waMsg = `¡Hola Dulce Aura! Consulté su agenda en el sitio web para el día *${formattedDate}* (${occasionVal}). Vi que hay cupo disponible de horno. ¿Podrían confirmarme los detalles para apartar mi lugar con anticipo?`;
  
  resultWhatsappBtn.href = `https://wa.me/5215512345678?text=${encodeURIComponent(waMsg)}`;
  resultWhatsappBtn.setAttribute('aria-label', `Congelar fecha del ${formattedDate} por WhatsApp`);

  // Anunciar a lectores de pantalla
  announceAccessibility(`Disponibilidad confirmada: ${availableSlots} de 6 lugares disponibles para el ${formattedDate}.`);

  // Scroll suave hacia el resultado si es necesario
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ==========================================================================
   4. UTILIDAD DE ANUNCIOS ACCESIBLES (WCAG 2.2 AA)
   ========================================================================== */
function announceAccessibility(text) {
  const announcer = document.getElementById('liveAnnouncer');
  if (announcer) {
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = text;
    }, 50);
  }
}
