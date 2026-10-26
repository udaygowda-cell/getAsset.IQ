/* Doctor rig: GSAP drives a jointed character (hips, knees, shoulder, elbow, neck, eyes) with
   a procedural walk cycle, spring-driven stethoscope/badge, blinking and pointer-following gaze. */
window.hsInitRig = function (stage) {
  if (!stage || !window.gsap || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  stage.classList.add('hs-gsap');
  var $ = function (s) { return stage.querySelector(s); };
  var J = { person: $('.hs-person'), body: $('.hs-body'), head: $('.hs-head'), l1: $('.hs-leg1'), l2: $('.hs-leg2'),
            k1: $('.hs-shin1'), k2: $('.hs-shin2'), sh: $('.hs-sh'), el: $('.hs-el'), tab: $('.hs-tabj'),
            a2: $('.hs-arm2'), e2: $('.hs-el2'), th: $('.hs-thumb'), st: $('.hs-steth'), bd: $('.hs-badge') };
  var irises = stage.querySelectorAll('.hs-iris'), eyes = stage.querySelectorAll('.hs-eye');
  var R = { x: -150, raise: 0, gaze: 0, nod: 0, mouse: 0, mx: 0, my: 0, blink: 1, thumb: 0 };
  var st = { s: 0, v: 0 }, bd = { s: 0, v: 0 }, amp = 0, phase = 0, prevX = R.x, visible = true;
  var set = function (el, v) { el.setAttribute('transform', v); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var spring = function (o, k, c, drive, dt) { o.v += (-k * o.s - c * o.v + drive) * dt; o.s += o.v * dt; };

  new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(stage);

  var tick = function (t, ms) {
    if (!visible) return;
    var dt = Math.min(ms, 50) / 1000 || .016, vx = (R.x - prevX) / dt; prevX = R.x;
    amp += (clamp(vx / 100, 0, 1) - amp) * Math.min(1, dt * 9);
    phase += Math.max(vx, 0) * dt * .0785;
    var p = phase, S = Math.sin, C = Math.cos, r = R.raise, m = R.mouse;
    /* legs: hip swing + knee flexion during the swing phase */
    set(J.l1, 'rotate(' + (-S(p) * 24 * amp) + ')');            set(J.l2, 'rotate(' + (S(p) * 24 * amp) + ')');
    set(J.k1, 'rotate(' + (amp * (4 + Math.pow(Math.max(0, C(p + .4)), 1.3) * 42)) + ')');
    set(J.k2, 'rotate(' + (amp * (4 + Math.pow(Math.max(0, C(p + Math.PI + .4)), 1.3) * 42)) + ')');
    /* torso: bob, forward lean, breathing */
    var bob = -Math.abs(S(p)) * 2.4 * amp + S(t * 1.7) * .8 * (1 - amp), lean = 2.2 * amp;
    set(J.body, 'translate(0,' + bob + ') rotate(' + lean + ' 0 220)');
    /* arms: carry the tablet low while walking, then raise it to scan */
    var sw = S(p + Math.PI) * amp * (1 - r), tremor = S(t * 1.9) * 1.1 * r;
    var sh = 26 * (1 - r) + sw * 14 + tremor, el = 72 * (1 - r) + sw * 8 - S(t * 1.3) * .8 * r;
    set(J.sh, 'rotate(' + sh + ')'); set(J.el, 'rotate(' + el + ')'); set(J.tab, 'rotate(' + (-(sh + el) * .92) + ')');
    var th = R.thumb;
    set(J.a2, 'rotate(' + ((S(p) * 20 * amp + S(t * 1.1) * .8) * (1 - th) + th * 40) + ')');
    set(J.e2, 'rotate(' + (6 * (1 - th) + th * 132 + S(t * 4) * th * .6) + ')');
    set(J.th, 'scale(1,' + (.15 + .85 * clamp((th - .35) / .65, 0, 1)) + ')');
    /* secondary motion: stethoscope and badge swing on springs */
    spring(st, 70, 5, C(p) * amp * 190, dt);  spring(bd, 45, 4, C(p) * amp * 150, dt);
    set(J.st, 'rotate(' + clamp(st.s, -14, 14) + ')'); set(J.bd, 'rotate(' + clamp(bd.s, -18, 18) + ')');
    /* head + eyes: scripted gaze, overridden by the pointer when it moves */
    var g = R.gaze, gh = g < 0 ? -g * 5 : -g * 1.5, mh = clamp(R.mx, -1, 1) * 6 + R.my * 3;
    set(J.head, 'rotate(' + ((1 - m) * gh + m * mh + R.nod - lean * .6 - bob * .8 + S(t * .7) * .5 + S(t * 1.9) * .25) + ')');
    var gx = (1 - m) * (g < 0 ? -g * .5 : g * 1.3) + m * R.mx * 1.4 + S(t * 3.3) * .12, gy = (1 - m) * (g < 0 ? -g * 1.1 : g * .2) + m * R.my + C(t * 2.7) * .08;
    irises.forEach(function (i) { set(i, 'translate(' + clamp(gx, -1.6, 1.6) + ',' + clamp(gy, -1.1, 1.1) + ')'); });
    eyes.forEach(function (e) { set(e, 'scale(1,' + R.blink + ')'); });
    set(J.person, 'translate(' + R.x + ',0)'); J.person.style.opacity = clamp((R.x + 150) / 40, 0, 1);
  };
  gsap.ticker.add(tick);

  /* choreography: walk in -> raise tablet -> scan loop (synced with the 6s CSS scan beam) */
  gsap.to(R, { x: 0, duration: 2.1, delay: .5, ease: 'power2.out' });
  gsap.to(R, { raise: 1, duration: .95, delay: 2.1, ease: 'power3.inOut' });
  gsap.timeline({ repeat: -1, delay: 2.4 })
    .to(R, { gaze: -1, duration: .5, ease: 'power2.inOut' }, .5)
    .to(R, { gaze: 1, duration: .6, ease: 'power2.inOut' }, 1.8)
    .to(R, { nod: 5, duration: .22, ease: 'power2.out' }, 3.45)
    .to(R, { nod: 0, duration: .5, ease: 'power2.inOut' }, 3.7)
    .to(R, { thumb: 1, duration: .55, ease: 'back.out(1.6)' }, 3.4)
    .to(R, { thumb: 0, duration: .7, ease: 'power2.inOut' }, 5.1)
    .to(R, { gaze: 0, duration: .7, ease: 'power2.inOut' }, 4.7)
    .to({}, { duration: 0 }, 6);

  /* natural blinking at random intervals */
  (function blink() {
    gsap.to(R, { blink: .08, duration: .07, yoyo: true, repeat: 1, ease: 'power1.in' });
    gsap.delayedCall(2.2 + Math.random() * 3.3, blink);
  })();

  /* pointer-following gaze */
  var qx = gsap.quickTo(R, 'mx', { duration: .7, ease: 'power3' }), qy = gsap.quickTo(R, 'my', { duration: .7, ease: 'power3' }), idle;
  window.addEventListener('pointermove', function (e) {
    var b = J.head.getBoundingClientRect(); if (!b.width) return;
    qx(clamp((e.clientX - b.left - b.width / 2) / 420, -1, 1)); qy(clamp((e.clientY - b.top - b.height / 2) / 420, -1, 1));
    gsap.to(R, { mouse: 1, duration: .4, overwrite: 'auto' });
    if (idle) idle.kill(); idle = gsap.delayedCall(3.5, function () { gsap.to(R, { mouse: 0, duration: 1.4 }); });
  }, { passive: true });
  return function () { gsap.ticker.remove(tick); };
};
if (!window.React || !window.ReactDOM) window.hsInitRig(document.querySelector('.hs-stage'));
