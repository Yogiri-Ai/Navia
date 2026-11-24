# Navia — Spina di Rosula | 3D Sovereign Showcase & Royal Archive

An interactive 3D WebGL & editorial showcase dedicated to **Navia Caspar** (*President of the Spina di Rosula, Helm of the Radiant Rose — Genshin Impact*), built with **Three.js r160**, custom **GLSL Holographic Foil Shaders**, a polyphonic **Web Audio Fontaine Music Box Synthesizer**, an **Interactive 3D Card Studio & HD PNG Exporter**, and a **22-Photo Royal Archive**.

---

## ✨ Key Features

1. **Three.js r160 3-Mode Interactive 3D Stage (`js/three-stage.js`)**
   - **Mode 1 — Sovereign Card & 3D Golden Parasol Halo**: Double-sided 3D collector card with custom GLSL holographic diamond-lattice foil, diagonal specular glare, sapphire corner gems, rotating ship-wheel crown, and a 12-ribbed 3D Golden Parasol Halo rotating behind the card alongside orbiting Geo crystals.
   - **Mode 2 — 360° 3D Carousel Ring**: Circular 3D ring of 12 framed Navia artworks that you can spin interactively by dragging horizontally or clicking the HUD controls.
   - **Mode 3 — Rosa Multiflora 3D Constellation**: Floating 3D photo constellation connected by golden star-lines in 3D space with pointer parallax.

2. **Sovereign Hologram Card Studio & HD PNG Exporter (`js/card-renderer.js`)**
   - Customize your own Navia collector card using any of the **22 local Navia artworks**.
   - Switch between 4 holographic foil & filigree themes: **Radiant Geo Gold**, **Court Azure Sapphire**, **Rosula Crimson Rose**, and **Sovereign Prismatic**.
   - Edit the Card Headline, Royal Subtitle, and Element Emblem in real time.
   - Apply your custom card directly to the live 3D WebGL stage or **Download a high-resolution `1024×1420` `.PNG` collector card**.

3. **Fontaine Music Box & Geo Audio Engine (`js/audio-engine.js`)**
   - Zero-dependency Web Audio API polyphonic synthesizer playing an original 3/4 Fontaine Waltz (*Spina di Rosula Waltz*) with live frequency bars rendered on the top HUD visualizer, plus crystalline Geo sound effects for *Crystal Salute* and card interactions.

4. **8-Scene 4K Wallpaper Crossfader & 22-Photo Royal Archive (`js/app.js`)**
   - Smooth Ken Burns crossfade stage across 8 high-resolution widescreen artworks with dynamic editorial headlines.
   - Filterable 22-photo masonry gallery (*4K Wallpapers*, *Portraits & TCG*, *Icons & Expressions*) with one-click **Set Background**, **Apply to 3D Card**, **Customize in Studio**, and **Fullscreen Lightbox**.
   - **Clip-Path Morphing Menu**: Expands smoothly out of the top-right `NAVIA` brand pill using dynamic `--pill-w` footprint calculation.

---

## 📁 Project Structure

```text
.
├── index.html               # Main entry point & semantic layout
├── README.md                # Project documentation
├── css/
│   ├── variables.css        # Design tokens, custom properties, keyframes & reset
│   ├── layout.css           # Hero layer stack, top nav, brand pill & clip-path menu
│   ├── components.css       # 3D stage switcher, music box visualizer, 4K HUD dock & toasts
│   └── modals.css           # 22-Photo Archive, Card Studio, Character Chronicle & Lightbox
├── js/
│   ├── catalog.js           # Complete metadata for all 22 photos, foil themes & voice lines
│   ├── textures-cache.js    # WebGL-safe texture cache for seamless local & server rendering
│   ├── audio-engine.js      # Polyphonic Web Audio Fontaine Music Box & Geo SFX synthesizer
│   ├── card-renderer.js     # High-DPI 2D canvas card compositor & 1024×1420 PNG exporter
│   ├── three-stage.js       # Three.js r160 3-Mode WebGL engine & custom GLSL foil shaders
│   └── app.js               # Main UI controller & event orchestration
└── Navia/                   # 22 high-resolution Navia wallpapers, portraits, TCG cards & icons
```

---

## 🚀 Running Locally or on GitHub Pages

- **GitHub Pages / Local Server**: Serve the root folder with any static server (e.g., `python -m http.server 8124`) and open `http://localhost:8124`.
- **Direct File Open**: Thanks to `js/textures-cache.js`, WebGL card textures also render cleanly without cross-origin taint errors when opened locally.
