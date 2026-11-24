# Navia — Spina di Rosula | 3D Sovereign Showcase & Royal Archive

An interactive 3D WebGL & editorial showcase dedicated to **Navia Caspar** (*President of the Spina di Rosula, Helm of the Radiant Rose — Genshin Impact*), built with **Three.js r160**, custom **GLSL Holographic Foil & Volumetric Godray Shaders**, **Volumetric Unreal-Style Bloom Auras**, a **Default Auto-Play 3-Track Fontaine Symphonic Music Box Synthesizer**, a **5-Star Golden Meteor Wish Summon Experience**, an **Interactive 3D Card Studio & HD PNG Exporter**, and a **22-Photo Royal Archive**.

---

## ✨ Key Features

1. **Default Multi-Track Fontaine Symphonic Music Box (`js/audio-engine.js`)**
   - Enabled **by default** on launch with auto-resume on first pointer/keyboard interaction.
   - Features **3 complete original Fontaine tracks** with stereo cathedral delay/reverb, celesta bell leads, counter-harmonies, concert harp bass plucks, and warm string pads:
     1. *La Rose Radieuse* (3/4 Fontaine Waltz in D Major)
     2. *Poisson Macaron Salon* (Breezy Café Theme in G Major)
     3. *Verdict of the Spina* (Heroic Geo Concerto in B Minor)
   - Real-time frequency spectrum visualizer in the top HUD + crystalline Geo sound effects.

2. **Three.js r160 3-Mode Interactive 3D Stage with Raycaster & Volumetric Bloom (`js/three-stage.js`)**
   - **Mode 1 — Sovereign Card & 3D Golden Parasol Halo**: Double-sided 3D collector card with custom GLSL holographic diamond-lattice foil, diagonal specular glare, volumetric bloom auras on every sapphire/Geo crystal, rotating 12-ribbed 3D Golden Parasol Halo, and a 12-beam GLSL Volumetric Godray Corona Backlight.
   - **Mode 2 — 360° 3D Carousel Ring**: Circular 3D ring of 12 framed Navia artworks with **`THREE.Raycaster` hover magnification & direct 3D click-to-focus**.
   - **Mode 3 — Rosa Multiflora 3D Constellation**: Floating 3D photo constellation connected by golden star-lines with interactive 3D raycast selection.
   - **3D Crystal Salute Shockwave & 11-Pellet Rosula Barrage**: Pressing `Crystal Salute ✦` (or `Space`) fires dual expanding 3D golden rose runic shockwave rings, 11 radial Rosula Shardshot beams, and 36 explosive Crystallize sparks.

3. **5-Star Golden Meteor Wish Summon Experience (`js/cursor-fx.js`)**
   - Click **`5★ Wish ✦`** (or press `W`) to launch an authentic Genshin Impact 5-Star Golden Meteor cutscene with supernova flash, harp glissando fanfare, **Single Pull (`1×`)**, **Royal Multi-Pull (`10×`)**, and one-click **Equip to 3D Stage**.
   - **Golden Geo Cursor Trail & Click Ripples**: Subtle Geo diamond sparkles trail your cursor and burst into compass-rose Crystallize ripples on click.

4. **Sovereign Hologram Card Studio & HD PNG Exporter (`js/card-renderer.js`)**
   - Customize your own Navia collector card using any of the **22 local Navia artworks**, 4 holographic foil themes (*Radiant Geo Gold*, *Court Azure Sapphire*, *Rosula Crimson Rose*, *Sovereign Prismatic*), and custom typography, then export as a **`1024×1420` HD `.PNG`**.

5. **Auto-Cinema 4K Exhibition Mode & Keyboard Shortcuts (`js/app.js`)**
   - Toggle **`Auto-Cinema ▶`** (or press `C`) for a hands-free 4K exhibition cycling wallpapers, 3D cards, and stage modes.
   - Shortcuts: `Space` (Salute), `F` (Flip 3D), `W` (5★ Wish), `M` (Music Play/Pause), `N` (Next Track), `C` (Auto-Cinema), `1 / 2 / 3` (3D Modes), `← / →` (4K Wallpapers).

---

## 📁 Project Structure

```text
.
├── index.html               # Main entry point, inline SVG favicon & semantic layout
├── README.md                # Project documentation
├── css/
│   ├── variables.css        # Design tokens, custom properties, keyframes & reset
│   ├── layout.css           # Hero layer stack, top nav, brand pill & clip-path menu
│   ├── components.css       # 3D stage switcher, music box visualizer, cursor FX & HUD dock
│   └── modals.css           # 22-Photo Archive, Card Studio, 5-Star Wish Overlay & Lightbox
├── js/
│   ├── catalog.js           # Complete metadata for all 22 photos, foil themes & voice lines
│   ├── textures-cache.js    # WebGL-safe texture cache for seamless local & server rendering
│   ├── audio-engine.js      # Default 3-track Fontaine Symphonic Music Box & Geo SFX engine
│   ├── card-renderer.js     # High-DPI 2D canvas card compositor & 1024×1420 PNG exporter
│   ├── cursor-fx.js         # Golden Geo cursor sparkle trail & 5-Star Meteor Wish Summon
│   ├── three-stage.js       # Three.js r160 3-Mode WebGL engine, Raycaster & Bloom/Shockwave shaders
│   └── app.js               # Main UI controller, Auto-Cinema & keyboard shortcuts
└── Navia/                   # 22 high-resolution Navia wallpapers, portraits, TCG cards & icons
```
