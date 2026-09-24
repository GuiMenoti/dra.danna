/* ============================================
   DRA DANNA DAFF — main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('is-active');
    mobileNav.classList.toggle('is-open');
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('is-active');
      mobileNav.classList.remove('is-open');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.main-nav a, .mobile-nav a');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(sec => navObserver.observe(sec));

  /* ---------- Carrossel de serviços ---------- */
  const track = document.getElementById('servicosTrack');
  if (track) {
    const originalItems = Array.from(track.children);
    originalItems.forEach(item => track.appendChild(item.cloneNode(true)));
    originalItems.forEach(item => track.appendChild(item.cloneNode(true)));

    let step = 0;
    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);
      step = originalItems[0].getBoundingClientRect().width + gap;
      const prevBehavior = track.style.scrollBehavior;
      track.style.scrollBehavior = 'auto';
      track.scrollLeft = step * originalItems.length;
      track.style.scrollBehavior = prevBehavior || 'smooth';
    };
    requestAnimationFrame(measure);
    window.addEventListener('resize', measure);

    const loopWidth = () => step * originalItems.length;
    const checkLoop = () => {
      const w = loopWidth();
      if (track.scrollLeft < w * 0.5) {
        track.style.scrollBehavior = 'auto';
        track.scrollLeft += w;
        track.style.scrollBehavior = 'smooth';
      } else if (track.scrollLeft > w * 1.5) {
        track.style.scrollBehavior = 'auto';
        track.scrollLeft -= w;
        track.style.scrollBehavior = 'smooth';
      }
    };
    let loopTimer;
    track.addEventListener('scroll', () => {
      clearTimeout(loopTimer);
      loopTimer = setTimeout(checkLoop, 120);
    }, { passive: true });

    let isDown = false, startX = 0, startScroll = 0;
    track.addEventListener('pointerdown', (e) => {
      isDown = true;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.style.scrollBehavior = 'auto';
      track.classList.add('dragging');
      track.setPointerCapture(e.pointerId);
      stopAutoplay();
    });
    track.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      track.scrollLeft = startScroll - (e.clientX - startX);
    });
    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('dragging');
      track.style.scrollBehavior = 'smooth';
      startAutoplay();
    };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    document.getElementById('carouselPrev')?.addEventListener('click', () => {
      track.scrollBy({ left: -step, behavior: 'smooth' });
    });
    document.getElementById('carouselNext')?.addEventListener('click', () => {
      track.scrollBy({ left: step, behavior: 'smooth' });
    });

    let autoplayId;
    function startAutoplay() {
      stopAutoplay();
      autoplayId = setInterval(() => track.scrollBy({ left: step, behavior: 'smooth' }), 2800);
    }
    function stopAutoplay() { clearInterval(autoplayId); }
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
  }

});
