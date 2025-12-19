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
  } else if (currentY > lastScrollY + 10) {
    header.classList.remove("top", "show");
    header.classList.add("hide");
  } else if (currentY < lastScrollY - 10) {
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
// SCROLL SUAVE — TOPO REAL DA SEÇÃO
// ======================================================
function smoothScroll(e) {
  e.preventDefault();

  const target = document.querySelector(
    e.currentTarget.getAttribute("href")
  );
  if (!target) return;

  // força header visível antes do cálculo
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

      menuLinks.forEach(link =>
        link.classList.remove("actived")
      );

      const active = document.querySelector(
        `.js-link[href="#${id}"]`
      );

      active?.classList.add("actived");
    });
  },
  {
    threshold: 0,
    rootMargin: "-35% 0px -50% 0px"
  }
);

sections.forEach(section =>
  menuObserver.observe(section)
);

// ======================================================
// ANIMAÇÃO DAS SEÇÕES (IDA + VOLTA)
// projects NÃO volta para hidden
// ======================================================
const animationObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const section = entry.target;
      const isProjects = section.id === "projects";

      if (entry.isIntersecting) {
        section.classList.add("visible");
        section.classList.remove("hidden");
      } else {
        if (!isProjects) {
          section.classList.remove("visible");
          section.classList.add("hidden");
        }
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -10% 0px"
  }
);

// estado inicial
sections.forEach(section => {
  section.classList.add("hidden");
  animationObserver.observe(section);
});

// ======================================================
// MENU MOBILE
// ======================================================
menuHamburger?.addEventListener("click", () => {
  linksContainer?.classList.toggle("active");
  menuHamburger.classList.toggle("active");
});

window.addEventListener("scroll", () => {
  linksContainer?.classList.remove("active");
  menuHamburger?.classList.remove("active");
});

// ======================================================
// VER MAIS — PROJECTS (3 FIXOS + RESTANTE TOGGLE)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("toggle-projects-btn");
  const cards = document.querySelectorAll(".card-item");

  if (!btn || cards.length <= 3) return;

  const ALWAYS_VISIBLE = 3;
  const extraCards = Array.from(cards).slice(ALWAYS_VISIBLE);

  let expanded = false;

  // estado inicial
  cards.forEach((card, index) => {
    if (index < ALWAYS_VISIBLE) {
      card.classList.add("visible");
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
      card.classList.remove("visible");
    }
  });

  btn.addEventListener("click", e => {
    e.preventDefault();
    expanded = !expanded;

    if (expanded) {
      // MOSTRA extras
      extraCards.forEach((card, i) => {
        card.classList.remove("hidden");
        setTimeout(() => {
          card.classList.add("visible");
        }, i * 80);
      });
      btn.textContent = "Ver menos";
    } else {
      // ESCONDE somente extras
      extraCards.forEach(card => {
        card.classList.remove("visible");
        setTimeout(() => {
          card.classList.add("hidden");
        }, 300);
      });
      btn.textContent = "Ver mais";
    }
  });
});