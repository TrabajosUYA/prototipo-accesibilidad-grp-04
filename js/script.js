// ==========================
// FORMULARIO RESERVA
// ==========================
const reservaForm = document.getElementById("reservaForm");
const formStatus = document.getElementById("formStatus");

reservaForm?.addEventListener("submit", function(e) {
  e.preventDefault();

  // Limpiar errores previos
  formStatus.textContent = "";
  const inputs = reservaForm.querySelectorAll("input");
  inputs.forEach(input => {
    input.removeAttribute("aria-invalid");
    const err = document.getElementById(input.id + "-error");
    if (err) err.remove();
  });

  let firstError = null;
  let errors = [];

  // Validar campos requeridos
  inputs.forEach(input => {
    if (input.required && !input.value.trim()) {
      errors.push({input, msg: "Este campo es obligatorio"});
    }

    // Validar email
    if (input.type === "email" && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        errors.push({input, msg: "Formato de email no válido"});
      }
    }

    // Validar número de pasajeros
    if (input.id === "personas" && input.value) {
      const val = parseInt(input.value, 10);
      if (val < 1 || val > 8) {
        errors.push({input, msg: "Debe ser entre 1 y 8 pasajeros"});
      }
    }
  });

  // Mostrar errores accesibles
  if (errors.length > 0) {
    errors.forEach(({input, msg}) => {
      input.setAttribute("aria-invalid", "true");

      // Crear mensaje de error
      let errorEl = document.createElement("div");
      errorEl.id = input.id + "-error";
      errorEl.textContent = msg;
      errorEl.style.color = "red";
      errorEl.style.marginTop = "4px";
      errorEl.setAttribute("role", "alert");
      input.insertAdjacentElement("afterend", errorEl);
    });

    // Focus en primer error
    errors[0].input.focus();
    return;
  }

  // Si no hay errores
  formStatus.textContent = "✅ Reserva enviada correctamente";
});

// ==========================
// FORMULARIO CONTACTO
// ==========================
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("status");

contactForm?.addEventListener("submit", function(e) {
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
      errors.push({input, msg: "Este campo es obligatorio"});
    }

    // Validar email si existe
    if (input.type === "email" && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        errors.push({input, msg: "Formato de email no válido"});
      }
    }
  });

  if (errors.length > 0) {
    errors.forEach(({input, msg}) => {
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

  contactStatus.textContent = "✅ Mensaje enviado correctamente";
});