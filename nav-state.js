(() => {
  const nav = document.querySelector(".top-nav");
  if (!nav) return;

  nav.id ||= "site-navigation";
  nav.classList.add("nav-enhanced");

  const menuButton = document.createElement("button");
  menuButton.type = "button";
  menuButton.className = "mobile-menu-toggle";
  menuButton.setAttribute("aria-controls", nav.id);
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.innerHTML =
    '<span class="menu-icon" aria-hidden="true">☰</span><span>Menu</span>';
  nav.prepend(menuButton);

  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.querySelector(".menu-icon").textContent = "☰";
  };

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.querySelector(".menu-icon").textContent = isOpen ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      window.matchMedia("(max-width: 760px)").matches &&
      nav.classList.contains("is-open") &&
      !nav.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);

  const path = window.location.pathname.replace(/\\/g, "/").toLowerCase();
  const isRootHome = /\/(?:index(?:_v2)?\.html)?$/.test(path) && !path.includes("/adventures/");

  let label = "";
  if (isRootHome) {
    label = "Home";
  } else if (/\/adventures\/borrowing-moms-car\/index\.html$/.test(path)) {
    label = "Start Your First Adventure";
  } else if (path.includes("/adventures/") || path.endsWith("/adventures.html")) {
    label = "Adventures";
  } else if (path.includes("/skill-") || path.endsWith("/skills.html")) {
    label = "Skills Library";
  } else if (path.endsWith("/about-tony.html")) {
    label = "About";
  } else if (path.endsWith("/feedback.html")) {
    label = "Feedback";
  }

  const activeLink = [...nav.querySelectorAll("a")].find(
    (link) => link.textContent.trim() === label
  );

  if (activeLink) {
    activeLink.setAttribute("aria-current", "page");
    if (!window.matchMedia("(max-width: 760px)").matches) {
      activeLink.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }
})();
