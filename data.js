const PRODUCTS = {
  s1: { id: "s1", name: "SUNQ / 01", price: 9.99, stock: 14, image: "https://placehold.co/800x800/111/fff?text=SUNQ+01" },
  s2: { id: "s2", name: "SUNQ / 02", price: 19.99, stock: 8, image: "https://placehold.co/800x800/111/fff?text=SUNQ+02" },
  s3: { id: "s3", name: "SUNQ / 03", price: 29.99, stock: 20, image: "https://placehold.co/800x800/111/fff?text=SUNQ+03" },
  s4: { id: "s4", name: "SUNQ / 04", price: 39.99, stock: 5, image: "https://placehold.co/800x800/111/fff?text=SUNQ+04" },
  s5: { id: "s5", name: "SUNQ / 05", price: 49.99, stock: 2, image: "https://placehold.co/800x800/111/fff?text=SUNQ+05" },

  s6: { id: "s6", name: "SUNQ / 06", price: 59.99, stock: 11, image: "https://placehold.co/800x800/111/fff?text=SUNQ+06" },
  s7: { id: "s7", name: "SUNQ / 07", price: 69.99, stock: 7, image: "https://placehold.co/800x800/111/fff?text=SUNQ+07" },
  s8: { id: "s8", name: "SUNQ / 08", price: 79.99, stock: 4, image: "https://placehold.co/800x800/111/fff?text=SUNQ+08" },
  s9: { id: "s9", name: "SUNQ / 09", price: 89.99, stock: 16, image: "https://placehold.co/800x800/111/fff?text=SUNQ+09" },
  s10:{ id: "s10", name: "SUNQ / 10", price: 99.99, stock: 1, image: "https://placehold.co/800x800/111/fff?text=SUNQ+10" }
};

/* ================= STOCK SYSTEM (LOCAL STORAGE) ================= */

function getStockData() {
  return JSON.parse(localStorage.getItem("sunqStock")) || {};
}

function saveStockData(stockData) {
  localStorage.setItem("sunqStock", JSON.stringify(stockData));
}

function initStock() {
  const stockData = getStockData();

  Object.values(PRODUCTS).forEach(product => {
    if (stockData[product.id] === undefined) {
      stockData[product.id] = product.stock;
    }
  });

  saveStockData(stockData);
}

function getStock(id) {
  const stockData = getStockData();
  return stockData[id] ?? 0;
}

function reduceStock(id, amount) {
  const stockData = getStockData();

  if (stockData[id] === undefined) return false;
  if (stockData[id] < amount) return false;

  stockData[id] -= amount;
  saveStockData(stockData);
  return true;
}

/* Initialize stock when site loads */
initStock();
