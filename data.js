/* =========================================================
   SUNQ PRODUCT CATALOG
   ========================================================= */

const CATEGORY_LABELS = {
  "diamond-fa": "Diamond / Champ FA",
  "diamond-nfa": "Diamond / Champ NFA",
  "emerald-fa": "Emerald FA",
  "emerald-nfa": "Emerald NFA",
  "rank-ready": "Rank Ready"
};

const PRODUCTS = [
  {
    id: "s1",
    name: "SUNQ / 01",
    price: 9.99,
    stock: 14,
    image: "https://github.com/sunqdeimos/sunq/raw/main/sunq01.jpg",

    category: "diamond-fa",
    platform: "Xbox",
    delivery: "5–15 minutes",

    description:
      "From yours truly, SUNQ :3.",

    featured: true,
    badge: "New"
  },

  {
    id: "s2",
    name: "SUNQ / 02",
    price: 19.99,
    stock: 8,
    image: "https://github.com/sunqdeimos/sunq/raw/main/sunq02.jpg",

    category: "diamond-fa",
    platform: "Xbox",
    delivery: "5–15 minutes",

    description:
      "From yours truly, SUNQ :3.",

    featured: false,
    badge: ""
  },

  {
    id: "s3",
    name: "SUNQ / 03",
    price: 29.99,
    stock: 20,
    image: "https://github.com/sunqdeimos/sunq/raw/main/sunq03.jpg",

    category: "diamond-nfa",
    platform: "Xbox",
    delivery: "10–20 minutes",

    description:
      "From yours truly, SUNQ :3.",

    featured: false,
    badge: ""
  },

  {
    id: "s4",
    name: "SUNQ / 04",
    price: 39.99,
    stock: 5,
    image: "https://github.com/sunqdeimos/sunq/raw/main/sunq04.jpg",

    category: "diamond-nfa",
    platform: "Xbox",
    delivery: "10–20 minutes",

    description:
      "From yours truly, SUNQ :3.",

    featured: false,
    badge: ""
  },

  {
    id: "s5",
    name: "SUNQ / 05",
    price: 49.99,
    stock: 2,
    image: "https://github.com/sunqdeimos/sunq/raw/main/sunq05.jpg",

    category: "emerald-fa",
    platform: "Xbox",
    delivery: "5–15 minutes",

    description:
      "From yours truly, SUNQ :3.",

    featured: true,
    badge: ""
  },

  {
    id: "s6",
    name: "SUNQ / 06",
    price: 59.99,
    stock: 11,
    image: "https://github.com/sunqdeimos/sunq/raw/main/sunq06.jpg",

    category: "emerald-fa",
    platform: "Xbox",
    delivery: "5–15 minutes",

    description:
      "From yours truly, SUNQ :3.",

    featured: false,
    badge: "Best Seller"
  },

  {
    id: "s7",
    name: "SUNQ / 07",
    price: 69.99,
    stock: 7,
    image: "https://github.com/sunqdeimos/sunq/raw/main/sunq07.jpg",

    category: "emerald-nfa",
    platform: "Xbox",
    delivery: "10–20 minutes",

    description:
      "From yours truly, SUNQ :3.",

    featured: false,
    badge: ""
  },

  {
    id: "s8",
    name: "SUNQ / 08",
    price: 79.99,
    stock: 4,
    image: "https://github.com/sunqdeimos/sunq/raw/main/sunq08.jpg",

    category: "emerald-nfa",
    platform: "Xbox",
    delivery: "10–20 minutes",

    description:
      "From yours truly, SUNQ :3.",

    featured: false,
    badge: ""
  },

  {
    id: "s9",
    name: "SUNQ / 09",
    price: 89.99,
    stock: 16,
    image: "https://github.com/sunqdeimos/sunq/raw/main/sunq09.jpg",

    category: "rank-ready",
    platform: "Xbox",
    delivery: "5–15 minutes",

    description:
      "From yours truly, SUNQ :3.",

    featured: true,
    badge: "New"
  },

  {
    id: "s10",
    name: "SUNQ / 10",
    price: 99.99,
    stock: 1,
    image: "https://github.com/sunqdeimos/sunq/raw/main/sunq10.jpg",

    category: "rank-ready",
    platform: "Xbox",
    delivery: "5–15 minutes",

    description:
      "From yours truly, SUNQ :3.",

    featured: false,
    badge: ""
  }
];


/* ==========================================================
   PRODUCT HELPERS
   ========================================================= */

function getProduct(id) {
  return PRODUCTS.find(product => product.id === id);
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
  const currentProduct = getProduct(productId);

  if (!currentProduct) {
    return [];
  }

  const sameCategory = PRODUCTS.filter(product => {
    return (
      product.id !== currentProduct.id &&
      product.category === currentProduct.category
    );
  });

  const otherCategories = PRODUCTS.filter(product => {
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
   LOCAL STOCK SYSTEM
   ========================================================= */

const STOCK_STORAGE_KEY = "sunqStock";

function getStockData() {
  try {
    const storedData =
      localStorage.getItem(STOCK_STORAGE_KEY);

    if (!storedData) {
      return {};
    }

    const parsedData = JSON.parse(storedData);

    if (
      parsedData === null ||
      typeof parsedData !== "object" ||
      Array.isArray(parsedData)
    ) {
      return {};
    }

    return parsedData;
  } catch (error) {
    console.error(
      "Could not read SUNQ stock data:",
      error
    );

    return {};
  }
}

function saveStockData(stockData) {
  localStorage.setItem(
    STOCK_STORAGE_KEY,
    JSON.stringify(stockData)
  );

  window.dispatchEvent(
    new CustomEvent("sunq:stockchange", {
      detail: {
        stockData
      }
    })
  );
}

function initStock() {
  const stockData = getStockData();
  let changed = false;

  PRODUCTS.forEach(product => {
    if (stockData[product.id] === undefined) {
      stockData[product.id] =
        Number(product.stock);

      changed = true;
    }
  });

  Object.keys(stockData).forEach(productId => {
    const productExists =
      PRODUCTS.some(product => {
        return product.id === productId;
      });

    if (!productExists) {
      delete stockData[productId];
      changed = true;
    }
  });

  if (changed) {
    saveStockData(stockData);
  }
}

function getStock(id) {
  const stockData = getStockData();
  const stock = Number(stockData[id]);

  return Number.isFinite(stock)
    ? stock
    : 0;
}

function setStock(id, amount) {
  const product = getProduct(id);
  const numericAmount = Number(amount);

  if (
    !product ||
    !Number.isFinite(numericAmount)
  ) {
    return false;
  }

  const stockData = getStockData();

  stockData[id] = Math.max(
    0,
    Math.floor(numericAmount)
  );

  saveStockData(stockData);
  return true;
}

function addStock(id, amount) {
  const numericAmount = Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    return false;
  }

  return setStock(
    id,
    getStock(id) + Math.floor(numericAmount)
  );
}

function reduceStock(id, amount) {
  const numericAmount = Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    return false;
  }

  const requestedAmount =
    Math.floor(numericAmount);

  const availableStock =
    getStock(id);

  if (availableStock < requestedAmount) {
    return false;
  }

  return setStock(
    id,
    availableStock - requestedAmount
  );
}

function resetStock(id) {
  const product = getProduct(id);

  if (!product) {
    return false;
  }

  return setStock(
    id,
    product.stock
  );
}

function resetAllStock() {
  const stockData = {};

  PRODUCTS.forEach(product => {
    stockData[product.id] =
      Number(product.stock);
  });

  saveStockData(stockData);
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
   INITIALIZE
   ========================================================= */

initStock();
