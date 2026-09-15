(function () {
  const body = document.body;
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menú");
    }));
  }

  const header = document.querySelector("[data-header]");
  if (header) {
    const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    const note = contactForm.querySelector("[data-form-note]");
    const submitButton = contactForm.querySelector("button[type=submit]");
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";
      try {
        const response = await fetch(contactForm.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(contactForm) });
        if (!response.ok) throw new Error("Form submission failed");
        contactForm.reset();
        note.textContent = "Recibimos tu consulta. Te responderemos pronto.";
        note.classList.add("success");
        submitButton.textContent = "Consulta enviada";
      } catch (error) {
        note.textContent = "No pudimos enviar la consulta. Escríbenos a consulta.finanzas@oceanotech.site.";
        submitButton.disabled = false;
        submitButton.textContent = "Solicitar diagnóstico";
      }
    });
  }
})();
