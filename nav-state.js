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

  const sharedVisit = new URLSearchParams(window.location.search).get("shared") === "1";
  if (sharedVisit && typeof window.gtag === "function") {
    window.gtag("event", "adventure_shared_visit", {
      adventure_path: location.pathname,
    });
  }

  const makeShareButton = (className = "nav-button share-adventure-button") => {
    const shareButton = document.createElement("button");
    shareButton.type = "button";
    shareButton.className = className;
    shareButton.textContent = "Share this adventure";

    shareButton.addEventListener("click", async () => {
      const shareUrl = new URL(window.location.href);
      shareUrl.hash = "";
      shareUrl.search = "";
      shareUrl.searchParams.set("shared", "1");
      const shareText = "Try this driving adventure. See what you would do.";

      try {
        if (navigator.share) {
          await navigator.share({
            title: document.title,
            text: shareText,
            url: shareUrl.href,
          });
          if (typeof window.gtag === "function") {
            window.gtag("event", "adventure_share", {
              adventure_path: location.pathname,
              share_method: "native",
            });
          }
          return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(`${shareText} ${shareUrl.href}`);
          const original = shareButton.textContent;
          shareButton.textContent = "Link copied!";
          setTimeout(() => {
            shareButton.textContent = original;
          }, 1800);
          if (typeof window.gtag === "function") {
            window.gtag("event", "adventure_share", {
              adventure_path: location.pathname,
              share_method: "clipboard",
            });
          }
          return;
        }
      } catch (error) {
        if (error && error.name === "AbortError") return;
      }

      window.prompt("Copy this adventure link:", shareUrl.href);
    });

    return shareButton;
  };

  const addAdventureSceneNavigation = () => {
    const steps = [...document.querySelectorAll(".episode-step")];
    if (steps.length < 2) return;

    const decisionSteps = steps.slice(0, -1);
    const status = document.querySelector(".scene-status");
    const storageKey = `dcg-adventure:${location.pathname}`;

    const scrollToSceneStart = (step) => {
      if (!step) return;
      requestAnimationFrame(() => {
        step.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    const showScene = (index) => {
      const safeIndex = Math.max(0, Math.min(index, decisionSteps.length - 1));
      steps.forEach((step, stepIndex) => {
        step.classList.toggle("is-active", stepIndex === safeIndex);
      });
      if (status) status.textContent = `Scene ${safeIndex + 1} of ${decisionSteps.length}`;

      try {
        const saved = JSON.parse(localStorage.getItem(storageKey)) || {};
        saved.current = safeIndex;
        saved.completed = Array.isArray(saved.completed) ? saved.completed : [];
        localStorage.setItem(storageKey, JSON.stringify(saved));
      } catch (_) {}

      scrollToSceneStart(steps[safeIndex]);
    };

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".continue-button")) return;
      requestAnimationFrame(() => {
        scrollToSceneStart(document.querySelector(".episode-step.is-active"));
      });
    });

    document.addEventListener(
      "click",
      (event) => {
        const choice = event.target.closest(".choice");
        if (!choice) return;
        const step = choice.closest(".episode-step");
        if (!step) return;
        step.querySelectorAll(".outcome").forEach((outcome) => {
          outcome.hidden = true;
        });
      },
      true
    );

    const finish = document.querySelector(".adventure-finish");
    if (finish && !finish.querySelector(".share-adventure-button")) {
      const shareButton = makeShareButton();
      const links = finish.querySelector(".adventure-links");
      if (links) {
        links.prepend(shareButton);
      } else {
        finish.appendChild(shareButton);
      }
    }

    const style = document.createElement("style");
    style.textContent = `
      .scene-navigation{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 4px;padding-top:16px;border-top:1px solid #d6e0e4}
      .scene-nav-button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 14px;border:2px solid #1f6f8b;border-radius:10px;background:#fff;color:#164f65;font:inherit;font-weight:800;text-decoration:none;cursor:pointer}
      .scene-nav-button:hover,.scene-nav-button:focus-visible{background:#eaf7fb}
      .scene-nav-button:disabled{border-color:#c4d0d5;background:#f1f4f5;color:#7a878d;cursor:not-allowed}
      .scene-nav-share{border-color:#1f6f8b;color:#164f65}
      .scene-nav-exit{margin-left:auto;border-color:#6d7880;color:#465159}
      .share-adventure-button{font:inherit;cursor:pointer}
      @media(max-width:760px){.scene-navigation{display:grid}.scene-nav-button{width:100%}.scene-nav-exit{margin-left:0}.share-adventure-button{width:100%}}
    `;
    document.head.appendChild(style);

    decisionSteps.forEach((step, index) => {
      const choices = step.querySelector(".choices");
      if (!choices || step.querySelector(".scene-navigation")) return;

      const controls = document.createElement("div");
      controls.className = "scene-navigation";
      controls.setAttribute("aria-label", "Adventure scene navigation");

      const first = document.createElement("button");
      first.type = "button";
      first.className = "scene-nav-button";
      first.textContent = "Back to first scene";
      first.disabled = index === 0;
      first.addEventListener("click", () => showScene(0));

      const previous = document.createElement("button");
      previous.type = "button";
      previous.className = "scene-nav-button";
      previous.textContent = "Previous scene";
      previous.disabled = index === 0;
      previous.addEventListener("click", () => showScene(index - 1));

      const share = makeShareButton("scene-nav-button scene-nav-share share-adventure-button");

      const exit = document.createElement("a");
      exit.className = "scene-nav-button scene-nav-exit";
      exit.href = "../../adventures.html";
      exit.textContent = "End adventure and choose another";

      controls.append(first, previous, share, exit);
      choices.insertAdjacentElement("afterend", controls);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      addAdventureSceneNavigation,
      { once: true }
    );
  } else {
    addAdventureSceneNavigation();
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
