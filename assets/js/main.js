(() => {
  'use strict';

  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = mainNav ? [...mainNav.querySelectorAll('a')] : [];
  const bookStage = document.getElementById('bookStage');
  const book = document.getElementById('book');
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('email');
  const formMessage = document.getElementById('formMessage');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setHeaderState = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Apri menu');
    mainNav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Apri menu' : 'Chiudi menu');
    mainNav?.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) closeMenu();
  });
  window.addEventListener('scroll', setHeaderState, { passive: true });
  setHeaderState();

  const revealElements = document.querySelectorAll('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canTilt && !reducedMotion && bookStage && book) {
    bookStage.addEventListener('pointermove', (event) => {
      const bounds = bookStage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      const rotateY = -10 + x * 12;
      const rotateX = 3 - y * 9;
      book.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(4px)`;
    });
    bookStage.addEventListener('pointerleave', () => {
      book.style.transform = 'rotateY(-10deg) rotateX(3deg)';
    });
  }

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = emailInput?.value.trim() || '';

    if (!isValidEmail(value)) {
      formMessage.textContent = 'Inserisci un indirizzo email valido.';
      formMessage.classList.add('is-error');
      emailInput?.focus();
      return;
    }

    formMessage.classList.remove('is-error');
    formMessage.textContent = 'Grazie! L’iscrizione demo è stata registrata.';
    form.reset();

    // GitHub Pages non include un backend. Per rendere reale l'iscrizione,
    // collega qui Formspree, Brevo, Mailchimp o il provider scelto.
  });

  if (emailInput && formMessage) {
    emailInput.addEventListener('input', () => {
      if (!formMessage.classList.contains('is-error')) return;
      formMessage.textContent = '';
      formMessage.classList.remove('is-error');
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
