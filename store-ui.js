/* =========================================================
   SUNQ SHARED STORE UI
   Requires data.js to load first.
   ========================================================= */

const CART_STORAGE_KEY = "sunqCart";

const FALLBACK_PRODUCT_IMAGE =
  "https://placehold.co/800x800/111111/d4af37?text=SUNQ";


/* =========================================================
   CART HELPERS
   ========================================================= */

function getCart() {
  try {
    const storedCart =
      localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart =
      JSON.parse(storedCart);

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
      .map(item => {
        return {
          id: item.id,
          quantity: Math.floor(
            Number(item.quantity)
          )
        };
      });
  } catch (error) {
    console.error(
      "Could not read SUNQ cart:",
      error
    );

    return [];
  }
}

function saveCart(cart) {
  const cleanCart =
    Array.isArray(cart)
      ? cart
          .filter(item => {
            return (
              item &&
              typeof item.id === "string" &&
              Number(item.quantity) > 0
            );
          })
          .map(item => {
            return {
              id: item.id,
              quantity: Math.floor(
                Number(item.quantity)
              )
            };
          })
      : [];

  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(cleanCart)
  );

  updateCartCount();

  window.dispatchEvent(
    new CustomEvent("sunq:cartchange", {
      detail: {
        cart: cleanCart
      }
    })
  );
}

function clearStoredCart() {
  localStorage.removeItem(
    CART_STORAGE_KEY
  );

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
    cartItem => {
      return cartItem.id === productId;
    }
  );

  return item
    ? Number(item.quantity)
    : 0;
}

function getCartItemCount() {
  return getCart().reduce(
    (total, item) => {
      return (
        total +
        Number(item.quantity || 0)
      );
    },
    0
  );
}

function updateCartCount() {
  const total =
    getCartItemCount();

  document
    .querySelectorAll("#cart-count")
    .forEach(counter => {
      counter.textContent = total;

      counter.setAttribute(
        "aria-label",
        `${total} item${total === 1 ? "" : "s"} in cart`
      );
    });
}


/* =========================================================
   FORMATTERS
   ========================================================= */

function formatPrice(price) {
  const numericPrice =
    Number(price);

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

function getProductImage(product) {
  if (
    !product ||
    !product.image
  ) {
    return FALLBACK_PRODUCT_IMAGE;
  }

  return product.image;
}


/* =========================================================
   STOCK HELPERS
   ========================================================= */

function getStockLabel(stock) {
  const numericStock =
    Number(stock);

  if (numericStock <= 0) {
    return "Unavailable";
  }

  if (numericStock === 1) {
    return "Only 1 available";
  }

  if (numericStock <= 3) {
    return `Only ${numericStock} available`;
  }

  return `${numericStock} available`;
}

function getStockClass(stock) {
  const numericStock =
    Number(stock);

  if (numericStock <= 0) {
    return "availability-sold-out";
  }

  if (numericStock <= 3) {
    return "availability-low";
  }

  return "availability-available";
}


/* =========================================================
   IMAGE HELPERS
   ========================================================= */

function handleProductImageLoad(image) {
  if (!image) {
    return;
  }

  image.classList.add("loaded");

  const wrapper =
    image.closest(
      ".product-card-image-wrap, .product-card-media"
    );

  const placeholder =
    wrapper?.querySelector(
      ".image-placeholder"
    );

  if (placeholder) {
    placeholder.remove();
  }
}

function handleProductImageError(image) {
  if (!image) {
    return;
  }

  image.onerror = null;
  image.src = FALLBACK_PRODUCT_IMAGE;
}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function renderCard(
  product,
  options = {}
) {
  if (!product) {
    return "";
  }

  const {
    animationIndex = 0,
    showCategory = true,
    showStock = true,
    showBadge = true,
    showMeta = true
  } = options;

  const stock =
    getStock(product.id);

  const badge =
    getProductBadge(product);

  const badgeClass =
    getBadgeClass(badge);

  const categoryLabel =
    getCategoryLabel(
      product.category
    );

  const platform =
    getProductPlatform(product);

  const delivery =
    getProductDelivery(product);

  const stockClass =
    getStockClass(stock);

  const stockLabel =
    getStockLabel(stock);

  const animationDelay =
    Math.min(
      animationIndex * 55,
      440
    );

  const badgeMarkup =
    showBadge && badge
      ? `
        <span
          class="product-badge ${escapeHTML(badgeClass)}"
        >
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

  const metaMarkup =
    showMeta
      ? `
        <div class="product-card-meta">

          <span>
            ${escapeHTML(platform)}
          </span>

          <span>
            ${escapeHTML(delivery)}
          </span>

        </div>
      `
      : "";

  const stockMarkup =
    showStock
      ? `
        <p
          class="product-stock ${escapeHTML(stockClass)}"
        >
          ${escapeHTML(stockLabel)}
        </p>
      `
      : "";

  const soldOutOverlay =
    stock <= 0
      ? `
        <div class="sold-out-overlay">
          Sold Out
        </div>
      `
      : "";

  const soldOutClass =
    stock <= 0
      ? "product-card-sold-out"
      : "";

  return `
    <a
      class="product-card fade ${soldOutClass}"
      href="product.html?id=${encodeURIComponent(product.id)}"
      style="animation-delay:${animationDelay}ms;"
      aria-label="View ${escapeHTML(product.name)}"
    >

      <div class="product-card-image-wrap">

        <div class="image-placeholder"></div>

        <img
          class="product-card-image"
          src="${escapeHTML(getProductImage(product))}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          onload="handleProductImageLoad(this)"
          onerror="handleProductImageError(this)"
        >

        ${badgeMarkup}

        ${soldOutOverlay}

      </div>


      <div class="product-card-content">

        ${categoryMarkup}

        <h3>
          ${escapeHTML(product.name)}
        </h3>

        <p class="product-card-price">
          ${formatPrice(product.price)}
        </p>

        ${metaMarkup}

        ${stockMarkup}

      </div>

    </a>
  `;
}


/* =========================================================
   PRODUCT GRID
   ========================================================= */

function renderGrid(
  containerOrId,
  products,
  options = {}
) {
  const container =
    typeof containerOrId === "string"
      ? document.getElementById(
          containerOrId
        )
      : containerOrId;

  if (!container) {
    console.warn(
      "SUNQ product grid container could not be found:",
      containerOrId
    );

    return;
  }

  const productList =
    Array.isArray(products)
      ? products
      : [];

  if (productList.length === 0) {
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

        <a
          class="button-secondary"
          href="shop.html"
        >
          View all products
        </a>

      </section>
    `;

    return;
  }

  container.innerHTML = `
    <div class="grid">

      ${productList
        .map((product, index) => {
          return renderCard(
            product,
            {
              ...options,
              animationIndex: index
            }
          );
        })
        .join("")}

    </div>
  `;
}


/* =========================================================
   BACKWARD-COMPATIBLE GRID NAME
   ========================================================= */

function renderProductGrid(
  containerOrId,
  products,
  options = {}
) {
  return renderGrid(
    containerOrId,
    products,
    options
  );
}


/* =========================================================
   RELATED PRODUCTS
   ========================================================= */

function renderRelatedProducts(
  containerOrId,
  productId,
  limit = 4
) {
  const relatedProducts =
    getRelatedProducts(
      productId,
      limit
    );

  renderGrid(
    containerOrId,
    relatedProducts,
    {
      showCategory: true,
      showStock: true,
      showBadge: true,
      showMeta: true
    }
  );
}


/* =========================================================
   FEATURED PRODUCTS
   ========================================================= */

function renderFeaturedProducts(
  containerOrId,
  limit = 6
) {
  const featuredProducts =
    getFeaturedProducts()
      .slice(0, limit);

  renderGrid(
    containerOrId,
    featuredProducts,
    {
      showCategory: true,
      showStock: true,
      showBadge: true,
      showMeta: true
    }
  );
}


/* =========================================================
   PAGE SYNCHRONIZATION
   ========================================================= */

function initializeSharedUI() {
  updateCartCount();
}

window.addEventListener(
  "storage",
  event => {
    if (
      event.key === CART_STORAGE_KEY ||
      event.key === "sunqStock"
    ) {
      updateCartCount();

      window.dispatchEvent(
        new CustomEvent(
          "sunq:externalchange",
          {
            detail: {
              key: event.key
            }
          }
        )
      );
    }
  }
);

window.addEventListener(
  "sunq:cartchange",
  updateCartCount
);

document.addEventListener(
  "DOMContentLoaded",
  initializeSharedUI
);

updateCartCount();
