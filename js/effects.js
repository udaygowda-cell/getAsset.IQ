/* Phone crop for the hero scene: show the doctor and monitor larger instead of the whole room */
window.hsFit = function () {
  var s = document.querySelector('.hs-svg'); if (!s) return;
  s.setAttribute('viewBox', matchMedia('(max-width: 760px)').matches ? '225 30 470 290' : '0 0 900 340');
};
window.hsFit(); matchMedia('(max-width: 760px)').addEventListener('change', window.hsFit);
/* ==========================================================================
   ANIMATION & EFFECTS LAYER (additive only - existing scripts untouched)
   ========================================================================== */
(function () {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const q = s => [...document.querySelectorAll(s)];

  /* Scroll progress bar + hero parallax */
  const prog = document.createElement('div');
  prog.id = 'fxProg';
  document.body.appendChild(prog);
  const hero = document.querySelector('.hero');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ')';
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Staggered scroll reveal for grouped items */
  function reveal(sel, step, thr) {
    const els = q(sel);
    if (!els.length) return;
    els.forEach(e => e.classList.add('fx-pre'));
    const o = new IntersectionObserver(es => {
      let k = 0;
      es.filter(x => x.isIntersecting).forEach(x => {
        const e = x.target;
        e.style.setProperty('--d', (120 + k * step) + 'ms');
        e.classList.remove('fx-pre');
        e.classList.add('fx-go', 'fx-seen');
        o.unobserve(e);
        const life = 1300 + k * step;
        k++;
        setTimeout(() => e.classList.remove('fx-go'), life);
      });
    }, { threshold: thr || 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(e => o.observe(e));
  }
  reveal('.console-wrapper', 0);
  reveal('.kp > div', 90);
  reveal('.dev, .feed', 120);
  reveal('.ql button', 70);
  reveal('.st', 110);
  reveal('.mc', 90);
  reveal('.tabs button', 80);
  reveal('.tl > div', 110);
  reveal('.est-card', 100);
  reveal('.slider-group', 80);
  reveal('.fi', 80);
  reveal('footer .w > div', 120);

  /* Magnetic buttons + click ripple */
  q('.btn-hero-primary, .btn.pri, .btn-hero-secondary').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width * 10;
      const y = (e.clientY - r.top - r.height / 2) / r.height * 8;
      b.style.translate = x + 'px ' + y + 'px';
    });
    b.addEventListener('pointerleave', () => { b.style.translate = ''; });
  });
  q('.btn').forEach(b => b.addEventListener('click', e => {
    const r = b.getBoundingClientRect();
    const d = Math.max(r.width, r.height);
    const s = document.createElement('span');
    s.className = 'fx-rip';
    s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
    b.appendChild(s);
    setTimeout(() => s.remove(), 650);
  }));

  /* Value section: stop the autoplay progress bar once the user picks a question */
  const ql = document.getElementById('ql');
  if (ql) ql.addEventListener('click', () => ql.classList.add('manual'), true);

  /* Estimator: count-up on the outcome cards the first time they appear */
  const grid = document.querySelector('.est-cards-grid');
  if (grid) {
    let abort = false;
    document.addEventListener('input', () => { abort = true; }, { once: true, capture: true });
    const co = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      co.disconnect();
      const els = ['o1', 'o2', 'o3', 'o4'].map(id => document.getElementById(id)).filter(Boolean);
      const finals = els.map(e => e.textContent);
      const t0 = performance.now(), dur = 1300;
      (function f(t) {
        if (abort) return;
        const p = Math.min((t - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
        els.forEach((el, i) => {
          const m = finals[i].match(/[\d,]*\.?\d+/);
          if (!m) return;
          const raw = m[0], num = parseFloat(raw.replace(/,/g, '')), dec = (raw.split('.')[1] || '').length;
          let s = (num * ease).toFixed(dec);
          if (raw.includes(',')) s = Number(s).toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec });
          el.textContent = finals[i].replace(raw, s);
        });
        if (p < 1) requestAnimationFrame(f);
        else if (typeof est === 'function') est();
      })(t0);
    }, { threshold: 0.35 });
    co.observe(grid);
  }
})();
