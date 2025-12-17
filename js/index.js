// ===============================
// ELEMENTOS PRINCIPAIS
// ===============================
const header = document.querySelector(".navbar-header");
const menuLinks = document.querySelectorAll(".js-link");
const sections = document.querySelectorAll(".section");
const menuHamburger = document.querySelector(".menu-hamburger");
const linksContainer = document.querySelector(".links-container");

// ===============================
// HEADER — SUMIR / APARECER
// ===============================
let lastY = 0;

function handleHeaderScroll() {
  const currentY = window.scrollY;

  if (currentY <= 0) {
    header.classList.remove("hide", "show");
    header.classList.add("top");
    lastY = currentY;
    return;
  }

  if (currentY > lastY) {
    header.classList.remove("top", "show");
    header.classList.add("hide");
  } else {
    header.classList.remove("hide", "top");
    header.classList.add("show");
  }

  lastY = currentY;
}

window.addEventListener("scroll", handleHeaderScroll, { passive: true });

// ===============================
// SCROLL SUAVE
// ===============================
menuLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();

    const target = document.querySelector(
      event.currentTarget.getAttribute("href")
    );

    if (!target) return;

    const headerHeight = header.offsetHeight;
    const targetY =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerHeight;

    window.scrollTo({
      top: targetY,
      behavior: "smooth"
    });

    // fechar menu mobile ao clicar
    if (linksContainer) linksContainer.classList.remove("active");
    if (menuHamburger) menuHamburger.classList.remove("active");
  });
});

// ===============================
// ATIVAR LINK DO MENU
// ===============================
const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");

      menuLinks.forEach(link => link.classList.remove("actived"));

      const activeLink = document.querySelector(
        `.js-link[href="#${id}"]`
      );

      if (activeLink) activeLink.classList.add("actived");
    });
  },
  { threshold: 0.55 }
);

sections.forEach(section => sectionObserver.observe(section));

// ===============================
// MENU MOBILE
// ===============================
if (menuHamburger && linksContainer) {
  menuHamburger.addEventListener("click", () => {
    menuHamburger.classList.toggle("active");
    linksContainer.classList.toggle("active");
  });

  window.addEventListener(
    "scroll",
    () => {
      menuHamburger.classList.remove("active");
      linksContainer.classList.remove("active");
    },
    { passive: true }
  );
}

// ===============================
// ANIMAÇÃO DAS SEÇÕES
// ===============================
const animationObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        entry.target.classList.remove("hidden");
      }
    });
  },
  { threshold: 0.3 }
);

sections.forEach(section => {
  section.classList.add("hidden");
  animationObserver.observe(section);
});

// ===============================
// BOTÃO "VER MAIS" — PROJETOS
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("toggle-projects-btn");
  const container = document.querySelector(".projects-card-container");

  if (!btn || !container) return;

  const extraCards = container.querySelectorAll(".card-item.hidden");
  let expanded = false;

  btn.addEventListener("click", event => {
    event.preventDefault();
    expanded = !expanded;

    if (expanded) {
      extraCards.forEach(card => card.classList.remove("hidden"));
      btn.textContent = "Ver menos";
    } else {
      extraCards.forEach(card => {
        setTimeout(() => card.classList.add("hidden"), 300);
      });
      btn.textContent = "Ver mais";
    }
  });
});
