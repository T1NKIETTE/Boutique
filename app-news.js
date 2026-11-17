/* ==========================================================================
   T1NKIETTE - News, Arrivals & Polls Logic
   ========================================================================== */

const newsData = [
  { id: 1, title: "Ouverture des sélections Privées Legend", type: "Fonctionnement", date: "2026-11-15", text: "Les nouvelles variétés Private Reserve sont désormais disponibles en formats once et lots exclusifs.", fav: false },
  { id: 2, title: "Arrivage massif Ice O Lator Lux", type: "Arrivage", date: "2026-11-10", text: "Le lot tant attendu de Nepal Cream est arrivé dans les stocks principaux avec jauge maximale.", fav: false },
  { id: 3, title: "Rupture temporaire California Mid Shelf", type: "Rupture", date: "2026-11-05", text: "Forte demande sur la Tropicana Cherry. Réapprovisionnement prévu sous 48h.", fav: false },
  { id: 4, title: "Mise à jour du programme fidélité 2.0", type: "Fonctionnement", date: "2026-10-28", text: "1€ dépensé donne désormais droit à 2 points, avec un seuil de réduction abaissé.", fav: false }
];

const arrivalsData = [
  { name: "Cali Top Shelf — Zkittlez Cake 🍰", farm: "ESC Farm 🇪🇸", thc: "32% THC", price: "120€ / 10G", stock: "150G", progress: 85, timeText: "Arrivage dans 4 heures" },
  { name: "Static Sift Single Source ⚡", farm: "Honey Mountains 🇲🇦", thc: "+65% THC", price: "110€ / 10G", stock: "100G", progress: 45, timeText: "Arrivage dans 2 jours" }
];

let activePoll = {
  question: "Quelle prochaine catégorie aimeriez-vous voir arriver en priorité ?",
  options: [
    { text: "Plus de résines Static Sift ⚡", votes: 142 },
    { text: "Gamme Living Soil Indoor 🌱", votes: 98 },
    { text: "Vapes Dual Chamber 2G 💨", votes: 215 }
  ],
  voted: false
};

document.addEventListener("DOMContentLoaded", () => {
  renderNews();
  renderArrivals();
  renderPoll();
  updateCartBadge();
});

function renderNews() {
  const container = document.getElementById("latest-news-container");
  const olderContainer = document.getElementById("older-news-container");
  if (!container) return;

  container.innerHTML = newsData.slice(0, 2).map(n => renderNewsCard(n, true)).renderFeatured ? "" : newsData.slice(0, 2).map(n => renderNewsCard(n, true)).join("");
  olderContainer.innerHTML = newsData.slice(2).map(n => renderNewsCard(n, false)).join("");
}

function renderNewsCard(n, isLarge) {
  return `
    <div class="card" style="${isLarge ? 'border-left: 4px solid var(--accent-color);' : ''}">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-size:11px; text-transform:uppercase; font-weight:700; color:var(--text-secondary);">${n.type} • ${n.date}</span>
        <button class="icon-btn" onclick="toggleNewsFav(${n.id})" style="font-size:16px;">${n.fav ? '⭐' : '☆'}</button>
      </div>
      <h3 style="font-size:${isLarge ? '18px' : '15px'}; margin-bottom:6px;">${n.title}</h3>
      <p style="font-size:13px; color:var(--text-secondary);">${n.text}</p>
    </div>
  `;
}

function toggleNewsFav(id) {
  const item = newsData.find(n => n.id === id);
  if (item) {
    item.fav = !item.fav;
    renderNews();
  }
}

function renderArrivals() {
  const container = document.getElementById("arrivals-container");
  if (!container) return;

  container.innerHTML = arrivalsData.map(a => `
    <div style="border-bottom:1px solid var(--border-color); padding-bottom:12px;">
      <div style="display:flex; justify-content:space-between; font-weight:600; font-size:14px; margin-bottom:4px;">
        <span>${a.name}</span>
        <span style="color:var(--accent-color);">${a.price}</span>
      </div>
      <div style="font-size:12px; color:var(--text-secondary); margin-bottom:6px;">${a.farm} • ${a.thc} • Stock prévu : ${a.stock}</div>
      <div style="font-size:11px; font-weight:600; display:flex; justify-content:space-between;">
        <span>${a.timeText}</span>
        <span>${a.progress}%</span>
      </div>
      <div class="time-gauge-bar"><div class="time-gauge-fill" style="width:${a.progress}%;"></div></div>
    </div>
  `).join("");
}

function renderPoll() {
  const container = document.getElementById("active-poll-container");
  if (!container) return;

  const totalVotes = activePoll.options.reduce((sum, o) => sum + o.votes, 0);

  container.innerHTML = `
    <p style="font-weight:600; font-size:15px; margin-bottom:14px;">${activePoll.question}</p>
    <div id="poll-options-box">
      ${activePoll.options.map((opt, idx) => {
        const percent = Math.round((opt.votes / totalVotes) * 100);
        return `
          <div class="poll-option" onclick="votePoll(${idx})">
            <span>${opt.text}</span>
            <span style="font-weight:700;">${activePoll.voted ? percent + '%' : 'Voter'}</span>
          </div>
        `;
      }).join("")}
    </div>
    <p style="font-size:12px; color:var(--text-secondary); margin-top:10px; text-align:right;">Total des votes : ${totalVotes}</p>
  `;
}

function votePoll(idx) {
  if (activePoll.voted) return;
  activePoll.options[idx].votes += 1;
  activePoll.voted = true;
  renderPoll();
  alert("Merci pour votre vote ! Les résultats sont désormais affichés.");
}

function openNewsFavoritesModal() {
  const favs = newsData.filter(n => n.fav);
  const container = document.getElementById("news-favorites-list");
  if (favs.length === 0) {
    container.innerHTML = `<p style="font-size:13px; color:var(--text-secondary);">Aucune nouvelle mise en favoris.</p>`;
  } else {
    container.innerHTML = favs.map(f => `<div class="stock-row"><strong>⭐ ${f.title}</strong><span style="font-size:12px; color:var(--text-secondary);">${f.date}</span></div>`).join("");
  }
  openModal("news-favorites-modal");
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function filterNews() {
  renderNews();
}

function loadMoreNews() {
  alert("Toutes les archives ont été chargées.");
}