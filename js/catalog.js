// ==================================================
// NAVIA ROYAL ARCHIVE CATALOG (22 Local Photos & Lore)
// ==================================================

export const ALL_PHOTOS = [
  { file: "1351553.jpeg", title: "Golden Sunlight of Fontaine", cat: "wallpaper", wide: true },
  { file: "1346600.jpeg", title: "Golden Rose & Verdict Strike", cat: "wallpaper", wide: true },
  { file: "1346601.jpeg", title: "Shades of the Demoiselle", cat: "wallpaper", wide: true },
  { file: "1346602.jpeg", title: "Vintage Frame & Azure Eyes", cat: "wallpaper", wide: true },
  { file: "1346603.jpeg", title: "Macaron Salon Elegance", cat: "wallpaper", wide: true },
  { file: "1335748.jpeg", title: "Sunflowers & Radiant Curls", cat: "wallpaper", wide: true },
  { file: "1344732.jpeg", title: "Afternoon Confectionery at Poisson", cat: "wallpaper", wide: true },
  { file: "1360834.jpeg", title: "Lavender Breeze & Petals", cat: "wallpaper", wide: true },
  { file: "%E1%AF%93%E2%98%85%20Navia%20Tcg%20Card%20%E2%82%8A%CB%9A%E2%8A%B9%20%E1%B0%94.jpg", title: "Genius Invokation TCG Sovereign", cat: "portrait", wide: false },
  { file: "Navia.jpg", title: "President of Spina di Rosula", cat: "portrait", wide: false },
  { file: "Navia%20Genshin%20Impact.jpg", title: "Golden Parasol Promenade", cat: "portrait", wide: false },
  { file: "__._._._._._.%23travel__%23nofilter__website%E2%80%A6", title: "Starlight Soiree Gift", cat: "portrait", wide: false },
  { file: "Navia%20icon.jpg", title: "Azure Sky Parasol Smile", cat: "icon", wide: false },
  { file: "Navia%20kitty%20icon%20-%E2%98%85.jpg", title: "Starry Kitty Whiskers", cat: "icon", wide: false },
  { file: "1053279431635533580.jpg", title: "Sweet Dessert Wink", cat: "icon", wide: false },
  { file: "885661082969402526.jpg", title: "Aviator Shades Confidence", cat: "icon", wide: false },
  { file: "Navia%E2%98%82%EF%B8%8F%F0%9F%91%92.jpg", title: "Gentle Poisson Smile", cat: "icon", wide: false },
  { file: "%E2%80%94%20Navia.jpg", title: "Royal Emblem Portrait", cat: "icon", wide: false },
  { file: "%E2%80%A7%E2%82%8A%CB%9A%20%E2%8B%85%20%20%F0%93%90%90%F0%93%8E%A9%20%E2%80%A7%E2%82%8A%CB%9A%20%E2%8B%85%20__%20%20NAVIA.jpg", title: "Chocolate Bite Wink", cat: "icon", wide: false },
  { file: "%E2%99%A1.jpg", title: "Rose Macaron Delight", cat: "icon", wide: false },
  { file: "%F0%9D%96%AD%F0%9D%96%BA%F0%9D%97%8F%F0%9D%97%82%F0%9D%96%BA%20%F0%96%A3%8E.jpg", title: "Twilight Sunglasses", cat: "icon", wide: false },
  { file: "%F0%9F%8C%BB%20%E2%97%9E%E3%85%A4%F0%93%8E%9F%F0%93%8E%9F%E3%85%A4%20Navia%20%20__%20_%20_%E2%8C%A2%20_%20__%20_%20_icon.jpg", title: "Sunlit Aviator Charm", cat: "icon", wide: false }
];

export const CARD_DECK = ALL_PHOTOS.slice(8).concat(ALL_PHOTOS.slice(0, 8));

export const HEADLINES = [
  ["streamlined", "operations", "feel", "breezy"],
  ["golden", "roses", "command", "fontaine"],
  ["unyielding", "verdict", "shines", "radiant"],
  ["timeless", "elegance", "blooms", "forever"],
  ["sweetest", "macarons", "spark", "delight"],
  ["sunlit", "horizons", "stand", "resolute"],
  ["cordial", "alliances", "thrive", "effortless"],
  ["azure", "memories", "drift", "serene"]
];

export const FOIL_THEMES = {
  geo: {
    id: "geo",
    name: "Radiant Geo Gold",
    primary: "#f7c654",
    secondary: "#d4751c",
    dark: "#17100a",
    badge: "GEO",
    shaderMode: 0
  },
  sapphire: {
    id: "sapphire",
    name: "Court Azure Sapphire",
    primary: "#60a5fa",
    secondary: "#2563eb",
    dark: "#091224",
    badge: "OUSIA",
    shaderMode: 1
  },
  crimson: {
    id: "crimson",
    name: "Rosula Crimson Rose",
    primary: "#fb7185",
    secondary: "#e11d48",
    dark: "#1f0910",
    badge: "ROSE",
    shaderMode: 2
  },
  prismatic: {
    id: "prismatic",
    name: "Sovereign Prismatic",
    primary: "#fde047",
    secondary: "#a855f7",
    dark: "#130d1c",
    badge: "SSR ★",
    shaderMode: 3
  }
};

export const VOICE_QUOTES = [
  "“A proper lady always carries her parasol... even if mine fires Rosula Shardshots at point-blank range!”",
  "“On behalf of the Spina di Rosula — let the Golden Rose Cannon sound our salute across the skies of Fontaine!”",
  "“Work flows so much smoother when everyone has a freshly baked macaron in hand. Melus and Silver already prepared the tea!”",
  "“No matter how tangled a case in the Court of Fontaine seems, the Spina resolves it before sunset — streamlined and breezy.”"
];
