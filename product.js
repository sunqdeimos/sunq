const PRODUCTS = [
  {
    id: "sunqs-a",
    name: "SUNQS A",
    price: 10,
    category: "SUNQS",
    desc: "Entry-level listing for quick purchase.",
    img: "https://placehold.co/800x800/0a0a0a/ffcc33?text=SUNQS+A"
  },
  {
    id: "sunqs-b",
    name: "SUNQS B",
    price: 15,
    category: "SUNQS",
    desc: "Mid-tier listing with added value.",
    img: "https://placehold.co/800x800/0a0a0a/ffcc33?text=SUNQS+B"
  },
  {
    id: "sunqs-c",
    name: "SUNQS C",
    price: 20,
    category: "SUNQS",
    desc: "Standard premium product listing.",
    img: "https://placehold.co/800x800/0a0a0a/ffcc33?text=SUNQS+C"
  },
  {
    id: "sunqs-d",
    name: "SUNQS D",
    price: 25,
    category: "SUNQS",
    desc: "Higher-tier digital bundle listing.",
    img: "https://placehold.co/800x800/0a0a0a/ffcc33?text=SUNQS+D"
  },
  {
    id: "sunqs-e",
    name: "SUNQS E",
    price: 30,
    category: "SUNQS",
    desc: "Exclusive premium listing category.",
    img: "https://placehold.co/800x800/0a0a0a/ffcc33?text=SUNQS+E"
  },

  {
    id: "jets-a",
    name: "JETS A",
    price: 12,
    category: "JETS",
    desc: "Starter listing from the JETS lineup.",
    img: "https://placehold.co/800x800/0a0a0a/ffcc33?text=JETS+A"
  },
  {
    id: "jets-b",
    name: "JETS B",
    price: 18,
    category: "JETS",
    desc: "Upgraded listing with more features.",
    img: "https://placehold.co/800x800/0a0a0a/ffcc33?text=JETS+B"
  },
  {
    id: "jets-c",
    name: "JETS C",
    price: 22,
    category: "JETS",
    desc: "Balanced mid-tier JETS product.",
    img: "https://placehold.co/800x800/0a0a0a/ffcc33?text=JETS+C"
  },
  {
    id: "jets-d",
    name: "JETS D",
    price: 28,
    category: "JETS",
    desc: "Higher tier listing with more demand.",
    img: "https://placehold.co/800x800/0a0a0a/ffcc33?text=JETS+D"
  },
  {
    id: "jets-e",
    name: "JETS E",
    price: 35,
    category: "JETS",
    desc: "Premium high-tier JETS listing.",
    img: "https://placehold.co/800x800/0a0a0a/ffcc33?text=JETS+E"
  }
];

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getCart() {
  return JSON.parse(localStorage.getItem("sunqCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("sunqCart", JSON.stringify(cart));
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const found = cart.find(item => item.id === productId);

  if (found) {
    found.quantity += qty;
  } else {
    cart.push({ id: productId, quantity: qty });
  }

  saveCart(cart);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartQuantity(productId, qty) {
  const cart = getCart();
  const found = cart.find(item => item.id === productId);

  if (!found) return;

  found.quantity = qty;

  if (found.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart(cart);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartCountDisplay() {
  const count = getCartCount();
  const span = document.getElementById("cart-count");
  if (span) span.innerText = count;
      }
