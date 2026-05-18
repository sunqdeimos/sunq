<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product | SUNQ</title>

  <link rel="stylesheet" href="styles.css">
  <script src="data.js"></script>
</head>

<body>

<nav class="navbar">
  <div class="nav-container">
    <a href="index.html" class="logo">SUNQ</a>

    <div class="nav-links">
      <a href="shop.html">Shop</a>
      <a href="about.html">About</a>
      <a href="cart.html">Cart (<span id="cart-count">0</span>)</a>
    </div>
  </div>
</nav>

<main class="shop">
  <div id="product-container"></div>
</main>

<script>
function getCart() {
  return JSON.parse(localStorage.getItem("sunqCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("sunqCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  document.getElementById("cart-count").textContent = total;
}

const id = new URLSearchParams(window.location.search).get("id");
const product = getProduct(id);
const container = document.getElementById("product-container");

function addToCart(id) {
  const p = getProduct(id);
  const stock = getStock(id);

  if (!p || stock <= 0) return alert("Out of stock.");

  const cart = getCart();
  const item = cart.find(i => i.id === id);

  const newQty = item ? item.quantity + 1 : 1;
  if (newQty > stock) return alert("Not enough stock.");

  if (item) item.quantity = newQty;
  else cart.push({ id, quantity: 1 });

  saveCart(cart);
  render();
}

function render() {
  if (!product) {
    container.innerHTML = `<div class="card"><h2>Not found</h2></div>`;
    return;
  }

  const stock = getStock(product.id);

  container.innerHTML = `
    <div class="product-layout">
      <div class="product-media">
        <img class="product-image-large" src="${product.image}">
      </div>

      <div class="product-info">
        <h1>${product.name}</h1>
        <p class="price">$${product.price}</p>
        <p>Stock: ${stock}</p>

        <button class="button-primary" onclick="addToCart('${product.id}')">
          Add to cart
        </button>
      </div>
    </div>
  `;
}

updateCartCount();
render();
</script>

</body>
</html>
