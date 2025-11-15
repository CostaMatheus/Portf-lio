// ======================
// Seleção de elementos
// ======================
const menuHamburger = document.querySelector(".menu-hamburger");
const linksContainer = document.querySelector(".links-container");
const header = document.getElementById('js-header');
const scrollInit = 60;

const links = document.querySelectorAll('.js-link');
const dots = document.querySelectorAll('.scroll-dots .dot');
const sections = document.querySelectorAll('.section');

// ======================
// Toggle menu hamburger (mobile)
// ======================
if (menuHamburger) {
  menuHamburger.addEventListener("click", () => {
    linksContainer.classList.toggle("active");
    menuHamburger.classList.toggle("active");
  });
}

// Fecha o menu caso o usuário role
window.addEventListener('scroll', () => {
  if (linksContainer) linksContainer.classList.remove("active");
  if (menuHamburger) menuHamburger.classList.remove("active");
});

// ======================
// Função de scroll suave manual
// ======================
function scrollSection(event) {
  if (event && event.preventDefault) event.preventDefault();

  let href;
  if (event && event.currentTarget) {
    href = event.currentTarget.getAttribute('href');
  } else if (typeof event === 'string') {
    href = event;
  } else {
    return;
  }

  if (!href || !href.startsWith('#')) return;

  const section = document.querySelector(href);
  if (!section) return;

  const targetY = section.offsetTop - 140; // compensação do header
  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = 600; // duração do scroll em ms
  let startTime = null;

  function animateScroll(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out
    window.scrollTo(0, startY + distance * ease);
    if (progress < 1) requestAnimationFrame(animateScroll);
  }

  requestAnimationFrame(animateScroll);
}

// Conecta clique dos links e dots
links.forEach(link => {
  const href = link.getAttribute('href') || '';
  if (href.startsWith('#')) link.addEventListener('click', scrollSection);
});
dots.forEach(dot => {
  const href = dot.getAttribute('href') || '';
  if (href.startsWith('#')) dot.addEventListener('click', scrollSection);
});

// ======================
// ScrollSpy + header ativo
// ======================
window.addEventListener('scroll', () => {
  const top = window.scrollY;

  sections.forEach(section => {
    const id = section.getAttribute('id');
    const offset = section.offsetTop - 150;
    const height = section.offsetHeight;

    if (top >= offset && top < offset + height) {
      // links
      links.forEach(l => l.classList.remove('actived'));
      const menuLink = document.querySelector(`header a[href*="#${id}"], header a[href*="${id}"]`);
      if (menuLink) menuLink.classList.add('actived');

      // dots
      dots.forEach(d => d.classList.remove('active'));
      const activeDot = document.querySelector(`.scroll-dots a[href="#${id}"], .scroll-dots a[href*="${id}"]`);
      if (activeDot) activeDot.classList.add('active');
    }
  });

  // header ativo
  if (top > scrollInit) {
    header.classList.add('actived');
  } else {
    header.classList.remove('actived');
  }
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
