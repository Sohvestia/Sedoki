document.addEventListener("DOMContentLoaded", () => {
  initBackToTop();
  initCarousels();
  initAccountTabs();
  initShopSearch();
  initCartDrawer();
  initAddToCartButtons();
  renderCart();
});

//  Back to top button
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  const nav = document.querySelector("nav");
  if (!btn || !nav) return;

  const toggleVisibility = () => {
    const navBottom = nav.getBoundingClientRect().bottom;
    if (navBottom <= 0) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  window.addEventListener("resize", toggleVisibility);
  toggleVisibility();

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Image Load

function handleProductImgError(img) {
  const exts = ["jpg", "jpeg", "png", "webp"];
  const tried = img.dataset.tried ? parseInt(img.dataset.tried, 10) : 0;
  if (tried < exts.length - 1) {
    img.dataset.tried = String(tried + 1);
    img.src = `img/products/${img.dataset.base}.${exts[tried + 1]}`;
    return;
  }
  const fallback = document.createElement("div");
  fallback.className = "thumb-fallback";
  fallback.textContent = img.dataset.name || "Product";
  img.replaceWith(fallback);
}

// Carousels

function initCarousels() {
  document.querySelectorAll(".carousel").forEach((carousel) => {
    initSingleCarousel(carousel);
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

  function getGap() {
    return (
      parseFloat(
        getComputedStyle(track).columnGap || getComputedStyle(track).gap,
      ) || 0
    );
  }
  function getVisibleCount() {
    const itemWidth = items[0].getBoundingClientRect().width + getGap();
    if (!itemWidth) return 1;
    return Math.max(1, Math.round(viewport.clientWidth / itemWidth));
  }
  function getMaxIndex() {
    return Math.max(0, items.length - getVisibleCount());
  }

  function render() {
    const itemWidth = items[0].getBoundingClientRect().width + getGap();
    track.style.transform = `translateX(-${index * itemWidth}px)`;
    updateDots();
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    const pages = getMaxIndex() + 1;
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", () => {
        goTo(i);
        restartTimer();
      });
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    Array.from(dotsWrap.children).forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function goTo(i) {
    index = Math.min(Math.max(i, 0), getMaxIndex());
    render();
  }
  function next() {
    if (index >= getMaxIndex()) goTo(0);
    else goTo(index + 1);
  }
  function prev() {
    if (index <= 0) goTo(getMaxIndex());
    else goTo(index - 1);
  }

  function startTimer() {
    timer = setInterval(next, AUTO_SCROLL_MS);
  }
  function stopTimer() {
    clearInterval(timer);
  }
  function restartTimer() {
    stopTimer();
    startTimer();
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      next();
      restartTimer();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prev();
      restartTimer();
    });
  }
  carousel.addEventListener("mouseenter", stopTimer);
  carousel.addEventListener("mouseleave", startTimer);

  window.addEventListener("resize", () => {
    buildDots();
    goTo(Math.min(index, getMaxIndex()));
  });

  buildDots();
  render();
  startTimer();
}

function initAccountTabs() {
  const tabs = document.querySelectorAll(".account-tab");
  if (tabs.length === 0) return;
  const forms = document.querySelectorAll(".account-form");

  if (window.location.hash === "#create") {
    const createTab = document.querySelector(
      '.account-tab[data-target="create-account-form"]',
    );
    if (createTab) createTab.click();
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      forms.forEach((f) => f.classList.remove("active"));
      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add("active");
    });
  });

  forms.forEach((form) => {
    const formEl = form.querySelector("form");
    if (formEl) {
      formEl.addEventListener("submit", (e) => {
        e.preventDefault();
<<<<<<< HEAD
        alert("Sirvir Irrur");
=======
        alert(
          "This is a demo form \u2014 account creation isn't connected to a server yet.",
        );
>>>>>>> cfc630c38ef665e75bba91191aeccc442d1369fe
      });
    }
  });
}

// Shop page search filtering

function initShopSearch() {
  const grid = document.querySelector(".product-grid");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const q = (params.get("q") || "").trim();
  const statusEl = document.querySelector(".search-status");
  const noResultsEl = document.querySelector(".no-results");
  const cards = Array.from(grid.querySelectorAll(".product-card"));

  document.querySelectorAll(".search-input").forEach((input) => {
    if (q) input.value = q;
  });

  if (!q) {
    if (statusEl) statusEl.style.display = "none";
    return;
  }

  const needle = q.toLowerCase();
  let matches = 0;
  cards.forEach((card) => {
    const name = (card.dataset.name || "").toLowerCase();
    const isMatch = name.includes(needle);
    card.style.display = isMatch ? "" : "none";
    if (isMatch) matches++;
  });

  if (statusEl) {
    statusEl.style.display = "block";
    statusEl.innerHTML =
      "Showing " +
      matches +
      " result" +
      (matches === 1 ? "" : "s") +
      " for &ldquo;<strong>" +
      escapeHtml(q) +
      "</strong>&rdquo;";
  }
  if (noResultsEl) {
    noResultsEl.style.display = matches === 0 ? "block" : "none";
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Cart

const CART_KEY = "sedoki_cart";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    /* localStorage unavailable (private browsing, etc.) - fail quietly */
  }
  renderCart();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((i) => i.name === product.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      base: product.base || "",
      qty: 1,
    });
  }
  saveCart(cart);
  openCartDrawer();
}

function removeFromCart(name) {
  saveCart(getCart().filter((i) => i.name !== name));
}

function changeQty(name, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    saveCart(cart.filter((i) => i.name !== name));
  } else {
    saveCart(cart);
  }
}

function cartSubtotal(cart) {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function cartCount(cart) {
  return cart.reduce((sum, i) => sum + i.qty, 0);
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

function productThumbHtml(item) {
  if (item.base) {
    return `<div class="thumb-box"><img class="product-img" src="img/products/${item.base}.jpg" data-base="${item.base}" data-tried="0" data-name="${escapeHtml(
      item.name,
    )}" alt="${escapeHtml(item.name)}" onerror="handleProductImgError(this)"></div>`;
  }
  return `<div class="thumb-box"><div class="thumb-fallback" style="border-radius:8px;">${escapeHtml(
    item.name,
  )}</div></div>`;
}

function renderCart() {
  const cart = getCart();
  renderCartCount(cart);
  renderDrawerCart(cart);
  renderFullCartPage(cart);
}

function renderCartCount(cart) {
  const count = cartCount(cart);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = String(count);
    el.style.display = count > 0 ? "flex" : "none";
  });
}

function renderDrawerCart(cart) {
  const list = document.getElementById("cartDrawerItems");
  const subtotalEl = document.getElementById("cartDrawerSubtotal");
  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML =
      '<div class="cart-drawer-empty"><p>Your cart is empty.</p><p style="margin-top:10px;"><a href="shop.html">Browse the catalog</a></p></div>';
  } else {
    list.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-drawer-item">
        ${productThumbHtml(item)}
        <div class="cart-drawer-item-info">
          <h4>${escapeHtml(item.name)}</h4>
          <div class="unit-price">${formatPHP(item.price)} each</div>
          <div class="cart-qty">
            <button type="button" onclick="changeQty('${escapeAttr(
              item.name,
            )}', -1)" aria-label="Decrease quantity">&minus;</button>
            <span>${item.qty}</span>
            <button type="button" onclick="changeQty('${escapeAttr(
              item.name,
            )}', 1)" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-item-line-total">${formatPHP(item.price * item.qty)}</div>
        </div>
        <button type="button" class="cart-item-remove" onclick="removeFromCart('${escapeAttr(
          item.name,
        )}')" aria-label="Remove item">&times;</button>
      </div>`,
      )
      .join("");
  }

  if (subtotalEl) subtotalEl.textContent = formatPHP(cartSubtotal(cart));
}

function renderFullCartPage(cart) {
  const emptyEl = document.getElementById("cartPageEmpty");
  const contentEl = document.getElementById("cartPageContent");
  const list = document.getElementById("cartPageItems");
  const subtotalEl = document.getElementById("cartPageSubtotal");
  if (!emptyEl || !contentEl || !list) return;

  if (cart.length === 0) {
    emptyEl.style.display = "block";
    contentEl.style.display = "none";
    return;
  }

  emptyEl.style.display = "none";
  contentEl.style.display = "block";

  list.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-page-item">
      ${productThumbHtml(item)}
      <div class="cart-page-item-info">
        <h3>${escapeHtml(item.name)}</h3>
        <div class="unit-price">${formatPHP(item.price)} each</div>
        <div class="cart-qty">
          <button type="button" onclick="changeQty('${escapeAttr(
            item.name,
          )}', -1)" aria-label="Decrease quantity">&minus;</button>
          <span>${item.qty}</span>
          <button type="button" onclick="changeQty('${escapeAttr(
            item.name,
          )}', 1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="cart-page-item-total">${formatPHP(item.price * item.qty)}</div>
      <button type="button" class="cart-item-remove" onclick="removeFromCart('${escapeAttr(
        item.name,
      )}')" aria-label="Remove item">&times;</button>
    </div>`,
    )
    .join("");

  if (subtotalEl) subtotalEl.textContent = formatPHP(cartSubtotal(cart));
}

function escapeAttr(str) {
  return String(str).replace(/'/g, "\\'");
}

// cart drawer open/close

function openCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (!drawer || !overlay) return;
  drawer.classList.add("open");
  overlay.classList.add("show");
  document.body.classList.add("cart-drawer-open");
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (!drawer || !overlay) return;
  drawer.classList.remove("open");
  overlay.classList.remove("show");
  document.body.classList.remove("cart-drawer-open");
}

function initCartDrawer() {
  const toggleBtn = document.getElementById("cartToggle");
  const closeBtn = document.getElementById("closeCartDrawer");
  const overlay = document.getElementById("cartOverlay");
  const drawerCheckout = document.getElementById("drawerCheckoutBtn");
  const pageCheckout = document.getElementById("pageCheckoutBtn");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const drawer = document.getElementById("cartDrawer");
      if (drawer && drawer.classList.contains("open")) {
        closeCartDrawer();
      } else {
        openCartDrawer();
      }
    });
  }
  if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
  if (overlay) overlay.addEventListener("click", closeCartDrawer);

  const runCheckout = () => {
    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    alert("Pay Subtotal: " + formatPHP(cartSubtotal(cart)));
  };
  if (drawerCheckout) drawerCheckout.addEventListener("click", runCheckout);
  if (pageCheckout) pageCheckout.addEventListener("click", runCheckout);
}

// Add to cart buttons

function initAddToCartButtons() {
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const base = btn.dataset.base || "";
      if (!name || isNaN(price)) return;
      addToCart({ name, price, base });
    });
  });
}
