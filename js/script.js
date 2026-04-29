// ==========================
// CÁLCULO DE PRECIOS Y DISTANCIA
// ==========================

// Coordenadas aproximadas de los aeropuertos
const COORDENADAS_AEROPUERTOS = {
  "sur": { lat: 28.0445, lon: -16.5800 },   // Tenerife Sur
  "norte": { lat: 28.4827, lon: -16.3416 }  // Tenerife Norte
};

// Fórmula de Haversine para calcular distancia en km entre 2 puntos
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
}

// ==========================
// NAVBAR RESPONSIVE
// ==========================
const toggleButton = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("nav-menu");

if (toggleButton && navMenu) {
  const menuLinks = navMenu.querySelectorAll("a");

  function openMenu() {
    navMenu.classList.add("show");
    toggleButton.setAttribute("aria-expanded", "true");
    if (menuLinks.length > 0) menuLinks[0].focus();
  }

  function closeMenu() {
    navMenu.classList.remove("show");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.focus();
  }

  toggleButton.addEventListener("click", () => {
    const expanded = toggleButton.getAttribute("aria-expanded") === "true";
    expanded ? closeMenu() : openMenu();
  });

  navMenu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

// ==========================
// FORMULARIO RESERVA — MULTI-STEP
// ==========================
const reservaForm = document.getElementById("reservaForm");

if (reservaForm) {

  // ---- Fecha mínima = hoy ----
  const fechaInput = document.getElementById("fecha");
  if (fechaInput) {
    fechaInput.setAttribute("min", new Date().toISOString().split("T")[0]);
  }

  // ---- Estado de pasos ----
  let currentStep = 1;
  const totalSteps = 3;

  function showStep(step) {
    for (let i = 1; i <= totalSteps; i++) {
      const el = document.getElementById("step-" + i);
      if (el) el.hidden = (i !== step);
    }

    // Actualizar breadcrumb
    for (let i = 1; i <= totalSteps; i++) {
      const bc = document.getElementById("bc-" + i);
      if (!bc) continue;
      bc.classList.remove("active", "completed");
      bc.removeAttribute("aria-current");
      if (i === step) {
        bc.classList.add("active");
        bc.setAttribute("aria-current", "step");
      } else if (i < step) {
        bc.classList.add("completed");
      }
    }

    currentStep = step;

    // Foco al primer campo del paso o al título del paso
    const stepEl = document.getElementById("step-" + step);
    const firstFocusable = stepEl?.querySelector("input, select, button, [tabindex]");
    if (firstFocusable) firstFocusable.focus();
  }

  // ---- Validación por paso ----
  function validateStep1() {
    const errorBox = document.getElementById("errorBox-1");
    errorBox.innerHTML = "";
    errorBox.style.display = "none";

    const errors = [];
    const origen = document.getElementById("origen");
    const destino = document.getElementById("destino");
    const fecha = document.getElementById("fecha");
    const hora = document.getElementById("hora");
    const personas = document.getElementById("personas");

    [origen, destino, fecha, hora, personas].forEach(inp => {
      inp?.removeAttribute("aria-invalid");
    });

    if (!origen.value) errors.push({ input: origen, msg: "El campo Origen es obligatorio" });
    if (!destino.value.trim()) errors.push({ input: destino, msg: "El campo Destino es obligatorio" });
    if (!fecha.value) errors.push({ input: fecha, msg: "El campo Fecha es obligatorio" });
    if (!hora.value) errors.push({ input: hora, msg: "El campo Hora es obligatorio" });

    if (fecha.value) {
      const hoy = new Date().toISOString().split("T")[0];
      if (fecha.value < hoy) {
        errors.push({ input: fecha, msg: "La fecha no puede ser anterior a hoy" });
      }
    }

    if (!personas.value) {
      errors.push({ input: personas, msg: "El campo Número de pasajeros es obligatorio" });
    } else {
      const val = parseInt(personas.value, 10);
      if (val < 1 || val > 8) {
        errors.push({ input: personas, msg: "El número de pasajeros debe estar entre 1 y 8" });
      }
    }

    if (errors.length > 0) {
      errorBox.style.display = "block";
      const ul = document.createElement("ul");
      ul.style.margin = "0";
      ul.style.paddingLeft = "20px";
      errors.forEach(({ input, msg }) => {
        input.setAttribute("aria-invalid", "true");
        const li = document.createElement("li");
        li.textContent = msg;
        ul.appendChild(li);
      });
      errorBox.appendChild(ul);
      errors[0].input.focus();
      return false;
    }

    return true;
  }

  function validateStep2() {
    const errorBox = document.getElementById("errorBox-2");
    errorBox.innerHTML = "";
    errorBox.style.display = "none";

    const errors = [];
    const email = document.getElementById("email");
    email.removeAttribute("aria-invalid");

    if (!email.value.trim()) {
      errors.push({ input: email, msg: "El campo Email es obligatorio" });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        errors.push({ input: email, msg: "Formato de email no válido" });
      }
    }

    if (errors.length > 0) {
      errorBox.style.display = "block";
      const ul = document.createElement("ul");
      ul.style.margin = "0";
      ul.style.paddingLeft = "20px";
      errors.forEach(({ input, msg }) => {
        input.setAttribute("aria-invalid", "true");
        const li = document.createElement("li");
        li.textContent = msg;
        ul.appendChild(li);
      });
      errorBox.appendChild(ul);
      errors[0].input.focus();
      return false;
    }

    return true;
  }

  // ---- Rellenar resumen ----
  function populateReview() {
    const origen = document.getElementById("origen");
    const destino = document.getElementById("destino");
    const fecha = document.getElementById("fecha");
    const hora = document.getElementById("hora");
    const personas = document.getElementById("personas");
    const email = document.getElementById("email");

    document.getElementById("review-origen").textContent = origen.options[origen.selectedIndex]?.text || "—";
    document.getElementById("review-destino").textContent = destino.value || "—";
    document.getElementById("review-fecha").textContent = fecha.value || "—";
    document.getElementById("review-hora").textContent = hora.value || "—";
    document.getElementById("review-personas").textContent = personas.value || "—";
    document.getElementById("review-email").textContent = email.value || "—";

    const valorOrigen = origen.value; // "sur" o "norte"
    const latDestino = parseFloat(destino.dataset.lat);
    const lonDestino = parseFloat(destino.dataset.lon);
    let textoPrecio = "No disponible (Destino no reconocido)";

    if (COORDENADAS_AEROPUERTOS[valorOrigen] && !isNaN(latDestino) && !isNaN(lonDestino)) {
      const coordsOrigen = COORDENADAS_AEROPUERTOS[valorOrigen];
      
      // 1. Distancia en línea recta
      const distanciaRecta = calcularDistancia(coordsOrigen.lat, coordsOrigen.lon, latDestino, lonDestino);
      
      // 2. Factor de carretera (aprox 1.3 veces la línea recta por la orografía de Tenerife)
      const distanciaCarretera = distanciaRecta * 1.3;

      // 3. Fórmula de precio: 3.15€ bajada de bandera + 1.10€ el kilómetro
      const precioCalculado = 3.15 + (distanciaCarretera * 1.10);

      textoPrecio = precioCalculado.toFixed(2) + " € (Aprox.)";
    }

    // Insertar en el HTML
    const reviewPrecioEl = document.getElementById("review-precio");
    if (reviewPrecioEl) {
      reviewPrecioEl.textContent = textoPrecio;
    }
  }

  // ---- Botones de navegación ----
  document.getElementById("nextStep1")?.addEventListener("click", () => {
    if (validateStep1()) showStep(2);
  });

  document.getElementById("prevStep2")?.addEventListener("click", () => showStep(1));
  document.getElementById("nextStep2")?.addEventListener("click", () => {
    if (validateStep2()) {
      populateReview();
      showStep(3);
    }
  });

  document.getElementById("prevStep3")?.addEventListener("click", () => showStep(2));

  // ---- Submit final ----
  reservaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formStatus = document.getElementById("formStatus");
    const confirmActions = document.getElementById("confirmActions");

    formStatus.innerHTML = `
      ✅ <strong>Reserva confirmada correctamente.</strong><br>
      Tu código de reserva es: <strong>0001</strong><br>
      Hemos enviado los detalles a tu email.
    `;

    if (confirmActions) confirmActions.hidden = true;
    formStatus.focus?.();
  });

  // ---- Iniciar en paso 1 ----
  showStep(1);
}

// ==========================
// AUTOCOMPLETE DESTINO — Nominatim (OpenStreetMap)
// Bounding box de Tenerife: oeste=-16.92, sur=27.99, este=-16.11, norte=28.59
// ==========================
const destinoInput = document.getElementById("destino");
const destinoListbox = document.getElementById("destino-listbox");

if (destinoInput && destinoListbox) {
  let autocompleteTimeout = null;
  let activeIndex = -1;

  // Bounding box de la isla de Tenerife (viewbox en formato lon_min,lat_max,lon_max,lat_min)
  const TENERIFE_VIEWBOX = "-16.92,28.59,-16.11,27.99";

  destinoInput.addEventListener("input", function () {
    clearTimeout(autocompleteTimeout);
    const query = this.value.trim();
    activeIndex = -1;

    if (query.length < 3) {
      closeAutocomplete();
      return;
    }

    // Mostrar spinner mientras espera
    destinoListbox.hidden = false;
    destinoListbox.innerHTML = '<li class="autocomplete-spinner" aria-live="polite">Buscando…</li>';
    destinoInput.setAttribute("aria-expanded", "true");

    // Debounce 350 ms para no saturar la API
    autocompleteTimeout = setTimeout(() => fetchDestinos(query), 350);
  });

  async function fetchDestinos(query) {
    try {
      const url =
        "https://nominatim.openstreetmap.org/search" +
        "?q=" + encodeURIComponent(query) +
        "&format=json" +
        "&bounded=1" +
        "&viewbox=" + TENERIFE_VIEWBOX +
        "&limit=6" +
        "&addressdetails=1" +
        "&accept-language=es";

      const res = await fetch(url, {
        headers: {
          "Accept-Language": "es"
        }
      });

      if (!res.ok) throw new Error("Error red");
      const data = await res.json();
      renderAutocomplete(data);
    } catch (err) {
      destinoListbox.innerHTML = '<li class="autocomplete-spinner">No se pudieron cargar sugerencias.</li>';
    }
  }

  function renderAutocomplete(results) {
    destinoListbox.innerHTML = "";
    activeIndex = -1;

    if (results.length === 0) {
      destinoListbox.innerHTML = '<li class="autocomplete-spinner">Sin resultados para esta búsqueda.</li>';
      return;
    }

    results.forEach((place, i) => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.setAttribute("id", "destino-option-" + i);
      li.setAttribute("aria-selected", "false");

      const parts = place.display_name.split(",");
      const shortName = parts.slice(0, 3).join(",").trim();
      li.textContent = shortName;

      // NUEVO: Guardar valores y coordenadas
      li.dataset.value = shortName;
      li.dataset.lat = place.lat;
      li.dataset.lon = place.lon;

      li.addEventListener("mousedown", (e) => e.preventDefault());
      // Pasamos lat y lon al hacer clic
      li.addEventListener("click", () => selectDestino(shortName, place.lat, place.lon));

      destinoListbox.appendChild(li);
    });

    destinoListbox.hidden = false;
    destinoInput.setAttribute("aria-expanded", "true");
  }

  // Modificamos selectDestino para que reciba las coordenadas
  function selectDestino(value, lat, lon) {
    destinoInput.value = value;

    if (lat && lon) {
      destinoInput.dataset.lat = lat;
      destinoInput.dataset.lon = lon;
    }

    destinoInput.removeAttribute("aria-invalid");
    closeAutocomplete();
  }

  function closeAutocomplete() {
    destinoListbox.hidden = true;
    destinoInput.setAttribute("aria-expanded", "false");
    destinoInput.removeAttribute("aria-activedescendant");
    activeIndex = -1;
  }

  // Navegación por teclado en la lista
  destinoInput.addEventListener("keydown", function (e) {
    const options = destinoListbox.querySelectorAll("[role='option']");
    if (destinoListbox.hidden || options.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % options.length;
      highlightOption(options, activeIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + options.length) % options.length;
      highlightOption(options, activeIndex);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const op = options[activeIndex];
      selectDestino(op.dataset.value, op.dataset.lat, op.dataset.lon);
    } else if (e.key === "Escape") {
      closeAutocomplete();
    }
  });

  function highlightOption(options, index) {
    options.forEach((o, i) => {
      const selected = i === index;
      o.setAttribute("aria-selected", selected ? "true" : "false");
      o.classList.toggle("highlighted", selected);
    });
    if (options[index]) {
      destinoInput.setAttribute("aria-activedescendant", options[index].id);
      // Scroll dentro de la lista si es necesario
      options[index].scrollIntoView({ block: "nearest" });
    }
  }

  destinoInput.addEventListener("blur", () => {
    // Pequeño retardo para que el click en la opción se procese antes de cerrar
    setTimeout(closeAutocomplete, 180);
  });
}

// ---- Botón de Cancelar Reserva ----
  document.getElementById("cancelButton")?.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas cancelar? Se perderán los datos introducidos y se borrará la reserva en caso de haberla confirmado.")) {
      reservaForm.reset(); // Borra todos los campos
      showStep(1); // Devuelve al usuario al primer paso
    }
  });

// ==========================
// FORMULARIO GESTIÓN
// ==========================
const gestionForm = document.getElementById("gestionForm");

if (gestionForm) {
  // Base de datos simulada de reservas (frontend demo)
  const reservasFake = [
    {
      codigo: "0001",
      email: "ejemplo@taxitenerife.com",
      origen: "Aeropuerto Tenerife Sur",
      destino: "La Laguna",
      fecha: "2026-05-20",
      hora: "10:30",
      personas: 2,
      estado: "Confirmada"
    },
    {
      codigo: "0002",
      email: "usuario@correo.com",
      origen: "Aeropuerto Tenerife Norte",
      destino: "Santa Cruz de Tenerife",
      fecha: "2026-06-15",
      hora: "14:00",
      personas: 4,
      estado: "Confirmada"
    }
  ];

  const resultEmpty = document.getElementById("resultEmpty");
  const resultTable = document.getElementById("resultTable");
  const resultNotFound = document.getElementById("resultNotFound");
  const resultTableBody = document.getElementById("resultTableBody");
  const cancelStatus = document.getElementById("cancelStatus");
  const gestionErrorBox = document.getElementById("gestionErrorBox");

  gestionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Reset estado
    gestionErrorBox.style.display = "none";
    gestionErrorBox.innerHTML = "";
    resultTable.hidden = true;
    resultNotFound.hidden = true;
    resultEmpty.hidden = true;
    cancelStatus.textContent = "";

    const codigoInput = document.getElementById("codigo");
    const emailInput = document.getElementById("emailGestion");

    codigoInput.removeAttribute("aria-invalid");
    emailInput.removeAttribute("aria-invalid");

    // Validar campos
    const errors = [];
    if (!codigoInput.value.trim()) errors.push({ input: codigoInput, msg: "El código de reserva es obligatorio" });
    if (!emailInput.value.trim()) errors.push({ input: emailInput, msg: "El email es obligatorio" });
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        errors.push({ input: emailInput, msg: "Formato de email no válido" });
      }
    }

    if (errors.length > 0) {
      gestionErrorBox.style.display = "block";
      const ul = document.createElement("ul");
      ul.style.margin = "0";
      ul.style.paddingLeft = "20px";
      errors.forEach(({ input, msg }) => {
        input.setAttribute("aria-invalid", "true");
        const li = document.createElement("li");
        li.textContent = msg;
        ul.appendChild(li);
      });
      gestionErrorBox.appendChild(ul);
      errors[0].input.focus();
      return;
    }

    // Buscar reserva
    const reserva = reservasFake.find(
      r => r.codigo === codigoInput.value.trim() &&
        r.email.toLowerCase() === emailInput.value.trim().toLowerCase()
    );

    if (!reserva) {
      resultNotFound.hidden = false;
      resultNotFound.focus?.();
      return;
    }

    // Mostrar tabla con resultado
    resultTableBody.innerHTML = "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(reserva.codigo)}</td>
      <td>${escapeHtml(reserva.origen)}</td>
      <td>${escapeHtml(reserva.destino)}</td>
      <td>${escapeHtml(reserva.fecha)}</td>
      <td>${escapeHtml(reserva.hora)}</td>
      <td>${escapeHtml(String(reserva.personas))}</td>
      <td>${escapeHtml(reserva.estado)}</td>
      <td>
        <button class="badge-cancelar" data-codigo="${escapeHtml(reserva.codigo)}" aria-label="Cancelar reserva ${escapeHtml(reserva.codigo)}">
          Cancelar
        </button>
      </td>
    `;
    resultTableBody.appendChild(tr);

    resultTable.hidden = false;

    // Botón cancelar
    const cancelBtn = resultTableBody.querySelector(".badge-cancelar");
    cancelBtn?.addEventListener("click", function () {
      const codigo = this.dataset.codigo;
      this.disabled = true;
      this.textContent = "Cancelada";
      cancelStatus.innerHTML = `✅ La reserva <strong>${codigo}</strong> ha sido cancelada correctamente.`;
    });

    // Llevar el foco a la tabla para anuncio accesible
    resultTable.setAttribute("tabindex", "-1");
    resultTable.focus();
  });

  function escapeHtml(str) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return String(str).replace(/[&<>"']/g, m => map[m]);
  }
}

// ==========================
// FORMULARIO CONTACTO
// ==========================
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("status");

if (contactForm && contactStatus) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    contactStatus.textContent = "";
    const inputs = contactForm.querySelectorAll("input, textarea");

    inputs.forEach(input => {
      input.removeAttribute("aria-invalid");
      const err = document.getElementById(input.id + "-error");
      if (err) err.remove();
    });

    let errors = [];

    inputs.forEach(input => {
      if (input.required && !input.value.trim()) {
        errors.push({ input, msg: "Este campo es obligatorio" });
      }
      if (input.type === "email" && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          errors.push({ input, msg: "Formato de email no válido" });
        }
      }
    });

    if (errors.length > 0) {
      errors.forEach(({ input, msg }) => {
        input.setAttribute("aria-invalid", "true");
        const errorEl = document.createElement("div");
        errorEl.id = input.id + "-error";
        errorEl.textContent = msg;
        errorEl.style.color = "red";
        errorEl.style.marginTop = "4px";
        errorEl.style.fontSize = "0.875rem";
        errorEl.setAttribute("role", "alert");
        input.insertAdjacentElement("afterend", errorEl);
      });
      errors[0].input.focus();
      return;
    }

    contactStatus.textContent = "✅ Mensaje enviado correctamente. Te responderemos pronto.";
  });
}
