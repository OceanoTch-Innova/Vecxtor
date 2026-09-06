(function () {
  const routes = Object.freeze({
    inicio: "Index.html",
    nosotros: "nosotros.html",
    servicios: "servicios.html",
    proyectos: "proyectos.html",
    proceso: "proceso.html",
    contacto: "contacto.html"
  });

  window.VecxtorRouting = Object.freeze({
    routes,
    resolve(name) {
      return routes[name] || null;
    }
  });

  const paths = Object.values(routes);
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) return;

    const [path, suffix = ""] = href.split(/([?#].*)/, 2);
    const routeName = link.dataset.route;
    const routePath = routeName ? routes[routeName] : paths.includes(path) ? path : null;
    if (routePath) link.href = `${routePath}${suffix}`;
  });
})();
