/* ==========================================================================
   T1NKIETTE - Centralized Database & Pricing Structures
   ========================================================================== */

const T1NKIETTE_DB = {
  settings: {
    storeName: "T1NKIETTE",
    currency: "€",
    loyaltyRatio: 2, // 1€ = 2 points
    loyaltyRedeemCost: 300, // 300 points = 10€
  },

  categories: [
    { id: "weed", name: "Weed", icon: "🌿", description: "Fleurs haut de gamme, sélection rigoureuse outdoor, indoor et living soil." },
    { id: "shit", name: "Shit", icon: "🍫", description: "Résines et extractions de hash traditionnelles et modernes (Dry, Frozen, Static)." },
    { id: "extras", name: "Extras", icon: "✨", description: "Concentrés puissants, vapes, résines pures et produits dérivés." },
    { id: "autres", name: "Autres", icon: "🚬", description: "Tabac, feuilles, filtres, accessoires et articles de fumeur." },
    { id: "promos", name: "Pack/Promo", icon: "🎁", description: "Packs exclusifs et offres promotionnelles du moment." }
  ],

  // --- CATALOGUE COMPLET ---
  catalog: {
    weed: [
      {
        id: "weed-low",
        name: "Low Shelf",
        thcRange: "13-20% THC",
        priceRange: "4-6€/G",
        discount: "-25% dégressif",
        varieties: [
          { name: "Cap Junky", type: "Cali Low Shelf", farm: "ESC Farm", country: "🇪🇸", thc: 19, sativaIndica: [40, 60], euphoricRelaxed: [50, 50], priceBuy: 2, tiers: [{qty:"10G", price:40}, {qty:"25G", price:90}, {qty:"50G", price:160}, {qty:"100G", price:300}, {qty:"200G", price:580}], stock: 150 },
          { name: "Chocolate Haze", type: "Spain", farm: "ESC Farm", country: "🇪🇸", thc: 20, sativaIndica: [70, 30], euphoricRelaxed: [80, 20], priceBuy: 2.5, tiers: [{qty:"10G", price:50}, {qty:"25G", price:110}, {qty:"50G", price:200}, {qty:"100G", price:380}], stock: 80 }
        ]
      },
      {
        id: "weed-mid",
        name: "Mid Shelf",
        thcRange: "20-27% THC",
        priceRange: "7-9€/G",
        discount: "-25% dégressif",
        varieties: [
          { name: "Tropicana Cherry", type: "Cali Mid Shelf", farm: "NRBK RA", country: "🇨🇦", thc: 26, sativaIndica: [60, 40], euphoricRelaxed: [70, 30], priceBuy: 3.5, tiers: [{qty:"10G", price:70}, {qty:"25G", price:150}, {qty:"50G", price:280}, {qty:"100G", price:530}], stock: 120 }
        ]
      },
      {
        id: "weed-top",
        name: "Top Shelf",
        thcRange: "27-34% THC",
        priceRange: "10-12€/G",
        discount: "-25% dégressif",
        varieties: [
          { name: "Big Buddha Cheese", type: "Cali Shelf", farm: "NRBK RA", country: "🇨🇦", thc: 27, sativaIndica: [20, 80], euphoricRelaxed: [30, 70], priceBuy: 5, tiers: [{qty:"10G", price:100}, {qty:"25G", price:220}, {qty:"50G", price:400}, {qty:"100G", price:750}], stock: 90 },
          { name: "Emergen-C", type: "Cali Top Shelf", farm: "ESC Farm", country: "🇪🇸", thc: 30, sativaIndica: [50, 50], euphoricRelaxed: [60, 40], priceBuy: 5.5, tiers: [{qty:"10G", price:110}, {qty:"25G", price:240}, {qty:"50G", price:440}, {qty:"100G", price:830}], stock: 65 }
        ]
      },
      {
        id: "weed-legend",
        name: "Legend",
        thcRange: "+34% THC",
        priceRange: "13-20€/G",
        discount: "-20% à -25% dégressif",
        varieties: [
          { name: "Dante Magic", type: "Private Reserve", farm: "The Wizard", country: "🇪🇸", thc: 34, sativaIndica: [30, 70], euphoricRelaxed: [40, 60], priceBuy: 6.5, tiers: [{qty:"1U (3,5G)", price:50}, {qty:"2U", price:90}, {qty:"4U", price:170}, {qty:"8U", price:320}, {qty:"16U", price:620}, {qty:"32U", price:1200}], stock: 45 },
          { name: "Rainbow Zkittlez", type: "Private Reserve", farm: "The Wizard", country: "🇪🇸", thc: 37, sativaIndica: [40, 60], euphoricRelaxed: [70, 30], priceBuy: 7, tiers: [{qty:"1U (3,5G)", price:60}, {qty:"2U", price:110}, {qty:"4U", price:200}, {qty:"8U", price:380}, {qty:"16U", price:740}, {qty:"32U", price:1440}], stock: 30 }
        ]
      }
    ],

    shit: [
      {
        id: "shit-mini",
        name: "Mini",
        thcRange: "+40% THC",
        priceRange: "3-4€/G",
        discount: "-25% dégressif",
        varieties: [
          { name: "Dry Mousse 45μ", type: "Hash Mousseux", farm: "ESC Farm", country: "🇪🇸", thc: 42, sativaIndica: [50, 50], euphoricRelaxed: [50, 50], priceBuy: 1.5, tiers: [{qty:"10G", price:30}, {qty:"25G", price:70}, {qty:"50G", price:130}, {qty:"100G", price:240}, {qty:"200G", price:460}], stock: 180 }
        ]
      },
      {
        id: "shit-lux",
        name: "Lux",
        thcRange: "+80% THC",
        priceRange: "21-29€/G",
        discount: "-15% dégressif",
        varieties: [
          { name: "Nepal Cream", type: "Ice O Lator", farm: "The Wizard", country: "🇪🇸", thc: 80, sativaIndica: [10, 90], euphoricRelaxed: [20, 80], priceBuy: 10.5, tiers: [{qty:"10G", price:210}, {qty:"15G", price:300}, {qty:"20G", price:390}, {qty:"25G", price:450}], stock: 25 }
        ]
      }
    ],

    extras: [
      {
        id: "extra-ultra",
        name: "Ultra",
        thcRange: "+90% THC",
        priceRange: "30-80€/G",
        discount: "-20% dégressif",
        varieties: [
          { name: "Seringue Vape 1G", type: "Distillat Pur", farm: "Delta Corp", country: "🇫🇷", thc: 95, sativaIndica: [50, 50], euphoricRelaxed: [60, 40], priceBuy: 15, tiers: [{qty:"1U", price:40}, {qty:"2U", price:70}, {qty:"3U", price:100}, {qty:"5U", price:160}], stock: 15 }
        ]
      }
    ],

    promos: [
      {
        id: "pack-conso",
        name: "1 • Pack Conso",
        description: "Grinder métal + Plateau + Balance + Slim (cartons) + Clipper",
        priceOriginal: 23.5,
        pricePromo: 15,
        discount: "-35%",
        stock: 40
      },
      {
        id: "pack-fumeurs",
        name: "2 • Pack Fumeurs",
        description: "Tabac x5 + feuilles x3 + filtres x3 + clipper + au choix accessoire",
        priceOriginal: 60.5,
        pricePromo: 50,
        discount: "-20%",
        stock: 25
      }
    ]
  },

  partners: {
    weed: ["ESC Farm 🇪🇸", "GMF Farm 🇳🇱", "Hunter Fruity Terps 🇪🇸", "FranBank 🇫🇷", "Doja 🇺🇸", "The Tenco 🇺🇸", "Cookies 🇺🇸", "Kaws 🇺🇸", "The Wizard 🇪🇸", "Jungle Boys 🇺🇸", "NRBK RA 🇨🇦"],
    hash: ["VVS Tanger 🇲🇦", "Hunter Fruity Terps 🇪🇸", "ESC Farm 🇪🇸", "The Hidden Farm 🇲🇦", "The Wizard 🇪🇸", "CaliPlate 🇺🇸", "ViceCity 🇺🇸", "Dr Cali 🇫🇷", "Doctor French 🇫🇷", "Venom 🇫🇷", "La Squadra Farm 🇮🇹", "Hashworld 🇲🇦", "Melt Labs 🇹🇭", "Drytech 🇲🇦", "FranBank 🇫🇷", "Honey Mountains 🇲🇦", "Anonymous 🇲🇦", "The Hash Valley 🇲🇦", "Mountain Giant 🇲🇦"],
    extras: ["Delta Corp 🇫🇷", "Jungle Boys 🇺🇸", "Packwood Los Angeles 🇺🇸", "The Wizard 🇪🇸", "ESC Farm 🇪🇸", "Melting Farm 🇺🇸", "Kaws 🇺🇸", "Cookies 🇺🇸", "Hunter Fruity Terps 🇪🇸", "Melt Labs 🇹🇭", "NRBK RA 🇨🇦", "FranBank 🇫🇷", "Pac-Man 🇺🇸"],
    autres: ["Camel 🇺🇸", "Marlboro 🇺🇸", "Lucky Strike 🇺🇸", "News 🇫🇷", "Clipper 🇪🇸", "Bic 🇫🇷", "OCB 🇫🇷", "Raw 🇺🇸", "Rizla+ 🇫🇷", "Cookies 🇺🇸"]
  }
};