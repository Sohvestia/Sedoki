const PRODUCTS = [
  {
    id: "zero2",
    name: "7Hz x Crinacle Salnotes Zero:2",
    brand: "7Hz",
    category: "IEM",
    price: 1559,
    stock: 12,
    description:
      "A collaboration between 7Hz and Crinacle, the Salnotes Zero:2 is an in-ear monitor with a balanced, easy-to-enjoy sound. A dependable first step into audiophile IEMs at an approachable price.",
  },
  {
    id: "redlion",
    name: "Tangzu Wan'er SG II Red Lion Edition",
    brand: "Tangzu",
    category: "IEM",
    price: 1599,
    stock: 8,
    description:
      "A special edition of the Tangzu Wan'er SG II finished in a bold red lion design. Smooth, musical sound in a compact and comfortable shell.",
  },
  {
    id: "ew200",
    name: "Simgot EW200",
    brand: "Simgot",
    category: "IEM",
    price: 2499,
    stock: 5,
    description:
      "A refined IEM from Simgot with detailed sound and a solid build. Made for listeners who want more resolution and polish than entry-level sets.",
  },
  {
    id: "7hz71",
    name: "7Hz 071",
    brand: "7Hz",
    category: "DAC",
    price: 2299,
    stock: 7,
    description:
      "A compact DAC from 7Hz for upgrading the audio output of your phone or computer. Cleaner sound, more headroom, and an easy plug-and-play setup.",
  },
  {
    id: "zonie",
    name: "Tripowin Zonie",
    brand: "Tripowin",
    category: "Cable",
    price: null,
    stock: 0,
    description:
      "An upgrade cable from Tripowin for your IEMs, built for a better fit, cleaner handling, and a sturdier connection.",
  },
  {
    id: "chu2",
    name: "Moondrop Chu II",
    brand: "Moondrop",
    category: "IEM",
    price: 1267,
    stock: 15,
    description:
      "A popular budget IEM from Moondrop known for clean, well-balanced tuning and a comfortable everyday fit.",
  },
  {
    id: "jm6",
    name: "Jcally JM6 Pro",
    brand: "Jcally",
    category: "DAC",
    price: 799,
    stock: 20,
    description:
      "An affordable portable DAC from Jcally that gives your IEMs and headphones a clear upgrade over built-in audio outputs.",
  },
  {
    id: "st12",
    name: "KBear ST12",
    brand: "KBear",
    category: "Cable",
    price: 667,
    stock: 25,
    description:
      "A budget-friendly upgrade cable from KBear with a tidy braid and a reliable connection for your favorite IEMs.",
  },
];

const CART_KEY = "sedoki_cart";
const SALE_KEY = "sedoki_sale";
const FEATURED_SALE_ID = "zero2";
const IMAGE_EXTS = ["png", "jpg", "jpeg", "webp"];

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
    : `class="product-card" data-reveal style="--d: ${Math.min(index, 8) * 70}ms"`;
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
      child.style.setProperty("--d", `${Math.min(i, 6) * 90}ms`);
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
  initNavMetrics();
  initBackToTop();
  initSaleMarquee();
  fillCarousels();
  initCarousels();
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
  const message = `<span class="marquee-label">On sale now</span>${items.join(sep)}${sep}`;
  const group = (hidden) =>
    `<div class="marquee-group"${hidden ? ' aria-hidden="true"' : ""}>${message.repeat(2)}</div>`;

  el.innerHTML = `<div class="marquee-track">${group(false)}${group(true)}</div>`;
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

function initCarousels() {
  document.querySelectorAll(".carousel").forEach(initSingleCarousel);
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
      alert(
        "This is a demo form \u2014 account creation isn't connected to a server yet.",
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
  document.title = `${p.name} - Sedoki`;
  root.innerHTML = `
    <article class="product-detail">
      <div class="detail-media" data-reveal="left">${saleBadgeHtml(p)}${productImgHtml(p)}</div>
      <div class="detail-info" data-reveal="right">
        <span class="product-tag">${escapeHtml(p.category)}</span>
        <h1>${escapeHtml(p.name)}</h1>
        <p class="detail-brand">Brand: <strong>${escapeHtml(p.brand)}</strong></p>
        <div class="price detail-price">${priceHtml(p)}</div>
        <p class="stock-status ${stock.cls}">${stock.text}</p>
        <p class="detail-desc">${escapeHtml(p.description)}</p>
        <button type="button" class="add-to-cart" data-id="${p.id}"${isAvailable(p) ? "" : " disabled"}>Add to Cart</button>
      </div>
    </article>
    <section class="manual-section" data-reveal>
      <details class="manual">
        <summary>Product Manual</summary>
        <div class="manual-body">
          <iframe class="manual-frame" title="${escapeHtml(p.name)} manual"></iframe>
          <p class="manual-missing" hidden>No manual is available for this product yet.</p>
        </div>
      </details>
    </section>`;

  initManualViewer(p);
}

function initManualViewer(p) {
  const details = document.querySelector(".manual");
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
  if (!p) return;
  const items = readCart();
  const item = items.find((i) => i.id === id);
  if (item) item.qty = Math.min(item.qty + delta, p.stock);
  else if (delta > 0) items.push({ id, qty: 1 });
  saveCart(items.filter((i) => i.qty > 0));
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
      alert("Your cart is empty.");
      return;
    }
    alert(
      "This is a demo checkout \u2014 there's no payment processor connected yet. Subtotal: " +
        formatPHP(cartSubtotal(lines)),
    );
  };
  document.getElementById("drawerCheckoutBtn")?.addEventListener("click", runCheckout);
  document.getElementById("pageCheckoutBtn")?.addEventListener("click", runCheckout);

  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".add-to-cart");
    if (addBtn) {
      if (!addBtn.disabled) {
        updateCartItem(addBtn.dataset.id, 1);
        setDrawer(true);
      }
      return;
    }
    const actionBtn = e.target.closest("[data-cart-action]");
    if (!actionBtn) return;
    const { cartAction, id } = actionBtn.dataset;
    if (cartAction === "inc") updateCartItem(id, 1);
    else if (cartAction === "dec") updateCartItem(id, -1);
    else if (cartAction === "remove") removeFromCart(id);
  });
}
