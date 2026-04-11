// ── THEME (runs immediately to prevent flash) ──
(function(){
  const saved = localStorage.getItem('spr_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', function() {

// ── SCROLL PROGRESS + BACK TO TOP ──
window.addEventListener('scroll', () => {
  const bar = document.getElementById('scrollBar');
  if (bar) bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
  const backTop = document.getElementById('backTop');
  if (backTop) backTop.classList.toggle('show', window.scrollY > 400);
  const calBtn = document.getElementById('calendlyBtn');
  if (calBtn) {
    calBtn.classList.toggle('show', window.scrollY > 300);
    const footer = document.querySelector('footer');
    if (footer) {
      const fRect = footer.getBoundingClientRect();
      calBtn.classList.toggle('near-footer', fRect.top < window.innerHeight);
    }
  }
});

// ── SPOTLIGHT ──
const spotlight = document.getElementById('spotlight');
if (spotlight) {
  document.addEventListener('mousemove', e => {
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top = e.clientY + 'px';
    spotlight.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => spotlight.style.opacity = '0');
}

// ── THEME TOGGLE ──
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  const saved = localStorage.getItem('spr_theme') || 'light';
  themeBtn.textContent = saved === 'dark' ? '☀️' : '🌙';
  themeBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('spr_theme', next);
  });
}

// ── LIVE EXPERIENCE COUNTER ──
(function() {
  const el = document.getElementById('expCounter');
  if (!el) return;
  el.innerHTML = `⏱ <strong>8+ years</strong> of professional software engineering experience`;
})();

// ── TYPING EFFECT ──
(function() {
  const typingEl = document.getElementById('typingText');
  if (!typingEl) return;
  const roles = (window.__heroRoles && window.__heroRoles.length) ? window.__heroRoles : ['Senior Java Engineer'];
  let rIdx = 0, cIdx = 0, deleting = false;
  function typeLoop() {
    const role = roles[rIdx];
    if (!deleting) {
      typingEl.textContent = role.slice(0, ++cIdx);
      if (cIdx === role.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    } else {
      typingEl.textContent = role.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
    }
    setTimeout(typeLoop, deleting ? 38 : 68);
  }
  setTimeout(typeLoop, 1200);
})();

// ── OPEN-TO TAG TOGGLES ──
document.querySelectorAll('.open-to-tag').forEach(tag => {
  tag.addEventListener('click', () => tag.classList.toggle('active'));
});

// ── SCROLL REVEAL ──
document.querySelectorAll('.reveal').forEach(el => {
  el.classList.add('animate-start');
  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 }).observe(el);
});

// ── SKILL BARS ──
document.querySelectorAll('.skill-bar-fill').forEach(b => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) b.style.width = b.dataset.width + '%';
  }, { threshold: 0.3 }).observe(b);
});

// ── LANGUAGE BARS ──
document.querySelectorAll('.lang-bar-fill').forEach(b => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) b.style.width = b.dataset.width + '%';
  }, { threshold: 0.3 }).observe(b);
});

// ── TIMELINE DRAW ──
const tlLine = document.getElementById('timelineLine');
if (tlLine) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) tlLine.style.height = tlLine.closest('.exp-timeline').scrollHeight + 'px';
  }, { threshold: 0.05 }).observe(tlLine);
}

// ── ANIMATED COUNTERS ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const step = target / 700 * 16;
  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + suffix;
    if (current < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.counter-num').forEach(animateCounter);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.achievements, .hero-stats').forEach(el => counterObs.observe(el));

// ── HERO CANVAS (light: keywords, dark: starfield) ──
(function() {
  const hc = document.getElementById('heroCanvas');
  if (hc) {
    const ctx = hc.getContext('2d');
    const words = ['Java', 'Spring Boot', 'AWS', 'Kafka', 'Kubernetes', 'PostgreSQL', 'Docker', 'Elasticsearch', 'Microservices', 'TDD', 'SOLID', 'REST', 'DynamoDB', 'Jenkins', 'React'];
    let floats = [], W, H;
    function resize() { W = hc.width = hc.offsetWidth; H = hc.height = hc.offsetHeight; }
    function spawn() { floats.push({ x: Math.random() * W, y: H + 20, word: words[Math.floor(Math.random() * words.length)], speed: 0.2 + Math.random() * 0.4, opacity: 0.08 + Math.random() * 0.08, size: 10 + Math.floor(Math.random() * 8) }); }
    let heroAnimating = true;
    function draw() { if (!heroAnimating) { requestAnimationFrame(draw); return; } ctx.clearRect(0, 0, W, H); if (Math.random() < 0.04) spawn(); floats = floats.filter(f => f.y > -30); floats.forEach(f => { f.y -= f.speed; ctx.globalAlpha = f.opacity; ctx.fillStyle = '#c47f00'; ctx.font = `${f.size}px 'DM Mono',monospace`; ctx.fillText(f.word, f.x, f.y); }); ctx.globalAlpha = 1; requestAnimationFrame(draw); }
    new IntersectionObserver(([e]) => { heroAnimating = e.isIntersecting; }, { threshold: 0 }).observe(hc);
    window.addEventListener('resize', resize); resize(); draw();
  }
  const sc = document.getElementById('starCanvas');
  if (sc) {
    const ctx = sc.getContext('2d');
    let stars = [], W, H;
    function resize() { W = sc.width = sc.offsetWidth; H = sc.height = sc.offsetHeight; stars = Array.from({ length: 120 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.5 + 0.3, speed: 0.05 + Math.random() * 0.2, opacity: Math.random(), dir: Math.random() * Math.PI * 2 })); }
    function draw() { ctx.clearRect(0, 0, W, H); stars.forEach(s => { s.x += Math.cos(s.dir) * s.speed; s.y += Math.sin(s.dir) * s.speed; s.opacity = 0.3 + Math.sin(Date.now() / 1000 + s.x) * 0.4; if (s.x < 0 || s.x > W || s.y < 0 || s.y > H) { s.x = Math.random() * W; s.y = Math.random() * H; } ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(240,165,0,${s.opacity})`; ctx.fill(); }); requestAnimationFrame(draw); }
    window.addEventListener('resize', resize); resize(); draw();
  }
})();

// ── TERMINAL CANVAS (background matrix) ──
(function() {
  const canvas = document.getElementById('terminalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const chars = 'JAVASPRINGAWSKAFKAKUBERNETES{}[]01アイウカキ'.split('');
  let particles = [], W, H;
  function resize() { const b = canvas.parentElement.getBoundingClientRect(); W = canvas.width = b.width; H = canvas.height = b.height; }
  function spawn() { particles.push({ x: Math.random() * W, y: H + 10, char: chars[Math.floor(Math.random() * chars.length)], speed: 0.3 + Math.random() * 0.6, opacity: 0.03 + Math.random() * 0.06, size: 9 + Math.floor(Math.random() * 8), color: Math.random() > 0.7 ? '#f0a500' : '#3a3a6a' }); }
  let termAnimating = true;
  function anim() { if (!termAnimating) { requestAnimationFrame(anim); return; } ctx.clearRect(0, 0, W, H); if (Math.random() < 0.3) spawn(); particles = particles.filter(p => p.y > -20); particles.forEach(p => { p.y -= p.speed; ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color; ctx.font = `${p.size}px 'DM Mono',monospace`; ctx.fillText(p.char, p.x, p.y); }); ctx.globalAlpha = 1; requestAnimationFrame(anim); }
  new IntersectionObserver(([e]) => { termAnimating = e.isIntersecting; }, { threshold: 0 }).observe(canvas);
  window.addEventListener('resize', resize); resize(); anim();
})();

// ── AI TERMINAL ──
(function() {
  const termOut = document.getElementById('terminalOutput');
  const termIn = document.getElementById('terminalInput');
  const termSend = document.getElementById('tSend');
  if (!termOut || !termIn || !termSend) return;
  let termBusy = false;

  function charRender(el, text, spd) {
    spd = spd || 18;
    return new Promise(res => {
      let i = 0;
      const cur = document.createElement('span');
      cur.className = 't-cursor-inline';
      el.appendChild(cur);
      const tick = () => {
        if (i < text.length) {
          cur.before(document.createTextNode(text[i]));
          const d = text[i] === ' ' ? spd * 0.3 : '.!?,'.includes(text[i]) ? spd * 2.5 : spd + Math.random() * 6;
          i++; setTimeout(tick, d);
        } else { cur.remove(); res(); }
      };
      tick();
    });
  }

  function addLine(prompt, pCls, tCls) {
    const line = document.createElement('div');
    line.className = 't-line';
    const p = document.createElement('span');
    p.className = 't-prompt ' + (pCls || '');
    p.textContent = prompt;
    const t = document.createElement('span');
    t.className = 't-text ' + (tCls || '');
    line.appendChild(p); line.appendChild(t);
    termOut.appendChild(line);
    termOut.scrollTop = termOut.scrollHeight;
    return t;
  }

  // Fallback responses used when the API is unavailable (local dev / no key)
  const openToRoles = window.__openToRoles !== undefined ? window.__openToRoles : true;
  const fallback = {
    aws: "I have strong hands-on AWS experience — EC2, S3, Lambda, DynamoDB, SNS, SQS, and EKS. At London Market I cut API response times by 20% through DynamoDB query optimisation.",
    kafka: "While I'm familiar with Apache Kafka from past work, my recent heavy event-driven pipelines at London Market were built entirely on AWS SNS and SQS for asynchronous messaging.",
    londonmarket: "At London Market via DXC I lead the modernisation of legacy insurance systems into Spring Boot microservices on AWS — 7 engineers, 30% fewer defects.",
    open: openToRoles
      ? "Yes — I'm actively open to senior roles in financial services, fintech, or cloud-native engineering. Based in London, open to remote. Reach me at r.suryaprakash31@gmail.com."
      : "I'm not actively looking right now, but feel free to connect on LinkedIn — I'm always open to interesting conversations.",
    ai: "I use Amazon Q Developer daily and Kiro IDE with MCP integrations for Jira/Confluence — significantly reducing manual overhead.",
    skill: "Designing scalable event-driven microservices on AWS with Java and Spring Boot — backed by TDD, SOLID principles, and CI/CD automation.",
    default: "I'm Surya — Senior Java Engineer, 8+ years in banking & insurance. Expert in Java, Spring Boot, and AWS. Currently at London Market. What would you like to know?"
  };

  function localFallback(q) {
    const ql = q.toLowerCase();
    if (ql.includes('aws') || ql.includes('cloud')) return fallback.aws;
    if (ql.includes('kafka') || ql.includes('messaging')) return fallback.kafka;
    if (ql.includes('london market') || ql.includes('dxc') || ql.includes('insurance')) return fallback.londonmarket;
    if (ql.includes('open') || ql.includes('availab') || ql.includes('hire') || ql.includes('role')) return fallback.open;
    if (ql.includes('ai') || ql.includes('tool') || ql.includes('kiro')) return fallback.ai;
    if (ql.includes('skill') || ql.includes('strong') || ql.includes('best')) return fallback.skill;
    return fallback.default;
  }

  async function askSurya(q) {
    if (termBusy || !q.trim()) return;
    termBusy = true;
    termIn.disabled = true;
    termSend.disabled = true;

    const uEl = addLine('you', 'user-p', 'user-t');
    await charRender(uEl, q, 12);

    const thEl = document.createElement('div');
    thEl.className = 't-line';
    thEl.innerHTML = '<span class="t-prompt">...</span><span class="t-text t-thinking">thinking<span class="t-cursor-inline"></span></span>';
    termOut.appendChild(thEl);
    termOut.scrollTop = termOut.scrollHeight;

    let ans;
    try {
      const res = await fetch('/.netlify/functions/ask-surya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, openToRoles })
      });
      if (res.ok) {
        const data = await res.json();
        ans = data.answer;
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("Terminal API Failure:", res.status, errData);
        ans = localFallback(q);
      }
    } catch (err) {
      console.error("Terminal Connection Error:", err);
      ans = localFallback(q);
    }

    thEl.remove();
    const sEl = addLine('me ', '', '');
    sEl.parentElement.querySelector('.t-prompt').style.color = '#c47f00';
    await charRender(sEl, ans, 16);
    termOut.scrollTop = termOut.scrollHeight;
    termIn.disabled = false;
    termSend.disabled = false;
    termIn.focus();
    termBusy = false;
  }

  termSend.addEventListener('click', () => { const q = termIn.value.trim(); if (q) { termIn.value = ''; askSurya(q); } });
  termIn.addEventListener('keydown', e => { if (e.key === 'Enter') { const q = termIn.value.trim(); if (q) { termIn.value = ''; askSurya(q); } } });
  document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => askSurya(c.dataset.q)));
})();

// ── LEARNING TICKER (Unified Banner) ──
(function() {
  const items = (window.__learningItems && window.__learningItems.length) ? window.__learningItems : ['AWS Solutions Architect Pro'];
  let idx = 0;
  const el = document.getElementById('topBannerTicker') || document.getElementById('learningTicker');
  if (!el) return;
  // If we have learning items and it's not the top banner text already, start cycling
  setInterval(() => {
    el.classList.add('fade-out');
    setTimeout(() => {
      idx = (idx + 1) % items.length;
      el.textContent = 'Learning: ' + items[idx];
      el.classList.remove('fade-out');
    }, 350);
  }, 4500);
})();

// ── MODALS ──
window.openModal = function(id) { document.getElementById(id).classList.add('open'); document.body.style.overflow = 'hidden'; };
window.closeModal = function(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow = ''; };
document.addEventListener('keydown', e => { if (e.key === 'Escape') { document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open')); document.body.style.overflow = ''; } });

// ── RECOMMENDATIONS READ MORE ──
document.querySelectorAll('.rec-text').forEach(el => {
  if (el.scrollHeight > el.clientHeight + 2) el.classList.add('clamped');
});

// ── SECTION NAV DOTS ──
(function() {
  const dots = document.querySelectorAll('.snav-dot');
  if (!dots.length) return;
  const sectionIds = ['hero', 'skills', 'experience', 'projects', 'terminal-section', 'contact'];
  function updateDots() {
    const scrollY = window.scrollY + window.innerHeight / 2;
    let active = 0;
    sectionIds.forEach((id, i) => {
      const el = document.getElementById(id) || document.querySelector('.hero');
      if (el && el.getBoundingClientRect().top + window.scrollY <= scrollY) active = i;
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
  }
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const id = dot.dataset.section;
      const el = document.getElementById(id) || (id === 'hero' ? document.querySelector('.hero') : null);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });
  window.addEventListener('scroll', updateDots, { passive: true });
  updateDots();
})();

// ── PARALLAX ──
(function() {
  const glow1 = document.querySelector('.hero-glow');
  const glow2 = document.querySelector('.hero-glow2');
  const grid = document.querySelector('.hero-bg-grid');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (glow1) glow1.style.transform = `translateY(${y * 0.15}px)`;
    if (glow2) glow2.style.transform = `translateY(${y * 0.08}px)`;
    if (grid) grid.style.transform = `translateY(${y * 0.05}px)`;
  }, { passive: true });
})();

// ── SMOOTH NAV TRANSITIONS ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── CV DOWNLOAD CONFETTI ──
(function() {
  const btn = document.getElementById('downloadCvBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const colors = ['#c47f00', '#f0a500', '#1a6fd4', '#60aaff', '#28c840', '#ffffff'];
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top;
    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div');
      const angle = Math.random() * Math.PI * 2, speed = 2 + Math.random() * 6, size = 5 + Math.random() * 7;
      el.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};pointer-events:none;z-index:99999;transform:translate(-50%,-50%);`;
      document.body.appendChild(el);
      let vx = Math.cos(angle) * speed, vy = Math.sin(angle) * speed - 4, x = 0, y = 0, opacity = 1;
      const tick = () => { vy += 0.15; x += vx; y += vy; opacity -= 0.018; el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${x * 3}deg)`; el.style.opacity = opacity; if (opacity > 0) requestAnimationFrame(tick); else el.remove(); };
      requestAnimationFrame(tick);
    }
  });
})();

// ── HAMBURGER MOBILE NAV ──
window.toggleMobileNav = function() {
  const btn = document.getElementById('hamburger');
  const overlay = document.getElementById('mobileNavOverlay');
  const drawer = document.getElementById('mobileNavDrawer');
  if (!btn || !overlay || !drawer) return;
  const isOpen = drawer.classList.contains('open');
  btn.classList.toggle('open', !isOpen);
  overlay.classList.toggle('show', !isOpen);
  drawer.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
};

// ── EASTER EGG ──
(function() {
  let buffer = ''; const secret = 'hire surya'; let logoClicks = 0; let clickTimer;
  function launchConfetti() { const colors = ['#c47f00', '#f0a500', '#1a6fd4', '#60aaff', '#28c840', '#fff']; for (let i = 0; i < 120; i++) { const el = document.createElement('div'); el.style.cssText = `position:fixed;top:${Math.random() * 30}vh;left:${Math.random() * 100}vw;width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;background:${colors[Math.floor(Math.random() * colors.length)]};z-index:99999;border-radius:${Math.random() > 0.5 ? '50%' : '2px'};pointer-events:none;animation:confettiFall ${1.5 + Math.random() * 2}s ease-out forwards;animation-delay:${Math.random() * 0.5}s;`; document.body.appendChild(el); setTimeout(() => el.remove(), 4000); } }
  const style = document.createElement('style');
  style.textContent = `@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg) scale(1);opacity:1}100%{transform:translateY(80vh) rotate(720deg) scale(0.3);opacity:0}}#easterModal{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)}#easterModal .e-box{background:var(--card);border:2px solid var(--accent);padding:3rem;max-width:480px;width:90%;text-align:center;position:relative;animation:fadeUp 0.4s ease}#easterModal .e-emoji{font-size:3.5rem;margin-bottom:1rem}#easterModal .e-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:var(--accent);margin-bottom:1rem}#easterModal .e-text{font-size:0.9rem;color:var(--muted);line-height:1.8;margin-bottom:2rem}#easterModal .e-close{position:absolute;top:1rem;right:1rem;background:none;border:1px solid var(--border);width:30px;height:30px;cursor:pointer;color:var(--muted);font-size:1rem;display:flex;align-items:center;justify-content:center}#easterModal .e-cta{display:inline-flex;align-items:center;gap:0.5rem;font-family:'DM Mono',monospace;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;padding:0.85rem 2rem;background:var(--accent);color:#fff;text-decoration:none;border:none;cursor:pointer}`;
  document.head.appendChild(style);
  function showEasterEgg() { if (document.getElementById('easterModal')) return; launchConfetti(); const modal = document.createElement('div'); modal.id = 'easterModal'; modal.innerHTML = `<div class="e-box"><button class="e-close" onclick="this.closest('#easterModal').remove()">✕</button><div class="e-emoji">🎉</div><div class="e-title">You found the secret!</div><div class="e-text">Great taste! Surya is a Senior Java Engineer open to exciting new opportunities.<br><br><em style="font-family:'Playfair Display',serif">Let's build something great together.</em></div><a href="mailto:r.suryaprakash31@gmail.com" class="e-cta">✉ Get in touch now</a></div>`; document.body.appendChild(modal); modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); }); }
  const logo = document.getElementById('navLogo');
  if (logo) { logo.addEventListener('click', () => { logoClicks++; clearTimeout(clickTimer); if (logoClicks >= 5) { logoClicks = 0; showEasterEgg(); return; } logo.style.transform = `rotate(${logoClicks % 2 === 0 ? '-3deg' : '3deg'})`; logo.style.transition = 'transform 0.1s'; setTimeout(() => { logo.style.transform = ''; }, 150); clickTimer = setTimeout(() => { logoClicks = 0; }, 1500); }); }
  document.addEventListener('keydown', e => { const tag = document.activeElement.tagName; if (tag === 'INPUT' || tag === 'TEXTAREA') return; if (e.key.length !== 1) return; buffer += e.key.toLowerCase(); if (buffer.length > secret.length) buffer = buffer.slice(-secret.length); if (buffer === secret) { buffer = ''; showEasterEgg(); } });
})();

// ── VISITOR COUNTER ──
(function() {
  const el = document.getElementById('visitorCount');
  if (!el) return;
  fetch('https://api.counterapi.dev/v1/surya-portfolio/visits/up')
    .then(r => r.json())
    .then(data => {
      const count = data.count ? data.count.toLocaleString() : '—';
      el.textContent = '\uD83D\uDC41 ' + count + ' visitors';
    })
    .catch(() => { el.textContent = ''; });
})();

}); // end DOMContentLoaded
