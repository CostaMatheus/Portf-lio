// =======================================
// ELEMENTOS PRINCIPAIS
// =======================================
const header = document.querySelector(".navbar-header");
const menuLinks = document.querySelectorAll(".js-link");
const sections = document.querySelectorAll(".section");
const menuHamburger = document.querySelector(".menu-hamburger");
const linksContainer = document.querySelector(".links-container");

// =======================================
// HEADER — SUMIR / APARECER NO SCROLL
// =======================================
let lastScrollY = 0;

function handleHeaderScroll() {
  const currentY = window.scrollY;

  // Topo da página
  if (currentY <= 0) {
    header.classList.remove("hide", "show");
    header.classList.add("top");
    lastScrollY = currentY;
    return;
  }

  // Scroll para baixo → esconde
  if (currentY > lastScrollY) {
    header.classList.remove("top", "show");
    header.classList.add("hide");
  }
  // Scroll para cima → mostra
  else {
    header.classList.remove("hide", "top");
    header.classList.add("show");
  }

  lastScrollY = currentY;
}

window.addEventListener("scroll", handleHeaderScroll);

// =======================================
// FUNÇÃO: HEADER VISÍVEL?
// =======================================
function isHeaderVisible() {
  return !header.classList.contains("hide");
}

// =======================================
// SCROLL SUAVE DO MENU (CORRIGIDO)
// =======================================
menuLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();

    const target = document.querySelector(
      event.currentTarget.getAttribute("href")
    );
    if (!target) return;

    // Força header a sumir antes do cálculo
    header.classList.remove("top", "show");
    header.classList.add("hide");

    requestAnimationFrame(() => {
      const headerHeight = isHeaderVisible() ? header.offsetHeight : 0;

      const targetY =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetY,
        behavior: "smooth"
      });
    });

    // Fecha menu mobile
    if (linksContainer) linksContainer.classList.remove("active");
    if (menuHamburger) menuHamburger.classList.remove("active");
  });
});

// =======================================
// LINK ATIVO CONFORME SEÇÃO VISÍVEL
// =======================================
// =======================================
// LINK ATIVO CONFORME SEÇÃO VISÍVEL (FIX)
// =======================================
const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        menuLinks.forEach(link =>
          link.classList.remove("actived")
        );

        const activeLink = document.querySelector(
          `.js-link[href="#${id}"]`
        );

        if (activeLink) activeLink.classList.add("actived");
      }
    });
  },
  {
    // 🔥 COMPENSA HEADER + FUNCIONA COM SEÇÕES CURTAS
    rootMargin: "-40% 0px -55% 0px",
    threshold: 0
  }
);

sections.forEach(section => sectionObserver.observe(section));


// =======================================
// MENU MOBILE (HAMBURGER)
// =======================================
if (menuHamburger && linksContainer) {
  menuHamburger.addEventListener("click", () => {
    menuHamburger.classList.toggle("active");
    linksContainer.classList.toggle("active");
  });
}

// Fecha menu mobile ao scroll
window.addEventListener("scroll", () => {
  if (linksContainer) linksContainer.classList.remove("active");
  if (menuHamburger) menuHamburger.classList.remove("active");
});

// =======================================
// ANIMAÇÃO DAS SEÇÕES (DESKTOP + MOBILE)
// =======================================
const animationObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        entry.target.classList.remove("hidden");
      } else {
        entry.target.classList.remove("visible");
        entry.target.classList.add("hidden");
      }
    });
  },
  {
    threshold: 0.3
  }
);

sections.forEach(section => {
  section.classList.add("hidden");
  animationObserver.observe(section);
});

// =======================================
// BOTÃO "VER MAIS" — PROJETOS
// =======================================
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
      extraCards.forEach(card =>
        setTimeout(() => card.classList.add("hidden"), 300)
      );
      btn.textContent = "Ver mais";
    }
  });
});
