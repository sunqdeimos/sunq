/* ================= PRODUCT CATALOG ================= */

const PRODUCTS = [
  {
    id: "s1",
    name: "SUNQ / 01",
    price: 9.99,
    stock: 14,
    image: "https://github.com/sunqdeimos/sunq/raw/main/sunq01.jpg",
    collection: "diamond"
  },
  {
    id: "s2",
    name: "SUNQ / 02",
    price: 19.99,
    stock: 8,
    image: "https://raw.githubusercontent.com/sunqdeimos/sunq/main/images/sunq02.jpg",
    collection: "diamond"
  },
  {
    id: "s3",
    name: "SUNQ / 03",
    price: 29.99,
    stock: 20,
    image: "https://raw.githubusercontent.com/sunqdeimos/sunq/main/images/sunq03.jpg",
    collection: "diamond"
  },
  {
    id: "s4",
    name: "SUNQ / 04",
    price: 39.99,
    stock: 5,
    image: "https://raw.githubusercontent.com/sunqdeimos/sunq/main/images/sunq04.jpg",
    collection: "sunq"
  },
  {
    id: "s5",
    name: "SUNQ / 05",
    price: 49.99,
    stock: 2,
    image: "https://raw.githubusercontent.com/sunqdeimos/sunq/main/images/sunq05.jpg",
    collection: "sunq"
  },
  {
    id: "s6",
    name: "SUNQ / 06",
    price: 59.99,
    stock: 11,
    image: "https://raw.githubusercontent.com/sunqdeimos/sunq/main/images/sunq06.jpg",
    collection: "sunq"
  },
  {
    id: "s7",
    name: "SUNQ / 07",
    price: 69.99,
    stock: 7,
    image: "https://raw.githubusercontent.com/sunqdeimos/sunq/main/images/sunq07.jpg",
    collection: "sunq"
  },
  {
    id: "s8",
    name: "SUNQ / 08",
    price: 79.99,
    stock: 4,
    image: "https://raw.githubusercontent.com/sunqdeimos/sunq/main/images/sunq08.jpg",
    collection: "sunq"
  },
  {
    id: "s9",
    name: "SUNQ / 09",
    price: 89.99,
    stock: 16,
    image: "https://raw.githubusercontent.com/sunqdeimos/sunq/main/images/sunq09.jpg",
    collection: "sunq"
  },
  {
    id: "s10",
    name: "SUNQ / 10",
    price: 99.99,
    stock: 1,
    image: "https://raw.githubusercontent.com/sunqdeimos/sunq/main/images/sunq10.jpg",
    collection: "sunq"
  }
];

/* ================= HELPERS ================= */

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

/* ================= STOCK SYSTEM ================= */

function getStockData() {
  return JSON.parse(localStorage.getItem("sunqStock")) || {};
}

function saveStockData(data) {
  localStorage.setItem("sunqStock", JSON.stringify(data));
}

/* initialize stock once */
function initStock() {
  const data = getStockData();

  PRODUCTS.forEach(p => {
    if (data[p.id] === undefined) {
      data[p.id] = p.stock;
    }
  });

  saveStockData(data);
}

function getStock(id) {
  const data = getStockData();
  return data[id] ?? 0;
}

function reduceStock(id, amount) {
  const data = getStockData();

  if (data[id] === undefined) return false;
  if (data[id] < amount) return false;

  data[id] -= amount;
  saveStockData(data);
  return true;
}

/* ================= INIT ================= */
initStock();
