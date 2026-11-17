/* ==========================================================================
   T1NKIETTE - Cart, Saved for Later & Checkout Logic
   ========================================================================== */

let promoDiscountPercent = 0;

document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
});

function renderCartPage() {
  const cart = JSON.parse(localStorage.getItem("t1nkiette_cart") || "[]");
  const saved = JSON.parse(localStorage.getItem("t1nkiette_saved") || "[]");
  const favs = JSON.parse(localStorage.getItem("t1nkiette_favs") || "[]");

  const cartContainer = document.getElementById("cart-items-list");
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<div class="card"><p style="color:var(--text-secondary);">Votre panier est actuellement vide.</p></div>`;
  } else {
    cartContainer.innerHTML = cart.map((item, idx) => {
      total += item.price;
      return `
        <div class="card" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>${item.name}</strong> (${item.qtyLabel})<br>
            <span style="font-size:12px; color:var(--text-secondary);">${item.farm}</span>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <strong>${item.price}€</strong>
            <button class="btn btn-outline" style="padding:6px 10px; font-size:12px;" onclick="saveForLater(${idx})">Mettre de côté</button>
            <button class="btn btn-outline" style="padding:6px 10px; font-size:12px; color:var(--danger-color);" onclick="removeFromCart(${idx})">✕</button>
          </div>
        </div>
      `;
    }).join("");
  }

  document.getElementById("cart-total-amount").innerText = total.toFixed(2);

  // Produits mis de côté
  const savedContainer = document.getElementById("saved-later-list");
  if (saved.length === 0) {
    savedContainer.innerHTML = `<p style="font-size:13px; color:var(--text-secondary);">Aucun produit mis de côté.</p>`;
  } else {
    savedContainer.innerHTML = saved.map((item, idx) => `
      <div class="stock-row">
        <span><strong>${item.name}</strong> (${item.qtyLabel}) — ${item.price}€</span>
        <button class="btn" style="padding:6px 12px; font-size:12px;" onclick="moveBackToCart(${idx})">+ Ajouter au panier</button>
      </div>
    `).join("");
  }

  // Produits favoris
  const favContainer = document.getElementById("cart-favorites-list");
  if (favs.length === 0) {
    favContainer.innerHTML = `<p style="font-size:13px; color:var(--text-secondary);">Aucun produit favori.</p>`;
  } else {
    favContainer.innerHTML = favs.map(name => `
      <div class="stock-row">
        <span>⭐ <strong>${name}</strong></span>
        <button class="btn btn-outline" style="padding:6px 12px; font-size:12px;" onclick="quickAddFavToCart('${name}')">+ Panier (10G - 40€)</button>
      </div>
    `).join("");
  }
}

function saveForLater(idx) {
  let cart = JSON.parse(localStorage.getItem("t1nkiette_cart") || "[]");
  let saved = JSON.parse(localStorage.getItem("t1nkiette_saved") || "[]");
  const [item] = cart.splice(idx, 1);
  saved.push(item);
  localStorage.setItem("t1nkiette_cart", JSON.stringify(cart));
  localStorage.setItem("t1nkiette_saved", JSON.stringify(saved));
  renderCartPage();
}

function moveBackToCart(idx) {
  let cart = JSON.parse(localStorage.getItem("t1nkiette_cart") || "[]");
  let saved = JSON.parse(localStorage.getItem("t1nkiette_saved") || "[]");
  const [item] = saved.splice(idx, 1);
  cart.push(item);
  localStorage.setItem("t1nkiette_cart", JSON.stringify(cart));
  localStorage.setItem("t1nkiette_saved", JSON.stringify(saved));
  renderCartPage();
}

function removeFromCart(idx) {
  let cart = JSON.parse(localStorage.getItem("t1nkiette_cart") || "[]");
  cart.splice(idx, 1);
  localStorage.setItem("t1nkiette_cart", JSON.stringify(cart));
  renderCartPage();
}

function quickAddFavToCart(name) {
  let cart = JSON.parse(localStorage.getItem("t1nkiette_cart") || "[]");
  cart.push({ id: Date.now(), name, price: 40, qtyLabel: "10G", farm: "Favori" });
  localStorage.setItem("t1nkiette_cart", JSON.stringify(cart));
  renderCartPage();
}

function toggleAddressField() {
  const mode = document.querySelector('input[name="delivery-mode"]:checked').value;
  const addrCard = document.getElementById("checkout-address-card");
  addrCard.style.display = (mode === "Livraison" || mode === "Envoi") ? "block" : "none";
}

function goToCheckout() {
  const cart = JSON.parse(localStorage.getItem("t1nkiette_cart") || "[]");
  if (cart.length === 0) {
    alert("Votre panier est vide !");
    return;
  }
  toggleAddressField();
  document.getElementById("cart-step-1").style.display = "none";
  document.getElementById("cart-step-2").style.display = "block";
  updateCheckoutSummary();
}

function backToCart() {
  document.getElementById("cart-step-2").style.display = "none";
  document.getElementById("cart-step-1").style.display = "block";
}

function applyPromoCode() {
  const code = document.getElementById("promo-code-input").value.trim().toUpperCase();
  const feedback = document.getElementById("promo-feedback");
  if (code === "T1NKIETTE10") {
    promoDiscountPercent = 10;
    feedback.innerText = "Code promo appliqué : -10% sur la commande !";
  } else {
    promoDiscountPercent = 0;
    feedback.innerText = "Code promo invalide ou expiré.";
  }
  updateCheckoutSummary();
}

function updateCheckoutSummary() {
  const cart = JSON.parse(localStorage.getItem("t1nkiette_cart") || "[]");
  const mode = document.querySelector('input[name="delivery-mode"]:checked').value;
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const finalTotal = subtotal * (1 - promoDiscountPercent / 100);
  const pointsEarned = Math.floor(finalTotal * T1NKIETTE_DB.settings.loyaltyRatio);

  document.getElementById("checkout-summary-details").innerHTML = `
    <p>Articles (${cart.length}) : ${subtotal.toFixed(2)}€</p>
    <p>Mode de réception : <strong>${mode}</strong></p>
    <p>Points fidélité gagnés : <strong>+${pointsEarned} pts</strong></p>
  `;
  document.getElementById("final-pay-amount").innerText = finalTotal.toFixed(2);
}

function submitOrder() {
  const cart = JSON.parse(localStorage.getItem("t1nkiette_cart") || "[]");
  const mode = document.querySelector('input[name="delivery-mode"]:checked').value;
  const payment = document.querySelector('input[name="payment-method"]:checked').value;
  const address = document.getElementById("delivery-address-input").value;

  if ((mode === "Livraison" || mode === "Envoi") && !address.trim()) {
    alert("Veuillez renseigner votre adresse de livraison / d'envoi.");
    return;
  }

  const finalTotal = parseFloat(document.getElementById("final-pay-amount").innerText);
  const pointsEarned = Math.floor(finalTotal * T1NKIETTE_DB.settings.loyaltyRatio);

  let orders = JSON.parse(localStorage.getItem("t1nkiette_orders") || "[]");
  orders.unshift({
    id: "CMD-" + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString("fr-FR"),
    timestamp: Date.now(),
    items: cart,
    total: finalTotal,
    mode,
    payment,
    address: address || "Retrait sur place",
    status: "En attente",
    adminNote: ""
  });

  localStorage.setItem("t1nkiette_orders", JSON.stringify(orders));

  // Mise à jour des points de fidélité
  let currentPts = parseInt(localStorage.getItem("t1nkiette_points") || "0");
  localStorage.setItem("t1nkiette_points", currentPts + pointsEarned);

  // Vider le panier
  localStorage.setItem("t1nkiette_cart", "[]");
  alert(`Commande validée ! Vous avez gagné +${pointsEarned} points de fidélité.`);
  window.location.href = "account.html#orders";
}