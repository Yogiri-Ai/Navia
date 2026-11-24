# NAVIA | Spina di Rosula Royal Archive

An interactive 3D WebGL and editorial showcase dedicated to **Navia Caspar** (*President of the Spina di Rosula, Helm of the Radiant Rose in Genshin Impact*). Built with **Three.js r160**, custom **GLSL Silk-Rim & Volumetric Godray Shaders**, **Volumetric Bloom Auras**, a **Default Auto-Play 3-Track Fontaine Symphonic Music Box**, **15 Studio Japanese Voice Lines by Toyosaki Aki (豊崎愛生)** with automatic BGM pause/resume, a **5-Star Golden Meteor Wish Summon Experience**, an **Interactive 3D Card Studio & HD PNG Exporter**, and a **22-Photo 4K Royal Archive**.

## Key Features

1. **15 Studio-Clean Japanese Voice Lines (CV: Toyosaki Aki) with Auto BGM Pause & Resume (`js/audio-engine.js`)**
   - Clicking directly on the **3D Sovereign Card** (or pressing `SALUTE` / `Space`) exclusively triggers **Elemental Burst** Japanese voice lines (*Faiaa!*, *Roozukurakkaa!*, *Uchitsuzukete~!*) paired with a full **3D Golden Rose Cannon Shockwave & 11-Pellet Rosula Barrage**.
   - Clicking any other navigation bar or button (`CARD`, `RING`, `STARS`, `SCENE`, `CINEMA`, `WISH`, `FLIP`, `ART`, `STUDIO`, `ARCHIVE`, `chronicle`, theme toggle, or menu) cycles through **12 non-burst studio Japanese voice lines** (6 Elemental Skill, 3 Treasure Chest, and 3 Joining Party). Strictly excludes Fallen, Low HP, and Hit Taken lines.
   - Background music automatically mutes while Navia speaks and smoothly fades back in once she finishes, accompanied by a Japanese, Romaji, and English subtitle banner.

2. **Default Multi-Track Fontaine Symphonic Music Box (`js/audio-engine.js`)**
   - Enabled by default on launch with stereo cathedral delay/reverb across 3 original Fontaine tracks (*La Rose Radieuse*, *Poisson Macaron Salon*, and *Verdict of the Spina*) plus a real-time frequency visualizer in the top bar.

3. **Three.js r160 3-Mode Interactive 3D Stage (`js/three-stage.js`)**
   - **Card Mode**: Double-sided 3D Sovereign Card with crystal-clear portrait rendering, pearlescent silk light reflection, perimeter-only iridescent foil, volumetric bloom auras, a hollow Art Deco Astrolabe Halo that stays behind the card when flipped, and a 12-beam GLSL Volumetric Godray Corona Backlight.
   - **Ring Mode**: Circular 360° 3D ring of 12 framed Navia artworks with `THREE.Raycaster` hover magnification and direct 3D click-to-focus.
   - **Stars Mode**: Floating 3D Rosa Multiflora photo constellation connected by golden star-lines with interactive 3D raycast selection.

4. **Face-Aware Focal Cropping & Full Android + Desktop Optimization (`js/catalog.js`, `js/card-renderer.js`)**
   - Every one of the 22 local photos carries custom face focal coordinates (`fx`, `fy`) so widescreen artworks never chop Navia's face inside vertical 3D cards or portrait Android screens.
   - Dynamic viewport height (`100dvh`), `viewport-fit=cover` safe-area insets, PWA `manifest.webmanifest`, and exact 3D camera frustum scaling ensure crisp presentation across Android phones and widescreen desktops.

5. **Sovereign Card Studio, 5-Star Wish Summon & 22-Photo Archive (`js/cursor-fx.js`, `js/card-renderer.js`)**
   - Customize any of the 22 artworks with 4 filigree finishes and export a `1024x1420` HD `.PNG` collector card.
   - Launch 1x or 10x **5-Star Golden Meteor Wish Summons** and equip pulled cards directly onto the 3D stage.

## Project Structure

```text
.
├── .nojekyll                # Disables Jekyll processing on GitHub Pages
├── index.html               # Main entry point, SEO/OpenGraph tags & semantic layout
├── manifest.webmanifest     # PWA Web App Manifest for Android/iOS Add-to-Home-Screen
├── robots.txt               # Search engine indexing rules
├── README.md                # Project documentation & deployment guide
├── audio/                   # 15 studio-clean Japanese voice clips (CV: Toyosaki Aki)
├── css/
│   ├── variables.css        # Design tokens, custom properties, keyframes & reset
│   ├── layout.css           # Hero layer stack, top nav, brand pill & clip-path menu
│   ├── components.css       # Editorial stage bar, music visualizer & horizon HUD
│   └── modals.css           # 22-Photo Archive, Card Studio, 5-Star Wish & Lightbox
├── js/
│   ├── catalog.js           # Metadata & face focal points for all 22 photos + 15 JP voices
│   ├── textures-cache.js    # WebGL-safe & CDN-resilient image cache for all 22 photos
│   ├── jp-voices-cache.js   # Zero-latency audio cache for all 15 Japanese voice clips
│   ├── audio-engine.js      # Default 3-track Fontaine Music Box & JP voice controller
│   ├── card-renderer.js     # Face-aware 2D canvas card compositor & 1024x1420 PNG exporter
│   ├── cursor-fx.js         # Golden Geo cursor sparkle trail & 5-Star Meteor Wish Summon
│   ├── three-stage.js       # Three.js r160 3-Mode WebGL engine, Raycaster & Bloom/Shockwave
│   └── app.js               # Main UI controller, Auto-Cinema & keyboard shortcuts
└── Navia/                   # 22 high-resolution Navia wallpapers, portraits, TCG cards & icons
```

## Hosting & Custom Domain Deployment

This project is a 100% static site requiring zero build tools.

### Option A: GitHub Pages + Custom Domain
1. Open your repository **Settings -> Pages**.
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`, select `main`, and set folder to `/ (root)`.
3. Under **Custom domain**, enter your domain (e.g. `navia.yourdomain.com` or `yourdomain.com`) and save.
4. Configure your DNS records at your domain registrar:
   - For a subdomain (`navia.yourdomain.com`): add a `CNAME` record pointing to `yogiri-ai.github.io`.
   - For an apex domain (`yourdomain.com`): add `A` records pointing to GitHub Pages IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`).
5. Enable **Enforce HTTPS** once DNS propagates.

### Option B: Cloudflare Pages / Vercel / Netlify
1. Connect the `Yogiri-Ai/Navia` GitHub repository directly.
2. Leave **Build command** empty and set **Output / Publish directory** to `.` (root).
3. Attach your custom domain in the provider's Domains dashboard for automatic global CDN and free SSL.
