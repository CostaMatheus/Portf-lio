// ======================================================
// ELEMENTOS
// ======================================================
const header = document.querySelector(".navbar-header");
const menuLinks = document.querySelectorAll(".js-link");
const sections = document.querySelectorAll(".section");
const menuHamburger = document.querySelector(".menu-hamburger");
const linksContainer = document.querySelector(".links-container");


// ======================================================
// HEADER — SHOW / HIDE (DESKTOP + MOBILE)
// ======================================================
let lastScrollY = window.scrollY;
let ticking = false;

function updateHeader() {
  const currentY = window.scrollY;

  if (currentY <= 0) {
    header.classList.remove("hide", "show");
    header.classList.add("top");
  } 
  else if (currentY > lastScrollY + 10) {
    header.classList.remove("top", "show");
    header.classList.add("hide");
  } 
  else if (currentY < lastScrollY - 10) {
    header.classList.remove("hide", "top");
    header.classList.add("show");
  }

  lastScrollY = currentY;
  ticking = false;
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(updateHeader);
    ticking = true;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("touchmove", onScroll, { passive: true });


// ======================================================
// SCROLL SUAVE — TOPO CORRETO DA SEÇÃO
// ======================================================
function smoothScroll(e) {
  e.preventDefault();

  const targetId = e.currentTarget.getAttribute("href");
  const target = document.querySelector(targetId);
  if (!target) return;

  // garante header visível antes do cálculo
  header.classList.remove("hide");
  header.classList.add("show");

  const headerHeight = header.offsetHeight;
  const targetY =
    target.getBoundingClientRect().top +
    window.scrollY -
    headerHeight;

  window.scrollTo({
    top: targetY,
    behavior: "smooth"
  });

  // fecha menu mobile
  linksContainer?.classList.remove("active");
  menuHamburger?.classList.remove("active");
}

menuLinks.forEach(link =>
  link.addEventListener("click", smoothScroll)
);


// ======================================================
// MENU ATIVO — INTERSECTION OBSERVER (ROBUSTO)
// ======================================================
const menuObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const id = entry.target.id;
      if (!id) return;

      menuLinks.forEach(link =>
        link.classList.remove("actived")
      );

      const activeLink = document.querySelector(
        `.js-link[href="#${id}"]`
      );

      activeLink?.classList.add("actived");
    });
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: 0
  }
);

sections.forEach(section =>
  menuObserver.observe(section)
);


// ======================================================
// ANIMAÇÃO DE SEÇÕES (SEGURA E COMPATÍVEL COM SEU CSS)
// ======================================================
const animationObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        entry.target.classList.remove("hidden");
        animationObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0,
    rootMargin: "0px 0px -15% 0px"
  }
);

sections.forEach(section => {
  // About SEMPRE visível
  if (section.id === "about") {
    section.classList.add("visible");
  } else {
    section.classList.add("hidden");
  }

  animationObserver.observe(section);
});


// ======================================================
// MENU MOBILE
// ======================================================
menuHamburger?.addEventListener("click", () => {
  linksContainer?.classList.toggle("active");
  menuHamburger?.classList.toggle("active");
});

window.addEventListener("scroll", () => {
  linksContainer?.classList.remove("active");
  menuHamburger?.classList.remove("active");
});


// ======================================================
// BOTÃO "VER MAIS" — PROJETOS
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("toggle-projects-btn");
  const container = document.querySelector(".projects-card-container");

  if (!btn || !container) return;

  const extraCards = container.querySelectorAll(".card-item.hidden");
  let expanded = false;

  btn.addEventListener("click", e => {
    e.preventDefault();
    expanded = !expanded;

    extraCards.forEach(card =>
      card.classList.toggle("hidden", !expanded)
    );

    btn.textContent = expanded ? "Ver menos" : "Ver mais";
  });
});
