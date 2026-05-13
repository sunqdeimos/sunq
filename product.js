<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product | SUNQ</title>
  <link rel="stylesheet" href="styles.css">
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

  <main class="product-page">

    <div id="product-container"></div>

  </main>

  <script>
    // ================= CART =================
    function getCart() {
      return JSON.parse(localStorage.getItem("sunqCart")) || [];
    }

    function updateCartCount() {
      const cart = getCart();
      const total = cart.reduce((sum, i) => sum + i.quantity, 0);
      const el = document.getElementById("cart-count");
      if (el) el.textContent = total;
    }

    function saveCart(cart) {
      localStorage.setItem("sunqCart", JSON.stringify(cart));
      updateCartCount();
    }

    // ================= PRODUCTS =================
    const PRODUCTS = {
      s1: { id: "s1", name: "SUNQ Alpha", price: 29.99 },
      s2: { id: "s2", name: "SUNQ Nova", price: 39.99 },
      s3: { id: "s3", name: "SUNQ Core", price: 24.99 },
      s4: { id: "s4", name: "SUNQ Pulse", price: 44.99 },
      s5: { id: "s5", name: "SUNQ Edge", price: 59.99 },

      j1: { id: "j1", name: "JET Strike", price: 34.99 },
      j2: { id: "j2", name: "JET Velocity", price: 49.99 },
      j3: { id: "j3", name: "JET Flux", price: 27.99 },
      j4: { id: "j4", name: "JET Aero", price: 64.99 },
      j5: { id: "j5", name: "JET Prime", price: 79.99 }
    };

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const product = PRODUCTS[id];
    const container = document.getElementById("product-container");

    function addToCart(id) {
      const cart = getCart();
      const item = cart.find(i => i.id === id);

      if (item) item.quantity += 1;
      else cart.push({ id, quantity: 1 });

      saveCart(cart);
    }

    function renderProduct() {
      if (!product) {
        container.innerHTML = `
          <div class="product-layout">
            <h2>Item not found</h2>
            <a class="button-primary" href="shop.html">Back to shop</a>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="product-layout">

          <div class="product-media">
            <div class="product-image-large"></div>
          </div>

          <div class="product-info">
            <h1>${product.name}</h1>
            <p class="price">$${product.price}</p>

            <p class="description">
              A curated product from SUNQS MARKET. Minimal, clean, intentional.
            </p>

            <button class="button-primary" onclick="addToCart('${product.id}')">
              Add to cart
            </button>

            <div class="meta">
              <p>✔ Secure checkout (demo)</p>
              <p>✔ Limited availability</p>
            </div>
          </div>

        </div>

        <section class="recommendations">
          <h2>You may also like</h2>

          <div class="grid small">
            ${Object.values(PRODUCTS)
              .filter(p => p.id !== product.id)
              .map(p => `
                <div class="card fade">
                  <div class="card-image"></div>
                  <h3>${p.name}</h3>
                  <p>$${p.price}</p>
                  <a class="button-primary" href="product.html?id=${p.id}">
                    View
                  </a>
                </div>
              `).join("")}
          </div>

        </section>
      `;
    }

    updateCartCount();
    renderProduct();
  </script>

</body>
</html>
