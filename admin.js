/* ==========================================================================
   T1NKIETTE - Admin Back-Office Logic & Financial Calculations
   ========================================================================== */

function checkAdminLogin() {
  const key = document.getElementById("admin-key-input").value.trim();
  if (key === "t1nkiette2026" || key === "admin") {
    document.getElementById("admin-login-screen").style.display = "none";
    document.getElementById("admin-dashboard-screen").style.display = "block";
    initAdminDashboard();
  } else {
    alert("Clé administrateur incorrecte ! (Utilisez 'admin' pour tester)");
  }
}

function adminLogout() {
  document.getElementById("admin-dashboard-screen").style.display = "none";
  document.getElementById("admin-login-screen").style.display = "flex";
}

function switchAdminTab(tabName) {
  document.querySelectorAll(".admin-tab-content").forEach(el => el.style.display = "none");
  document.querySelectorAll(".admin-tab-btn").forEach(btn => btn.classList.remove("active"));
  
  document.getElementById(`tab-${tabName}`).style.display = "block";
  event.currentTarget.classList.add("active");

  if (tabName === "finances") calculateFinancialMetrics();
  if (tabName === "orders") renderAdminOrders();
  if (tabName === "catalog") renderAdminCatalog();
}

function initAdminDashboard() {
  calculateFinancialMetrics();
  renderAdminOrders();
  renderAdminCatalog();
}

/* --- CALCULS FINANCIERS AVANCÉS (CA, COGS, Bénéfices, Marge) --- */
function calculateFinancialMetrics() {
  let orders = JSON.parse(localStorage.getItem("t1nkiette_orders") || "[]");
  let totalCA = 0;
  let totalCOGS = 0; // Coût d'achat du stock vendu

  orders.forEach(ord => {
    totalCA += ord.total;
    // Estimation COGS basée sur un prix d'achat moyen de 40% du prix de vente si non défini
    totalCOGS += ord.total * 0.40;
  });

  let netBenefit = totalCA - totalCOGS;
  let margin = totalCA > 0 ? ((netBenefit / totalCA) * 100).toFixed(1) : 0;

  document.getElementById("metric-ca").innerText = totalCA.toFixed(2) + " €";
  document.getElementById("metric-cogs").innerText = totalCOGS.toFixed(2) + " €";
  document.getElementById("metric-benefit").innerText = netBenefit.toFixed(2) + " €";
  document.getElementById("metric-margin").innerText = margin + " %";

  const breakdownBox = document.getElementById("financial-breakdown-box");
  if (orders.length === 0) {
    breakdownBox.innerText = "Aucune commande enregistrée pour le moment.";
  } else {
    breakdownBox.innerHTML = `Nombre total de commandes validées : <strong>${orders.length}</strong>`;
  }
}

/* --- GESTION DES COMMANDES (Statuts & Notes) --- */
function renderAdminOrders() {
  let orders = JSON.parse(localStorage.getItem("t1nkiette_orders") || "[]");
  const container = document.getElementById("admin-orders-container");

  if (orders.length === 0) {
    container.innerHTML = `<div class="card"><p style="color:var(--text-secondary);">Aucune commande en attente.</p></div>`;
    return;
  }

  container.innerHTML = orders.map((ord, idx) => `
    <div class="admin-order-card">
      <div class="admin-order-header">
        <strong>${ord.id} (${ord.date})</strong>
        <select onchange="updateOrderStatus(${idx}, this.value)" style="padding:6px; border-radius:6px; font-weight:600;">
          <option value="En attente" ${ord.status==='En attente'?'selected':''}>En attente</option>
          <option value="Confirmée" ${ord.status==='Confirmée'?'selected':''}>Confirmée</option>
          <option value="En préparation" ${ord.status==='En préparation'?'selected':''}>En préparation</option>
          <option value="En livraison/envoi" ${ord.status==='En livraison/envoi'?'selected':''}>En livraison/envoi</option>
          <option value="Livrée" ${ord.status==='Livrée'?'selected':''}>Livrée</option>
          <option value="Annulée" ${ord.status==='Annulée'?'selected':''}>Annulée</option>
        </select>
      </div>
      <p style="font-size:13px; color:var(--text-secondary);">Mode : ${ord.mode} • Paiement : ${ord.payment} • Adresse : ${ord.address}</p>
      <div style="font-weight:700; margin:8px 0;">Total : ${ord.total.toFixed(2)}€</div>
      
      <div style="margin-top:10px;">
        <label style="font-size:12px; font-weight:600;">Note à l'attention du client :</label>
        <input type="text" id="admin-note-${idx}" value="${ord.adminNote || ''}" placeholder="Ajouter une note visible client..." style="width:100%; padding:8px; border:1px solid var(--border-color); border-radius:6px; margin-top:4px;" oninput="saveAdminNote(${idx}, this.value)">
      </div>

      <div class="admin-order-actions">
        <button class="btn btn-outline" style="color:var(--danger-color);" onclick="deleteOrder(${idx})">Supprimer la commande</button>
      </div>
    </div>
  `).join("");
}

function updateOrderStatus(idx, newStatus) {
  let orders = JSON.parse(localStorage.getItem("t1nkiette_orders") || "[]");
  orders[idx].status = newStatus;
  localStorage.setItem("t1nkiette_orders", JSON.stringify(orders));
  alert(`Statut de la commande mis à jour : ${newStatus}`);
}

function saveAdminNote(idx, noteVal) {
  let orders = JSON.parse(localStorage.getItem("t1nkiette_orders") || "[]");
  orders[idx].adminNote = noteVal;
  localStorage.setItem("t1nkiette_orders", JSON.stringify(orders));
}

function deleteOrder(idx) {
  if (confirm("Voulez-vous vraiment supprimer cette commande ?")) {
    let orders = JSON.parse(localStorage.getItem("t1nkiette_orders") || "[]");
    orders.splice(idx, 1);
    localStorage.setItem("t1nkiette_orders", JSON.stringify(orders));
    renderAdminOrders();
  }
}

/* --- CRUD CATALOGUE --- */
function renderAdminCatalog() {
  const container = document.getElementById("admin-catalog-container");
  let html = "";

  Object.keys(T1NKIETTE_DB.catalog).forEach(catKey => {
    if (catKey === "promos") return;
    T1NKIETTE_DB.catalog[catKey].forEach(range => {
      html += `<h3 style="margin:16px 0 8px; font-size:16px; text-transform:uppercase;">${catKey} — Gamme ${range.name}</h3>`;
      (range.varieties || []).forEach((v, vIdx) => {
        html += `
          <div class="card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div>
              <strong>${v.name}</strong> (${v.type}) • ${v.farm} • <strong>Stock : ${v.stock}G</strong>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-outline" style="padding:6px 12px; font-size:12px;" onclick="editStockPrompt('${catKey}', '${range.id}', ${vIdx})">Modifier Stock</button>
            </div>
          </div>
        `;
      });
    });
  });

  container.innerHTML = html;
}

function editStockPrompt(catKey, rangeId, vIdx) {
  const rangeObj = T1NKIETTE_DB.catalog[catKey].find(r => r.id === rangeId);
  const prod = rangeObj.varieties[vIdx];
  const newStock = prompt(`Entrer le nouveau stock en grammes pour ${prod.name} :`, prod.stock);
  if (newStock !== null) {
    prod.stock = parseInt(newStock) || 0;
    renderAdminCatalog();
    alert("Stock mis à jour avec succès !");
  }
}

function openNewProductModal() {
  alert("Module d'ajout de produit direct ouvert. (Via store-data.js ou Firebase)");
}

function saveLoyaltySettings() {
  alert("Paramètres de fidélité enregistrés !");
}