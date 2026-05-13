// product.js

const ITEMS = {
  "item-a": {
    id: "item-a",
    name: "Placeholder Item A",
    price: 29.99,
    image: "https://placehold.co/600x600/1a1a1a/white?text=Item+A",
    description: "Generic placeholder item A."
  },
  "item-b": {
    id: "item-b",
    name: "Placeholder Item B",
    price: 49.99,
    image: "https://placehold.co/600x600/1a1a1a/white?text=Item+B",
    description: "Generic placeholder item B."
  },
  "item-c": {
    id: "item-c",
    name: "Placeholder Item C",
    price: 19.99,
    image: "https://placehold.co/600x600/1a1a1a/white?text=Item+C",
    description: "Generic placeholder item C."
  },
  "item-d": {
    id: "item-d",
    name: "Placeholder Item D",
    price: 99.99,
    image: "https://placehold.co/600x600/1a1a1a/white?text=Item+D",
    description: "Generic placeholder item D."
  },
  "item-e": {
    id: "item-e",
    name: "Placeholder Item E",
    price: 14.99,
    image: "https://placehold.co/600x600/1a1a1a/white?text=Item+E",
    description: "Generic placeholder item E."
  },
  "item-f": {
    id: "item-f",
    name: "Placeholder Item F",
    price: 199.99,
    image: "https://placehold.co/600x600/1a1a1a/white?text=Item+F",
    description: "Generic placeholder item F."
  }
};

// Get product ID from URL
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("item");
}

// CART HELPERS
function getCart() {
  return JSON.parse(localStorage.getItem("sunqCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("sunqCart", JSON.stringify(cart));
}

// UPDATE CART COUNT (navbar)
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);

  const el = document.getElementById("cart-count");
  if (el) el.textContent = total;
}

// ADD TO CART
function addToCart(id, quantity = 1) {
  let cart = getCart();

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, quantity });
  }

  saveCart(cart);
  updateCartCount();
}

// RENDER PRODUCT PAGE
function renderProduct() {
  const id = getProductId();
  const product = ITEMS[id];

  const container = document.getElementById("product-container");

  if (!container) return;

  if (!product) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px;">
        <h2>Item not found</h2>
        <a href="shop.html" class="button-primary">Back to Shop</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="product-grid-page">
      <div>
        <img src="${product.image}" style="width:100%;border-radius:16px;">
      </div>

      <div>
        <h1>${product.name}</h1>
        <p style="font-size:24px;color:gold;">$${product.price.toFixed(2)}</p>
        <p>${product.description}</p>

        <div style="margin-top:20px;">
          <label>Quantity:</label>
          <input id="qty" type="number" value="1" min="1" style="width:60px;">
        </div>

        <button id="addBtn" class="button-primary" style="margin-top:20px;">
          Add to Cart
        </button>
      </div>
    </div>
  `;

  document.getElementById("addBtn").addEventListener("click", () => {
    const qty = parseInt(document.getElementById("qty").value) || 1;
    addToCart(product.id, qty);
    alert("Added to cart");
  });
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
  renderProduct();
  updateCartCount();
});
