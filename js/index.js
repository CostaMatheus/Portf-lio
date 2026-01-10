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
  const target = document.querySelector(e.currentTarget.getAttribute("href"));
  if (!target) return;

  header.classList.remove("hide");
  header.classList.add("show");

  const headerHeight = header.offsetHeight;
  const targetY =
    target.getBoundingClientRect().top + window.scrollY - headerHeight;

  window.scrollTo({
    top: targetY,
    behavior: "smooth"
  });

  linksContainer?.classList.remove("active");
  menuHamburger?.classList.remove("active");
}

menuLinks.forEach(link => link.addEventListener("click", smoothScroll));

// ======================================================
// MENU ATIVO — INTERSECTION OBSERVER
// ======================================================
const menuObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      menuLinks.forEach(link => link.classList.remove("actived"));
      const active = document.querySelector(`.js-link[href="#${id}"]`);
      active?.classList.add("actived");
    });
  },
  { threshold: 0, rootMargin: "-35% 0px -50% 0px" }
);
sections.forEach(section => menuObserver.observe(section));

// ======================================================
// ANIMAÇÃO DAS SEÇÕES (IDA + VOLTA)
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
  { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
);

sections.forEach(section => {
  section.classList.add("hidden");
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
// VER MAIS — PROJECTS (3 FIXOS + RESTANTE TOGGLE)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".projects-btn");
  const cards = Array.from(document.querySelectorAll(".card-item"));
  const notification = document.querySelector(".notification");
  const ALWAYS_VISIBLE = 3;
  let expandedCount = 0;

  function updateCardsVisibility() {
    const visibleCards = cards.filter(card => !card.classList.contains('hidden-by-tab'));
    const totalVisible = visibleCards.length;

    visibleCards.forEach((card, index) => {
      if (index < ALWAYS_VISIBLE + expandedCount) {
        card.classList.add('visible');
        card.classList.remove('hidden', 'is-removed');
      } else {
        card.classList.remove('visible');
        card.classList.add('hidden');
        setTimeout(() => {
          if (card.classList.contains('hidden')) card.classList.add('is-removed');
        }, 300);
      }
    });

    // botão sempre visível
    if (totalVisible <= ALWAYS_VISIBLE) {
      btn.textContent = "Ver mais"; // mantém o texto padrão
    }
  }

  // Função para mostrar notificação

  function showNotification(message, duration = 1000) {
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
      notification.classList.remove('show');
    }, duration);
  }

 btn.addEventListener("click", e => {
  e.preventDefault();
  const visibleCards = cards.filter(card => !card.classList.contains('hidden-by-tab'));
  const totalVisible = visibleCards.length;

  if (expandedCount + ALWAYS_VISIBLE >= totalVisible) {
    // "Ver menos"
    if (totalVisible > ALWAYS_VISIBLE) {
      expandedCount = 0;
      btn.textContent = "Ver mais";
      updateCardsVisibility();
    } else {
      // 🔔 Popup via CSS
      showNotification("Não existem mais projetos para serem exibidos.");
      return;
    }
  } else {
    // "Ver mais" 3 a 3
    expandedCount += 3;
    if (expandedCount + ALWAYS_VISIBLE > totalVisible) expandedCount = totalVisible - ALWAYS_VISIBLE;
    btn.textContent = "Ver menos";
    updateCardsVisibility();
  }
});

  // estado inicial
  cards.forEach(card => card.classList.add('hidden', 'is-removed'));
  updateCardsVisibility();

  // ======================================================
  // TAB PROJECTS — FILTRO MULTI-CATEGORIA
  // ======================================================
  const tabs = document.querySelectorAll('.tab-nav-projects a');
  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      const filter = tab.dataset.filter;
      const isActive = tab.classList.contains('active');

      tabs.forEach(t => t.classList.remove('active'));
      if (!isActive) tab.classList.add('active');

      cards.forEach(card => {
        const categories = card.dataset.category?.split(' ') || [];
        if (isActive || (!filter || categories.includes(filter))) {
          card.classList.remove('hidden-by-tab');
        } else {
          card.classList.add('hidden-by-tab');
          card.classList.remove('visible');
          setTimeout(() => {
            if (card.classList.contains('hidden-by-tab')) card.classList.add('is-removed');
          }, 300);
        }
      });

      expandedCount = 0; // reset da contagem
      btn.textContent = "Ver mais"; // mantém botão visível
      updateCardsVisibility();
    });
  });
});
