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

    // ================= PRODUCT DATA =================
    const PRODUCTS = [
  // ================= SUNQ =================
  { id: "s1", name: "SUNQ A", price: 9.99, category: "sunq" },
  { id: "s2", name: "SUNQ B", price: 19.99, category: "sunq" },
  { id: "s3", name: "SUNQ C", price: 29.99, category: "sunq" },
  { id: "s4", name: "SUNQ D", price: 39.99, category: "sunq" },
  { id: "s5", name: "SUNQ E", price: 49.99, category: "sunq" },

  // ================= JET =================
  { id: "j1", name: "JET F", price: 9.99, category: "jet" },
  { id: "j2", name: "JET G", price: 19.99, category: "jet" },
  { id: "j3", name: "JET H", price: 29.99, category: "jet" },
  { id: "j4", name: "JET I", price: 39.99, category: "jet" },
  { id: "j5", name: "JET J", price: 49.99, category: "jet" }
    };

    // ================= GET PRODUCT ID =================
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id")?.trim();

    const product = PRODUCTS[id];
    const container = document.getElementById("product-container");

    console.log("Requested ID:", id);
    console.log("Available products:", Object.keys(PRODUCTS));

    // ================= ADD TO CART =================
    function addToCart(id) {
      const cart = getCart();
      const item = cart.find(i => i.id === id);

      if (item) item.quantity += 1;
      else cart.push({ id, quantity: 1 });

      saveCart(cart);
    }

    // ================= RENDER =================
    function renderProduct() {

      if (!product) {
        container.innerHTML = `
          <div class="product-layout">
            <h2>Item not found</h2>
            <p style="opacity:0.7;">This product does not exist or the link is incorrect.</p>
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
              A curated product from SUNQS MARKET. Clean, minimal, and intentionally designed.
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
