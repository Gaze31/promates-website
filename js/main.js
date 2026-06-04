(function () {

  /* ── Hamburger / mobile menu ── */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu   = document.getElementById('mobile-menu');

  function openMenu() {
    hamburgerBtn.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburgerBtn.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    // Close button inside the overlay
    const closeBtn = document.getElementById('mobile-menu-close');
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Close when a mobile link is tapped
    mobileMenu.querySelectorAll('.mobile-link, .mobile-cta').forEach(el => {
      el.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ── Scroll progress bar ── */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (total > 0 ? Math.min((scrolled / total) * 100, 100) : 0) + '%';
    }, { passive: true });
  }

  /* ── Nav: solid background on scroll (like Contra Labs) ── */
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }, { passive: true });

  /* ── Hero headline: line-by-line reveal ── */
  setTimeout(() => {
    const headline = document.querySelector('.hero-headline');
    if (headline) headline.classList.add('lines-visible');
  }, 250);

  /* ── Hero image: subtle parallax ── */
  const heroImg = document.querySelector('.hero-right img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight * 1.5) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.11}px)`;
      }
    }, { passive: true });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ── data-scroll-to buttons ── */
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.scrollTo);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── data-mailto buttons ── */
  document.querySelectorAll('[data-mailto]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'mailto:' + btn.dataset.mailto;
    });
  });

  /* ── Gallery drag-to-scroll ── */
  const galleryScroll = document.querySelector('.gallery-scroll');
  if (galleryScroll) {
    let isDown = false, startX, scrollLeft;
    galleryScroll.addEventListener('mousedown', e => {
      isDown = true;
      galleryScroll.classList.add('is-dragging');
      startX = e.pageX - galleryScroll.offsetLeft;
      scrollLeft = galleryScroll.scrollLeft;
    });
    galleryScroll.addEventListener('mouseleave', () => { isDown = false; galleryScroll.classList.remove('is-dragging'); });
    galleryScroll.addEventListener('mouseup', () => { isDown = false; galleryScroll.classList.remove('is-dragging'); });
    galleryScroll.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - galleryScroll.offsetLeft;
      galleryScroll.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
  }

  /* ── Image error fallbacks ── */
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const ph = document.getElementById(img.dataset.fallback);
      if (ph) ph.classList.remove('hidden');
    });
  });

  /* ── Scroll-reveal ── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── Counter animation ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = 'true';
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  /* ── Magnetic buttons ── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      const strength = parseFloat(btn.dataset.magneticStrength || '0.14');
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        btn.style.transition = 'transform 0.08s linear, background 0.3s';
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1), background 0.3s';
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

})();
