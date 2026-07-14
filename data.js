/* =========================================================
   SUNQ PRODUCT DATA
   Loads products from Supabase.
   Requires:
   1. Supabase CDN
   2. supabase-config.js
   ========================================================= */

const CATEGORY_LABELS = {
  "diamond-fa": "Diamond / Champ FA",
  "diamond-nfa": "Diamond / Champ NFA",
  "emerald-fa": "Emerald FA",
  "emerald-nfa": "Emerald NFA",
  "rank-ready": "Rank Ready"
};

let PRODUCTS = [];

let productsLoaded = false;
let productsLoading = false;
let productsLoadError = null;


/* =========================================================
   LOAD PRODUCTS FROM SUPABASE
   ========================================================= */

async function loadProducts() {
  if (productsLoading) {
    return PRODUCTS;
  }

  productsLoading = true;
  productsLoadError = null;

  try {
    const { data, error } = await supabaseClient
  .from("products")
  .select("*")
  .order("display_order", {
    ascending: true
  });

    if (error) {
      throw error;
    }

    PRODUCTS = Array.isArray(data)
      ? data.map(normalizeProduct)
      : [];

    productsLoaded = true;

    window.dispatchEvent(
      new CustomEvent("sunq:productsloaded", {
        detail: {
          products: PRODUCTS
        }
      })
    );

    return PRODUCTS;
  } catch (error) {
    console.error(
      "Could not load SUNQ products:",
      error
    );

    PRODUCTS = [];
    productsLoadError = error;

    window.dispatchEvent(
      new CustomEvent("sunq:productserror", {
        detail: {
          error
        }
      })
    );

    return [];
  } finally {
    productsLoading = false;
  }
}


/* =========================================================
   PRODUCT NORMALIZATION
   ========================================================= */

function normalizeProduct(product) {
  return {
    id: String(product.id ?? ""),
    name: String(product.name ?? "Unnamed product"),
    price: Number(product.price ?? 0),
    stock: Math.max(
      0,
      Math.floor(Number(product.stock ?? 0))
    ),
    image: String(product.image ?? ""),
    category: String(product.category ?? ""),
    platform: String(product.platform ?? "Not specified"),
    delivery: String(
      product.delivery ?? "Delivery time unavailable"
    ),
    description: String(product.description ?? ""),
    featured: Boolean(product.featured),
    badge: product.badge
      ? String(product.badge)
      : "",
    created_at: product.created_at ?? null
  };
}


/* =========================================================
   PRODUCT HELPERS
   ========================================================= */

function getProduct(id) {
  return PRODUCTS.find(product => {
    return product.id === id;
  });
}

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || "Uncategorized";
}

function getProductsByCategory(category) {
  if (category === "all") {
    return [...PRODUCTS];
  }

  return PRODUCTS.filter(product => {
    return product.category === category;
  });
}

function getFeaturedProducts() {
  return PRODUCTS.filter(product => {
    return product.featured === true;
  });
}

function getRelatedProducts(productId, limit = 4) {
  const currentProduct =
    getProduct(productId);

  if (!currentProduct) {
    return [];
  }

  const sameCategory =
    PRODUCTS.filter(product => {
      return (
        product.id !== currentProduct.id &&
        product.category === currentProduct.category
      );
    });

  const otherCategories =
    PRODUCTS.filter(product => {
      return (
        product.id !== currentProduct.id &&
        product.category !== currentProduct.category
      );
    });

  return [
    ...sameCategory,
    ...otherCategories
  ].slice(0, limit);
}

function getProductSearchText(product) {
  return [
    product.name,
    product.id,
    getCategoryLabel(product.category),
    product.category,
    product.platform,
    product.delivery,
    product.badge,
    product.description
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}


/* =========================================================
   PRODUCT DETAIL HELPERS
   ========================================================= */

function getProductPlatform(product) {
  return product?.platform || "Not specified";
}

function getProductDelivery(product) {
  return product?.delivery || "Delivery time unavailable";
}

function getAvailabilityLabel(productId) {
  const stock = getStock(productId);

  if (stock <= 0) {
    return "Unavailable";
  }

  if (stock === 1) {
    return "Only 1 available";
  }

  if (stock <= 3) {
    return `Only ${stock} available`;
  }

  return "Available";
}

function getAvailabilityClass(productId) {
  const stock = getStock(productId);

  if (stock <= 0) {
    return "availability-sold-out";
  }

  if (stock <= 3) {
    return "availability-low";
  }

  return "availability-available";
}


/* =========================================================
   STOCK HELPERS
   Stock now comes directly from Supabase product rows.
   ========================================================= */

function getStock(id) {
  const product = getProduct(id);

  if (!product) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(Number(product.stock || 0))
  );
}


/* =========================================================
   BADGE HELPERS
   ========================================================= */

function getProductBadge(product) {
  const stock = getStock(product.id);

  if (stock <= 0) {
    return "Sold Out";
  }

  if (stock <= 3) {
    return "Low Stock";
  }

  return product.badge || "";
}

function getBadgeClass(badge) {
  const normalizedBadge =
    String(badge)
      .trim()
      .toLowerCase();

  if (normalizedBadge === "sold out") {
    return "badge-sold-out";
  }

  if (normalizedBadge === "low stock") {
    return "badge-low-stock";
  }

  if (normalizedBadge === "best seller") {
    return "badge-best-seller";
  }

  if (normalizedBadge === "new") {
    return "badge-new";
  }

  return "";
}


/* =========================================================
   LOADING STATE HELPERS
   ========================================================= */

function areProductsLoaded() {
  return productsLoaded;
}

function isProductsLoading() {
  return productsLoading;
}

function getProductsLoadError() {
  return productsLoadError;
}


/* =========================================================
   INITIALIZE
   ========================================================= */

const productsReady = loadProducts();
