/* ==========================================================================
   T1NKIETTE - Catalog Navigation, Gauges, Sorting & Product Details
   ========================================================================== */

let currentCategory = null;
let currentRange = null;
let selectedTierIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  populateFarmFilter();
  updateCartBadge();

  const params = new URLSearchParams(window.location.search);
  const catParam = params.get("category");
  if (catParam) {
    renderCategoryView(catParam);
  } else {
    renderCatalogHome();
  }
});

function getStockLevel(stock) {
  if (stock <= 10) return { level: 1, color: "var(--stock-red)", emoji: "🟥", label: "Critique" };
  if (stock <= 25) return { level: 2, color: "var(--stock-orange)", emoji: "🟧", label: "Limité" };
  if (stock <= 50) return { level: 3, color: "var(--stock-yellow)", emoji: "🟨", label: "Moyen" };
  if (stock <= 100) return { level: 4, color: "var(--stock-green)", emoji: "🟩", label: "Bon" };
  if (stock <= 200) return { level: 5, color: "var(--stock-blue)", emoji: "🟦", label: "Élevé" };
  return { level: 6, color: "var(--stock-purple)", emoji: "🟪", label: "Max" };
}

function renderStockMiniDots(stock) {
  const { level } = getStockLevel(stock);
  const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
  return `<div class="stock-indicator">` +
    colors.map((c, idx) => `<span class="stock-dot ${idx < level ? 'active ' + c : ''}"></span>`).join("") +
    `</div>`;
}

/* --- NIVEAU 1 : SOMMAIRE CATÉGORIES --- */
function renderCatalogHome() {
  currentCategory = null;
  currentRange = null;
  document.getElementById("catalog-breadcrumb").innerText = "Catalogue > Toutes les catégories";
  const view = document.getElementById("catalog-dynamic-view");

  view.innerHTML = `
    <div class="categories-grid">
      ${T1NKIETTE_DB.categories.map(cat => `
        <div class="category-card" onclick="renderCategoryView('${cat.id}')">
          <span class="category-icon">${cat.icon}</span>
          <h3>${cat.name}</h3>
          <p>${cat.description}</p>
        </div>
      `).join("")}
    </div>
  `;
}

/* --- NIVEAU 2 : PAGE CATÉGORIE (Vedettes + Gammes) --- */
function renderCategoryView(catId) {
  currentCategory = catId;
  currentRange = null;
  const catObj = T1NKIETTE_DB.categories.find(c => c.id === catId);
  document.getElementById("catalog-breadcrumb").innerHTML = `<span onclick="renderCatalogHome()">Catalogue</span> > <strong>${catObj ? catObj.name : catId}</strong>`;
  const view = document.getElementById("catalog-dynamic-view");

  if (catId === "promos") {
    view.innerHTML = `
      <div class="card" style="margin-bottom:24px;">
        <h2>🎁 Packs & Promotions Exclusives</h2>
        <p style="color:var(--text-secondary); font-size:14px;">Offres groupées à tarifs préférentiels.</p>
      </div>
      <div class="product-grid">
        ${T1NKIETTE_DB.catalog.promos.map(p => `
          <div class="card">
            <div style="display:flex; justify-content:space-between;">
              <h3>${p.name}</h3>
              <span style="background:var(--danger-color); color:#fff; padding:2px 8px; border-radius:10px; font-size:12px;">${p.discount}</span>
            </div>
            <p style="font-size:13px; color:var(--text-secondary); margin:10px 0;">${p.description}</p>
            <div style="margin:12px 0;">${renderStockMiniDots(p.stock)} <span style="font-size:12px;">(${p.stock} dispo)</span></div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div><del style="color:var(--text-secondary);">${p.priceOriginal}€</del> <strong style="font-size:18px;">${p.pricePromo}€</strong></div>
              <button class="btn" onclick="addProductToCart('${p.name}', '${p.pricePromo}', '1 Pack', 'Pack Promo')">Ajouter</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
    return;
  }

  const ranges = T1NKIETTE_DB.catalog[catId] || [];
  view.innerHTML = `
    <div class="card" style="margin-bottom:24px; display:flex; align-items:center; gap:16px;">
      <span style="font-size:42px;">${catObj.icon}</span>
      <div>
        <h2>${catObj.name}</h2>
        <p style="color:var(--text-secondary); font-size:14px;">${catObj.description}</p>
      </div>
    </div>
    <h3 class="section-title">Gammes disponibles</h3>
    <div class="categories-grid">
      ${ranges.map(r => `
        <div class="category-card" onclick="renderRangeView('${catId}', '${r.id}')">
          <h3>Gamme ${r.name}</h3>
          <p style="color:var(--accent-color); font-weight:600; margin:6px 0;">${r.thcRange}</p>
          <p>${r.priceRange} • ${r.discount}</p>
        </div>
      `).join("")}
    </div>
  `;
}

/* --- NIVEAU 3 : PAGE GAMME (Grille Fiches Produits) --- */
function renderRangeView(catId, rangeId) {
  currentCategory = catId;
  currentRange = rangeId;
  const catObj = T1NKIETTE_DB.categories.find(c => c.id === catId);
  const rangeObj = (T1NKIETTE_DB.catalog[catId] || []).find(r => r.id === rangeId);

  document.getElementById("catalog-breadcrumb").innerHTML = `
    <span onclick="renderCatalogHome()">Catalogue</span> > 
    <span onclick="renderCategoryView('${catId}')">${catObj.name}</span> > 
    <strong>${rangeObj.name}</strong>
  `;

  const view = document.getElementById("catalog-dynamic-view");
  const products = rangeObj.varieties || [];

  view.innerHTML = `
    <h2 class="section-title">${catObj.name} — Gamme ${rangeObj.name} (${rangeObj.thcRange})</h2>
    <div class="product-grid">
      ${products.map((prod, idx) => `
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="height:120px; background:var(--bg-secondary); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:40px; margin-bottom:12px;">
              ${catObj.icon}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h3 style="font-size:16px;">${prod.name}</h3>
              <span style="font-size:12px; font-weight:600; color:var(--accent-color);">${prod.thc}% THC</span>
            </div>
            <p style="font-size:13px; color:var(--text-secondary); margin:4px 0;">${prod.type} • ${prod.farm} ${prod.country}</p>
            <div style="margin:10px 0;">${renderStockMiniDots(prod.stock)}</div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; padding-top:12px; border-top:1px solid var(--border-color);">
            <div>
              <span style="font-size:11px; color:var(--text-secondary);">À partir de</span><br>
              <strong style="font-size:17px;">${prod.tiers[0].price}€</strong> <span style="font-size:12px;">(${prod.tiers[0].qty})</span>
            </div>
            <button class="btn" onclick="renderProductDetail('${catId}', '${rangeId}', ${idx})">En savoir plus</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

/* --- NIVEAU 4 : FICHE PRODUIT DÉTAILLÉE --- */
function renderProductDetail(catId, rangeId, varietyIdx) {
  const catObj = T1NKIETTE_DB.categories.find(c => c.id === catId);
  const rangeObj = (T1NKIETTE_DB.catalog[catId] || []).find(r => r.id === rangeId);
  const prod = rangeObj.varieties[varietyIdx];
  selectedTierIndex = 0;

  document.getElementById("catalog-breadcrumb").innerHTML = `
    <span onclick="renderCatalogHome()">Catalogue</span> > 
    <span onclick="renderCategoryView('${catId}')">${catObj.name}</span> > 
    <span onclick="renderRangeView('${catId}', '${rangeId}')">${rangeObj.name}</span> > 
    <strong>${prod.name}</strong>
  `;

  const stockInfo = getStockLevel(prod.stock);
  const view = document.getElementById("catalog-dynamic-view");

  view.innerHTML = `
    <div class="product-detail-container">
      <!-- 1. Galerie Image / Vidéo -->
      <div class="media-gallery" id="product-media-display">${catObj.icon}</div>
      <div class="media-thumbs">
        <button class="thumb-btn" onclick="document.getElementById('product-media-display').innerHTML='${catObj.icon}'">📸 Photo 1</button>
        <button class="thumb-btn" onclick="document.getElementById('product-media-display').innerHTML='🔍 Macro Trichomes'">🔍 Macro</button>
        <button class="thumb-btn" onclick="document.getElementById('product-media-display').innerHTML='🎥 Vidéo HD (1080p)'">🎥 Vidéo</button>
      </div>

      <!-- 2. Jauge de disponibilité pleine ligne (🟥🟧🟨🟩🟦🟪) -->
      <div style="font-size:12px; font-weight:600; margin-bottom:4px;">Disponibilité : ${stockInfo.emoji} ${stockInfo.label} (${prod.stock}G en stock)</div>
      <div class="full-stock-bar">
        <div class="stock-segment ${stockInfo.level >= 1 ? 'active' : ''}" style="background:var(--stock-red);"></div>
        <div class="stock-segment ${stockInfo.level >= 2 ? 'active' : ''}" style="background:var(--stock-orange);"></div>
        <div class="stock-segment ${stockInfo.level >= 3 ? 'active' : ''}" style="background:var(--stock-yellow);"></div>
        <div class="stock-segment ${stockInfo.level >= 4 ? 'active' : ''}" style="background:var(--stock-green);"></div>
        <div class="stock-segment ${stockInfo.level >= 5 ? 'active' : ''}" style="background:var(--stock-blue);"></div>
        <div class="stock-segment ${stockInfo.level >= 6 ? 'active' : ''}" style="background:var(--stock-purple);"></div>
      </div>

      <!-- 3. Sélecteur de modèle / variété (met à jour dynamiquement la fiche) -->
      ${rangeObj.varieties.length > 1 ? `
        <div style="font-size:13px; font-weight:600; margin-bottom:8px;">Choisir la variété / modèle :</div>
        <div class="variety-selector">
          ${rangeObj.varieties.map((v, i) => `
            <div class="variety-chip ${i === varietyIdx ? 'selected' : ''}" onclick="renderProductDetail('${catId}', '${rangeId}', ${i})">${v.name}</div>
          `).join("")}
        </div>
      ` : ''}

      <!-- 4. Fabricant, Spécification & Liens rapides -->
      <h2 style="font-size:24px; margin-bottom:4px;">${prod.name} — <span style="color:var(--text-secondary); font-weight:400;">${prod.type}</span></h2>
      <div style="font-size:14px; font-weight:600; margin-bottom:10px;">
        Farm : ${prod.farm} ${prod.country} • Taux : ${prod.thc}% THC
      </div>
      <div style="display:flex; gap:14px; flex-wrap:wrap; font-size:12px; color:var(--accent-color); margin-bottom:16px;">
        <span style="cursor:pointer; text-decoration:underline;" onclick="openModal('horaires-modal')">🚚 Modalités de réception</span>
        <span style="cursor:pointer; text-decoration:underline;" onclick="window.location.href='community.html#warranty'">🛡️ Garantie incluse</span>
        <span style="cursor:pointer; text-decoration:underline;" onclick="window.location.href='loyalty.html'">💎 +${prod.tiers[0].price * 2} pts fidélité</span>
      </div>

      <!-- 5. Description -->
      <p style="font-size:14px; color:var(--text-secondary); line-height:1.5; margin-bottom:20px;">
        Sélection ${prod.type} cultivée et affinée par ${prod.farm} (${prod.country}). Profil terpénique préservé, contrôle qualité strict et tarification dégressive automatique selon la quantité sélectionnée.
      </p>

      <!-- 6. Les 3 Jauges Techniques -->
      <div style="background:var(--bg-secondary); padding:16px; border-radius:12px; margin-bottom:20px;">
        <!-- Jauge 1 : THC (Blanc -> Or) -->
        <div class="tech-gauge-container">
          <div class="gauge-label"><span>Taux de THC</span><span>${prod.thc}%</span></div>
          <div class="gauge-bar"><div class="gauge-fill white-gold" style="width:${Math.min(prod.thc, 100)}%;"></div></div>
        </div>
        <!-- Jauge 2 : Sativa / Indica (Bleu -> Vert) -->
        <div class="tech-gauge-container">
          <div class="gauge-label"><span>Sativa ${prod.sativaIndica[0]}%</span><span>Indica ${prod.sativaIndica[1]}%</span></div>
          <div class="gauge-bar"><div class="gauge-fill blue-green" style="width:100%;"></div></div>
        </div>
        <!-- Jauge 3 : Euphorisant / Relaxant (Violet -> Rouge) -->
        <div class="tech-gauge-container">
          <div class="gauge-label"><span>Euphorisant ${prod.euphoricRelaxed[0]}%</span><span>Relaxant ${prod.euphoricRelaxed[1]}%</span></div>
          <div class="gauge-bar"><div class="gauge-fill purple-red" style="width:100%;"></div></div>
        </div>
      </div>

      <!-- 7. Notes spécifiques au modèle -->
      <div style="font-size:13px; padding:12px; border-left:3px solid var(--text-primary); background:var(--bg-secondary); margin-bottom:20px;">
        <strong>Notes du modèle (${prod.name}) :</strong> Arômes intenses, combustion propre, affinage optimal certifié par ${prod.farm}.
      </div>

      <!-- 8. Tarifs dégressifs & Ajout Panier -->
      <h3 style="font-size:16px; margin-bottom:8px;">Sélectionner un palier (${rangeObj.discount}) :</h3>
      <div class="tiers-grid" id="product-tiers-grid">
        ${prod.tiers.map((t, idx) => `
          <div class="tier-card ${idx === 0 ? 'selected' : ''}" onclick="selectTier(this, ${idx})">
            <div style="font-weight:700; font-size:15px;">${t.qty}</div>
            <div style="color:var(--accent-color); font-weight:600; font-size:14px;">${t.price}€</div>
          </div>
        `).join("")}
      </div>

      <div style="display:flex; gap:12px; margin-top:20px;">
        <button class="btn" style="flex:1; padding:14px; font-size:16px;" onclick="confirmAddProduct('${prod.name}', '${prod.farm}', ${JSON.stringify(prod.tiers).replace(/"/g, '&quot;')})">
          🛒 Ajouter au panier
        </button>
        <button class="btn btn-outline" onclick="toggleFavorite('${prod.name}')">⭐ Favoris</button>
      </div>
    </div>
  `;
}

function selectTier(el, idx) {
  selectedTierIndex = idx;
  document.querySelectorAll(".tier-card").forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
}

function confirmAddProduct(name, farm, tiers) {
  const tier = tiers[selectedTierIndex];
  addProductToCart(name, tier.price, tier.qty, farm);
}

function addProductToCart(name, price, qtyLabel, farm) {
  let cart = JSON.parse(localStorage.getItem("t1nkiette_cart") || "[]");
  cart.push({ id: Date.now(), name, price: parseFloat(price), qtyLabel, farm });
  localStorage.setItem("t1nkiette_cart", JSON.stringify(cart));
  updateCartBadge();
  alert(`${name} (${qtyLabel} - ${price}€) ajouté au panier !`);
}

function toggleFavorite(name) {
  let favs = JSON.parse(localStorage.getItem("t1nkiette_favs") || "[]");
  if (!favs.includes(name)) {
    favs.push(name);
    localStorage.setItem("t1nkiette_favs", JSON.stringify(favs));
    alert(`${name} ajouté à vos favoris !`);
  } else {
    alert(`${name} est déjà dans vos favoris.`);
  }
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("t1nkiette_cart") || "[]");
  const badge = document.getElementById("cart-badge");
  if (badge) badge.innerText = cart.length;
}

/* --- PARTENAIRES POP-UP --- */
function populateFarmFilter() {
  const select = document.getElementById("farm-filter");
  if (!select) return;
  const allFarms = new Set();
  Object.values(T1NKIETTE_DB.partners).forEach(list => list.forEach(f => allFarms.add(f)));
  allFarms.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.innerText = f;
    select.appendChild(opt);
  });
}

function openPartnersModal() {
  const body = document.getElementById("partners-modal-body");
  let html = "";
  for (const [cat, list] of Object.entries(T1NKIETTE_DB.partners)) {
    html += `<h4 style="text-transform:uppercase; margin:12px 0 6px; font-size:13px; color:var(--text-secondary);">${cat}</h4>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">
        ${list.map(p => `<span class="variety-chip" onclick="filterByPartner('${p}')">${p}</span>`).join("")}
      </div>`;
  }
  body.innerHTML = html;
  openModal("partners-modal");
}

function filterByPartner(partnerName) {
  closeModal("partners-modal");
  const cleanName = partnerName.split(" ")[0];
  document.getElementById("catalog-search").value = cleanName;
  filterCatalogProducts();
}

function openFavoritesModal() {
  const favs = JSON.parse(localStorage.getItem("t1nkiette_favs") || "[]");
  const body = document.getElementById("favorites-modal-body");
  if (favs.length === 0) {
    body.innerHTML = "<p style='color:var(--text-secondary); font-size:14px;'>Aucun produit favori enregistré.</p>";
  } else {
    body.innerHTML = favs.map(f => `<div class="stock-row"><strong>⭐ ${f}</strong><button class="btn btn-outline" onclick="closeModal('favorites-modal')">Voir</button></div>`).join("");
  }
  openModal("favorites-modal");
}

/* --- FILTRE & TRI GLOBAL --- */
function filterCatalogProducts() {
  const query = document.getElementById("catalog-search").value.toLowerCase();
  const sortType = document.getElementById("sort-select").value;
  const farmFilter = document.getElementById("farm-filter").value;

  let results = [];
  T1NKIETTE_DB.categories.forEach(cat => {
    if (cat.id === "promos") return;
    (T1NKIETTE_DB.catalog[cat.id] || []).forEach(range => {
      (range.varieties || []).forEach((v, idx) => {
        results.push({ ...v, catId: cat.id, catIcon: cat.icon, rangeId: range.id, rangeName: range.name, idx });
      });
    });
  });

  if (query) {
    results = results.filter(p => (p.name + " " + p.farm + " " + p.type).toLowerCase().includes(query));
  }
  if (farmFilter !== "all") {
    results = results.filter(p => farmFilter.includes(p.farm));
  }

  // Tris
  if (sortType === "price-asc") results.sort((a, b) => a.tiers[0].price - b.tiers[0].price);
  if (sortType === "price-desc") results.sort((a, b) => b.tiers[0].price - a.tiers[0].price);
  if (sortType === "thc-asc") results.sort((a, b) => a.thc - b.thc);
  if (sortType === "thc-desc") results.sort((a, b) => b.thc - a.thc);
  if (sortType === "stock-asc") results.sort((a, b) => a.stock - b.stock);
  if (sortType === "stock-desc") results.sort((a, b) => b.stock - a.stock);
  if (sortType === "farm") results.sort((a, b) => a.farm.localeCompare(b.farm));

  const view = document.getElementById("catalog-dynamic-view");
  view.innerHTML = `
    <h3 class="section-title">Résultats filtrés (${results.length})</h3>
    <div class="product-grid">
      ${results.map(prod => `
        <div class="card">
          <h4>${prod.catIcon} ${prod.name}</h4>
          <p style="font-size:13px; color:var(--text-secondary);">${prod.farm} ${prod.country} • ${prod.thc}% THC</p>
          <div style="margin:8px 0;">${renderStockMiniDots(prod.stock)}</div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
            <strong>${prod.tiers[0].price}€ (${prod.tiers[0].qty})</strong>
            <button class="btn" onclick="renderProductDetail('${prod.catId}', '${prod.rangeId}', ${prod.idx})">Voir</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}