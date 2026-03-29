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

    // Llevar el foco al primer enlace del menú
    if (menuLinks.length > 0) {
      menuLinks[0].focus();
    }
  }

  function closeMenu() {
    navMenu.classList.remove("show");
    toggleButton.setAttribute("aria-expanded", "false");

    // Devolver el foco al botón hamburguesa
    toggleButton.focus();
  }

  toggleButton.addEventListener("click", () => {
    const expanded = toggleButton.getAttribute("aria-expanded") === "true";

    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Cerrar con Escape cuando el menú esté abierto
  navMenu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });
}

// ==========================
// FORMULARIO RESERVA
// ==========================
const reservaForm = document.getElementById("reservaForm");
const formStatus = document.getElementById("formStatus");
const fechaInput = document.getElementById("fecha");
const reviewBox = document.getElementById("reviewBox");

if (fechaInput) {
  const hoy = new Date().toISOString().split("T")[0];
  fechaInput.setAttribute("min", hoy);
}

reservaForm?.addEventListener("submit", function (e) {
  e.preventDefault();

  const errorBox = document.getElementById("errorBox");
  errorBox.innerHTML = "";
  errorBox.style.display = "none";

  formStatus.textContent = "";

  const inputs = reservaForm.querySelectorAll("input, select");

  inputs.forEach(input => {
    input.removeAttribute("aria-invalid");
  });

  let errors = [];

  const origen = document.getElementById("origen");
  const destino = document.getElementById("destino");

  // Campos vacíos
  inputs.forEach(input => {
    if (input.required && !input.value) {
      errors.push({ input, msg: "El campo " + input.previousElementSibling.textContent + " es obligatorio" });
    }
  });

  // Validar origen != destino
  if (origen.value && destino.value && origen.value === destino.value) {
    errors.push({ input: destino, msg: "Origen y destino no pueden ser iguales" });
  }

  // Validar email
  const email = document.getElementById("email");
  if (email.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      errors.push({ input: email, msg: "Formato de email no válido" });
    }
  }

  // Validar pasajeros
  const personas = document.getElementById("personas");
  if (personas.value) {
    const val = parseInt(personas.value, 10);
    if (val < 1 || val > 8) {
      errors.push({ input: personas, msg: "Pasajeros entre 1 y 8" });
    }
  }

  const fecha = document.getElementById("fecha");

  if (fecha.value) {
    const hoy = new Date().toISOString().split("T")[0];

    if (fecha.value < hoy) {
      errors.push({ input: fecha, msg: "La fecha no puede ser anterior a hoy" });
    }
  }

  // SI HAY ERRORES
  if (errors.length > 0) {

    errorBox.style.display = "block";

    let ul = document.createElement("ul");

    errors.forEach(({ input, msg }) => {
      input.setAttribute("aria-invalid", "true");

      let li = document.createElement("li");
      li.textContent = msg;
      ul.appendChild(li);
    });

    errorBox.appendChild(ul);

    errors[0].input.focus();
    return;
  }

  // OK
  reviewBox.hidden = false;
  reviewBox.innerHTML = `
  <h2>Revisa tu reserva</h2>
  <p><strong>Origen:</strong> ${origen.options[origen.selectedIndex].text}</p>
  <p><strong>Destino:</strong> ${destino.options[destino.selectedIndex].text}</p>
  <p><strong>Fecha:</strong> ${fecha.value}</p>
  <p><strong>Pasajeros:</strong> ${personas.value || "No indicado"}</p>
  <p><strong>Email:</strong> ${email.value}</p>
  <button type="button" class="btn" id="confirmSubmit">Enviar reserva</button>
`;

  formStatus.textContent = "";
  reviewBox.focus?.();

  const confirmButton = document.getElementById("confirmSubmit");
  confirmButton.addEventListener("click", () => {
    formStatus.textContent = "Reserva enviada correctamente";
    reviewBox.hidden = true;
  });
});

// ==========================
// FORMULARIO CONTACTO
// ==========================
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("status");

contactForm?.addEventListener("submit", function (e) {
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

    // Validar email si existe
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
      let errorEl = document.createElement("div");
      errorEl.id = input.id + "-error";
      errorEl.textContent = msg;
      errorEl.style.color = "red";
      errorEl.style.marginTop = "4px";
      errorEl.setAttribute("role", "alert");
      input.insertAdjacentElement("afterend", errorEl);
    });

    errors[0].input.focus();
    return;
  }

  contactStatus.textContent = "Mensaje enviado correctamente";
});