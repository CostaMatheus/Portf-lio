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

  // topo da página → header transparente
  if (currentY <= 0) {
    header.classList.remove("hide", "show");
    header.classList.add("top");
    lastY = currentY;
    return;
  }

  // rolando para baixo → esconder
  if (currentY > lastY) {
    header.classList.remove("top", "show");
    header.classList.add("hide");
  }
  // rolando para cima → mostrar
  else {
    header.classList.remove("hide", "top");
    header.classList.add("show");
  }

  lastY = currentY;
}

window.addEventListener("scroll", handleHeaderScroll);


// ===============================
// SCROLL SUAVE
// ===============================
function smoothScroll(event) {
  event.preventDefault();

  const target = document.querySelector(event.currentTarget.getAttribute("href"));
  if (!target) return;

  const headerHeight = header.offsetHeight; // altura REAL do header

  const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight;

  window.scrollTo({
    top: targetY,
    behavior: "smooth"
  });
}


// ===============================
// ATIVAR LINK DO MENU CONFORME A SEÇÃO
// ===============================
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute("id");

    if (entry.isIntersecting) {
      // remover ativo dos outros
      menuLinks.forEach(link => link.classList.remove("actived"));

      // ativar o atual
      const activeLink = document.querySelector(`.js-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add("actived");
    }
  });
}, { threshold: 0.55 });

sections.forEach(sec => sectionObserver.observe(sec));


// ===============================
// MOBILE MENU (caso exista)
// ===============================
if (menuHamburger) {
  menuHamburger.addEventListener("click", () => {
    linksContainer.classList.toggle("active");
    menuHamburger.classList.toggle("active");
  });
}

window.addEventListener("scroll", () => {
  if (linksContainer) linksContainer.classList.remove("active");
  if (menuHamburger) menuHamburger.classList.remove("active");
});


// ===============================
// BOTÃO "VER MAIS" PROJETOS
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("toggle-projects-btn");
  const container = document.querySelector(".projects-card-container");

  if (!btn || !container) return;

  const extraCards = container.querySelectorAll(".card-item.hidden");
  let expanded = false;

  btn.addEventListener("click", e => {
    e.preventDefault();
    expanded = !expanded;

    if (expanded) {
      extraCards.forEach(card => card.classList.remove("hidden"));
      btn.textContent = "Ver menos";
    } else {
      extraCards.forEach(card => card.classList.add("hidden"));
      btn.textContent = "Ver mais";
    }
  });
});


// ======================
// IntersectionObserver para animação de seções
// ======================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.classList.remove('hidden');
    } else {
      entry.target.classList.remove('visible');
      entry.target.classList.add('hidden');
    }
  });
}, { threshold: 0.3 });

sections.forEach(sec => {
  sec.classList.add('hidden'); // começam invisíveis
  observer.observe(sec);
});


document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("toggle-projects-btn");
  const cardContainer = document.querySelector(".projects-card-container");

  // pega todos os card-item que estão escondidos
  const extraCards = cardContainer.querySelectorAll(".card-item.hidden");

  let expanded = false;

  btn.addEventListener("click", (event) => {
    event.preventDefault();
    expanded = !expanded;

    if (expanded) {
      // MOSTRAR os cards extras
      extraCards.forEach(card => {
        card.classList.remove("hidden");   
      });

      btn.textContent = "Ver menos";

    } else {
      // ESCONDER os cards
      extraCards.forEach(card => {
        // após a animação de recolher, recoloca a classe hidden
        setTimeout(() => {
          card.classList.add("hidden");
        }, 300);
      });

      btn.textContent = "Ver mais";
    }

  });

});



