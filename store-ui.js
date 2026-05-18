function getCart() {
  return JSON.parse(localStorage.getItem("sunqCart")) || [];
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.quantity, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = total;
}

function renderCard(product) {
  const stock = getStock(product.id);

  return `
    <a class="card fade" href="product.html?id=${product.id}">
      <div class="card-image"></div>
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <p style="opacity:0.6; font-size:12px;">Stock: ${stock}</p>
    </a>
  `;
}

function renderGrid(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="grid">
      ${products.map(renderCard).join("")}
    </div>
  `;
}
