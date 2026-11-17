/* ==========================================================================
   T1NKIETTE - Home Page & UI Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderHomeCategories();
  renderFeaturedProducts();
  renderHomePromos();
  renderHeroCarousel();
  renderDrawerLinks();
  renderModalStocks();
});

/* --- RENDER HOME CATEGORIES --- */
function renderHomeCategories() {
  const grid = document.getElementById("home-categories-grid");
  if (!grid) return;
  
  grid.innerHTML = T1NKIETTE_DB.categories.map(cat => `
    <div class="category-card" onclick="window.location.href='catalog.html?category=${cat.id}'">
      <span class="category-icon">${cat.icon}</span>
      <h3>${cat.name}</h3>
      <p>${cat.description}</p>
    </div>
  `).join("");
}

/* --- RENDER FEATURED PRODUCTS --- */
function renderFeaturedProducts() {
  const grid = document.getElementById("featured-products-grid");
  if (!grid) return;

  // Extrait quelques produits phares du catalogue
  let featured = [];
  Object.values(T1NKIETTE_DB.catalog).forEach(catList => {
    catList.forEach(range => {
      if (range.varieties && range.varieties.length > 0) {
        featured.push({ ...range.varieties[0], categoryName: range.name });
      }
    });
  });

  grid.innerHTML = featured.slice(0, 4).map(prod => `
    <div class="card" style="min-width: 240px; cursor: pointer;" onclick="window.location.href='catalog.html'">
      <div style="font-weight: 600; font-size: 15px; margin-bottom: 4px;">${prod.name}</div>
      <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">${prod.farm} ${prod.country} • ${prod.thc}% THC</div>
      <div style="font-weight: 700; color: var(--accent-color);">${prod.tiers[0].price}€ (${prod.tiers[0].qty})</div>
    </div>
  `).join("");
}

/* --- RENDER HOME PROMOS --- */
function renderHomePromos() {
  const grid = document.getElementById("home-promos-grid");
  if (!grid) return;

  const promos = T1NKIETTE_DB.catalog.promos || [];
  grid.innerHTML = promos.map(promo => `
    <div class="card" style="border: 2px solid var(--accent-color);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
        <h3 style="font-size: 16px; font-weight:600;">${promo.name}</h3>
        <span style="background:var(--danger-color); color:#fff; font-size:12px; font-weight:700; padding:2px 8px; border-radius:10px;">${promo.discount}</span>
      </div>
      <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">${promo.description}</p>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="text-decoration: line-through; color: var(--text-secondary); font-size: 13px; margin-right: 8px;">${promo.priceOriginal}€</span>
          <span style="font-size: 18px; font-weight: 700; color: var(--text-primary);">${promo.pricePromo}€</span>
        </div>
        <button class="btn" onclick="addToCartPromo('${promo.id}')">Ajouter</button>
      </div>
    </div>
  `).join("");
}

/* --- HERO CAROUSEL (Max 5 slides) --- */
function renderHeroCarousel() {
  const track = document.getElementById("hero-track");
  if (!track) return;

  const slides = [
    { title: "T1NKIETTE — Collection Premium 2026", desc: "Découvrez nos nouvelles variétés Légendaires et résines Lux.", bg: "#1D1D1F", link: "catalog.html" },
    { title: "Packs Promo Exclusifs", desc: "Profitez du Pack Conso et du Pack Fumeurs à prix réduits.", bg: "#2C2C2E", link: "catalog.html?category=promos" },
    { title: "Programme Fidélité Avancé", desc: "1€ dépensé = 2 points. Échangez vos points contre des produits cadeaux.", bg: "#3A3A3C", link: "loyalty.html" },
    { title: "Stocks en Temps Réel & Arrivages", desc: "Suivez l'état des stocks en direct et anticipez les prochains arrivages.", bg: "#48484A", link: "news.html" },
    { title: "Service Professionnel & Assistance", desc: "Un accompagnement sur-mesure et une messagerie multi-services dédiée.", bg: "#636366", link: "messaging.html" }
  ];

  track.innerHTML = slides.map((slide, idx) => `
    <div class="carousel-slide" style="background-color: ${slide.bg}; cursor:pointer;" onclick="window.location.href='${slide.link}'">
      <div class="carousel-content">
        <h2>${slide.title}</h2>
        <p>${slide.desc}</p>
        <span style="font-size: 13px; text-decoration: underline; font-weight: 500;">En savoir plus →</span>
      </div>
    </div>
  `).join("");
}

/* --- MODALS & DRAWER LOGIC --- */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "flex";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

function openSommaireDrawer() {
  const drawer = document.getElementById("sommaire-drawer");
  if (drawer) drawer.style.display = "flex";
}

function closeSommaireDrawer() {
  const drawer = document.getElementById("sommaire-drawer");
  if (drawer) drawer.style.display = "none";
}

function renderDrawerLinks() {
  const container = document.getElementById("drawer-links-container");
  if (!container) return;

  const links = [
    { name: "Accueil", url: "index.html" },
    { name: "Catalogue Complet", url: "catalog.html" },
    { name: "Nouvelles & Arrivages", url: "news.html" },
    { name: "Sondages", url: "news.html#polls" },
    { name: "Communauté & Règlement", url: "community.html" },
    { name: "Programme Fidélité & Récompenses", url: "loyalty.html" },
    { name: "Panier & Commande", url: "cart.html" },
    { name: "Mes Commandes", url: "account.html#orders" },
    { name: "Mon Compte", url: "account.html" },
    { name: "Messagerie (4 Services)", url: "messaging.html" },
    { name: "Aide / FAQ", url: "community.html#faq" }
  ];

  container.innerHTML = links.map(l => `<a href="${l.url}">${l.name}</a>`).join("");
}

/* --- REALTIME STOCKS MODAL LIST --- */
function renderModalStocks(filterText = "", levelFilter = "all") {
  const container = document.getElementById("modal-stocks-list");
  if (!container) return;

  let allItems = [];
  Object.keys(T1NKIETTE_DB.catalog).forEach(catKey => {
    if (catKey === "promos") {
      T1NKIETTE_DB.catalog.promos.forEach(p => {
        allItems.push({ name: p.name, farm: "Pack T1NKIETTE", stock: p.stock, unit: "u" });
      });
    } else {
      T1NKIETTE_DB.catalog[catKey].forEach(range => {
        if (range.varieties) {
          range.varieties.forEach(v => {
            allItems.push({ name: `${v.name} (${v.type})`, farm: `${v.farm} ${v.country}`, stock: v.stock, unit: "G" });
          });
        }
      });
    }
  });

  // Filtrage
  let filtered = allItems.filter(item => {
    const matchText = (item.name + " " + item.farm).toLowerCase().includes(filterText.toLowerCase());
    return matchText;
  });

  container.innerHTML = filtered.map(item => `
    <div class="stock-row">
      <div>
        <strong>${item.name}</strong><br>
        <span style="font-size:12px; color:var(--text-secondary);">${item.farm}</span>
      </div>
      <div style="font-weight:600;">${item.stock} ${item.unit}</div>
    </div>
  `).join("");
}

function filterModalStocks() {
  const text = document.getElementById("stock-search-input").value;
  renderModalStocks(text);
}

/* --- GPS & ACTIONS --- */
function copyStoreAddress() {
  navigator.clipboard.writeText("Boutique T1NKIETTE, 65350 Bouilh-Péreuilh, France");
  alert("Adresse copiée dans le presse-papier !");
}

function openWaze() {
  window.open("https://www.waze.com/ul?ll=43.25,0.15&navigate=yes", "_blank");
}

function openGoogleMaps() {
  window.open("https://www.google.com/maps/search/?api=1&query=Bouilh-Pereuilh+65350", "_blank");
}

function addToCartPromo(promoId) {
  alert("Pack ajouté au panier avec succès !");
}

function handleGlobalSearch(query) {
  if (query.length > 2) {
    // Redirection ou affichage instantané des résultats
  }
}
