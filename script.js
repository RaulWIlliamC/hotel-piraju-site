const root = document.documentElement;
const revealElements = [...document.querySelectorAll("[data-reveal]")];
const lakeStory = document.querySelector(".lake-story");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateScrollState() {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const pageProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  root.style.setProperty("--scroll", clamp(pageProgress, 0, 1).toFixed(4));

  if (lakeStory) {
    const rect = lakeStory.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (rect.height + window.innerHeight);
    root.style.setProperty("--story", clamp(progress, 0, 1).toFixed(4));
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

let ticking = false;

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollState();
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true }
);

window.addEventListener("resize", updateScrollState);
window.addEventListener("load", updateScrollState);
updateScrollState();
