(() => {
  const measurementId = "G-9WMXEP7LMQ";
  const hasAnalytics = document.querySelector(
    `script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`
  );
  if (!hasAnalytics) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    const analyticsScript = document.createElement("script");
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(analyticsScript);
  }

  const nav = document.querySelector(".top-nav");
  if (!nav) return;

  nav.id ||= "site-navigation";
  nav.classList.add("nav-enhanced");

  const adventuresLink = [...nav.querySelectorAll("a")].find(
    (link) => link.textContent.trim() === "Adventures"
  );
  if (adventuresLink) {
    const adventuresUrl = new URL(adventuresLink.href);
    adventuresUrl.searchParams.set("v", "20260802-season1-complete");
    adventuresLink.href = adventuresUrl.href;
  }

  if (![...nav.querySelectorAll("a")].some((link) => link.textContent.trim() === "Meet the Crew")) {
    const homeLink = [...nav.querySelectorAll("a")].find(
      (link) => link.textContent.trim() === "Home"
    );
    const aboutLink = [...nav.querySelectorAll("a")].find(
      (link) => link.textContent.trim() === "About"
    );
    if (homeLink) {
      const crewLink = document.createElement("a");
      crewLink.href = new URL("characters/index.html", homeLink.href).href;
      crewLink.textContent = "Meet the Crew";
      nav.insertBefore(crewLink, aboutLink || null);
    }
  }

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
  } else if (path.includes("/characters/")) {
    label = "Meet the Crew";
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
