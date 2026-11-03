(() => {
  const root = document.documentElement;
  const key = "ci-colour-theme";
  try {
    const theme = localStorage.getItem(key);
    if (theme === "light" || theme === "dark") root.dataset.theme = theme;
  } catch {}
  const toggle = document.querySelector(".theme-switch");
  if (toggle) {
    const update = () => toggle.setAttribute("aria-label", "Switch to " + (root.dataset.theme === "dark" ? "light" : "dark") + " mode");
    update();
    toggle.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(key, root.dataset.theme); } catch {}
      update();
    });
  }
  const menu = document.querySelector(".menu-button");
  const nav = document.querySelector(".navigation");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const expanded = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open", !expanded);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    }));
  }
  const search = document.querySelector("#search");
  const items = [...document.querySelectorAll(".result-item")];
  const filters = [...document.querySelectorAll(".filter")];
  if (search && items.length) {
    let selected = "all";
    const update = () => {
      const query = search.value.trim().toLowerCase();
      let total = 0;
      for (const item of items) {
        const text = (item.dataset.search || "").toLowerCase();
        const matches = (selected === "all" || (item.dataset.category || "").split(" ").includes(selected)) && (!query || text.includes(query));
        item.hidden = !matches;
        if (matches) total++;
      }
      document.querySelector("#result-note").textContent = total + " result" + (total === 1 ? "" : "s") + " displayed";
      document.querySelector("#empty-message").hidden = total > 0;
    };
    search.addEventListener("input", update);
    filters.forEach(btn => btn.addEventListener("click", () => {
      selected = btn.dataset.filter;
      filters.forEach(f => { const active = f === btn; f.classList.toggle("active", active); f.setAttribute("aria-pressed", String(active)); });
      update();
    }));
  }
})();