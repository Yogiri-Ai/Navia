# NAVIA | Spina di Rosula Royal Archive

An interactive 3D WebGL and editorial showcase dedicated to **Navia Caspar** (*President of the Spina di Rosula, Helm of the Radiant Rose in Genshin Impact*). Built with **Three.js r160**, custom **GLSL Silk-Rim & Volumetric Godray Shaders**, **Volumetric Bloom Auras**, a **Default Auto-Play 3-Track Fontaine Symphonic Music Box**, **Japanese Voice Lines by Toyosaki Aki (豊崎愛生)** with automatic BGM ducking, a **5-Star Golden Meteor Wish Summon Experience**, an **Interactive 3D Card Studio & HD PNG Exporter**, and a **22-Photo 4K Royal Archive**.

## Key Features

1. **Japanese Voice Lines (CV: Toyosaki Aki) with Auto BGM Pause & Resume (`js/audio-engine.js`)**
   - Clicking the 3D Sovereign Card, flipping the card, or firing a Crystal Salute automatically mutes the background music, plays Navia's Japanese Elemental Skill or Elemental Burst voice line with a live Japanese/Romaji/English subtitle banner, and smoothly resumes the background music once she finishes speaking.
   - All 6 Japanese voice clips are pre-extracted into `audio/jp-*.mp3` and cached in `js/jp-voices-cache.js` for zero-latency playback.

2. **Default Multi-Track Fontaine Symphonic Music Box (`js/audio-engine.js`)**
   - Enabled by default on launch with stereo cathedral delay/reverb, celesta bell leads, counter-harmonies, concert harp bass plucks, and warm string pads across 3 original Fontaine tracks:
     1. *La Rose Radieuse* (3/4 Fontaine Waltz in D Major)
     2. *Poisson Macaron Salon* (Breezy Café Theme in G Major)
     3. *Verdict of the Spina* (Heroic Geo Concerto in B Minor)

3. **Three.js r160 3-Mode Interactive 3D Stage (`js/three-stage.js`)**
   - **Card Mode**: Double-sided 3D Sovereign Card with crystal-clear portrait rendering, pearlescent silk light reflection, perimeter-only iridescent foil, volumetric bloom auras on every sapphire and Geo crystal, a hollow Art Deco Astrolabe Halo that always stays behind the card, and a 12-beam GLSL Volumetric Godray Corona Backlight.
   - **Ring Mode**: Circular 360° 3D ring of 12 framed Navia artworks with `THREE.Raycaster` hover magnification and direct 3D click-to-focus.
   - **Stars Mode**: Floating 3D Rosa Multiflora photo constellation connected by golden star-lines with interactive 3D raycast selection.
   - **3D Crystal Salute Shockwave**: Pressing `Salute` (or `Space`) fires dual expanding 3D golden rose shockwave rings, 11 radial Rosula Shardshot beams, and 36 explosive Crystallize sparks.

4. **5-Star Golden Meteor Wish Summon (`js/cursor-fx.js`)**
   - Click `Wish` (or press `W`) to launch a 5-Star Golden Meteor cutscene with supernova flash, Single Pull (`1x`), Royal Multi-Pull (`10x`), and one-click Equip to 3D Stage.

5. **Sovereign Card Studio & HD PNG Exporter (`js/card-renderer.js`)**
   - Customize your own Navia collector card using any of the 22 local Navia artworks, 4 filigree finishes (*Radiant Geo Gold*, *Court Azure Sapphire*, *Rosula Crimson Rose*, *Sovereign Prismatic*), and custom typography, then download as a `1024x1420` HD `.PNG`.

## Project Structure

```text
.
├── index.html               # Main entry point & semantic layout
├── README.md                # Project documentation
├── audio/                   # 6 extracted Japanese voice clips (Toyosaki Aki)
├── css/
│   ├── variables.css        # Design tokens, custom properties, keyframes & reset
│   ├── layout.css           # Hero layer stack, top nav, brand pill & clip-path menu
│   ├── components.css       # Editorial stage bar, music box visualizer & horizon HUD
│   └── modals.css           # 22-Photo Archive, Card Studio, 5-Star Wish Overlay & Lightbox
├── js/
│   ├── catalog.js           # Metadata for all 22 photos, foil themes & 6 JP voice lines
│   ├── textures-cache.js    # WebGL-safe texture cache for all 22 photos
│   ├── jp-voices-cache.js   # Zero-latency audio cache for all 6 Japanese voice clips
│   ├── audio-engine.js      # Default 3-track Fontaine Music Box & JP voice controller
│   ├── card-renderer.js     # High-DPI 2D canvas card compositor & 1024x1420 PNG exporter
│   ├── cursor-fx.js         # Golden Geo cursor sparkle trail & 5-Star Meteor Wish Summon
│   ├── three-stage.js       # Three.js r160 3-Mode WebGL engine, Raycaster & Bloom/Shockwave shaders
│   └── app.js               # Main UI controller, Auto-Cinema & keyboard shortcuts
└── Navia/                   # 22 high-resolution Navia wallpapers, portraits, TCG cards & icons
```
