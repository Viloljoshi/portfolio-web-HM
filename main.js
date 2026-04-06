/* ============================================================
   NAV — sticky + hamburger
   ============================================================ */
const hamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ============================================================
   ACTIVE NAV LINK — highlight current section
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => observer.observe(s));

/* ============================================================
   AVATAR UPLOAD — click to replace, persists via localStorage
   ============================================================ */
const avatarEl = document.getElementById('avatarEl');
const avatarUpload = document.getElementById('avatarUpload');

const savedAvatar = localStorage.getItem('portfolioAvatar');
if (savedAvatar) {
  avatarEl.innerHTML = `<img src="${savedAvatar}" alt="Profile photo"><span class="avatar-edit-hint">EDIT</span>`;
}

avatarEl.addEventListener('click', () => avatarUpload.click());

avatarUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataUrl = ev.target.result;
    avatarEl.innerHTML = `<img src="${dataUrl}" alt="Profile photo"><span class="avatar-edit-hint">EDIT</span>`;
    localStorage.setItem('portfolioAvatar', dataUrl);
  };
  reader.readAsDataURL(file);
});

/* ============================================================
   SCROLL ANIMATIONS — fade in on scroll
   ============================================================ */
const fadeEls = document.querySelectorAll(
  '.stat-card, .about-card, .tl-item, .project-card, .contact-link, .sg'
);

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

fadeEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s`;
  fadeObserver.observe(el);
});
