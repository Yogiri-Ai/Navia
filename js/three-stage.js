// ==================================================
// THREE.JS r160 3-MODE INTERACTIVE 3D NAVIA STAGE
// Modes:
//   1. "sovereign"     — Holographic Sovereign Card + 3D Golden Parasol Halo
//   2. "carousel"      — 360° 3D Carousel Ring of 12 Navia Cards
//   3. "constellation" — 3D Rosa Multiflora Floating Photo Constellation
// ==================================================
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { CARD_DECK, FOIL_THEMES } from "./catalog.js";
import { createBaseCardCanvas, loadPhotoIntoCardCanvas } from "./card-renderer.js";

export function initThreeStage(callbacks = {}) {
  const canvas = document.getElementById("fox");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;

  const scene = new THREE.Scene();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 6);

  // Spec Warm Lights + Sapphire Accent
  const hemiLight = new THREE.HemisphereLight(0xffe2c0, 0x6b3a12, 1.15);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffc98a, 2.25);
  keyLight.position.set(-3, 4, 3);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xffa24d, 1.65);
  rimLight.position.set(3, 2, -3);
  scene.add(rimLight);

  const sapphireLight = new THREE.PointLight(0x4ea8ff, 1.9, 9);
  sapphireLight.position.set(1.6, -1.1, 2.2);
  scene.add(sapphireLight);

  // Keep GLTFLoader referenced per spec
  const gltfLoader = new GLTFLoader();
  void gltfLoader;

  // Root Pivot & Holder
  const pivot = new THREE.Group();
  scene.add(pivot);

  const holder = new THREE.Group();
  pivot.add(holder);

  // Shared PBR Materials
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf7c654,
    metalness: 0.92,
    roughness: 0.16,
    envMapIntensity: 1.25
  });

  const obsidianMat = new THREE.MeshStandardMaterial({
    color: 0x1a1310,
    metalness: 0.65,
    roughness: 0.24,
    envMapIntensity: 0.85
  });

  const sapphireMat = new THREE.MeshPhysicalMaterial({
    color: 0x2d7ef7,
    emissive: 0x0d2b66,
    emissiveIntensity: 0.48,
    metalness: 0.15,
    roughness: 0.08,
    transmission: 0.72,
    thickness: 0.6,
    envMapIntensity: 1.4
  });

  const geoCrystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xffb830,
    emissive: 0xd46b08,
    emissiveIntensity: 0.45,
    metalness: 0.25,
    roughness: 0.1,
    transmission: 0.65,
    thickness: 0.5,
    envMapIntensity: 1.3
  });

  function makeRoundedRect(w, h, r) {
    const s = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  // ==================================================
  // MODE 1 GROUP: SOVEREIGN HOLOGRAPHIC CARD + 3D PARASOL HALO
  // ==================================================
  const sovereignGroup = new THREE.Group();
  holder.add(sovereignGroup);

  const cardGroup = new THREE.Group();
  sovereignGroup.add(cardGroup);

  const cardW = 1.46;
  const cardH = 2.02;
  const outerShape = makeRoundedRect(cardW, cardH, 0.13);
  const outerGeo = new THREE.ExtrudeGeometry(outerShape, {
    depth: 0.055,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.025,
    bevelThickness: 0.025
  });
  outerGeo.center();
  cardGroup.add(new THREE.Mesh(outerGeo, goldMat));

  const innerShape = makeRoundedRect(cardW - 0.07, cardH - 0.07, 0.1);
  const innerGeo = new THREE.ExtrudeGeometry(innerShape, {
    depth: 0.092,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.01,
    bevelThickness: 0.01
  });
  innerGeo.center();
  cardGroup.add(new THREE.Mesh(innerGeo, obsidianMat));

  // Front & Back High-DPI Canvases
  const frontCanvas = createBaseCardCanvas("geo");
  const backCanvas = createBaseCardCanvas("sapphire");

  const frontTex = new THREE.CanvasTexture(frontCanvas);
  frontTex.colorSpace = THREE.SRGBColorSpace;
  frontTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const backTex = new THREE.CanvasTexture(backCanvas);
  backTex.colorSpace = THREE.SRGBColorSpace;
  backTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const holoVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const holoFragmentShader = `
    uniform sampler2D uMap;
    uniform float uTime;
    uniform vec2 uTilt;
    uniform float uNight;
    uniform float uFoilMode;
    varying vec2 vUv;

    vec3 palette(float t, float mode) {
      if (mode < 0.5) {
        // Radiant Geo Gold
        return 0.55 + 0.45 * cos(6.28318 * (t + vec3(0.0, 0.15, 0.45)));
      } else if (mode < 1.5) {
        // Court Azure Sapphire
        return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.55, 0.65, 0.85)));
      } else if (mode < 2.5) {
        // Rosula Crimson Rose
        return 0.55 + 0.45 * cos(6.28318 * (t + vec3(0.9, 0.1, 0.3)));
      }
      // Prismatic Rainbow
      return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
    }

    void main() {
      vec2 p = vUv * 2.0 - 1.0;
      vec2 d = abs(p) - vec2(0.88, 0.90);
      float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - 0.09;
      if (dist > 0.0) discard;

      vec4 texColor = texture2D(uMap, vUv);

      // Diagonal specular glare sweep
      float sweepPos = (vUv.x * 0.85 + vUv.y * 0.65) - (uTilt.x * 0.65 + uTilt.y * 0.55) - 0.75;
      float glare = exp(-sweepPos * sweepPos * 14.0) * 0.4;

      // Holographic diamond lattice
      vec2 grid = fract(vUv * vec2(18.0, 25.0));
      float diamond = smoothstep(0.44, 0.5, abs(grid.x - 0.5) + abs(grid.y - 0.5));
      float holoPhase = vUv.x * 1.4 + vUv.y * 1.8 + uTilt.x * 1.5 - uTilt.y * 1.2 + uTime * 0.16;
      vec3 foil = palette(holoPhase, uFoilMode) * (0.15 + 0.14 * (1.0 - diamond));

      float border = smoothstep(-0.025, -0.005, dist) - smoothstep(-0.005, 0.0, dist);
      vec3 goldFrame = mix(vec3(0.98, 0.79, 0.34), vec3(0.45, 0.72, 1.0), uNight);

      vec3 finalRgb = texColor.rgb + foil * (0.35 + length(uTilt) * 0.75) + vec3(1.0, 0.93, 0.75) * glare;
      finalRgb = mix(finalRgb, goldFrame, border * 0.88);

      gl_FragColor = vec4(finalRgb, 1.0);
    }
  `;

  const holoUniforms = {
    uMap: { value: frontTex },
    uTime: { value: 0 },
    uTilt: { value: new THREE.Vector2(0, 0) },
    uNight: { value: 0 },
    uFoilMode: { value: 0 }
  };

  const backUniforms = {
    uMap: { value: backTex },
    uTime: { value: 0 },
    uTilt: { value: new THREE.Vector2(0, 0) },
    uNight: { value: 0 },
    uFoilMode: { value: 1 }
  };

  const facePlaneGeo = new THREE.PlaneGeometry(cardW - 0.11, cardH - 0.11);
  const frontFaceMesh = new THREE.Mesh(
    facePlaneGeo,
    new THREE.ShaderMaterial({
      uniforms: holoUniforms,
      vertexShader: holoVertexShader,
      fragmentShader: holoFragmentShader,
      transparent: true
    })
  );
  frontFaceMesh.position.z = 0.062;
  cardGroup.add(frontFaceMesh);

  const backFaceMesh = new THREE.Mesh(
    facePlaneGeo,
    new THREE.ShaderMaterial({
      uniforms: backUniforms,
      vertexShader: holoVertexShader,
      fragmentShader: holoFragmentShader,
      transparent: true
    })
  );
  backFaceMesh.rotation.y = Math.PI;
  backFaceMesh.position.z = -0.062;
  cardGroup.add(backFaceMesh);

  // Corner Sapphire Gems & Top Crown Ship-Wheel
  const cornerGemGeo = new THREE.OctahedronGeometry(0.075, 0);
  [
    [-cardW / 2 + 0.05, cardH / 2 - 0.05],
    [cardW / 2 - 0.05, cardH / 2 - 0.05],
    [-cardW / 2 + 0.05, -cardH / 2 + 0.05],
    [cardW / 2 - 0.05, -cardH / 2 + 0.05]
  ].forEach(([cx, cy]) => {
    const gem = new THREE.Mesh(cornerGemGeo, sapphireMat);
    gem.position.set(cx, cy, 0);
    gem.scale.set(0.95, 1.4, 1.35);
    cardGroup.add(gem);
  });

  const crestGroup = new THREE.Group();
  crestGroup.position.set(0, cardH / 2 + 0.08, 0);
  crestGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.022, 16, 32), goldMat));
  crestGroup.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), sapphireMat));
  for (let i = 0; i < 8; i++) {
    const spoke = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.13, 6), goldMat);
    const angle = (i / 8) * Math.PI * 2;
    spoke.position.set(Math.cos(angle) * 0.17, Math.sin(angle) * 0.17, 0);
    spoke.rotation.z = angle - Math.PI / 2;
    crestGroup.add(spoke);
  }
  cardGroup.add(crestGroup);

  // 3D Golden Gunbrella / Parasol Rose Compass Halo behind the Card
  const parasolHalo = new THREE.Group();
  parasolHalo.position.set(0, 0.05, -0.26);
  sovereignGroup.add(parasolHalo);

  const outerHaloRing = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.018, 16, 64), goldMat);
  parasolHalo.add(outerHaloRing);

  const innerHaloRing = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.012, 12, 48), goldMat);
  parasolHalo.add(innerHaloRing);

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.014, 1.18, 8), goldMat);
    rib.position.set(Math.cos(angle) * 0.59, Math.sin(angle) * 0.59, 0);
    rib.rotation.z = angle - Math.PI / 2;
    parasolHalo.add(rib);

    const tipGem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.055, 0),
      i % 2 === 0 ? geoCrystalMat : sapphireMat
    );
    tipGem.position.set(Math.cos(angle) * 1.24, Math.sin(angle) * 1.24, 0);
    tipGem.rotation.z = angle;
    parasolHalo.add(tipGem);
  }

  // Orbiting 3D Geo & Sapphire Crystals
  const orbitGroup = new THREE.Group();
  holder.add(orbitGroup);

  const crystals = [];
  const crystalGeo = new THREE.OctahedronGeometry(0.12, 0);
  for (let i = 0; i < 8; i++) {
    const mesh = new THREE.Mesh(crystalGeo, i % 3 === 0 ? sapphireMat : geoCrystalMat);
    mesh.scale.set(0.75, 1.65, 0.75);
    if (i % 2 === 0) {
      const miniRing = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.008, 8, 24), goldMat);
      miniRing.rotation.x = Math.PI / 3;
      mesh.add(miniRing);
    }
    crystals.push({
      mesh,
      baseAngle: (i / 8) * Math.PI * 2,
      radius: 1.32 + (i % 2) * 0.22,
      baseY: (i - 3.5) * 0.28,
      speed: 0.45 + (i % 3) * 0.15,
      phase: i * 0.9
    });
    orbitGroup.add(mesh);
  }

  // ==================================================
  // MODE 2 & 3 GROUP: 12-CARD 3D CAROUSEL RING & CONSTELLATION
  // ==================================================
  const multiCardsGroup = new THREE.Group();
  multiCardsGroup.visible = false;
  holder.add(multiCardsGroup);

  const multiNodes = [];
  const NODE_COUNT = 12;
  const miniW = 0.74;
  const miniH = 1.02;
  const miniPlaneGeo = new THREE.PlaneGeometry(miniW, miniH);
  const miniFrameGeo = new THREE.PlaneGeometry(miniW + 0.06, miniH + 0.06);

  // Constellation points for Rosa Multiflora (Rose-like 3D coordinates)
  const CONSTELLATION_POS = [
    new THREE.Vector3(0.0, 0.88, 0.25),
    new THREE.Vector3(0.85, 0.65, -0.15),
    new THREE.Vector3(1.45, 0.1, 0.35),
    new THREE.Vector3(1.1, -0.68, -0.2),
    new THREE.Vector3(0.38, -0.95, 0.3),
    new THREE.Vector3(-0.38, -0.95, -0.15),
    new THREE.Vector3(-1.1, -0.68, 0.25),
    new THREE.Vector3(-1.45, 0.1, -0.25),
    new THREE.Vector3(-0.85, 0.65, 0.2),
    new THREE.Vector3(0.0, 0.18, 0.55),
    new THREE.Vector3(0.55, -0.18, 0.4),
    new THREE.Vector3(-0.55, -0.18, 0.4)
  ];

  for (let i = 0; i < NODE_COUNT; i++) {
    const item = CARD_DECK[i % CARD_DECK.length];
    const nodeGroup = new THREE.Group();

    const frameBack = new THREE.Mesh(miniFrameGeo, goldMat);
    frameBack.position.z = -0.01;
    nodeGroup.add(frameBack);

    const can = createBaseCardCanvas(i % 2 === 0 ? "geo" : "sapphire");
    const tex = new THREE.CanvasTexture(can);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    const face = new THREE.Mesh(miniPlaneGeo, mat);
    nodeGroup.add(face);

    loadPhotoIntoCardCanvas(
      "./Navia/" + item.file,
      can,
      { title: "NAVIA", subtitle: item.title, foilTheme: i % 2 === 0 ? "geo" : "sapphire" },
      () => { tex.needsUpdate = true; }
    );

    multiCardsGroup.add(nodeGroup);
    multiNodes.push({
      group: nodeGroup,
      index: i,
      carouselAngle: (i / NODE_COUNT) * Math.PI * 2,
      constPos: CONSTELLATION_POS[i]
    });
  }

  // Golden Constellation Lines connecting Rosa Multiflora nodes
  const linePairs = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
    [6, 7], [7, 8], [8, 0], [0, 9], [9, 10], [9, 11],
    [10, 3], [11, 6], [1, 9], [8, 9]
  ];
  const linePositions = new Float32Array(linePairs.length * 6);
  linePairs.forEach(([a, b], idx) => {
    const pa = CONSTELLATION_POS[a];
    const pb = CONSTELLATION_POS[b];
    linePositions[idx * 6 + 0] = pa.x;
    linePositions[idx * 6 + 1] = pa.y;
    linePositions[idx * 6 + 2] = pa.z - 0.05;
    linePositions[idx * 6 + 3] = pb.x;
    linePositions[idx * 6 + 4] = pb.y;
    linePositions[idx * 6 + 5] = pb.z - 0.05;
  });
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  const constellationLines = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({ color: 0xf7c654, transparent: true, opacity: 0.55 })
  );
  constellationLines.visible = false;
  multiCardsGroup.add(constellationLines);

  // ==================================================
  // FLOATING GOLDEN ROSE PETAL & STARLIGHT PARTICLES
  // ==================================================
  const particleCount = 120;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 5.4;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 3.6;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));

  const spriteCan = document.createElement("canvas");
  spriteCan.width = 64;
  spriteCan.height = 64;
  const sCtx = spriteCan.getContext("2d");
  const sGrad = sCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
  sGrad.addColorStop(0, "rgba(255, 245, 200, 1)");
  sGrad.addColorStop(0.45, "rgba(245, 190, 75, 0.78)");
  sGrad.addColorStop(1, "rgba(232, 116, 42, 0)");
  sCtx.fillStyle = sGrad;
  sCtx.beginPath();
  sCtx.moveTo(32, 2);
  sCtx.lineTo(62, 32);
  sCtx.lineTo(32, 62);
  sCtx.lineTo(2, 32);
  sCtx.closePath();
  sCtx.fill();

  const particleSystem = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      size: 0.095,
      map: new THREE.CanvasTexture(spriteCan),
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  scene.add(particleSystem);

  // Normalize holder scale per spec (3.15 / maxDim)
  const box = new THREE.Box3().setFromObject(cardGroup);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  holder.scale.setScalar((3.15 / maxDim) * 0.68);

  // Load initial Front & Back Sovereign Cards
  let currentCardIdx = 0;
  let currentFoilTheme = "geo";

  function applyCardArt(url, options = {}, intoBack = false) {
    const targetCan = intoBack ? backCanvas : frontCanvas;
    const targetTex = intoBack ? backTex : frontTex;
    const themeKey = options.foilTheme || currentFoilTheme;
    const theme = FOIL_THEMES[themeKey] || FOIL_THEMES.geo;
    if (!intoBack) {
      holoUniforms.uFoilMode.value = theme.shaderMode;
    } else {
      backUniforms.uFoilMode.value = theme.shaderMode;
    }
    loadPhotoIntoCardCanvas(url, targetCan, options, () => {
      targetTex.needsUpdate = true;
    });
  }

  applyCardArt("./Navia/" + CARD_DECK[0].file, {
    title: "N A V I A",
    subtitle: CARD_DECK[0].title,
    foilTheme: "geo"
  }, false);

  applyCardArt("./Navia/" + CARD_DECK[1].file, {
    title: "N A V I A",
    subtitle: CARD_DECK[1].title,
    foilTheme: "sapphire"
  }, true);

  // ==================================================
  // STAGE CONTROLS & API
  // ==================================================
  let stageMode = "sovereign"; // "sovereign" | "carousel" | "constellation"
  let targetFlipY = 0;
  let currentFlipY = 0;
  let carouselSpinTarget = 0;
  let carouselSpinCurrent = 0;
  let saluteBurst = 0;

  function setStageMode(mode) {
    stageMode = mode;
    sovereignGroup.visible = mode === "sovereign";
    multiCardsGroup.visible = mode !== "sovereign";
    constellationLines.visible = mode === "constellation";
    saluteBurst = 0.9;
  }

  function flipCard() {
    if (stageMode === "carousel") {
      carouselSpinTarget += (Math.PI * 2) / NODE_COUNT;
    } else {
      targetFlipY += Math.PI;
    }
    saluteBurst = Math.max(saluteBurst, 0.55);
  }

  function cycleCard() {
    currentCardIdx = (currentCardIdx + 1) % CARD_DECK.length;
    const frontItem = CARD_DECK[currentCardIdx];
    const backItem = CARD_DECK[(currentCardIdx + 1) % CARD_DECK.length];
    applyCardArt("./Navia/" + frontItem.file, {
      title: "N A V I A",
      subtitle: frontItem.title,
      foilTheme: currentFoilTheme
    }, false);
    applyCardArt("./Navia/" + backItem.file, {
      title: "N A V I A",
      subtitle: backItem.title,
      foilTheme: currentFoilTheme
    }, true);
    targetFlipY += Math.PI * 2;
    carouselSpinTarget += (Math.PI * 2) / NODE_COUNT;
    saluteBurst = 0.85;
    return { index: currentCardIdx, total: CARD_DECK.length, item: frontItem };
  }

  function applyCustomCardFromStudio(url, options) {
    currentFoilTheme = options.foilTheme || "geo";
    applyCardArt(url, options, false);
    setStageMode("sovereign");
    targetFlipY = Math.round(targetFlipY / (Math.PI * 2)) * (Math.PI * 2) + Math.PI * 2;
    saluteBurst = 1.15;
  }

  function triggerCrystalSalute() {
    saluteBurst = 1.45;
    targetFlipY += Math.PI * 2;
    carouselSpinTarget += (Math.PI * 2) / 3;
  }

  function setNightMode(isNight) {
    holoUniforms.uNight.value = isNight ? 1.0 : 0.0;
    backUniforms.uNight.value = isNight ? 1.0 : 0.0;
    keyLight.color.setHex(isNight ? 0x9ec5ff : 0xffc98a);
    rimLight.color.setHex(isNight ? 0x4ea8ff : 0xffa24d);
  }

  // Canvas drag / click interaction
  let pointerDownX = 0;
  let isDragging = false;
  canvas.addEventListener("pointerdown", (e) => {
    pointerDownX = e.clientX;
    isDragging = true;
  });
  window.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.clientX - pointerDownX;
    if (Math.abs(dx) < 8) {
      flipCard();
      if (callbacks.onCardInteract) callbacks.onCardInteract();
    } else if (stageMode === "carousel") {
      carouselSpinTarget += dx * 0.008;
    } else {
      targetFlipY += Math.sign(dx) * Math.PI;
    }
  });

  // Pointer Parallax & Layout (Exact Spec Math)
  const target = { x: 0, y: 0 };
  const look = { x: 0, y: 0 };
  let baseX = 0.05;
  let baseY = 0.05;

  window.addEventListener("pointermove", (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
    if (isDragging && stageMode === "carousel") {
      carouselSpinTarget += e.movementX * 0.006;
    }
  });

  function layout() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    const mobile = width < 720;
    baseX = mobile ? 0 : 0.05;
    baseY = mobile ? 0.45 : 0.05;
    const pScale = mobile ? 0.62 : Math.min(1, Math.max(0.75, aspect / 1.78));
    pivot.scale.setScalar(pScale);
  }

  layout();
  window.addEventListener("resize", layout);
  canvas.classList.add("is-ready");

  // Animation Loop
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const reduced = reducedMotionQuery.matches;

    look.x += (target.x - look.x) * 0.04;
    look.y += (target.y - look.y) * 0.04;

    currentFlipY += (targetFlipY - currentFlipY) * 0.08;
    carouselSpinCurrent += (carouselSpinTarget - carouselSpinCurrent) * 0.07;
    saluteBurst *= 0.94;

    holoUniforms.uTime.value = t;
    holoUniforms.uTilt.value.set(look.x, look.y);
    backUniforms.uTime.value = t;
    backUniforms.uTilt.value.set(-look.x, look.y);

    if (callbacks.onFrame) callbacks.onFrame(t);

    if (reduced) {
      pivot.position.set(baseX + look.x * 0.06, baseY, 0);
      pivot.rotation.set(look.y * 0.1, look.x * 0.22 + currentFlipY, 0);
    } else {
      const bob = Math.sin(t * 2.2) * 0.09;
      pivot.position.set(baseX + look.x * 0.06, baseY + bob, 0);
      pivot.rotation.z = Math.sin(t * 2.2 + 0.6) * 0.025;
      pivot.rotation.y =
        look.x * 0.22 +
        Math.sin(t * 0.9) * 0.05 +
        (stageMode === "sovereign" ? currentFlipY : 0);
      pivot.rotation.x = look.y * 0.1 + Math.cos(t * 2.2) * 0.02;

      // Rotate 3D Golden Parasol Halo & Crown
      crestGroup.rotation.z = t * 0.55;
      parasolHalo.rotation.z = -t * 0.28 - saluteBurst * 0.8;
      const haloScale = 1 + saluteBurst * 0.22 + Math.sin(t * 2.0) * 0.025;
      parasolHalo.scale.setScalar(haloScale);

      // Update Mode 2 (Carousel Ring) & Mode 3 (Constellation) card nodes
      if (stageMode !== "sovereign") {
        const ringRadius = 1.85;
        multiNodes.forEach((node, idx) => {
          if (stageMode === "carousel") {
            const angle = node.carouselAngle + carouselSpinCurrent + t * 0.18;
            const tx = Math.sin(angle) * ringRadius;
            const tz = Math.cos(angle) * ringRadius * 0.65;
            const ty = Math.sin(angle * 2 + t) * 0.12;
            node.group.position.lerp(new THREE.Vector3(tx, ty, tz), 0.1);
            node.group.rotation.y = angle;
            node.group.scale.setScalar(0.82 + (tz + ringRadius * 0.65) * 0.14);
          } else {
            // Constellation mode
            const cp = node.constPos;
            const floatY = cp.y + Math.sin(t * 1.8 + idx) * 0.05;
            node.group.position.lerp(new THREE.Vector3(cp.x, floatY, cp.z), 0.1);
            node.group.rotation.y = look.x * 0.25 + Math.sin(t + idx) * 0.08;
            node.group.scale.setScalar(0.68);
          }
        });
      }

      // Orbiting Geo crystals
      crystals.forEach((c, idx) => {
        const a = c.baseAngle + t * c.speed * (1 + saluteBurst * 2.5);
        const r = c.radius + Math.sin(t * 1.8 + c.phase) * 0.08 + saluteBurst * 0.48;
        c.mesh.position.set(
          Math.cos(a) * r,
          c.baseY + Math.sin(t * 2.4 + c.phase) * 0.14,
          Math.sin(a) * r * 0.55
        );
        c.mesh.rotation.y = t * 1.4 + idx;
        c.mesh.rotation.x = Math.sin(t + idx) * 0.35;
      });

      // Drift golden rose particles
      const posArr = pGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += (0.003 + saluteBurst * 0.02) * (0.5 + (i % 3) * 0.3);
        if (posArr[i * 3 + 1] > 1.8) posArr[i * 3 + 1] = -1.8;
      }
      pGeo.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  animate();

  return {
    setStageMode,
    flipCard,
    cycleCard,
    applyCustomCardFromStudio,
    triggerCrystalSalute,
    setNightMode
  };
}
