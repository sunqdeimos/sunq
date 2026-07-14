/* =========================================================
   SUNQ SHARED USER INTERFACE
   Requires data.js to load first.
   ========================================================= */

const CART_STORAGE_KEY = "sunqCart";


/* =========================================================
   CART HELPERS
   ========================================================= */

function getCart() {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart
      .filter(item => {
        return (
          item &&
          typeof item.id === "string" &&
          Number(item.quantity) > 0
        );
      })
      .map(item => ({
        id: item.id,
        quantity: Math.floor(Number(item.quantity))
      }));
  } catch (error) {
    console.error("Could not read SUNQ cart:", error);
    return [];
  }
}

function saveCart(cart) {
  const cleanCart = Array.isArray(cart)
    ? cart
        .filter(item => {
          return (
            item &&
            typeof item.id === "string" &&
            Number(item.quantity) > 0
          );
        })
        .map(item => ({
          id: item.id,
          quantity: Math.floor(Number(item.quantity))
        }))
    : [];

  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(cleanCart)
  );

  updateCartCount();

  /*
    The browser storage event only fires in other tabs.
    This custom event updates the current page immediately.
  */
  window.dispatchEvent(
    new CustomEvent("sunq:cartchange", {
      detail: {
        cart: cleanCart
      }
    })
  );
}

function clearStoredCart() {
  localStorage.removeItem(CART_STORAGE_KEY);

  updateCartCount();

  window.dispatchEvent(
    new CustomEvent("sunq:cartchange", {
      detail: {
        cart: []
      }
    })
  );
}

function getCartQuantity(productId) {
  const item = getCart().find(
    cartItem => cartItem.id === productId
  );

  return item ? Number(item.quantity) : 0;
}

function getCartItemCount() {
  return getCart().reduce((total, item) => {
    return total + Number(item.quantity || 0);
  }, 0);
}

function updateCartCount() {
  const countElement = document.getElementById("cart-count");

  if (!countElement) {
    return;
  }

  const total = getCartItemCount();

  countElement.textContent = total;
  countElement.setAttribute(
    "aria-label",
    `${total} item${total === 1 ? "" : "s"} in cart`
  );
}


/* =========================================================
   DISPLAY HELPERS
   ========================================================= */

function formatPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "$0.00";
  }

  return `$${numericPrice.toFixed(2)}`;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getStockLabel(stock) {
  const numericStock = Number(stock);

  if (numericStock <= 0) {
    return "Sold out";
  }

  if (numericStock === 1) {
    return "1 available";
  }

  return `${numericStock} available`;
}

function getStockClass(stock) {
  const numericStock = Number(stock);

  if (numericStock <= 0) {
    return "stock-sold-out";
  }

  if (numericStock <= 3) {
    return "stock-low";
  }

  return "stock-available";
}

function getProductImage(product) {
  const fallbackImage =
    "https://placehold.co/800x800/111111/d4af37?text=SUNQ";

  if (!product || !product.image) {
    return fallbackImage;
  }

  return product.image;
}


/* =========================================================
   PRODUCT CARD RENDERING
   ========================================================= */

function renderProductCard(product, options = {}) {
  if (!product) {
    return "";
  }

  const {
    animationIndex = 0,
    showCategory = true,
    showStock = true,
    showBadge = true
  } = options;

  const stock = getStock(product.id);
  const categoryLabel = getCategoryLabel(product.category);
  const badge = getProductBadge(product);
  const badgeClass = getBadgeClass(badge);
  const stockClass = getStockClass(stock);
  const stockLabel = getStockLabel(stock);

  const animationDelay = Math.min(
    animationIndex * 55,
    440
  );

  const badgeMarkup =
    showBadge && badge
      ? `
        <span class="product-badge ${escapeHTML(badgeClass)}">
          ${escapeHTML(badge)}
        </span>
      `
      : "";

  const categoryMarkup =
    showCategory
      ? `
        <p class="product-card-category">
          ${escapeHTML(categoryLabel)}
        </p>
      `
      : "";

  const stockMarkup =
    showStock
      ? `
        <p class="product-card-stock ${escapeHTML(stockClass)}">
          ${escapeHTML(stockLabel)}
        </p>
      `
      : "";

  const soldOutClass =
    stock <= 0
      ? "product-card-sold-out"
      : "";

  return `
    <a
      class="card product-card fade ${soldOutClass}"
      href="product.html?id=${encodeURIComponent(product.id)}"
      style="animation-delay:${animationDelay}ms;"
      aria-label="View ${escapeHTML(product.name)}"
    >
      <div class="product-card-media">
        <img
          class="card-img"
          src="${escapeHTML(getProductImage(product))}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          onerror="
            this.onerror = null;
            this.src = 'https://placehold.co/800x800/111111/d4af37?text=SUNQ';
          "
        >

        ${badgeMarkup}

        ${
          stock <= 0
            ? `
              <div class="sold-out-overlay">
                Sold Out
              </div>
            `
            : ""
        }
      </div>

      <div class="product-card-content">
        ${categoryMarkup}

        <h3>${escapeHTML(product.name)}</h3>

        <div class="product-card-bottom">
          <p class="product-card-price">
            ${formatPrice(product.price)}
          </p>

          ${stockMarkup}
        </div>
      </div>
    </a>
  `;
}

function renderProductGrid(
  containerOrId,
  products,
  options = {}
) {
  const container =
    typeof containerOrId === "string"
      ? document.getElementById(containerOrId)
      : containerOrId;

  if (!container) {
    console.warn(
      "SUNQ product grid container could not be found:",
      containerOrId
    );

    return;
  }

  const productList = Array.isArray(products)
    ? products
    : [];

  if (productList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No products found</h2>

        <p>
          Try another search or choose a different category.
        </p>

        <a class="button-secondary" href="shop.html">
          View all products
        </a>
      </div>
    `;

    return;
  }

  container.innerHTML = `
    <div class="grid">
      ${productList
        .map((product, index) => {
          return renderProductCard(product, {
            ...options,
            animationIndex: index
          });
        })
        .join("")}
    </div>
  `;
}


/* =========================================================
   RELATED PRODUCT RENDERING
   ========================================================= */

function renderRelatedProducts(
  containerOrId,
  productId,
  limit = 4
) {
  const relatedProducts = getRelatedProducts(
    productId,
    limit
  );

  renderProductGrid(
    containerOrId,
    relatedProducts,
    {
      showCategory: true,
      showStock: true,
      showBadge: true
    }
  );
}


/* =========================================================
   FEATURED PRODUCT RENDERING
   ========================================================= */

function renderFeaturedProducts(
  containerOrId,
  limit = 6
) {
  const featuredProducts = getFeaturedProducts()
    .slice(0, limit);

  renderProductGrid(
    containerOrId,
    featuredProducts,
    {
      showCategory: true,
      showStock: true,
      showBadge: true
    }
  );
}


/* =========================================================
   PAGE SYNCHRONIZATION
   ========================================================= */

function initializeSharedUI() {
  updateCartCount();
}

window.addEventListener("storage", event => {
  if (
    event.key === CART_STORAGE_KEY ||
    event.key === "sunqStock"
  ) {
    updateCartCount();

    window.dispatchEvent(
      new CustomEvent("sunq:externalchange", {
        detail: {
          key: event.key
        }
      })
    );
  }
});

window.addEventListener(
  "sunq:cartchange",
  updateCartCount
);

document.addEventListener(
  "DOMContentLoaded",
  initializeSharedUI
);
