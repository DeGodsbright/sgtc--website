document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  loadWebsiteContent().finally(() => {
    setupScriptureSlider();
    setupHeroSlider();
  });
});

function setupMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".nav-links a");

  function closeMenu() {
    if (!menuToggle || !siteNav) return;

    menuToggle.classList.remove("active");
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }

  if (!menuToggle || !siteNav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

async function loadWebsiteContent() {
  try {
    const response = await fetch("content/site-content.json", { cache: "no-store" });
    if (!response.ok) return;

    const content = await response.json();
    applyWebsiteContent(content);
  } catch (error) {
    console.warn("Website content file could not be loaded. The default page content is still available.", error);
  }
}

function applyWebsiteContent(content) {
  if (!content || typeof content !== "object") return;

  setText("title", content.siteName || document.title);
  setText(".topbar p", content.topbar?.text);
  setText(".topbar a", content.topbar?.linkText);
  setAttribute(".topbar a", "href", content.topbar?.linkUrl);

  setText(".hero-copy .eyebrow", content.hero?.eyebrow);
  setText(".hero-copy h1", content.hero?.title);
  setText(".hero-copy > p:not(.eyebrow)", content.hero?.body);
  renderServices(content.services);
  renderCommitments(content.commitments);

  setText(".about-section .section-copy .eyebrow", content.about?.eyebrow);
  setText(".about-section .section-copy h2", content.about?.title);
  setText(".about-section .section-copy p:not(.eyebrow)", content.about?.body);

  setText(".visit-section .section-heading .eyebrow", content.visit?.eyebrow);
  setText(".visit-section .section-heading h2", content.visit?.title);
  setText(".visit-section .section-heading p:not(.eyebrow)", content.visit?.body);
  renderVisitSteps(content.visit?.steps);

  renderScriptures(content.scriptures);
  renderMinistries(content.ministries);
  renderEvents(content.events);
  renderGallery(content.gallery);

  setText(".cta-section .eyebrow", content.cta?.eyebrow);
  setText(".cta-section h2", content.cta?.title);
  setText(".cta-section p:not(.eyebrow)", content.cta?.body);
  setText(".cta-section .btn", content.cta?.buttonText);
  setAttribute(".cta-section .btn", "href", content.cta?.buttonUrl);

  setText(".contact-section .section-copy .eyebrow", content.contact?.eyebrow);
  setText(".contact-section .section-copy h2", content.contact?.title);
  setText(".contact-section .section-copy p:not(.eyebrow)", content.contact?.body);
  renderContactDetails(content.contact);

  setText(".footer-brand span", content.siteName);
  setText(".footer-main p", content.footer?.tagline);
  setText(".footer-bottom p", `© 2026 ${content.siteName || "Salvation Gate Triumphant Church"}. All rights reserved.`);
  renderSocials(content.footer);
}

function renderServices(services) {
  const list = document.querySelector(".service-card ul");
  if (!list || !Array.isArray(services)) return;

  list.innerHTML = services
    .map((service) => `
      <li>
        <strong>${escapeHtml(service.title)}</strong>
        <span>${escapeHtml(service.time)}</span>
      </li>
    `)
    .join("");
}

function renderCommitments(commitments) {
  const strip = document.querySelector(".intro-strip");
  if (!strip || !Array.isArray(commitments)) return;

  strip.innerHTML = commitments
    .map((item) => `
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.text)}</span>
      </div>
    `)
    .join("");
}

function renderVisitSteps(steps) {
  const grid = document.querySelector(".visit-grid");
  if (!grid || !Array.isArray(steps)) return;

  grid.innerHTML = steps
    .map((step, index) => `
      <article class="visit-card">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.body)}</p>
      </article>
    `)
    .join("");
}

function renderScriptures(scriptures) {
  const slider = document.querySelector(".scripture-slider");
  if (!slider || !Array.isArray(scriptures)) return;

  slider.innerHTML = scriptures
    .map((text) => `<p class="slides fade">${sanitizeLimitedHtml(text)}</p>`)
    .join("");
}

function renderMinistries(ministries) {
  const grid = document.querySelector(".ministry-grid");
  if (!grid || !Array.isArray(ministries)) return;

  grid.innerHTML = ministries
    .map((ministry) => `
      <article class="ministry-card">
        <img src="${escapeAttribute(ministry.image)}" alt="${escapeAttribute(ministry.title)}">
        <div>
          <span>${escapeHtml(ministry.label)}</span>
          <h3>${escapeHtml(ministry.title)}</h3>
          <p>${escapeHtml(ministry.body)}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderEvents(events) {
  const list = document.querySelector(".event-list");
  if (!list || !Array.isArray(events)) return;

  list.innerHTML = events
    .map((event) => `
      <article>
        <time>${escapeHtml(event.day)}</time>
        <div>
          <h3>${escapeHtml(event.title)}</h3>
          <p>${escapeHtml(event.body)}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderGallery(images) {
  const gallery = document.querySelector(".gallery-grid");
  if (!gallery || !Array.isArray(images)) return;

  gallery.innerHTML = images
    .map((image, index) => `<img src="${escapeAttribute(image)}" alt="Church life photo ${index + 1}">`)
    .join("");
}

function renderContactDetails(contact) {
  if (!contact || typeof contact !== "object") return;

  const panel = document.querySelector(".contact-panel");
  if (panel && Array.isArray(contact.details)) {
    panel.innerHTML = `
      <h3>Service Times</h3>
      ${contact.details.map((detail) => `<p>${escapeHtml(detail)}</p>`).join("")}
    `;
  }

  if (contact.email) {
    setAttribute(".contact-form", "action", `mailto:${contact.email}`);
  }
}

function renderSocials(footer) {
  const socials = document.querySelector(".socials");
  if (!socials || !footer) return;

  const links = [
    ["Facebook", footer.facebook],
    ["Instagram", footer.instagram],
    ["YouTube", footer.youtube]
  ].filter(([, url]) => Boolean(url));

  socials.innerHTML = links
    .map(([label, url]) => `<a href="${escapeAttribute(url)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`)
    .join("");
}

function setupScriptureSlider() {
  let scriptureIndex = 0;

  function showScriptureSlide() {
    const slides = document.querySelectorAll(".slides");
    if (!slides.length) return;

    slides.forEach((slide) => {
      slide.style.display = "none";
    });

    slides[scriptureIndex].style.display = "block";
    scriptureIndex = (scriptureIndex + 1) % slides.length;
  }

  showScriptureSlide();
  setInterval(showScriptureSlide, 4500);
}

function setupHeroSlider() {
  const heroSlides = document.querySelectorAll(".hero-slide");
  let heroIndex = 0;

  function showHeroSlide() {
    if (heroSlides.length < 2) return;

    heroSlides[heroIndex].classList.remove("active");
    heroIndex = (heroIndex + 1) % heroSlides.length;
    heroSlides[heroIndex].classList.add("active");
  }

  setInterval(showHeroSlide, 5500);
}

function setText(selector, value) {
  if (value === undefined || value === null) return;

  const element = document.querySelector(selector);
  if (element) {
    element.textContent = String(value);
  }
}

function setAttribute(selector, attribute, value) {
  if (!value) return;

  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, String(value));
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function sanitizeLimitedHtml(value) {
  return escapeHtml(value)
    .replaceAll("&amp;mdash;", "&mdash;")
    .replaceAll("&amp;ndash;", "&ndash;")
    .replaceAll("&amp;nbsp;", "&nbsp;");
}
