// ==================================================
// NAVIA ROYAL ARCHIVE CATALOG
// 22 Local Photos with Per-Image Face Focal Points (fx, fy)
// + 15 Studio-Clean Japanese Voice Lines (CV: Toyosaki Aki)
// ==================================================

export const ALL_PHOTOS = [
  { file: "1351553.jpeg", title: "Golden Sunlight of Fontaine", cat: "wallpaper", wide: true, fx: 0.36, fy: 0.34 },
  { file: "1346600.jpeg", title: "Golden Rose & Verdict Strike", cat: "wallpaper", wide: true, fx: 0.50, fy: 0.35 },
  { file: "1346601.jpeg", title: "Shades of the Demoiselle", cat: "wallpaper", wide: true, fx: 0.44, fy: 0.46 },
  { file: "1346602.jpeg", title: "Vintage Frame & Azure Eyes", cat: "wallpaper", wide: true, fx: 0.78, fy: 0.38 },
  { file: "1346603.jpeg", title: "Macaron Salon Elegance", cat: "wallpaper", wide: true, fx: 0.43, fy: 0.44 },
  { file: "1335748.jpeg", title: "Sunflowers & Radiant Curls", cat: "wallpaper", wide: true, fx: 0.56, fy: 0.42 },
  { file: "1344732.jpeg", title: "Afternoon Confectionery at Poisson", cat: "wallpaper", wide: true, fx: 0.72, fy: 0.34 },
  { file: "1360834.jpeg", title: "Lavender Breeze & Petals", cat: "wallpaper", wide: true, fx: 0.65, fy: 0.38 },
  { file: "%E1%AF%93%E2%98%85%20Navia%20Tcg%20Card%20%E2%82%8A%CB%9A%E2%8A%B9%20%E1%B0%94.jpg", title: "Genius Invokation Sovereign", cat: "portrait", wide: false, fx: 0.50, fy: 0.40 },
  { file: "Navia.jpg", title: "President of Spina di Rosula", cat: "portrait", wide: false, fx: 0.50, fy: 0.34 },
  { file: "Navia%20Genshin%20Impact.jpg", title: "Golden Parasol Promenade", cat: "portrait", wide: false, fx: 0.48, fy: 0.35 },
  { file: "__._._._._._.%23travel__%23nofilter__website%E2%80%A6", title: "Starlight Soiree Gift", cat: "portrait", wide: false, fx: 0.50, fy: 0.34 },
  { file: "Navia%20icon.jpg", title: "Azure Sky Parasol Smile", cat: "icon", wide: false, fx: 0.50, fy: 0.44 },
  { file: "Navia%20kitty%20icon%20-%E2%98%85.jpg", title: "Starry Kitty Whiskers", cat: "icon", wide: false, fx: 0.50, fy: 0.44 },
  { file: "1053279431635533580.jpg", title: "Sweet Dessert Wink", cat: "icon", wide: false, fx: 0.50, fy: 0.46 },
  { file: "885661082969402526.jpg", title: "Aviator Shades Confidence", cat: "icon", wide: false, fx: 0.48, fy: 0.42 },
  { file: "Navia%E2%98%82%EF%B8%8F%F0%9F%91%92.jpg", title: "Gentle Poisson Smile", cat: "icon", wide: false, fx: 0.50, fy: 0.44 },
  { file: "%E2%80%94%20Navia.jpg", title: "Royal Emblem Portrait", cat: "icon", wide: false, fx: 0.50, fy: 0.44 },
  { file: "%E2%80%A7%E2%82%8A%CB%9A%20%E2%8B%85%20%20%F0%93%90%90%F0%93%8E%A9%20%E2%80%A7%E2%82%8A%CB%9A%20%E2%8B%85%20__%20%20NAVIA.jpg", title: "Chocolate Bite Wink", cat: "icon", wide: false, fx: 0.48, fy: 0.44 },
  { file: "%E2%99%A1.jpg", title: "Rose Macaron Delight", cat: "icon", wide: false, fx: 0.52, fy: 0.44 },
  { file: "%F0%9D%96%AD%F0%9D%96%BA%F0%9D%97%8F%F0%9D%97%82%F0%9D%96%BA%20%F0%96%A3%8E.jpg", title: "Twilight Sunglasses", cat: "icon", wide: false, fx: 0.46, fy: 0.42 },
  { file: "%F0%9F%8C%BB%20%E2%97%9E%E3%85%A4%F0%93%8E%9F%F0%93%8E%9F%E3%85%A4%20Navia%20%20__%20_%20_%E2%8C%A2%20_%20__%20_%20_icon.jpg", title: "Sunlit Aviator Charm", cat: "icon", wide: false, fx: 0.48, fy: 0.44 }
];

export function getPhotoFocal(fileOrUrl) {
  if (!fileOrUrl) return { fx: 0.5, fy: 0.38 };
  const key = String(fileOrUrl).split("/Navia/").pop();
  const found = ALL_PHOTOS.find((p) => p.file === key);
  return found ? { fx: found.fx, fy: found.fy } : { fx: 0.5, fy: 0.38 };
}

export const CARD_DECK = ALL_PHOTOS.slice(8).concat(ALL_PHOTOS.slice(0, 8));

export const HEADLINES = [
  ["helm", "of the", "radiant", "rose"],
  ["golden", "roses", "command", "fontaine"],
  ["unyielding", "verdict", "shines", "eternal"],
  ["spina", "di rosula", "stands", "resolute"],
  ["sweetest", "macarons", "spark", "delight"],
  ["sunlit", "horizons", "bloom", "forever"],
  ["poisson", "breezes", "drift", "serene"],
  ["azure", "memories", "shine", "bright"]
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

// 15 Studio-Clean Japanese Voice Lines (CV: Toyosaki Aki / 豊崎愛生)
// Strictly excludes Low HP, Ally Low HP, Fallen, and Hit Taken lines!
export const JP_VOICE_LINES = [
  {
    id: 0,
    type: "skill",
    audioFile: "./audio/jp-skill-1.mp3",
    durSec: 2.5,
    label: "Elemental Skill I",
    jp: "気を付けなさい！",
    romaji: "Kiwotsukenasai!",
    en: "Watch out!"
  },
  {
    id: 1,
    type: "skill",
    audioFile: "./audio/jp-skill-2.mp3",
    durSec: 2.6,
    label: "Elemental Skill II",
    jp: "堂々不意打ち！",
    romaji: "Doudou fuiuchi!",
    en: "Comin' at ya!"
  },
  {
    id: 2,
    type: "skill",
    audioFile: "./audio/jp-skill-3.mp3",
    durSec: 2.5,
    label: "Elemental Skill III",
    jp: "やっほ～！",
    romaji: "Yahhoo~!",
    en: "Hey there!"
  },
  {
    id: 3,
    type: "skill",
    audioFile: "./audio/jp-skill-4.mp3",
    durSec: 2.5,
    label: "Elemental Skill IV",
    jp: "避けられる？",
    romaji: "Yokerareru?",
    en: "Feelin' lucky?"
  },
  {
    id: 4,
    type: "skill",
    audioFile: "./audio/jp-skill-5.mp3",
    durSec: 3.0,
    label: "Elemental Skill V",
    jp: "あと何発でしょー？",
    romaji: "Ato nanpatsu deshou?",
    en: "This one's got your name on it!"
  },
  {
    id: 5,
    type: "skill",
    audioFile: "./audio/jp-skill-6.mp3",
    durSec: 2.7,
    label: "Elemental Skill VI",
    jp: "これって…“傘弾銃”？",
    romaji: "Kore tte... \"Sandanjuu\"?",
    en: "Umbrella warfare, I guess?"
  },
  {
    id: 6,
    type: "burst",
    audioFile: "./audio/jp-burst-1.mp3",
    durSec: 4.6,
    label: "Elemental Burst I",
    jp: "ファイアー！ ま、岩元素なんだけどね",
    romaji: "Faiaa! Ma, iwa gensou nandakedo ne",
    en: "Fire! Well, with rocks."
  },
  {
    id: 7,
    type: "burst",
    audioFile: "./audio/jp-burst-2.mp3",
    durSec: 5.3,
    label: "Elemental Burst II",
    jp: "ローズクラッカー！ 『棘薔薇の会』特注版よ",
    romaji: "Roozukurakkaa! \"Supina di Roosura\" tokuchuuban yo",
    en: "A proper sendoff! From the Spina, with love."
  },
  {
    id: 8,
    type: "burst",
    audioFile: "./audio/jp-burst-3.mp3",
    durSec: 5.3,
    label: "Elemental Burst III",
    jp: "撃ち続けて～！ うんうん、イイ感じ！",
    romaji: "Uchitsuzukete~! Un un, ii kanji!",
    en: "Attack! Mm-hmm, that's the way."
  },
  {
    id: 9,
    type: "chest",
    audioFile: "./audio/jp-chest-1.mp3",
    durSec: 3.2,
    label: "Treasure Chest I",
    jp: "わぁお、ラッキー！",
    romaji: "Waao, rakkii!",
    en: "Whoa! What a stroke of good luck!"
  },
  {
    id: 10,
    type: "chest",
    audioFile: "./audio/jp-chest-2.mp3",
    durSec: 3.0,
    label: "Treasure Chest II",
    jp: "さ、早くしまって！",
    romaji: "Sa, hayaku shimatte!",
    en: "Quick! Let's pack it up!"
  },
  {
    id: 11,
    type: "chest",
    audioFile: "./audio/jp-chest-3.mp3",
    durSec: 3.8,
    label: "Treasure Chest III",
    jp: "お宝探し、大成功！",
    romaji: "Otakara sagashi, daiseikou!",
    en: "I'm loving this treasure hunt!"
  },
  {
    id: 12,
    type: "join",
    audioFile: "./audio/jp-join-1.mp3",
    durSec: 2.9,
    label: "Joining Party I",
    jp: "思い立ったが吉日！",
    romaji: "Omoitatta ga kichijitsu!",
    en: "Count me in."
  },
  {
    id: 13,
    type: "join",
    audioFile: "./audio/jp-join-2.mp3",
    durSec: 3.4,
    label: "Joining Party II",
    jp: "スピナ・ディ・ロースラの出番よ！",
    romaji: "Supina di Roosura no deban yo!",
    en: "The Spina's on the case!"
  },
  {
    id: 14,
    type: "join",
    audioFile: "./audio/jp-join-3.mp3",
    durSec: 3.8,
    label: "Joining Party III",
    jp: "今日はあたしが案内してあげる！",
    romaji: "Kyou wa atashi ga annai shite ageru!",
    en: "I'll take the lead today!"
  }
];

export const VOICE_QUOTES = JP_VOICE_LINES.map((v) => v.en);
