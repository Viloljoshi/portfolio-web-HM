/* Reveal on scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* Scroll progress + nav state */
const scrollBar = document.getElementById("scrollBar");
const nav = document.getElementById("nav");
const onScroll = () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  scrollBar.style.width = scrolled + "%";
  nav.classList.toggle("scrolled", h.scrollTop > 24);
};
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Cursor-tracking gradient blob */
const cursorBlob = document.getElementById("cursorBlob");
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let cx = mx, cy = my;
let hue = 0;
document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
function tickBlob() {
  cx += (mx - cx) * 0.08;
  cy += (my - cy) * 0.08;
  hue = (hue + 0.4) % 360;
  cursorBlob.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
  cursorBlob.style.background = `conic-gradient(from ${hue}deg, rgba(210,63,12,0.45), rgba(255,106,44,0.4), rgba(201,138,22,0.4), rgba(13,106,106,0.35), rgba(210,63,12,0.45))`;
  requestAnimationFrame(tickBlob);
}
tickBlob();

/* Per-card spotlight on hm cards */
document.querySelectorAll(".hm").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
    card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
  });
});

/* Magnetic buttons */
document.querySelectorAll("[data-magnetic], .nav-cta").forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
  });
  btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
});

/* Animated number counters */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = target * eased;
    const display = (target % 1 === 0) ? Math.round(val) : val.toFixed(1);
    el.textContent = prefix + display + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll("[data-count]").forEach(el => countIO.observe(el));

/* Subtle parallax on blobs */
const blobs = document.querySelectorAll(".blob.b1, .blob.b2, .blob.b3, .blob.b4");
document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  blobs.forEach((b, i) => {
    const f = (i + 1) * 6;
    b.style.translate = `${x * f}px ${y * f}px`;
  });
});

/* Hero headline rotator */
(function () {
  const el = document.getElementById("heroRotator");
  if (!el) return;
  const phrases = [
    "regulated industries.",
    "banks &amp; insurers.",
    "compliance ops.",
    "high-stakes systems.",
    "KYC &amp; AML at scale.",
    "agentic workflows.",
    "audit-ready pipelines.",
    "production, not demos."
  ];
  let i = 0;
  el.textContent = "";
  const first = document.createElement("span");
  first.className = "word in";
  first.innerHTML = phrases[0];
  el.appendChild(first);

  let busy = false;
  setInterval(() => {
    if (busy) return;
    busy = true;
    const cur = el.querySelector(".word.in");
    if (!cur) { busy = false; return; }
    i = (i + 1) % phrases.length;
    const next = document.createElement("span");
    next.className = "word in-prep";
    next.innerHTML = phrases[i];
    el.appendChild(next);
    const w = Math.max(cur.offsetWidth, next.offsetWidth);
    el.style.minWidth = w + "px";
    setTimeout(() => {
      cur.classList.remove("in"); cur.classList.add("out");
      next.classList.remove("in-prep"); next.classList.add("in");
    }, 20);
    setTimeout(() => {
      if (cur.parentNode) cur.remove();
      busy = false;
    }, 700);
  }, 2600);
})();
