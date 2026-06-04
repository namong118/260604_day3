/* =============================================
   1. CANVAS PARTICLE NETWORK
   ============================================= */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles, mouse = { x: -9999, y: -9999 };

function resizeCanvas() {
  const hero = document.getElementById('hero');
  W = canvas.width = hero.offsetWidth;
  H = canvas.height = hero.offsetHeight;
}

function Particle() {
  this.x = Math.random() * W;
  this.y = Math.random() * H;
  this.vx = (Math.random() - 0.5) * 0.6;
  this.vy = (Math.random() - 0.5) * 0.6;
  this.r = Math.random() * 2.5 + 1;
  this.base = { x: this.x, y: this.y };
  this.hue = Math.random() < 0.5 ? 262 : 188; // purple or cyan
}

Particle.prototype.update = function () {
  const dx = mouse.x - this.x;
  const dy = mouse.y - this.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 120) {
    const force = (120 - dist) / 120;
    this.vx -= (dx / dist) * force * 0.8;
    this.vy -= (dy / dist) * force * 0.8;
  }

  this.vx *= 0.97;
  this.vy *= 0.97;
  this.x += this.vx;
  this.y += this.vy;

  if (this.x < 0) this.x = W;
  if (this.x > W) this.x = 0;
  if (this.y < 0) this.y = H;
  if (this.y > H) this.y = 0;
};

Particle.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(${this.hue}, 90%, 75%, 0.8)`;
  ctx.fill();
};

function connectParticles() {
  const MAX_DIST = 130;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > MAX_DIST) continue;
      const alpha = (1 - dist / MAX_DIST) * 0.45;
      const grad = ctx.createLinearGradient(
        particles[i].x, particles[i].y,
        particles[j].x, particles[j].y
      );
      grad.addColorStop(0, `hsla(262,80%,70%,${alpha})`);
      grad.addColorStop(1, `hsla(188,80%,70%,${alpha})`);
      ctx.beginPath();
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(particles[j].x, particles[j].y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }
}

function drawMouseGlow() {
  if (mouse.x < 0 || mouse.x > W) return;
  const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
  grd.addColorStop(0, 'rgba(109,40,217,0.18)');
  grd.addColorStop(1, 'rgba(109,40,217,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);
}

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  drawMouseGlow();
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateCanvas);
}

function initCanvas() {
  resizeCanvas();
  particles = Array.from({ length: 80 }, () => new Particle());
  animateCanvas();
}

window.addEventListener('resize', () => { resizeCanvas(); });

document.getElementById('hero').addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
document.getElementById('hero').addEventListener('mouseleave', () => {
  mouse.x = -9999; mouse.y = -9999;
});

/* =============================================
   2. TYPEWRITER EFFECT
   ============================================= */
const roles = [
  '게임 클라이언트 개발자',
  'AI 개발자 지망생',
  'Unity 전문가',
  '3D 아티스트',
  '문제 해결사',
];
const twEl = document.getElementById('typewriter');
let roleIdx = 0, charIdx = 0, isDeleting = false;

function typeWrite() {
  const current = roles[roleIdx];
  if (isDeleting) {
    charIdx--;
    twEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(typeWrite, 400);
      return;
    }
    setTimeout(typeWrite, 60);
  } else {
    charIdx++;
    twEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeWrite, 1800);
      return;
    }
    setTimeout(typeWrite, 100);
  }
}

/* =============================================
   3. MOUSE PARALLAX ON PHOTO
   ============================================= */
const photoWrap = document.getElementById('photoWrap');
const heroSection = document.getElementById('hero');

heroSection.addEventListener('mousemove', (e) => {
  const rect = heroSection.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const rx = ((e.clientY - cy) / rect.height) * 12;
  const ry = ((e.clientX - cx) / rect.width) * -12;
  photoWrap.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
});
heroSection.addEventListener('mouseleave', () => {
  photoWrap.style.transform = 'rotateX(0deg) rotateY(0deg)';
});

/* =============================================
   4. NAME GLITCH ON HOVER
   ============================================= */
const heroName = document.getElementById('heroName');
heroName.setAttribute('data-text', heroName.textContent);
heroName.addEventListener('mouseenter', () => heroName.classList.add('glitch'));
heroName.addEventListener('mouseleave', () => heroName.classList.remove('glitch'));

/* =============================================
   5. NAVBAR & SCROLL
   ============================================= */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});

scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* =============================================
   6. SCROLL ANIMATIONS (IntersectionObserver)
   ============================================= */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    entry.target.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up, .skill-category').forEach(el => observer.observe(el));

document.querySelectorAll('.timeline-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.15}s`;
  observer.observe(el);
});

/* =============================================
   7. CONTACT FORM
   ============================================= */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.innerHTML = '<i class="fas fa-check"></i> 전송 완료!';
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> 메시지 보내기';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

/* =============================================
   8. ACTIVE NAV HIGHLIGHT
   ============================================= */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const link = document.querySelector(`.nav-links a[href="#${section.id}"]`);
    if (!link) return;
    const top = section.offsetTop;
    const height = section.offsetHeight;
    link.style.color = (scrollY >= top && scrollY < top + height)
      ? 'var(--primary-light)' : '';
  });
});

/* =============================================
   INIT
   ============================================= */
window.addEventListener('load', () => {
  initCanvas();
  setTimeout(typeWrite, 800);
});
