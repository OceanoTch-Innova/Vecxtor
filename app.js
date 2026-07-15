(function () {
  const body = document.body;
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const page = body ? body.dataset.page : "";

  document.querySelectorAll("[data-route]").forEach((link) => {
    if (link.dataset.route === page) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const header = document.querySelector("[data-header]");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 8);
    }, { passive: true });
  }

  const canvas = document.querySelector("[data-network-canvas]");
  if (canvas) {
    const context = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let points = [];
    const pointer = { x: 0, y: 0, active: false };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * scale);
      canvas.height = Math.floor(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      points = Array.from({ length: Math.max(34, Math.floor(width / 32)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: 1 + Math.random() * 2.6
      }));
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#10211b";
      context.fillRect(0, 0, width, height);

      points.forEach((point, index) => {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;

        for (let next = index + 1; next < points.length; next += 1) {
          const other = points[next];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 145) {
            context.strokeStyle = `rgba(255,255,255,${0.16 - distance / 1100})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }

        if (pointer.active) {
          const distance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
          if (distance < 180) {
            context.strokeStyle = `rgba(242,103,74,${0.36 - distance / 520})`;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(pointer.x, pointer.y);
            context.stroke();
          }
        }

        context.fillStyle = index % 4 === 0 ? "#f2674a" : "#d9fff0";
        context.beginPath();
        context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        context.fill();
      });

      requestAnimationFrame(draw);
    }

    canvas.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    });

    canvas.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    window.addEventListener("resize", resize);
    resize();
    draw();
  }

  const calculator = document.querySelector("[data-calculator]");
  if (calculator) {
    const hours = calculator.querySelector("[data-hours]");
    const rate = calculator.querySelector("[data-rate]");
    const hoursValue = calculator.querySelector("[data-hours-value]");
    const rateValue = calculator.querySelector("[data-rate-value]");
    const savings = calculator.querySelector("[data-savings]");
    const formatter = new Intl.NumberFormat("es-CO");

    function updateCalculator() {
      const weeklyHours = Number(hours.value);
      const hourlyRate = Number(rate.value);
      const saved = Math.round(weeklyHours * hourlyRate * 4 * 0.6);
      hoursValue.textContent = weeklyHours;
      rateValue.textContent = formatter.format(hourlyRate);
      savings.textContent = `$${formatter.format(saved)} COP`;
    }

    hours.addEventListener("input", updateCalculator);
    rate.addEventListener("input", updateCalculator);
    updateCalculator();
  }

  const tabs = document.querySelector("[data-tabs]");
  if (tabs) {
    tabs.querySelectorAll("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.tab;
        tabs.querySelectorAll("[data-tab]").forEach((item) => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-selected", String(active));
        });
        tabs.querySelectorAll("[data-panel]").forEach((panel) => {
          panel.classList.toggle("active", panel.dataset.panel === target);
        });
      });
    });

    const hash = window.location.hash.replace("#", "");
    const hashMap = { web: "web", software: "software", automatizacion: "auto" };
    if (hashMap[hash]) {
      const button = tabs.querySelector(`[data-tab="${hashMap[hash]}"]`);
      if (button) button.click();
    }
  }

  const filterBar = document.querySelector("[data-filter-bar]");
  if (filterBar) {
    const cards = document.querySelectorAll("[data-category]");
    filterBar.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      const filter = button.dataset.filter;
      filterBar.querySelectorAll("[data-filter]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      cards.forEach((card) => {
        card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
      });
    });
  }

  const accordion = document.querySelector("[data-accordion]");
  if (accordion) {
    accordion.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      const item = button.closest("article");
      item.classList.toggle("open");
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    const note = document.querySelector("[data-form-note]");
    const mailLink = document.querySelector("[data-mail-link]");
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    if (plan) {
      const service = contactForm.elements.service;
      if (plan === "software") service.value = "Software a medida";
      if (plan === "web-auto") service.value = "Automatizacion comercial";
      if (plan === "base") service.value = "Pagina web";
    }

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const message = [
        `Hola Vecxtor, soy ${data.get("name")}.`,
        data.get("business") ? `Mi negocio es ${data.get("business")}.` : "",
        `Me interesa: ${data.get("service")}.`,
        `Presupuesto: ${data.get("budget")}.`,
        `Mensaje: ${data.get("message")}`
      ].filter(Boolean).join(" ");
      const encoded = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/573000000000?text=${encoded}`;
      const mailtoUrl = `mailto:hola@vecxtor.co?subject=${encodeURIComponent("Cotizacion Vecxtor")}&body=${encoded}`;
      mailLink.href = mailtoUrl;
      note.innerHTML = `Mensaje listo. <a href="${whatsappUrl}" target="_blank" rel="noopener">Abrir WhatsApp</a> o usa el boton de correo.`;
    });
  }
})();
