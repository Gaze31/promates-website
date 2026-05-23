(function () {

  /* ── Scroll progress bar ── */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (total > 0 ? Math.min((scrolled / total) * 100, 100) : 0) + '%';
    }, { passive: true });
  }

  /* ── Nav border on scroll ── */
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 40
      ? 'rgba(28,25,22,0.16)'
      : 'rgba(28,25,22,0.08)';
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

  /* ── Mobile hamburger ── */
  const hamBtn = document.getElementById('ham-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  hamBtn.addEventListener('click', () => {
    const open = hamBtn.classList.toggle('open');
    hamBtn.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
  });
  mobileMenu.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      hamBtn.classList.remove('open');
      hamBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
    });
  });

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
