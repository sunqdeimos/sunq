/* =========================================================
   SUNQ SHARED STORE UI
   ========================================================= */


/* =========================================================
   CART HELPERS
   ========================================================= */

function getCart() {
  try {
    return JSON.parse(
      localStorage.getItem("sunqCart")
    ) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(
    "sunqCart",
    JSON.stringify(cart)
  );

  window.dispatchEvent(
    new Event("sunq:cartchange")
  );

  updateCartCount();
}

function clearStoredCart() {
  localStorage.removeItem("sunqCart");

  window.dispatchEvent(
    new Event("sunq:cartchange")
  );

  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();

  const total = cart.reduce((sum, item) => {
    return sum + Number(item.quantity || 0);
  }, 0);

  document
    .querySelectorAll("#cart-count")
    .forEach(counter => {
      counter.textContent = total;
    });
}


/* =========================================================
   FORMATTERS
   ========================================================= */

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getProductImage(product) {
  return product.image ||
    "https://placehold.co/800x800/111111/d4af37?text=SUNQ";
}


/* =========================================================
   STOCK HELPERS
   ========================================================= */

function getStockLabel(stock) {
  if (stock <= 0) {
    return "Unavailable";
  }

  if (stock === 1) {
    return "Only 1 available";
  }

  if (stock <= 3) {
    return `Only ${stock} available`;
  }

  return `${stock} available`;
}

function getStockClass(stock) {
  if (stock <= 0) {
    return "availability-sold-out";
  }

  if (stock <= 3) {
    return "availability-low";
  }

  return "availability-available";
}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function renderCard(product) {

  const stock =
    getStock(product.id);

  const badge =
    getProductBadge(product);

  const badgeClass =
    getBadgeClass(badge);

  return `
    <a
      class="product-card fade"
      href="product.html?id=${encodeURIComponent(product.id)}"
    >

      <div class="product-card-image-wrap">

        <div class="image-placeholder"></div>

        <img
          class="product-card-image"
          src="${escapeHTML(getProductImage(product))}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"

          onload="
            this.classList.add('loaded');
            this.previousElementSibling.remove();
          "

          onerror="
            this.onerror=null;
            this.src='https://placehold.co/800x800/111111/d4af37?text=SUNQ';
          "
        >

        ${
          badge
            ? `
              <span
                class="product-badge ${badgeClass}"
              >
                ${escapeHTML(badge)}
              </span>
            `
            : ""
        }

      </div>

      <div class="product-card-content">

        <p class="product-card-category">
          ${escapeHTML(
            getCategoryLabel(
              product.category
            )
          )}
        </p>

        <h3>
          ${escapeHTML(product.name)}
        </h3>

        <p class="product-card-price">
          ${formatPrice(product.price)}
        </p>

        <div class="product-card-meta">

          <span>
            ${escapeHTML(product.platform)}
          </span>

          <span>
            ${escapeHTML(product.delivery)}
          </span>

        </div>

        <p class="
          product-stock
          ${getStockClass(stock)}
        ">
          ${getStockLabel(stock)}
        </p>

      </div>

    </a>
  `;
}


/* =========================================================
   PRODUCT GRID
   ========================================================= */

function renderGrid(
  containerId,
  products
) {

  const container =
    document.getElementById(containerId);

  if (!container) {
    return;
  }

  if (!products.length) {

    container.innerHTML = `
      <section class="empty-state">

        <p class="empty-state-kicker">
          Nothing here yet.
        </p>

        <h2>
          We looked everywhere.
        </h2>

        <p>
          Even behind the couch.
        </p>

      </section>
    `;

    return;
  }

  container.innerHTML = `
    <div class="grid">

      ${products
        .map(renderCard)
        .join("")}

    </div>
  `;
}


/* =========================================================
   RELATED PRODUCTS
   ========================================================= */

function renderRelatedProducts(
  containerId,
  productId,
  limit = 4
) {

  renderGrid(
    containerId,
    getRelatedProducts(
      productId,
      limit
    )
  );

}


/* =========================================================
   FEATURED PRODUCTS
   ========================================================= */

function renderFeaturedProducts(
  containerId
) {

  renderGrid(
    containerId,
    getFeaturedProducts()
  );

}


/* =========================================================
   GLOBAL EVENTS
   ========================================================= */

window.addEventListener(
  "storage",
  () => {

    updateCartCount();

    window.dispatchEvent(
      new Event("sunq:externalchange")
    );

  }
);

updateCartCount();
