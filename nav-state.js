(() => {
  const nav = document.querySelector(".top-nav");
  if (!nav) return;

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
    activeLink.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
})();
