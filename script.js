const PRODUCTS = [
  {
    id: "zero2",
    name: "7Hz x Crinacle Salnotes Zero:2",
    brand: "7Hz",
    category: "IEM",
    price: 1559,
    stock: 12,
    description:
      "An in-ear monitor co-developed by 7Hz and Crinacle, built around a single 10 mm dual-cavity dynamic driver with a PU and metal composite diaphragm. It comes with a detachable 0.78 mm 2-pin silver-plated oxygen-free copper (OFC) coaxial cable and 3.5 mm plug, in a resin shell with a stainless steel faceplate.",
  },
  {
    id: "redlion",
    name: "Tangzu Wan'er SG II Red Lion Edition",
    brand: "Tangzu",
    category: "IEM",
    price: 1599,
    stock: 8,
    description:
      "The Lion Edition of the Tangzu Wan'er S.G II Bass Version, an in-ear monitor with a single 10 mm dynamic driver and an enhanced PET diaphragm. It uses a detachable 0.78 mm 2-pin silver-plated OFC cable, 1.2 m long, with a 3.5 mm plug.",
  },
  {
    id: "ew200",
    name: "Simgot EW200",
    brand: "Simgot",
    category: "IEM",
    price: 2499,
    stock: 5,
    description:
      "An in-ear monitor from Simgot with a 10 mm dual-magnetic-circuit, dual-cavity dynamic driver and a silicon crystal polymer (SCP) diaphragm, housed in a metal alloy shell. It has detachable 0.78 mm 2-pin connectors and a silver-plated OFC cable with a 3.5 mm plug.",
  },
  {
    id: "7hz71",
    name: "7Hz 071",
    brand: "7Hz",
    category: "DAC",
    price: 2299,
    stock: 7,
    description:
      "A USB-C DAC and headphone amplifier dongle from 7Hz, built around the AKM AK4377 chip and supporting up to 32-bit/384 kHz PCM audio. It delivers 70 mW at 32 \u03a9 through a 3.5 mm output and is powered by the connected phone or computer, so it needs no battery.",
  },
  {
    id: "zonie",
    name: "Tripowin Zonie",
    brand: "Tripowin",
    category: "Cable",
    price: null,
    stock: 0,
    description:
      "An upgrade cable from Tripowin for in-ear monitors, made of 16-core silver-plated copper (SPC) and 1.25 m long, with pre-shaped ear hooks and a cable slider. It is offered with 0.78 mm 2-pin, MMCX or recessed 2-pin connectors and 3.5 mm, 2.5 mm balanced or 4.4 mm balanced plugs.",
  },
  {
    id: "chu2",
    name: "Moondrop Chu II",
    brand: "Moondrop",
    category: "IEM",
    price: 1267,
    stock: 15,
    description:
      "An in-ear monitor from Moondrop with a 10 mm dynamic driver and an aluminum-magnesium alloy composite dome diaphragm, housed in a cast metal alloy shell. It has an impedance of 18 \u03a9, a sensitivity of 119 dB/Vrms, detachable 0.78 mm 2-pin connectors and a 3.5 mm plug.",
  },
  {
    id: "jm6",
    name: "Jcally JM6 Pro",
    brand: "Jcally",
    category: "DAC",
    price: 799,
    stock: 20,
    description:
      "A compact USB-C DAC and amplifier dongle from Jcally, using a Conexant CX31993 DAC chip and a Maxim MAX97220 amplifier chip, with support for up to 32-bit/384 kHz PCM audio. It has a 3.5 mm output, works with in-line CTIA headset mics, and weighs only 6 g.",
  },
  {
    id: "st12",
    name: "KBear ST12",
    brand: "KBear",
    category: "Cable",
    price: 667,
    stock: 25,
    description:
      "A replacement cable from KBear, designed for in-ear monitors (IEMs), featuring an 8-strand, 4N oxygen-free copper (OFC) silver-plated cable that is 1.2 m long. It is offered with 2-pin, MMCX or recessed 2-pin (QDC) connectors and a 3.5 mm or 4.4 mm balanced plug.",
  },
];

const CART_KEY = "sedoki_cart";
const SALE_KEY = "sedoki_sale";
const FEATURED_SALE_ID = "zero2";
const IMAGE_EXTS = ["png", "jpg", "jpeg", "webp"];
const MARQUEE_REPEATS = 20;

const SOUND_FILES = {
  addToCart: "audio/add2cart.mp3",
  checkout: "audio/checkout.mp3",
  error: "audio/error.mp3",
};
const sounds = {};

function initSounds() {
  Object.entries(SOUND_FILES).forEach(([name, src]) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    sounds[name] = audio;
  });
}

function playSound(name) {
  const audio = sounds[name];
  if (!audio) return;
  try {
    audio.currentTime = 0;
    const result = audio.play();
    if (result && result.catch) result.catch(() => {});
  } catch (e) {}
}

function notify(message, sound = "error") {
  playSound(sound);
  setTimeout(() => alert(message), 80);
}

const findProduct = (id) => PRODUCTS.find((p) => p.id === id);
const productUrl = (p) => `product.html?p=${encodeURIComponent(p.id)}`;
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatPHP(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "\u20b1\u2014";
  return (
    "\u20b1" +
    amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function loadSales() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SALE_KEY));
    const ids = saved ? Object.keys(saved) : [];
    if (ids.length === 3 && ids.every((id) => findProduct(id))) return saved;
  } catch (e) {}

  const pool = PRODUCTS.filter((p) => p.stock > 0 && p.id !== FEATURED_SALE_ID);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const ids = [FEATURED_SALE_ID, ...pool.slice(0, 2).map((p) => p.id)];
  const sales = {};
  ids.forEach((id) => (sales[id] = randomInt(10, 40)));

  try {
    sessionStorage.setItem(SALE_KEY, JSON.stringify(sales));
  } catch (e) {}
  return sales;
}

const SALES = loadSales();

const isAvailable = (p) => p.stock > 0 && p.price !== null;
const discountOf = (p) => (isAvailable(p) ? SALES[p.id] || 0 : 0);
const currentPrice = (p) =>
  p.price === null ? null : Math.round(p.price * (1 - discountOf(p) / 100));

function priceHtml(p) {
  if (!isAvailable(p)) return "Out of Stock";
  if (!discountOf(p)) return formatPHP(p.price);
  return `<span class="price-old">${formatPHP(p.price)}</span><span class="price-now">${formatPHP(currentPrice(p))}</span>`;
}

function saleBadgeHtml(p) {
  return discountOf(p) ? `<span class="sale-badge">-${discountOf(p)}%</span>` : "";
}

function productImgHtml(p) {
  return `<img class="product-img" src="products/${p.id}/${p.id}.${IMAGE_EXTS[0]}" data-id="${p.id}" data-tried="0" data-name="${escapeHtml(p.name)}" alt="${escapeHtml(p.name)}" />`;
}

document.addEventListener(
  "error",
  (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !img.classList.contains("product-img")) return;
    const tried = parseInt(img.dataset.tried || "0", 10) + 1;
    if (tried < IMAGE_EXTS.length) {
      img.dataset.tried = String(tried);
      img.src = `products/${img.dataset.id}/${img.dataset.id}.${IMAGE_EXTS[tried]}`;
      return;
    }
    const fallback = document.createElement("div");
    fallback.className = "thumb-fallback";
    fallback.textContent = img.dataset.name || "Product";
    img.replaceWith(fallback);
  },
  true,
);

function productCardHtml(p, { index = 0, carousel = false } = {}) {
  const attrs = carousel
    ? 'class="product-card carousel-item"'
    : `class="product-card" data-reveal style="--d: ${Math.min(index, 6) * 30}ms"`;
  return `
    <article ${attrs} data-id="${p.id}">
      <a class="product-link" href="${productUrl(p)}">
        <div class="product-thumb">${saleBadgeHtml(p)}${productImgHtml(p)}</div>
        <h3>${escapeHtml(p.name)}</h3>
      </a>
      <span class="product-brand">${escapeHtml(p.brand)}</span>
      <span class="product-tag">${escapeHtml(p.category)}</span>
      <div class="price">${priceHtml(p)}</div>
      <button type="button" class="add-to-cart" data-id="${p.id}"${isAvailable(p) ? "" : " disabled"}>Add to Cart</button>
    </article>`;
}

let revealObserver = null;

function observeReveals() {
  document.querySelectorAll("[data-stagger]").forEach((parent) => {
    Array.from(parent.children).forEach((child, i) => {
      if (child.hasAttribute("data-reveal")) return;
      child.setAttribute("data-reveal", "");
      child.style.setProperty("--d", `${Math.min(i, 5) * 35}ms`);
    });
  });

  const targets = document.querySelectorAll("[data-reveal]:not(.in-view)");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );
  }
  targets.forEach((el) => revealObserver.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initSounds();
  initNavMetrics();
  initNavMenu();
  initBackToTop();
  initSaleMarquee();
  fillCarousels();
  document.querySelectorAll(".carousel").forEach(initSingleCarousel);
  initCatalog();
  initProductPage();
  initAccountTabs();
  initCartDrawer();
  renderCart();
  observeReveals();
});

function initNavMetrics() {
  const nav = document.querySelector("nav");
  if (!nav) return;
  const update = () =>
    document.documentElement.style.setProperty("--nav-h", `${nav.offsetHeight}px`);
  update();
  window.addEventListener("resize", update);
}

function initNavMenu() {
  const nav = document.querySelector("nav");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!nav || !toggle || !menu) return;

  const setOpen = (open) => {
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("menu-open")));
  nav.addEventListener("click", (e) => {
    if (e.target.closest("#navMenu a, #cartToggle")) setOpen(false);
  });
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
  window.matchMedia("(min-width: 1001px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const toggle = () => btn.classList.toggle("show", window.scrollY > 400);
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initSaleMarquee() {
  const el = document.getElementById("saleMarquee");
  if (!el) return;

  const sep = '<span class="marquee-sep" aria-hidden="true">&bull;</span>';
  const items = Object.keys(SALES).map((id) => {
    const p = findProduct(id);
    return `<a href="${productUrl(p)}"><strong>${escapeHtml(p.name)}</strong> <em>${SALES[id]}% OFF</em></a>`;
  });

  el.innerHTML = (items.join(sep) + sep).repeat(MARQUEE_REPEATS);
}

function fillCarousels() {
  document.querySelectorAll("[data-products]").forEach((track) => {
    track.innerHTML = track.dataset.products
      .split(",")
      .map(findProduct)
      .filter(Boolean)
      .map((p) => productCardHtml(p, { carousel: true }))
      .join("");
  });
}

function initSingleCarousel(carousel) {
  const viewport = carousel.querySelector(".carousel-viewport");
  const track = carousel.querySelector(".carousel-track");
  const dotsWrap = carousel.querySelector(".carousel-dots");
  const prevBtn = carousel.querySelector(".carousel-arrow.prev");
  const nextBtn = carousel.querySelector(".carousel-arrow.next");
  if (!viewport || !track) return;

  const items = Array.from(track.children);
  if (items.length === 0) return;

  const AUTO_SCROLL_MS = 5000;
  let index = 0;
  let timer = null;

  const getGap = () => parseFloat(getComputedStyle(track).columnGap) || 0;
  const getStep = () => items[0].getBoundingClientRect().width + getGap();
  const getVisibleCount = () => {
    const step = getStep();
    return step ? Math.max(1, Math.round(viewport.clientWidth / step)) : 1;
  };
  const getMaxIndex = () => Math.max(0, items.length - getVisibleCount());

  function render() {
    track.style.transform = `translateX(-${index * getStep()}px)`;
    Array.from(dotsWrap?.children || []).forEach((dot, i) =>
      dot.classList.toggle("active", i === index),
    );
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    for (let i = 0; i <= getMaxIndex(); i++) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === index ? " active" : "");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => {
        goTo(i);
        startTimer();
      });
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(i) {
    index = Math.min(Math.max(i, 0), getMaxIndex());
    render();
  }
  const next = () => goTo(index >= getMaxIndex() ? 0 : index + 1);
  const prev = () => goTo(index <= 0 ? getMaxIndex() : index - 1);

  const stopTimer = () => clearInterval(timer);
  const startTimer = () => {
    stopTimer();
    timer = setInterval(next, AUTO_SCROLL_MS);
  };

  nextBtn?.addEventListener("click", () => {
    next();
    startTimer();
  });
  prevBtn?.addEventListener("click", () => {
    prev();
    startTimer();
  });
  carousel.addEventListener("mouseenter", stopTimer);
  carousel.addEventListener("mouseleave", startTimer);

  window.addEventListener("resize", () => {
    goTo(index);
    buildDots();
  });

  buildDots();
  render();
  startTimer();
}

function initAccountTabs() {
  const tabs = document.querySelectorAll(".account-tab");
  if (tabs.length === 0) return;
  const forms = document.querySelectorAll(".account-form");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      forms.forEach((f) => f.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.target)?.classList.add("active");
    });
  });

  if (window.location.hash === "#create") {
    document
      .querySelector('.account-tab[data-target="create-account-form"]')
      ?.click();
  }

  forms.forEach((form) => {
    form.querySelector("form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      notify(
        "This is a demo form \u2014 account creation isn't connected to a server yet.",
        "error",
      );
    });
  });
}

function initCatalog() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((p, i) => productCardHtml(p, { index: i })).join("");
  const cards = new Map(Array.from(grid.children).map((c) => [c.dataset.id, c]));

  const panel = document.getElementById("filterPanel");
  const searchInput = document.getElementById("catalogSearch");
  const categoryBox = document.getElementById("categoryFilters");
  const brandBox = document.getElementById("brandFilters");
  const minInput = document.getElementById("priceMin");
  const maxInput = document.getElementById("priceMax");
  const stockInput = document.getElementById("inStockOnly");
  const saleInput = document.getElementById("onSaleOnly");
  const sortSelect = document.getElementById("sortBy");
  const statusEl = document.querySelector(".search-status");
  const noResultsEl = document.querySelector(".no-results");
  const sidebar = document.getElementById("filterSidebar");
  const toggleBtn = document.getElementById("filterToggle");

  const unique = (key) => [...new Set(PRODUCTS.map((p) => p[key]))];
  const checkHtml = (name, value) =>
    `<label class="check"><input type="checkbox" name="${name}" value="${escapeHtml(value)}" /><span>${escapeHtml(value)}</span></label>`;

  categoryBox.innerHTML = unique("category").map((v) => checkHtml("category", v)).join("");
  brandBox.innerHTML = unique("brand").sort().map((v) => checkHtml("brand", v)).join("");

  const params = new URLSearchParams(window.location.search);
  const preset = (key) =>
    params.getAll(key).flatMap((v) => v.split(",")).map((v) => v.trim().toLowerCase());
  searchInput.value = (params.get("q") || "").trim();
  document.getElementById("onSaleOnly").checked = params.get("sale") === "1";
  [
    ["category", preset("category")],
    ["brand", preset("brand")],
  ].forEach(([name, values]) =>
    document.querySelectorAll(`input[name="${name}"]`).forEach((box) => {
      box.checked = values.includes(box.value.toLowerCase());
    }),
  );

  const checked = (name) =>
    Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((b) => b.value);

  function matches(p, f) {
    const price = currentPrice(p);
    const hasPriceFilter = f.min !== null || f.max !== null;
    if (f.q && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(f.q)) return false;
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.brands.length && !f.brands.includes(p.brand)) return false;
    if (hasPriceFilter && price === null) return false;
    if (f.min !== null && price < f.min) return false;
    if (f.max !== null && price > f.max) return false;
    if (f.inStock && !isAvailable(p)) return false;
    if (f.onSale && !discountOf(p)) return false;
    return true;
  }

  const sorters = {
    featured: () => 0,
    "price-asc": (a, b) => (currentPrice(a) ?? Infinity) - (currentPrice(b) ?? Infinity),
    "price-desc": (a, b) => (currentPrice(b) ?? -1) - (currentPrice(a) ?? -1),
    name: (a, b) => a.name.localeCompare(b.name),
  };

  function readFilters() {
    const num = (el) => (el.value === "" ? null : Number(el.value));
    return {
      q: searchInput.value.trim().toLowerCase(),
      categories: checked("category"),
      brands: checked("brand"),
      min: num(minInput),
      max: num(maxInput),
      inStock: stockInput.checked,
      onSale: saleInput.checked,
    };
  }

  function apply() {
    const filters = readFilters();
    const results = PRODUCTS.filter((p) => matches(p, filters)).sort(
      sorters[sortSelect.value] || sorters.featured,
    );
    const visible = new Set(results.map((p) => p.id));

    cards.forEach((card, id) => (card.hidden = !visible.has(id)));
    results.forEach((p) => grid.appendChild(cards.get(p.id)));

    const filtering =
      filters.q ||
      filters.categories.length ||
      filters.brands.length ||
      filters.min !== null ||
      filters.max !== null ||
      filters.inStock ||
      filters.onSale;

    statusEl.hidden = !filtering;
    statusEl.textContent = `Showing ${results.length} of ${PRODUCTS.length} products`;
    noResultsEl.hidden = results.length > 0;
    observeReveals();
  }

  function resetFilters() {
    panel.reset();
    searchInput.value = "";
    history.replaceState(null, "", window.location.pathname);
    apply();
  }

  panel.addEventListener("input", apply);
  panel.addEventListener("submit", (e) => e.preventDefault());
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });
  document.getElementById("filterReset").addEventListener("click", resetFilters);
  document.getElementById("noResultsReset").addEventListener("click", resetFilters);

  const mobile = window.matchMedia("(max-width: 900px)");
  const setCollapsed = (collapsed) => {
    sidebar.classList.toggle("collapsed", collapsed);
    toggleBtn.setAttribute("aria-expanded", String(!collapsed));
  };
  setCollapsed(mobile.matches);
  toggleBtn.addEventListener("click", () =>
    setCollapsed(!sidebar.classList.contains("collapsed")),
  );
  mobile.addEventListener("change", (e) => setCollapsed(e.matches));

  apply();
}

function stockStatus(p) {
  if (p.stock <= 0) return { cls: "out", text: "Out of stock" };
  if (p.stock <= 5) return { cls: "low", text: `Only ${p.stock} left in stock` };
  return { cls: "in", text: `${p.stock} in stock` };
}

function dropdownHtml(className, title, bodyHtml) {
  return `
    <section class="manual-section" data-reveal>
      <details class="manual ${className}">
        <summary>${title}</summary>
        <div class="manual-body">${bodyHtml}</div>
      </details>
    </section>`;
}

function specsHtml(p) {
  const template = document.querySelector(`template[data-spec="${p.id}"]`);
  return template
    ? template.innerHTML
    : '<p class="manual-missing">Specifications are coming soon.</p>';
}

function initProductPage() {
  const root = document.getElementById("productDetail");
  if (!root) return;

  const p = findProduct(new URLSearchParams(window.location.search).get("p"));
  if (!p) {
    document.title = "Product not found - Sedoki";
    root.innerHTML = `<div class="empty-cart"><p>We couldn't find that product.</p><p><a href="shop.html">Browse the catalog</a></p></div>`;
    return;
  }

  const stock = stockStatus(p);
  const name = escapeHtml(p.name);
  document.title = `${p.name} - Sedoki`;
  root.innerHTML = `
    <article class="product-detail">
      <div class="detail-media" data-reveal="left">
        ${saleBadgeHtml(p)}
        <div class="gallery" tabindex="0" aria-roledescription="carousel" aria-label="${name} images">
          <div class="gallery-track">
            <div class="gallery-slide">${productImgHtml(p)}</div>
          </div>
          <button type="button" class="gallery-arrow prev" aria-label="Previous image" hidden>&#10094;</button>
          <button type="button" class="gallery-arrow next" aria-label="Next image" hidden>&#10095;</button>
          <div class="gallery-dots" hidden></div>
        </div>
      </div>
      <div class="detail-info" data-reveal="right">
        <span class="product-tag">${escapeHtml(p.category)}</span>
        <h1>${name}</h1>
        <p class="detail-brand">Brand: <strong>${escapeHtml(p.brand)}</strong></p>
        <div class="price detail-price">${priceHtml(p)}</div>
        <p class="stock-status ${stock.cls}">${stock.text}</p>
        <p class="detail-desc">${escapeHtml(p.description)}</p>
        <button type="button" class="add-to-cart" data-id="${p.id}"${isAvailable(p) ? "" : " disabled"}>Add to Cart</button>
      </div>
    </article>
    ${dropdownHtml("specs-panel", "Specifications", specsHtml(p))}
    ${dropdownHtml(
      "manual-pdf",
      "Manual",
      `<iframe class="manual-frame" title="${name} manual"></iframe>
       <p class="manual-missing" hidden>No manual is available for this product yet.</p>`,
    )}
    ${dropdownHtml(
      "manual-video",
      "Promotional Video",
      `<div class="video-slot"></div>
       <p class="manual-missing" hidden>No video is available for this product yet.</p>`,
    )}`;

  initGallery(p);
  initManualViewer(p);
  initVideoViewer(p);
}

function imageLoads(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

async function findExtraImages(p) {
  const found = [];
  for (let n = 2; n <= 12; n++) {
    const urls = IMAGE_EXTS.map((ext) => `products/${p.id}/${p.id}-img${n}.${ext}`);
    const results = await Promise.all(urls.map(imageLoads));
    const hit = urls[results.indexOf(true)];
    if (!hit) break;
    found.push(hit);
  }
  return found;
}

async function initGallery(p) {
  const gallery = document.querySelector(".gallery");
  const track = gallery.querySelector(".gallery-track");
  const prevBtn = gallery.querySelector(".gallery-arrow.prev");
  const nextBtn = gallery.querySelector(".gallery-arrow.next");
  const dotsWrap = gallery.querySelector(".gallery-dots");

  const extras = await findExtraImages(p);
  if (extras.length === 0) return;

  extras.forEach((url, i) => {
    track.insertAdjacentHTML(
      "beforeend",
      `<div class="gallery-slide"><img src="${url}" alt="${escapeHtml(p.name)} - image ${i + 2}" draggable="false" /></div>`,
    );
  });

  const total = track.children.length;
  let index = 0;

  dotsWrap.innerHTML = Array.from(
    { length: total },
    (_, i) => `<button type="button" class="gallery-dot" aria-label="Show image ${i + 1}"></button>`,
  ).join("");
  [prevBtn, nextBtn, dotsWrap].forEach((el) => (el.hidden = false));

  function goTo(i) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    Array.from(dotsWrap.children).forEach((dot, n) =>
      dot.classList.toggle("active", n === index),
    );
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));
  dotsWrap.addEventListener("click", (e) => {
    const dot = e.target.closest(".gallery-dot");
    if (dot) goTo(Array.from(dotsWrap.children).indexOf(dot));
  });
  gallery.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    else if (e.key === "ArrowRight") goTo(index + 1);
  });

  let startX = null;
  track.addEventListener("pointerdown", (e) => (startX = e.clientX));
  track.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
  });
  track.addEventListener("pointercancel", () => (startX = null));

  goTo(0);
}

function initManualViewer(p) {
  const details = document.querySelector(".manual-pdf");
  const frame = details.querySelector(".manual-frame");
  const missing = details.querySelector(".manual-missing");
  const url = `products/${p.id}/${p.id}.pdf`;
  let loaded = false;

  details.addEventListener("toggle", async () => {
    if (!details.open || loaded) return;
    loaded = true;
    let exists = true;
    try {
      exists = (await fetch(url, { method: "HEAD" })).ok;
    } catch (e) {}
    if (exists) frame.src = url;
    else {
      frame.hidden = true;
      missing.hidden = false;
    }
  });
}

function initVideoViewer(p) {
  const details = document.querySelector(".manual-video");
  const slot = details.querySelector(".video-slot");
  const missing = details.querySelector(".manual-missing");
  const template = document.querySelector(`template[data-video="${p.id}"]`);

  details.addEventListener("toggle", () => {
    if (!template) {
      missing.hidden = !details.open;
      return;
    }
    if (details.open) slot.replaceChildren(template.content.cloneNode(true));
    else slot.replaceChildren();
  });
}

function readCart() {
  let raw;
  try {
    raw = JSON.parse(localStorage.getItem(CART_KEY));
  } catch (e) {
    return [];
  }
  if (!Array.isArray(raw)) return [];

  const merged = new Map();
  raw.forEach((item) => {
    const id = item.id || item.base;
    const p = findProduct(id);
    const qty = parseInt(item.qty, 10);
    if (!p || !isAvailable(p) || !(qty > 0)) return;
    merged.set(id, Math.min((merged.get(id) || 0) + qty, p.stock));
  });
  return Array.from(merged, ([id, qty]) => ({ id, qty }));
}

function cartLines() {
  return readCart().map(({ id, qty }) => {
    const product = findProduct(id);
    return { product, qty, price: currentPrice(product) };
  });
}

function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (e) {}
  renderCart();
}

function updateCartItem(id, delta) {
  const p = findProduct(id);
  if (!p) return false;
  const items = readCart();
  const item = items.find((i) => i.id === id);
  if (delta > 0 && item && item.qty >= p.stock) return false;
  if (item) item.qty = Math.min(item.qty + delta, p.stock);
  else if (delta > 0) items.push({ id, qty: 1 });
  saveCart(items.filter((i) => i.qty > 0));
  return true;
}

const removeFromCart = (id) => saveCart(readCart().filter((i) => i.id !== id));
const cartSubtotal = (lines) => lines.reduce((sum, l) => sum + l.price * l.qty, 0);
const cartCount = (lines) => lines.reduce((sum, l) => sum + l.qty, 0);

function cartQtyHtml(line) {
  const id = line.product.id;
  return `
    <div class="cart-qty">
      <button type="button" data-cart-action="dec" data-id="${id}" aria-label="Decrease quantity">&minus;</button>
      <span>${line.qty}</span>
      <button type="button" data-cart-action="inc" data-id="${id}" aria-label="Increase quantity">+</button>
    </div>`;
}

const cartThumbHtml = (p) => `<div class="thumb-box">${productImgHtml(p)}</div>`;

function renderCart() {
  const lines = cartLines();
  const count = cartCount(lines);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = String(count);
    el.style.display = count > 0 ? "flex" : "none";
  });
  renderDrawerCart(lines);
  renderFullCartPage(lines);
}

function renderDrawerCart(lines) {
  const list = document.getElementById("cartDrawerItems");
  if (!list) return;

  list.innerHTML = lines.length
    ? lines
        .map(
          (l) => `
      <div class="cart-drawer-item">
        ${cartThumbHtml(l.product)}
        <div class="cart-drawer-item-info">
          <h4>${escapeHtml(l.product.name)}</h4>
          <div class="unit-price">${formatPHP(l.price)} each</div>
          ${cartQtyHtml(l)}
          <div class="cart-item-line-total">${formatPHP(l.price * l.qty)}</div>
        </div>
        <button type="button" class="cart-item-remove" data-cart-action="remove" data-id="${l.product.id}" aria-label="Remove item">&times;</button>
      </div>`,
        )
        .join("")
    : '<div class="cart-drawer-empty"><p>Your cart is empty.</p><p><a href="shop.html">Browse the catalog</a></p></div>';

  const subtotalEl = document.getElementById("cartDrawerSubtotal");
  if (subtotalEl) subtotalEl.textContent = formatPHP(cartSubtotal(lines));
}

function renderFullCartPage(lines) {
  const emptyEl = document.getElementById("cartPageEmpty");
  const contentEl = document.getElementById("cartPageContent");
  const list = document.getElementById("cartPageItems");
  if (!emptyEl || !contentEl || !list) return;

  emptyEl.style.display = lines.length ? "none" : "block";
  contentEl.style.display = lines.length ? "block" : "none";
  if (!lines.length) return;

  list.innerHTML = lines
    .map(
      (l) => `
    <div class="cart-page-item">
      ${cartThumbHtml(l.product)}
      <div class="cart-page-item-info">
        <h3>${escapeHtml(l.product.name)}</h3>
        <div class="unit-price">${formatPHP(l.price)} each</div>
        ${cartQtyHtml(l)}
      </div>
      <div class="cart-page-item-total">${formatPHP(l.price * l.qty)}</div>
      <button type="button" class="cart-item-remove" data-cart-action="remove" data-id="${l.product.id}" aria-label="Remove item">&times;</button>
    </div>`,
    )
    .join("");

  const subtotalEl = document.getElementById("cartPageSubtotal");
  if (subtotalEl) subtotalEl.textContent = formatPHP(cartSubtotal(lines));
}

function setDrawer(open) {
  document.getElementById("cartDrawer")?.classList.toggle("open", open);
  document.getElementById("cartOverlay")?.classList.toggle("show", open);
  document.body.classList.toggle("cart-drawer-open", open);
}

function initCartDrawer() {
  const drawer = document.getElementById("cartDrawer");

  document.getElementById("cartToggle")?.addEventListener("click", () =>
    setDrawer(!drawer?.classList.contains("open")),
  );
  document.getElementById("closeCartDrawer")?.addEventListener("click", () => setDrawer(false));
  document.getElementById("cartOverlay")?.addEventListener("click", () => setDrawer(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setDrawer(false);
  });

  const runCheckout = () => {
    const lines = cartLines();
    if (lines.length === 0) {
      notify("Your cart is empty.", "error");
      return;
    }
    notify(
      "This is a demo checkout \u2014 there's no payment processor connected yet. Subtotal: " +
        formatPHP(cartSubtotal(lines)),
      "checkout",
    );
  };
  document.getElementById("drawerCheckoutBtn")?.addEventListener("click", runCheckout);
  document.getElementById("pageCheckoutBtn")?.addEventListener("click", runCheckout);

  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".add-to-cart");
    if (addBtn) {
      if (!addBtn.disabled) {
        playSound(updateCartItem(addBtn.dataset.id, 1) ? "addToCart" : "error");
      }
      return;
    }
    const actionBtn = e.target.closest("[data-cart-action]");
    if (!actionBtn) return;
    const { cartAction, id } = actionBtn.dataset;
    if (cartAction === "inc") {
      if (!updateCartItem(id, 1)) playSound("error");
    }
    else if (cartAction === "dec") updateCartItem(id, -1);
    else if (cartAction === "remove") removeFromCart(id);
  });
}
