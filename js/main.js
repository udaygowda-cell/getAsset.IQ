const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion:reduce)').matches;

// Video Modal Control
const videoModal = $('#videoModal');
const btnOpenVideo = $('#btnOpenVideo');
const btnCloseModal = $('#btnCloseModal');

function openModal() {
  if (videoModal) {
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal() {
  if (videoModal) {
    videoModal.classList.remove('open');
    document.body.style.overflow = '';
  }
}
if (btnOpenVideo) btnOpenVideo.onclick = openModal;
if (btnCloseModal) btnCloseModal.onclick = closeModal;
if (videoModal) {
  videoModal.onclick = (e) => {
    if (e.target === videoModal) closeModal();
  };
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoModal && videoModal.classList.contains('open')) closeModal();
});

// 7 CFO Executive Questions
const Q = [
  ["What do I own, and what is it worth?", "₹38.4 Cr", "1,062 assets · 14% life-saving · 22% revenue equipment", "Register: purchase details, criticality, department", [14, 31, 55]],
  ["What am I spending to keep it running?", "82%", "of annual budget used, month 9 of 12. AMC/CMC fees, parts and labour per asset and department.", "Contracts, stores, budgets", [82, 18]],
  ["What does it cost me when it fails?", "212 h", "downtime on revenue equipment this month. Each hour is deferred procedures.", "Issues: measured downtime per asset and month", [70, 30]],
  ["Am I paying twice for repairs?", "37 of 41", "repairs were under active coverage. 4 were outside contract. Coverage displays on tickets before work starts.", "Contracts on the ticket", [90, 10]],
  ["Which machines are eating the budget?", "9 assets", "with 3 or more issues in 90 days. Backed by MTBF and total cost of repair vs replacement cost.", "Asset health score, MTBF, cost per asset", [25, 75]],
  ["Am I exposed to compliance fines?", "84%", "fully compliant. 11% due in 30 days, 5% overdue across PM, calibration, AERB licences and contracts.", "Reports, licensing, physical verification log", [84, 11, 5]],
  ["Is the preventive maintenance working?", "93%", "PM compliance achieved, with unexpected breakdowns reduced by 22% over the same six months.", "Dashboard: PM compliance trend, open issues", [93, 7]]
];

const col = ['#6366F1', '#2563EB', '#00A3FF'];
$('#ql').innerHTML = Q.map((q, i) => `<button data-i="${i}"><b>${i+1}</b>${q[0]}</button>`).join('');

function val(i) {
  $$('#ql button').forEach((b, j) => b.classList.toggle('on', i === j));
  const q = Q[i], v = $('#vc');
  v.innerHTML = `
    <small>Executive Question ${i+1}</small>
    <div class="n gt">${q[1]}</div>
    <p>${q[2]}</p>
    <div class="bars">${q[4].map((w, k) => `<i style="flex:none;background:${col[k]};width:0" data-w="${w}%"></i>`).join('')}</div>
    <div class="src"><b>Where this is verified:</b> ${q[3]}</div>
  `;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      $$('.bars i').forEach(e => {
        e.style.width = `calc(${e.dataset.w} * 0.95)`;
      });
    });
  });
}

$$('#ql button').forEach(b => b.onclick = () => { val(+b.dataset.i); auto = false; });
let auto = true;
val(0);
let vi = 0;
setInterval(() => {
  if (auto && !RM && !document.hidden) {
    vi = (vi + 1) % Q.length;
    val(vi);
  }
}, 4400);

// 5-Step Lifecycle flow
const S = [
  ["Reported", "Any staff member scans the device QR, describes the fault and adds a photo. Untagged assets can be reported too."],
  ["Assigned", "Escalated by criticality and sent to the right engineer in seconds, with the coverage shown on the ticket."],
  ["In progress", "Spare parts issued from stores against the ticket, while the system measures the downtime."],
  ["Fixed", "Action note and test readings mandatory. All timestamps signed cryptographically."],
  ["Verified", "The reporter signs off on the repair on their phone. Only then does the ticket close."]
];
$('#fl5').innerHTML = S.map((s, i) => `<div class="st"><i>${i+1}</i><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('');
let si = 0;
function step() {
  $$('.st').forEach((e, i) => e.classList.toggle('on', i <= si));
  $('#pgb').style.width = (((si + 1) / 5) * 100) + '%';
  si = (si + 1) % 5;
}
step();
if (!RM) setInterval(step, 2000);

// Modules
const M = [
  ["Module 1", "Asset register", ["QR tag on every asset", "Bulk import at onboarding", "Depreciation and book value", "Transfers, loans and gate passes"]],
  ["Module 2", "Maintenance & calibration", ["PM, calibration and safety schedules", "Reminders and calendar view", "Checklists with measured readings", "Calibration certificates on record"]],
  ["Module 3", "Breakdowns & downtime", ["Report by QR scan, including untagged assets", "SLAs and escalation by criticality", "Reporter sign-off on every repair", "Repeat-failure alerts"]],
  ["Module 4", "Contracts, stores & purchase", ["Warranty, AMC and CMC tracking", "Vendor SLA tracking", "Spare parts with batch and expiry", "Indent, PO and goods receipt"]],
  ["Module 5", "Compliance & audit", ["NABH-ready audit exports", "Radiation and AERB register", "Physical verification rounds", "Condemnation and training records"]],
  ["Module 6", "Dashboards & access", ["Uptime, MTTR and MTBF dashboard", "Ask AssetIQ in plain language", "Role-based, multi-branch access", "Android and web, with offline access"]]
];
$('#mg').innerHTML = M.map(m => `
  <div class="mc rv">
    <small>${m[0]}</small>
    <h3>${m[1]}</h3>
    <ul>${m[2].map(x => `<li>${x}</li>`).join('')}</ul>
  </div>
`).join('');

// Roles
const R = {
  bio: ["Biomedical Engineering", "Run maintenance on schedule", [
    "PM, calibration and safety schedules with automatic reminders",
    "Device history on your phone; log each job by QR scan, even offline",
    "One queue for breakdowns, PMs and calibrations, sorted by urgency",
    "Spare parts issued against the job, with the cost on the device"
  ]],
  fin: ["Purchase & Finance", "Control equipment spend", [
    "Warranty, AMC and CMC coverage checked before a vendor quote is approved",
    "Cost, depreciation and contract-expiry alerts per device",
    "Indent, purchase order and goods receipt into stores",
    "Vendor SLA tracking, with escalation when a vendor misses it"
  ]],
  qual: ["Quality & NABH", "Show compliance on demand", [
    "NABH and JCI audit exports in one click",
    "AERB and lead-apron register with licence validity",
    "Append-only log of every change, with user and time",
    "Calibration certificates and physical verification rounds on record"
  ]],
  it: ["IT", "No infrastructure to manage", [
    "Cloud-hosted web and Android apps; role-based, multi-branch access",
    "Encrypted data, VAPT tested, stored in India",
    "API and webhooks for HIS and ERP",
    "Admin console to configure departments, workflows and approvals"
  ]],
  usr: ["Doctors & Ward Staff", "Report a fault in seconds", [
    "Scan the QR on the machine to open the reporting page",
    "Untagged assets can be reported too",
    "See the live status of every pending repair",
    "Confirm the repair before the ticket closes"
  ]]
};
$('#tabs').innerHTML = Object.keys(R).map(k => `<button data-k="${k}">${R[k][0]}</button>`).join('');
function role(k) {
  $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
  const r = R[k];
  $('#panel').innerHTML = `
    <h3>${r[0]}</h3>
    <div class="sub">${r[1]}</div>
    <ul>${r[2].map((t, i) => `<li style="animation-delay:${i*70}ms">${t}</li>`).join('')}</ul>
  `;
}
$$('#tabs button').forEach(b => b.onclick = () => role(b.dataset.k));
role('bio');

// Compare Table
const T = [
  ["Measured clinical downtime clock", "Included (Automated)", "Manual timestamp typing", "Unreliable"],
  ["Active warranty and AMC shown on the ticket", "Included (Instant)", "Separate disconnected module", "Manual search"],
  ["Reporter signs off before a repair closes", "Included (Built-in)", "Closed by technician", "Not supported"],
  ["Offline mobile operation", "Included (Native)", "Requires internet", "Paper back-entry"],
  ["Repeat-failure detection", "Included", "Partial / on roadmap", "Not available"],
  ["Purchase indent, PO and goods receipt into stores", "Included", "Partial / on roadmap", "Not available"],
  ["Radiation / AERB / lead-apron register", "Included", "Partial / on roadmap", "Not available"],
  ["One-click NABH audit exports", "Included", "Needs custom reporting", "Weeks of manual work"],
  ["Vendor SLA tracking and escalation", "Included", "Requires manual setup", "Untracked"],
  ["VAPT of your hospital's implementation", "Included", "Not usually offered", "Not available"]
];
$('#tb').innerHTML = T.map((r, i) => `
  <tr class="row" style="transition-delay:${i*60}ms">
    <td>${r[0]}</td>
    <td class="me">${r[1]}</td>
    <td class="x">${r[2]}</td>
    <td class="x">${r[3]}</td>
  </tr>
`).join('');

// FAQ
const F = [
  ["What is AssetIQ?", "AssetIQ is biomedical equipment management for hospitals. One register for every device, with maintenance and calibration schedules, breakdown tickets with measured downtime, contracts, spares, purchase and NABH, JCI and AERB records. It runs on web and Android."],
  ["How does our existing data get in?", "Import your spreadsheet in bulk, or our team tags the devices on site with you. If you use another software system, we map its export to the register. You review the mapped data before it goes live."],
  ["What happens in the 30-day trial?", "Days 1 to 5: inventory and QR tagging. Days 6 and 7: training for engineers, ward staff, department heads and administrators. Days 8 to 29: you run daily operations with support. Day 30: we compare the audit report with your current system's output and you decide. Your current system keeps running throughout."],
  ["Does the mobile app work without a signal?", "Yes. Scan a device, see its history and log a job even offline. The app syncs when you are back online."],
  ["Who owns our data, and where is it stored?", "You do. Data is hosted in the cloud in India, encrypted, and every change is written to an append-only log with the user and time. Your hospital's implementation is VAPT tested, and you can export your records at any time."],
  ["Can we manage more than one hospital branch?", "Yes. Role-based, multi-branch access gives group leadership one view, while each branch keeps its own queues and records."],
  ["How is AssetIQ priced?", "Simple asset-based pricing, with unlimited users for all roles and branches. Onboarding, user training and remote support are included, and multi-year contracts get a lower price."],
  ["Can it connect to our HIS or ERP?", "Yes. AssetIQ has an API and webhooks for integration with your HIS and ERP."]
];
$('#fq').innerHTML = F.map(f => `
  <div class="fi">
    <button aria-expanded="false">${f[0]}</button>
    <div class="fa"><div><p>${f[1]}</p></div></div>
  </div>
`).join('');
$$('.fi button').forEach(b => b.onclick = () => {
  const o = b.parentElement.classList.toggle('on');
  b.setAttribute('aria-expanded', o);
});

// Number Counter animation
function cu(el) {
  const to = +el.dataset.n, d = +el.dataset.d || 0;
  if (RM) { el.textContent = to.toLocaleString('en-IN'); return; }
  const t0 = performance.now();
  (function f(t) {
    const p = Math.min((t - t0) / 1400, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = (to * e).toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}

// Intersection Observers for Scroll Reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');
    io.unobserve(e.target);
  }
}), { threshold: 0.15 });
$$('.rv, .bar2, tr.row').forEach(e => io.observe(e));

const io2 = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.querySelectorAll('[data-n]').forEach(cu);
    io2.unobserve(e.target);
  }
}), { threshold: 0.25 });
io2.observe(document.body.firstElementChild && document.querySelector('.con') || document.createElement('i'));

// ==========================================
// Interactive ROI Estimator & Dynamic Updates
// ==========================================
const inr = n => n >= 1e7 ? '₹' + (n / 1e7).toFixed(1) + ' Cr' : n >= 1e5 ? '₹' + (n / 1e5).toFixed(1) + ' L' : '₹' + Math.round(n).toLocaleString('en-IN');

let cardResetTimers = {};

function triggerBump(el, cardEl) {
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
  
  if (cardEl) {
    const cardId = cardEl.id;
    cardEl.classList.add('card-active');
    if (cardResetTimers[cardId]) clearTimeout(cardResetTimers[cardId]);
    cardResetTimers[cardId] = setTimeout(() => {
      cardEl.classList.remove('card-active');
    }, 450);
  }
}

function updateSliderProgress(slider) {
  const min = +slider.min;
  const max = +slider.max;
  const val = +slider.value;
  const percentage = ((val - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(to right, #2563EB 0%, #00A3FF ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;
  
  // Update floating bubble position
  const bubble = $(`#b-${slider.id}`);
  if (bubble) {
    bubble.style.left = `calc(${percentage}% + ${(11 - percentage * 0.22)}px)`;
  }
}

function est(triggerElement) {
  const a = +$('#e1').value;
  const v = +$('#e2').value;
  const p = +$('#e3').value;
  const h = +$('#e4').value;
  const r = +$('#e5').value;

  const t1 = a.toLocaleString('en-IN');
  const t2 = inr(v);
  const t3 = p + '%';
  const t4 = h + ' hrs';
  const t5 = inr(r);

  // Update Right-Column Slider Badges & Floating Bubbles
  $('#l1').textContent = t1;
  $('#l2').textContent = t2;
  $('#l3').textContent = t3;
  $('#l4').textContent = t4;
  $('#l5').textContent = t5;

  const b1 = $('#b-e1'); if (b1) b1.textContent = t1;
  const b2 = $('#b-e2'); if (b2) b2.textContent = t2;
  const b3 = $('#b-e3'); if (b3) b3.textContent = t3;
  const b4 = $('#b-e4'); if (b4) b4.textContent = t4;
  const b5 = $('#b-e5'); if (b5) b5.textContent = t5;

  // Calculate Left-Column Card Values
  const o1El = $('#o1');
  const o2El = $('#o2');
  const o3El = $('#o3');
  const o4El = $('#o4');

  o1El.textContent = inr(a * v);
  o2El.textContent = inr(h * r);
  o3El.textContent = Math.max(90, Math.min(98, Math.round(p * 1.15))) + '%';
  o4El.textContent = a.toLocaleString('en-IN') + ' units';

  // Apply slider track background gradient
  $$('.custom-range').forEach(updateSliderProgress);

  // Trigger micro-bump animation & highlight pulse on affected outcome cards
  if (triggerElement) {
    if (triggerElement.id === 'e1') {
      triggerBump(o1El, $('#c1'));
      triggerBump(o4El, $('#c4'));
    }
    if (triggerElement.id === 'e2') {
      triggerBump(o1El, $('#c1'));
    }
    if (triggerElement.id === 'e3') {
      triggerBump(o3El, $('#c3'));
    }
    if (triggerElement.id === 'e4' || triggerElement.id === 'e5') {
      triggerBump(o2El, $('#c2'));
    }
  }
}

$$('.custom-range').forEach(input => {
  const wrap = input.closest('.slider-track-wrap');
  const group = input.closest('.slider-group');

  const startDrag = () => {
    if (wrap) wrap.classList.add('dragging');
    if (group) group.classList.add('active');
  };
  const endDrag = () => {
    if (wrap) wrap.classList.remove('dragging');
    if (group) group.classList.remove('active');
  };

  input.addEventListener('mousedown', startDrag);
  input.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);

  input.addEventListener('input', (e) => est(e.target));
});
est(); // initial run

// Form Submit Handler
$('#fm').onsubmit = e => {
  e.preventDefault();
  $('#fm').hidden = true;
  $('#ok').hidden = false;
};

// Header shadow on scroll
addEventListener('scroll', () => $('#hd').classList.toggle('sc', scrollY > 10), { passive: true });

// Active nav indicator
const ls = $$('.links a');
const io4 = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    ls.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }
}), { rootMargin: '-45% 0px -50% 0px' });
$$('section[id]').forEach(s => io4.observe(s));
